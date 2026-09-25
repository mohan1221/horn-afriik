-- =====================================================================
-- Horn Afriik: database setup for Supabase
-- Paste this whole file into Supabase > SQL Editor > New query > Run.
-- Safe to run again: it never deletes students, scores or your edits.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- App settings (one row) ----------
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  require_approval boolean not null default false,
  admin_emails text[] not null default array['alamiin177@gmail.com']
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ---------- Profiles (one per account) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null default '',
  form text not null default 'Form 4',
  role text not null default 'student' check (role in ('student', 'admin')),
  status text not null default 'active' check (status in ('active', 'pending', 'blocked')),
  created_at timestamptz not null default now(),
  last_seen timestamptz
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and status = 'active');
$$;

create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and status = 'active');
$$;

-- New sign-up -> profile. Emails listed in settings.admin_emails become admins.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  s public.settings;
  is_adm boolean;
begin
  select * into s from public.settings where id = 1;
  is_adm := lower(coalesce(new.email, '')) in (select lower(e) from unnest(coalesce(s.admin_emails, '{}')) e);
  insert into public.profiles (id, email, full_name, form, role, status)
  values (
    new.id, new.email,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 80),
    coalesce(nullif(new.raw_user_meta_data ->> 'form', ''), 'Form 4'),
    case when is_adm then 'admin' else 'student' end,
    case when is_adm then 'active' when coalesce(s.require_approval, false) then 'pending' else 'active' end
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Students may edit their own name and class, never their role or status.
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.status := old.status;
    new.email := old.email;
  end if;
  new.id := old.id;
  return new;
end $$;

drop trigger if exists guard_profile on public.profiles;
create trigger guard_profile before update on public.profiles
  for each row execute function public.guard_profile();

-- ---------- Course content ----------
create table if not exists public.subjects (
  id text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  name text not null,
  so text not null default '',
  sym text not null default '',
  cat text not null default 'science' check (cat in ('science', 'languages', 'arts', 'islamic')),
  description text not null default '',
  cover_url text,
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null references public.subjects (id) on delete cascade on update cascade,
  title text not null,
  sort int not null default 0,
  sections jsonb not null default '[]'::jsonb,
  image_url text,
  video_url text,
  published boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (subject_id, title)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null references public.subjects (id) on delete cascade on update cascade,
  lesson_title text,
  question text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) between 2 and 6),
  correct int not null default 0,
  explanation text not null default '',
  image_url text,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists questions_subject_idx on public.questions (subject_id);

-- ---------- Student activity ----------
create table if not exists public.attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  sid text not null,
  unit text not null default '',
  correct int not null check (correct >= 0),
  total int not null check (total > 0 and total >= correct),
  exam boolean not null default false,
  client_t bigint not null,
  created_at timestamptz not null default now(),
  unique (user_id, client_t)
);
create index if not exists attempts_user_idx on public.attempts (user_id);
create index if not exists attempts_created_idx on public.attempts (created_at desc);

create table if not exists public.lesson_done (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  sid text not null,
  unit text not null,
  done_at timestamptz not null default now(),
  primary key (user_id, sid, unit)
);

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  user_id uuid default auth.uid() references public.profiles (id) on delete set null,
  name text not null default '',
  form text not null default '',
  topic text not null default '',
  rating int check (rating between 1 and 5),
  message text not null check (char_length(message) between 1 and 4000),
  status text not null default 'new' check (status in ('new', 'read', 'done')),
  created_at timestamptz not null default now()
);

-- ---------- Row-level security ----------
alter table public.settings enable row level security;
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.lesson_done enable row level security;
alter table public.feedback enable row level security;

drop policy if exists "settings admin read" on public.settings;
create policy "settings admin read" on public.settings for select to authenticated using (public.is_admin());
drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles update" on public.profiles;
create policy "profiles update" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
drop policy if exists "profiles delete" on public.profiles;
create policy "profiles delete" on public.profiles for delete to authenticated using (public.is_admin());

-- Content: everyone reads published items; only admins write.
do $$
declare t text;
begin
  foreach t in array array['subjects', 'lessons'] loop
    execute format('drop policy if exists "%1$s read" on public.%1$s', t);
    execute format('create policy "%1$s read" on public.%1$s for select to anon, authenticated using (published or public.is_admin())', t);
  end loop;
  foreach t in array array['subjects', 'lessons', 'questions'] loop
    execute format('drop policy if exists "%1$s admin insert" on public.%1$s', t);
    execute format('create policy "%1$s admin insert" on public.%1$s for insert to authenticated with check (public.is_admin())', t);
    execute format('drop policy if exists "%1$s admin update" on public.%1$s', t);
    execute format('create policy "%1$s admin update" on public.%1$s for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('drop policy if exists "%1$s admin delete" on public.%1$s', t);
    execute format('create policy "%1$s admin delete" on public.%1$s for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;
drop policy if exists "questions read" on public.questions;
create policy "questions read" on public.questions for select to anon, authenticated using (
  public.is_admin() or exists (select 1 from public.subjects s where s.id = subject_id and s.published));

drop policy if exists "attempts read" on public.attempts;
create policy "attempts read" on public.attempts for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "attempts insert" on public.attempts;
create policy "attempts insert" on public.attempts for insert to authenticated with check (user_id = auth.uid() and public.is_active());
drop policy if exists "attempts delete" on public.attempts;
create policy "attempts delete" on public.attempts for delete to authenticated using (public.is_admin());

drop policy if exists "done read" on public.lesson_done;
create policy "done read" on public.lesson_done for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "done insert" on public.lesson_done;
create policy "done insert" on public.lesson_done for insert to authenticated with check (user_id = auth.uid() and public.is_active());
drop policy if exists "done delete" on public.lesson_done;
create policy "done delete" on public.lesson_done for delete to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "feedback send" on public.feedback;
create policy "feedback send" on public.feedback for insert to anon, authenticated with check (user_id is null or user_id = auth.uid());
drop policy if exists "feedback admin read" on public.feedback;
create policy "feedback admin read" on public.feedback for select to authenticated using (public.is_admin());
drop policy if exists "feedback admin update" on public.feedback;
create policy "feedback admin update" on public.feedback for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "feedback admin delete" on public.feedback;
create policy "feedback admin delete" on public.feedback for delete to authenticated using (public.is_admin());

-- ---------- Admin action: delete an account completely ----------
create or replace function public.admin_delete_user(target uuid) returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.is_admin() then raise exception 'Only admins can delete accounts'; end if;
  if target = auth.uid() then raise exception 'You cannot delete your own admin account'; end if;
  delete from auth.users where id = target;
end $$;
revoke all on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- ---------- Storage for lesson images and videos ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media admin read" on storage.objects;
create policy "media admin read" on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin upload" on storage.objects;
create policy "media admin upload" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ---------- Make sure the admin email is an admin (if already signed up) ----------
update public.profiles p set role = 'admin', status = 'active'
where lower(p.email) in (select lower(e) from public.settings s, unnest(s.admin_emails) e where s.id = 1);

-- ---------- Starter courses (the 12 subjects already in the app) ----------
insert into public.subjects (id,name,so,sym,cat,sort) values

('physics','Physics','Fiisigis','Ph','science',10),
('mathematics','Mathematics','Xisaab','Ma','science',20),
('chemistry','Chemistry','Kimistari','Ch','science',30),
('biology','Biology','Bayoolaji','Bi','science',40),
('technology','Technology','Tiknoolaji','Te','science',50),
('arabic','Arabic','Carabi','ع','languages',60),
('english','English','Ingiriisi','En','languages',70),
('somali','Af Soomaali','Luqadda hooyo','So','languages',80),
('geography','Geography','Juqraafi','Ge','arts',90),
('history','History','Taariikh','Hi','arts',100),
('business','Business','Ganacsi','Bu','arts',110),
('islamic','Islamic Studies','Tarbiyada Islaamka','إ','islamic',120)
on conflict (id) do nothing;

insert into public.lessons (subject_id,title,sort,sections) values
('physics','Motion & Forces',10,'[{"h":"Speed and velocity","p":"Speed = distance ÷ time. Velocity is speed in a stated direction, so it is a vector quantity."},{"h":"Newton''s second law","p":"F = m × a. A force in newtons (N) accelerates a mass in kilograms. Weight is W = m × g, with g ≈ 9.8 m/s²."},{"h":"Balanced forces","p":"When forces balance, an object stays still or keeps moving at a steady speed."}]'::jsonb),
('physics','Work & Energy',20,'[{"h":"Work","p":"Work = force × distance moved in the direction of the force. It is measured in joules (J)."},{"h":"Kinetic and potential energy","p":"Kinetic energy = ½mv². Gravitational potential energy = mgh."},{"h":"Conservation","p":"Energy is never created or destroyed. It only changes from one form to another."}]'::jsonb),
('physics','Electricity',30,'[{"h":"Ohm''s law","p":"V = I × R: voltage in volts, current in amperes, resistance in ohms (Ω)."},{"h":"Electrical power","p":"P = V × I, measured in watts. A 240 V kettle drawing 10 A uses 2,400 W."}]'::jsonb),
('physics','Light & Waves',40,'[{"h":"Speed of light","p":"Light travels at 3 × 10⁸ m/s in a vacuum and slows down in water or glass. The change in speed bends it (refraction)."},{"h":"The wave equation","p":"v = f × λ. Wave speed equals frequency times wavelength."}]'::jsonb),
('mathematics','Algebra',10,'[{"h":"Solving linear equations","p":"Do the same thing to both sides. 2x + 6 = 14 → 2x = 8 → x = 4."},{"h":"Expanding brackets","p":"a(b + c) = ab + ac, and (x + 2)(x + 3) = x² + 5x + 6."}]'::jsonb),
('mathematics','Geometry',20,'[{"h":"Angles","p":"Angles in a triangle add to 180°, angles on a straight line add to 180° and angles in a quadrilateral add to 360°."},{"h":"Circles","p":"Circumference = 2πr and area = πr². Use π ≈ 3.14 or 22/7."}]'::jsonb),
('mathematics','Calculus',30,'[{"h":"The power rule","p":"d/dx (xⁿ) = n·xⁿ⁻¹, so d/dx (x³) = 3x²."},{"h":"What a derivative means","p":"The derivative is the gradient of a curve at a point: how fast one quantity changes compared with another."}]'::jsonb),
('mathematics','Logarithms',40,'[{"h":"Definition","p":"log_b x = y means bʸ = x. For example, log₁₀ 100 = 2 because 10² = 100."},{"h":"Laws of logs","p":"log(ab) = log a + log b · log(a/b) = log a − log b · log(aⁿ) = n log a."}]'::jsonb),
('chemistry','Atomic Structure',10,'[{"h":"Particles in the atom","p":"Protons (+) and neutrons (no charge) sit in the nucleus. Electrons (−) move in shells around it."},{"h":"Atomic and mass number","p":"The atomic number is the number of protons. The mass number is protons + neutrons. Carbon: 6 protons, 6 neutrons, electrons 2, 4."}]'::jsonb),
('chemistry','Chemical Bonding',20,'[{"h":"Ionic bonds","p":"Metals give electrons to non-metals. The ions formed have opposite charges and attract, e.g. Na⁺ and Cl⁻ in NaCl."},{"h":"Covalent bonds","p":"Non-metals share pairs of electrons, e.g. H₂O and CO₂."}]'::jsonb),
('chemistry','Acids & Bases',30,'[{"h":"The pH scale","p":"pH runs from 0 to 14. Below 7 is acidic, 7 is neutral and above 7 is alkaline."},{"h":"Neutralisation","p":"Acid + base → salt + water. HCl + NaOH → NaCl + H₂O."}]'::jsonb),
('biology','Cell Biology',10,'[{"h":"Organelles","p":"The nucleus holds DNA. Mitochondria release energy in respiration. Ribosomes build proteins."},{"h":"Plant cells","p":"Plant cells also have a cell wall, a large vacuole and chloroplasts for photosynthesis."}]'::jsonb),
('biology','Human Body',20,'[{"h":"The heart","p":"Four chambers: two atria above, two ventricles below. The left ventricle pumps blood around the whole body."},{"h":"Blood","p":"Red cells carry oxygen using haemoglobin. White cells fight infection. Platelets help blood clot."}]'::jsonb),
('biology','Genetics',30,'[{"h":"DNA","p":"DNA is a double helix. Its bases pair A–T and G–C."},{"h":"Genes and chromosomes","p":"A gene is a section of DNA that codes for a protein. Human body cells hold 23 pairs of chromosomes."}]'::jsonb),
('technology','Computer Systems',10,'[{"h":"Hardware","p":"Input (keyboard, mouse) → processing (CPU) → output (monitor, printer), with storage keeping data."},{"h":"Memory","p":"RAM is fast but loses data without power (volatile). ROM keeps its contents."}]'::jsonb),
('technology','Number Systems',20,'[{"h":"Binary","p":"Computers count in base 2. Place values from the right are 1, 2, 4, 8. So 0101 = 4 + 1 = 5."},{"h":"Units of data","p":"8 bits = 1 byte. 1,024 bytes = 1 kilobyte."}]'::jsonb),
('technology','The Web',30,'[{"h":"HTML","p":"HTML gives a web page its structure using tags such as &lt;h1&gt; for headings and &lt;p&gt; for paragraphs."},{"h":"URLs","p":"A web address names the protocol (https), the domain and the path to the page."}]'::jsonb),
('arabic','Grammar (النحو)',10,'[{"h":"The definite article","p":"<span lang=\"ar\">ال</span> means \"the\". Before sun letters the ل is silent (<span lang=\"ar\">الشَّمْس</span>). Before moon letters you pronounce it (<span lang=\"ar\">القَمَر</span>)."},{"h":"Nominal sentences","p":"A sentence can begin with a noun: <span lang=\"ar\">الكِتَابُ جَدِيدٌ</span> (The book is new)."}]'::jsonb),
('arabic','Vocabulary (المفردات)',20,'[{"h":"At school","p":"<span lang=\"ar\">مَدْرَسَة</span> school · <span lang=\"ar\">مُدَرِّس</span> teacher · <span lang=\"ar\">كِتَاب</span> book · <span lang=\"ar\">قَلَم</span> pen"},{"h":"Courtesy","p":"<span lang=\"ar\">شُكْرًا</span> thank you · <span lang=\"ar\">عَفْوًا</span> you''re welcome · <span lang=\"ar\">مِنْ فَضْلِكَ</span> please"}]'::jsonb),
('arabic','Verbs (الأفعال)',30,'[{"h":"Past, present, command","p":"<span lang=\"ar\">كَتَبَ</span> he wrote · <span lang=\"ar\">يَكْتُبُ</span> he writes · <span lang=\"ar\">اُكْتُبْ</span> write!"},{"h":"Three-letter roots","p":"Most words grow from a root. ك-ت-ب gives <span lang=\"ar\">كِتَاب</span>, <span lang=\"ar\">كَاتِب</span> and <span lang=\"ar\">مَكْتَبَة</span>."}]'::jsonb),
('english','Grammar',10,'[{"h":"Present simple","p":"Add -s or -es for he, she and it: she goes, he plays."},{"h":"Irregular verbs","p":"Some verbs change form completely: go → went → gone, see → saw → seen."},{"h":"Articles","p":"Use \"the\" with superlatives: the best, the tallest."}]'::jsonb),
('english','Vocabulary',20,'[{"h":"Synonyms and antonyms","p":"Synonyms share a meaning (rapid, fast). Antonyms are opposites (ancient, modern)."},{"h":"Word classes","p":"Nouns name things (happiness), adjectives describe nouns (happy), adverbs describe verbs (happily)."}]'::jsonb),
('english','Comprehension',30,'[{"h":"Find the main idea","p":"Read the whole passage first. The first and last sentences of a paragraph usually carry its main idea."},{"h":"Use evidence","p":"Underline the exact words in the text that support your answer."}]'::jsonb),
('somali','Higgaad',10,'[{"h":"Shaqallada","p":"Af Soomaaligu wuxuu leeyahay 5 shaqal gaagaab (a, e, i, o, u) iyo 5 shaqal dheer (aa, ee, ii, oo, uu)."},{"h":"Xarfaha gaarka ah","p":"\"c\" waa cayn (caano), \"x\" waa xaa (xoolo), \"kh\" waa khaa (khamiis)."}]'::jsonb),
('somali','Naxwe',20,'[{"h":"Jamac","p":"Magacyo badan waxay jamac ku sameeyaan isbeddel: nin → niman, buug → buugaag."},{"h":"Lab iyo dheddig","p":"Qodobka \"ka\" wuxuu raacaa magac lab ah (ninka), \"ta\" wuxuu raacaa magac dheddig ah (naagta)."}]'::jsonb),
('somali','Suugaan',30,'[{"h":"Qoraalka Af Soomaaliga","p":"Farta Laatiinka ee Af Soomaaliga waxaa si rasmi ah loo ansixiyay 21 Oktoobar 1972."},{"h":"Noocyada maansada","p":"Suugaanta Soomaalidu waxay leedahay noocyo ay ka mid yihiin gabay, geeraar iyo buraambur."}]'::jsonb),
('geography','Physical Geography of Somalia',10,'[{"h":"Coastline","p":"Somalia''s coast runs about 3,300 km along the Gulf of Aden and the Indian Ocean, the longest on mainland Africa."},{"h":"Rivers","p":"The Jubba and Shabelle rise in the Ethiopian Highlands and water southern Somalia''s main farmland."}]'::jsonb),
('geography','Maps & Coordinates',20,'[{"h":"Latitude","p":"Lines of latitude run east–west and measure distance north or south of the Equator (0°)."},{"h":"Longitude","p":"Lines of longitude run from pole to pole and measure distance east or west of the Prime Meridian at Greenwich."}]'::jsonb),
('geography','World Regions',30,'[{"h":"Continents","p":"There are seven continents. Asia is the largest, followed by Africa."},{"h":"The Horn of Africa","p":"Somalia, Ethiopia, Eritrea and Djibouti make up the Horn of Africa."}]'::jsonb),
('history','Ancient Somalia',10,'[{"h":"The Land of Punt","p":"Ancient Egyptians traded for gold, incense and ebony with Punt, which many historians place on the Horn coast."},{"h":"The Adal Sultanate","p":"In the 1500s Imam Ahmad ibn Ibrahim al-Ghazi (Axmed Gurey) led Adal''s campaigns across the Horn."}]'::jsonb),
('history','Colonial Era',20,'[{"h":"Partition","p":"In the late 1800s Somali lands were divided between Britain, Italy, France and Ethiopia."},{"h":"The Dervishes","p":"Sayid Maxamed Cabdulle Xasan led the Dervish resistance from 1899 to 1920."}]'::jsonb),
('history','Independence',30,'[{"h":"Somali Youth League","p":"Founded in Mogadishu in 1943, the SYL campaigned for independence and unity."},{"h":"1 July 1960","p":"British Somaliland (independent on 26 June) and the Italian-administered south united as the Somali Republic."}]'::jsonb),
('business','Business Basics',10,'[{"h":"Types of ownership","p":"Sole proprietor: one owner. Partnership: two or more owners. Company: owned by shareholders."},{"h":"Profit and loss","p":"Profit = revenue − costs. When costs are larger than revenue, the business makes a loss."}]'::jsonb),
('business','Accounting',20,'[{"h":"The accounting equation","p":"Assets = Liabilities + Equity. The two sides always balance."},{"h":"Fixed and variable costs","p":"Fixed costs such as rent stay the same. Variable costs such as stock rise as you sell more."}]'::jsonb),
('business','Economics',30,'[{"h":"Demand","p":"When price falls, quantity demanded usually rises."},{"h":"Supply","p":"When price rises, producers are usually willing to supply more."}]'::jsonb),
('islamic','Qur''an Studies',10,'[{"h":"Structure","p":"The Qur''an has 114 surahs in 30 juz''. Al-Baqarah is the longest and Al-Kawthar the shortest."},{"h":"The first revelation","p":"The first word revealed was <span lang=\"ar\">اقْرَأْ</span> (Read), in Surat al-''Alaq."}]'::jsonb),
('islamic','Fiqh',20,'[{"h":"The five pillars","p":"Shahada, Salah, Zakah, Sawm in Ramadan, and Hajj."},{"h":"Zakah","p":"Zakah is 2.5% of savings above the nisab, held for one full lunar year (hawl)."}]'::jsonb),
('islamic','Seerah',30,'[{"h":"Birth","p":"The Prophet ﷺ was born in Makkah in the Year of the Elephant, around 570 CE."},{"h":"The Hijrah","p":"In 622 CE the Prophet ﷺ migrated to Madinah. The Hijri calendar counts from that year."}]'::jsonb)
on conflict (subject_id,title) do nothing;

insert into public.questions (subject_id,question,options,correct,explanation,sort)
select v.* from (values
('physics','What is the SI unit of force?','["Newton","Joule","Watt","Pascal"]'::jsonb,0,'Force is measured in newtons (N). 1 N = 1 kg·m/s².',10),
('physics','Near Earth''s surface, acceleration due to gravity is about…','["9.8 m/s²","3.0 m/s²","98 m/s²","1.6 m/s²"]'::jsonb,0,'g ≈ 9.8 m/s². The Moon''s value is about 1.6 m/s².',20),
('physics','A bus travels 120 km in 2 hours. What is its average speed?','["60 km/h","240 km/h","30 km/h","122 km/h"]'::jsonb,0,'Speed = distance ÷ time = 120 ÷ 2 = 60 km/h.',30),
('physics','Which of these is a vector quantity?','["Velocity","Mass","Temperature","Time"]'::jsonb,0,'Velocity has both size and direction. The others only have size.',40),
('physics','A current of 2 A flows through a 5 Ω resistor. What is the voltage?','["10 V","2.5 V","7 V","0.4 V"]'::jsonb,0,'Ohm''s law: V = I × R = 2 × 5 = 10 V.',50),
('physics','Light travels fastest through…','["A vacuum","Water","Glass","Air at sea level"]'::jsonb,0,'Light reaches 3 × 10⁸ m/s in a vacuum and slows down in any medium.',60),
('mathematics','Solve for x: 2x + 6 = 14','["x = 4","x = 10","x = 3","x = 7"]'::jsonb,0,'2x = 14 − 6 = 8, so x = 4.',10),
('mathematics','What is the area of a circle with radius 7 cm? (π ≈ 22/7)','["154 cm²","44 cm²","49 cm²","308 cm²"]'::jsonb,0,'A = πr² = 22/7 × 49 = 154 cm².',20),
('mathematics','What is the derivative of x³?','["3x²","x²","3x³","x⁴ / 4"]'::jsonb,0,'Power rule: d/dx xⁿ = n·xⁿ⁻¹, so 3x².',30),
('mathematics','√144 equals…','["12","14","72","11"]'::jsonb,0,'12 × 12 = 144.',40),
('mathematics','The interior angles of a triangle add up to…','["180°","360°","90°","270°"]'::jsonb,0,'Every triangle''s angles sum to 180°.',50),
('mathematics','If log₁₀ x = 2, then x =','["100","20","10","1000"]'::jsonb,0,'log₁₀ x = 2 means 10² = x, so x = 100.',60),
('chemistry','What is the chemical symbol for sodium?','["Na","So","Sd","S"]'::jsonb,0,'Na comes from the Latin name natrium.',10),
('chemistry','What is the pH of pure water at 25 °C?','["7","0","14","5"]'::jsonb,0,'Pure water is neutral, pH 7.',20),
('chemistry','What is the atomic number of carbon?','["6","12","8","14"]'::jsonb,0,'Carbon has 6 protons. 12 is its mass number.',30),
('chemistry','What is the molar mass of water (H₂O)?','["18 g/mol","16 g/mol","10 g/mol","20 g/mol"]'::jsonb,0,'2 × 1 (H) + 16 (O) = 18 g/mol.',40),
('chemistry','Which of these is a noble gas?','["Argon","Nitrogen","Oxygen","Chlorine"]'::jsonb,0,'Argon is in Group 18 with a full outer shell.',50),
('chemistry','Sodium chloride (NaCl) is held together by…','["Ionic bonds","Covalent bonds","Metallic bonds","Hydrogen bonds"]'::jsonb,0,'Na gives an electron to Cl, forming Na⁺ and Cl⁻ ions.',60),
('biology','Which organelle releases energy from food in a cell?','["Mitochondrion","Nucleus","Ribosome","Vacuole"]'::jsonb,0,'Mitochondria carry out aerobic respiration.',10),
('biology','Photosynthesis takes place in the…','["Chloroplast","Mitochondrion","Cell wall","Nucleus"]'::jsonb,0,'Chloroplasts contain chlorophyll, which absorbs light.',20),
('biology','Which blood cells carry oxygen?','["Red blood cells","White blood cells","Platelets","Plasma cells"]'::jsonb,0,'Red blood cells contain haemoglobin, which binds oxygen.',30),
('biology','In DNA, adenine pairs with…','["Thymine","Guanine","Cytosine","Uracil"]'::jsonb,0,'A pairs with T, and G pairs with C. Uracil is found in RNA.',40),
('biology','How many chambers does the human heart have?','["4","2","3","6"]'::jsonb,0,'Two atria and two ventricles.',50),
('biology','What is the largest organ of the human body?','["Skin","Liver","Brain","Lungs"]'::jsonb,0,'The skin covers about 1.8 m² in adults.',60),
('technology','What does CPU stand for?','["Central Processing Unit","Computer Power Unit","Central Program Utility","Control Processing Unit"]'::jsonb,0,'The CPU runs a computer''s instructions.',10),
('technology','How many bits are in one byte?','["8","4","16","10"]'::jsonb,0,'1 byte = 8 bits.',20),
('technology','Which of these is an input device?','["Keyboard","Monitor","Printer","Speaker"]'::jsonb,0,'A keyboard sends data into the computer.',30),
('technology','What is HTML used for?','["Structuring web pages","Storing databases","Editing photos","Running spreadsheets"]'::jsonb,0,'HTML marks up the content and structure of web pages.',40),
('technology','Which memory loses its contents when power is off?','["RAM","ROM","Hard disk","Flash drive"]'::jsonb,0,'RAM is volatile memory.',50),
('technology','What is the decimal number 5 in binary?','["101","110","011","111"]'::jsonb,0,'4 + 0 + 1 = 5, written 101.',60),
('arabic','What is the plural of <span lang="ar">كِتَاب</span> (book)?','["<span lang=\"ar\">كُتُب</span>","<span lang=\"ar\">كِتَابَات</span>","<span lang=\"ar\">كَاتِب</span>","<span lang=\"ar\">مَكْتَبَة</span>"]'::jsonb,0,'<span lang="ar">كُتُب</span> is the broken plural of <span lang="ar">كِتَاب</span>.',10),
('arabic','What does <span lang="ar">مَدْرَسَة</span> mean?','["School","Teacher","Book","Mosque"]'::jsonb,0,'<span lang="ar">مَدْرَسَة</span> is a school. A teacher is <span lang="ar">مُدَرِّس</span>.',20),
('arabic','Which is a sun letter (<span lang="ar">حرف شمسي</span>)?','["<span lang=\"ar\">ش</span>","<span lang=\"ar\">ق</span>","<span lang=\"ar\">ب</span>","<span lang=\"ar\">م</span>"]'::jsonb,0,'With sun letters the ل of <span lang="ar">ال</span> is silent, as in <span lang="ar">الشَّمْس</span>.',30),
('arabic','Which verb is the past tense of <span lang="ar">يَكْتُبُ</span>?','["<span lang=\"ar\">كَتَبَ</span>","<span lang=\"ar\">اُكْتُبْ</span>","<span lang=\"ar\">كَاتِب</span>","<span lang=\"ar\">مَكْتُوب</span>"]'::jsonb,0,'<span lang="ar">كَتَبَ</span> means "he wrote".',40),
('arabic','What does <span lang="ar">شُكْرًا</span> mean?','["Thank you","Welcome","Goodbye","Please"]'::jsonb,0,'<span lang="ar">شُكْرًا</span> is thank you. The reply is <span lang="ar">عَفْوًا</span>.',50),
('arabic','How many letters are in the Arabic alphabet?','["28","26","30","24"]'::jsonb,0,'The Arabic alphabet has 28 letters.',60),
('english','What is the past tense of "go"?','["went","goed","gone","going"]'::jsonb,0,'"Go" is irregular: go, went, gone.',10),
('english','Choose a synonym for "rapid".','["fast","slow","calm","weak"]'::jsonb,0,'Rapid means fast or quick.',20),
('english','She ___ to school every day.','["goes","go","going","gone"]'::jsonb,0,'Third person singular in the present simple takes -s/-es.',30),
('english','Which word is a noun?','["happiness","happy","happily","happen"]'::jsonb,0,'Happiness names a thing (a feeling), so it is a noun.',40),
('english','What is the opposite of "ancient"?','["modern","old","historic","early"]'::jsonb,0,'Ancient means very old. Modern is its opposite.',50),
('english','They are ___ best students in the class.','["the","a","an","no article"]'::jsonb,0,'Superlatives take "the": the best, the tallest.',60),
('somali','Imisa shaqal gaaban ayuu leeyahay Af Soomaaligu?','["5","3","7","10"]'::jsonb,0,'Shaqallada gaagaban waa a, e, i, o, u.',10),
('somali','Sannadkee ayaa si rasmi ah loo ansixiyay qoraalka Af Soomaaliga?','["1972","1960","1969","1978"]'::jsonb,0,'21 Oktoobar 1972 ayaa farta Laatiinka loo ansixiyay Af Soomaaliga.',20),
('somali','Xarafkee ayaa matala dhawaaqa cayn (ʕ), sida "caano"?','["c","x","q","dh"]'::jsonb,0,'Xarafka "c" wuxuu u taagan yahay cayn.',30),
('somali','Jamciga erayga "nin" waa?','["niman","ninno","ninyo","nimaan"]'::jsonb,0,'Nin → niman.',40),
('somali','Erayga "mahadsanid" macnihiisu waa?','["Thank you","Good morning","Goodbye","Welcome"]'::jsonb,0,'Mahadsanid = thank you.',50),
('somali','Xarafkee ayaa matala dhawaaqa ħ, sida erayga "xoolo"?','["x","h","kh","c"]'::jsonb,0,'Xarafka "x" wuxuu u taagan yahay dhawaaqa ħ.',60),
('geography','What is the capital city of Somalia?','["Mogadishu","Hargeisa","Kismayo","Baidoa"]'::jsonb,0,'Mogadishu (Muqdisho) is the capital.',10),
('geography','Which two rivers flow through southern Somalia?','["Jubba and Shabelle","Nile and Awash","Tana and Omo","Zambezi and Congo"]'::jsonb,0,'Both rise in the Ethiopian Highlands.',20),
('geography','Which body of water lies north of Somalia?','["Gulf of Aden","Red Sea","Mediterranean Sea","Persian Gulf"]'::jsonb,0,'The Gulf of Aden separates Somalia from Yemen.',30),
('geography','Somalia has the longest coastline on mainland Africa. About how long is it?','["3,300 km","800 km","1,500 km","6,000 km"]'::jsonb,0,'Roughly 3,300 km along the Gulf of Aden and the Indian Ocean.',40),
('geography','What is the largest continent by area?','["Asia","Africa","North America","Europe"]'::jsonb,0,'Asia covers about 30% of Earth''s land.',50),
('geography','Lines of latitude measure distance…','["North or south of the Equator","East or west of Greenwich","Above sea level","Between time zones"]'::jsonb,0,'Longitude measures east–west from the Prime Meridian.',60),
('history','In which year did Somalia become independent and unite?','["1960","1950","1969","1977"]'::jsonb,0,'On 1 July 1960 the north and south united as the Somali Republic.',10),
('history','The Somali Youth League was founded in…','["1943","1960","1920","1955"]'::jsonb,0,'The SYL was founded in Mogadishu in May 1943.',20),
('history','Who led the Dervish movement against colonial rule?','["Sayid Maxamed Cabdulle Xasan","Aden Abdulle Osman","Axmed Gurey","Siad Barre"]'::jsonb,0,'The Dervish state resisted British and Italian forces from 1899 to 1920.',30),
('history','Ancient Egyptians traded with a land to the south they called…','["The Land of Punt","Axum","Carthage","Nubia"]'::jsonb,0,'Many historians place Punt on the Horn of Africa coast.',40),
('history','Imam Ahmad ibn Ibrahim al-Ghazi, leader of the Adal Sultanate, is widely known as…','["Axmed Gurey","Sayid Maxamed","Cali Mire","Wiil Waal"]'::jsonb,0,'Gurey means "left-handed".',50),
('history','In which year did the Second World War end?','["1945","1918","1939","1950"]'::jsonb,0,'The war ended in 1945.',60),
('business','Profit is calculated as…','["Revenue − Costs","Costs − Revenue","Revenue + Costs","Revenue × Costs"]'::jsonb,0,'Whatever remains after costs is profit.',10),
('business','A shop earns $5,000 and spends $3,200. What is the profit?','["$1,800","$8,200","$3,200","$2,800"]'::jsonb,0,'5,000 − 3,200 = 1,800.',20),
('business','A sole proprietorship is owned by…','["One person","Shareholders","The government","Two partners"]'::jsonb,0,'Sole means single.',30),
('business','The accounting equation is: Assets = …','["Liabilities + Equity","Revenue − Expenses","Equity − Liabilities","Cash + Sales"]'::jsonb,0,'Everything a business owns is funded by debts or owner''s equity.',40),
('business','According to the law of demand, when price falls, quantity demanded usually…','["Rises","Falls","Stays the same","Becomes zero"]'::jsonb,0,'Price and quantity demanded move in opposite directions.',50),
('business','Which is a fixed cost for a shop?','["Monthly rent","Stock bought for resale","Delivery fuel per order","Packaging"]'::jsonb,0,'Rent stays the same however much you sell.',60),
('islamic','How many pillars of Islam are there?','["5","6","4","7"]'::jsonb,0,'Shahada, Salah, Zakah, Sawm and Hajj.',10),
('islamic','What was the first word revealed to the Prophet ﷺ?','["Iqra'' (Read)","Qul (Say)","Bismillah","Alhamdulillah"]'::jsonb,0,'Surat al-''Alaq 96:1 begins with <span lang="ar">اقْرَأْ</span>.',20),
('islamic','How many surahs are in the Qur''an?','["114","99","120","30"]'::jsonb,0,'The Qur''an has 114 surahs in 30 juz''.',30),
('islamic','What is the longest surah?','["Al-Baqarah","Al-Fatihah","Yasin","Al-Imran"]'::jsonb,0,'Al-Baqarah has 286 verses.',40),
('islamic','In which month is fasting obligatory?','["Ramadan","Shawwal","Muharram","Rajab"]'::jsonb,0,'Ramadan is the ninth month of the Hijri calendar.',50),
('islamic','The minimum amount of wealth on which Zakah is due is called…','["Nisab","Hawl","Sadaqah","Fitrah"]'::jsonb,0,'Hawl is the full lunar year the wealth must be held.',60)
) as v(subject_id,question,options,correct,explanation,sort)
where not exists (select 1 from public.questions x where x.subject_id=v.subject_id and x.question=v.question);
