(function(){
/* ================= DATA ================= */
const CATS = [
  {id:'science', name:'Science'},
  {id:'languages', name:'Languages'},
  {id:'arts', name:'Arts'},
  {id:'islamic', name:'Islamic'}
];
const S = {
physics:{name:'Physics', so:'Fiisigis', sym:'Ph', cat:'science', units:['Motion & Forces','Work & Energy','Electricity','Light & Waves'], q:[
 ['What is the SI unit of force?',['Newton','Joule','Watt','Pascal'],0,'Force is measured in newtons (N). 1 N = 1 kg·m/s².'],
 ['Near Earth\'s surface, acceleration due to gravity is about…',['9.8 m/s²','3.0 m/s²','98 m/s²','1.6 m/s²'],0,'g ≈ 9.8 m/s². The Moon\'s value is about 1.6 m/s².'],
 ['A bus travels 120 km in 2 hours. What is its average speed?',['60 km/h','240 km/h','30 km/h','122 km/h'],0,'Speed = distance ÷ time = 120 ÷ 2 = 60 km/h.'],
 ['Which of these is a vector quantity?',['Velocity','Mass','Temperature','Time'],0,'Velocity has both size and direction. The others only have size.'],
 ['A current of 2 A flows through a 5 Ω resistor. What is the voltage?',['10 V','2.5 V','7 V','0.4 V'],0,'Ohm\'s law: V = I × R = 2 × 5 = 10 V.'],
 ['Light travels fastest through…',['A vacuum','Water','Glass','Air at sea level'],0,'Light reaches 3 × 10⁸ m/s in a vacuum and slows down in any medium.']]},
mathematics:{name:'Mathematics', so:'Xisaab', sym:'Ma', cat:'science', units:['Algebra','Geometry','Calculus','Logarithms'], q:[
 ['Solve for x: 2x + 6 = 14',['x = 4','x = 10','x = 3','x = 7'],0,'2x = 14 − 6 = 8, so x = 4.'],
 ['What is the area of a circle with radius 7 cm? (π ≈ 22/7)',['154 cm²','44 cm²','49 cm²','308 cm²'],0,'A = πr² = 22/7 × 49 = 154 cm².'],
 ['What is the derivative of x³?',['3x²','x²','3x³','x⁴ / 4'],0,'Power rule: d/dx xⁿ = n·xⁿ⁻¹, so 3x².'],
 ['√144 equals…',['12','14','72','11'],0,'12 × 12 = 144.'],
 ['The interior angles of a triangle add up to…',['180°','360°','90°','270°'],0,'Every triangle\'s angles sum to 180°.'],
 ['If log₁₀ x = 2, then x =',['100','20','10','1000'],0,'log₁₀ x = 2 means 10² = x, so x = 100.']]},
chemistry:{name:'Chemistry', so:'Kimistari', sym:'Ch', cat:'science', units:['Atomic Structure','Chemical Bonding','Acids & Bases'], q:[
 ['What is the chemical symbol for sodium?',['Na','So','Sd','S'],0,'Na comes from the Latin name natrium.'],
 ['What is the pH of pure water at 25 °C?',['7','0','14','5'],0,'Pure water is neutral, pH 7.'],
 ['What is the atomic number of carbon?',['6','12','8','14'],0,'Carbon has 6 protons. 12 is its mass number.'],
 ['What is the molar mass of water (H₂O)?',['18 g/mol','16 g/mol','10 g/mol','20 g/mol'],0,'2 × 1 (H) + 16 (O) = 18 g/mol.'],
 ['Which of these is a noble gas?',['Argon','Nitrogen','Oxygen','Chlorine'],0,'Argon is in Group 18 with a full outer shell.'],
 ['Sodium chloride (NaCl) is held together by…',['Ionic bonds','Covalent bonds','Metallic bonds','Hydrogen bonds'],0,'Na gives an electron to Cl, forming Na⁺ and Cl⁻ ions.']]},
biology:{name:'Biology', so:'Bayoolaji', sym:'Bi', cat:'science', units:['Cell Biology','Human Body','Genetics'], q:[
 ['Which organelle releases energy from food in a cell?',['Mitochondrion','Nucleus','Ribosome','Vacuole'],0,'Mitochondria carry out aerobic respiration.'],
 ['Photosynthesis takes place in the…',['Chloroplast','Mitochondrion','Cell wall','Nucleus'],0,'Chloroplasts contain chlorophyll, which absorbs light.'],
 ['Which blood cells carry oxygen?',['Red blood cells','White blood cells','Platelets','Plasma cells'],0,'Red blood cells contain haemoglobin, which binds oxygen.'],
 ['In DNA, adenine pairs with…',['Thymine','Guanine','Cytosine','Uracil'],0,'A pairs with T, and G pairs with C. Uracil is found in RNA.'],
 ['How many chambers does the human heart have?',['4','2','3','6'],0,'Two atria and two ventricles.'],
 ['What is the largest organ of the human body?',['Skin','Liver','Brain','Lungs'],0,'The skin covers about 1.8 m² in adults.']]},
technology:{name:'Technology', so:'Tiknoolaji', sym:'Te', cat:'science', units:['Computer Systems','Number Systems','The Web'], q:[
 ['What does CPU stand for?',['Central Processing Unit','Computer Power Unit','Central Program Utility','Control Processing Unit'],0,'The CPU runs a computer\'s instructions.'],
 ['How many bits are in one byte?',['8','4','16','10'],0,'1 byte = 8 bits.'],
 ['Which of these is an input device?',['Keyboard','Monitor','Printer','Speaker'],0,'A keyboard sends data into the computer.'],
 ['What is HTML used for?',['Structuring web pages','Storing databases','Editing photos','Running spreadsheets'],0,'HTML marks up the content and structure of web pages.'],
 ['Which memory loses its contents when power is off?',['RAM','ROM','Hard disk','Flash drive'],0,'RAM is volatile memory.'],
 ['What is the decimal number 5 in binary?',['101','110','011','111'],0,'4 + 0 + 1 = 5, written 101.']]},
arabic:{name:'Arabic', so:'Carabi', sym:'ع', cat:'languages', units:['Grammar (النحو)','Vocabulary (المفردات)','Verbs (الأفعال)'], q:[
 ['What is the plural of <span lang="ar">كِتَاب</span> (book)?',['<span lang="ar">كُتُب</span>','<span lang="ar">كِتَابَات</span>','<span lang="ar">كَاتِب</span>','<span lang="ar">مَكْتَبَة</span>'],0,'<span lang="ar">كُتُب</span> is the broken plural of <span lang="ar">كِتَاب</span>.'],
 ['What does <span lang="ar">مَدْرَسَة</span> mean?',['School','Teacher','Book','Mosque'],0,'<span lang="ar">مَدْرَسَة</span> is a school. A teacher is <span lang="ar">مُدَرِّس</span>.'],
 ['Which is a sun letter (<span lang="ar">حرف شمسي</span>)?',['<span lang="ar">ش</span>','<span lang="ar">ق</span>','<span lang="ar">ب</span>','<span lang="ar">م</span>'],0,'With sun letters the ل of <span lang="ar">ال</span> is silent, as in <span lang="ar">الشَّمْس</span>.'],
 ['Which verb is the past tense of <span lang="ar">يَكْتُبُ</span>?',['<span lang="ar">كَتَبَ</span>','<span lang="ar">اُكْتُبْ</span>','<span lang="ar">كَاتِب</span>','<span lang="ar">مَكْتُوب</span>'],0,'<span lang="ar">كَتَبَ</span> means "he wrote".'],
 ['What does <span lang="ar">شُكْرًا</span> mean?',['Thank you','Welcome','Goodbye','Please'],0,'<span lang="ar">شُكْرًا</span> is thank you. The reply is <span lang="ar">عَفْوًا</span>.'],
 ['How many letters are in the Arabic alphabet?',['28','26','30','24'],0,'The Arabic alphabet has 28 letters.']]},
english:{name:'English', so:'Ingiriisi', sym:'En', cat:'languages', units:['Grammar','Vocabulary','Comprehension'], q:[
 ['What is the past tense of "go"?',['went','goed','gone','going'],0,'"Go" is irregular: go, went, gone.'],
 ['Choose a synonym for "rapid".',['fast','slow','calm','weak'],0,'Rapid means fast or quick.'],
 ['She ___ to school every day.',['goes','go','going','gone'],0,'Third person singular in the present simple takes -s/-es.'],
 ['Which word is a noun?',['happiness','happy','happily','happen'],0,'Happiness names a thing (a feeling), so it is a noun.'],
 ['What is the opposite of "ancient"?',['modern','old','historic','early'],0,'Ancient means very old. Modern is its opposite.'],
 ['They are ___ best students in the class.',['the','a','an','no article'],0,'Superlatives take "the": the best, the tallest.']]},
somali:{name:'Af Soomaali', so:'Luqadda hooyo', sym:'So', cat:'languages', units:['Higgaad','Naxwe','Suugaan'], q:[
 ['Imisa shaqal gaaban ayuu leeyahay Af Soomaaligu?',['5','3','7','10'],0,'Shaqallada gaagaban waa a, e, i, o, u.'],
 ['Sannadkee ayaa si rasmi ah loo ansixiyay qoraalka Af Soomaaliga?',['1972','1960','1969','1978'],0,'21 Oktoobar 1972 ayaa farta Laatiinka loo ansixiyay Af Soomaaliga.'],
 ['Xarafkee ayaa matala dhawaaqa cayn (ʕ), sida "caano"?',['c','x','q','dh'],0,'Xarafka "c" wuxuu u taagan yahay cayn.'],
 ['Jamciga erayga "nin" waa?',['niman','ninno','ninyo','nimaan'],0,'Nin → niman.'],
 ['Erayga "mahadsanid" macnihiisu waa?',['Thank you','Good morning','Goodbye','Welcome'],0,'Mahadsanid = thank you.'],
 ['Xarafkee ayaa matala dhawaaqa ħ, sida erayga "xoolo"?',['x','h','kh','c'],0,'Xarafka "x" wuxuu u taagan yahay dhawaaqa ħ.']]},
geography:{name:'Geography', so:'Juqraafi', sym:'Ge', cat:'arts', units:['Physical Geography of Somalia','Maps & Coordinates','World Regions'], q:[
 ['What is the capital city of Somalia?',['Mogadishu','Hargeisa','Kismayo','Baidoa'],0,'Mogadishu (Muqdisho) is the capital.'],
 ['Which two rivers flow through southern Somalia?',['Jubba and Shabelle','Nile and Awash','Tana and Omo','Zambezi and Congo'],0,'Both rise in the Ethiopian Highlands.'],
 ['Which body of water lies north of Somalia?',['Gulf of Aden','Red Sea','Mediterranean Sea','Persian Gulf'],0,'The Gulf of Aden separates Somalia from Yemen.'],
 ['Somalia has the longest coastline on mainland Africa. About how long is it?',['3,300 km','800 km','1,500 km','6,000 km'],0,'Roughly 3,300 km along the Gulf of Aden and the Indian Ocean.'],
 ['What is the largest continent by area?',['Asia','Africa','North America','Europe'],0,'Asia covers about 30% of Earth\'s land.'],
 ['Lines of latitude measure distance…',['North or south of the Equator','East or west of Greenwich','Above sea level','Between time zones'],0,'Longitude measures east–west from the Prime Meridian.']]},
history:{name:'History', so:'Taariikh', sym:'Hi', cat:'arts', units:['Ancient Somalia','Colonial Era','Independence'], q:[
 ['In which year did Somalia become independent and unite?',['1960','1950','1969','1977'],0,'On 1 July 1960 the north and south united as the Somali Republic.'],
 ['The Somali Youth League was founded in…',['1943','1960','1920','1955'],0,'The SYL was founded in Mogadishu in May 1943.'],
 ['Who led the Dervish movement against colonial rule?',['Sayid Maxamed Cabdulle Xasan','Aden Abdulle Osman','Axmed Gurey','Siad Barre'],0,'The Dervish state resisted British and Italian forces from 1899 to 1920.'],
 ['Ancient Egyptians traded with a land to the south they called…',['The Land of Punt','Axum','Carthage','Nubia'],0,'Many historians place Punt on the Horn of Africa coast.'],
 ['Imam Ahmad ibn Ibrahim al-Ghazi, leader of the Adal Sultanate, is widely known as…',['Axmed Gurey','Sayid Maxamed','Cali Mire','Wiil Waal'],0,'Gurey means "left-handed".'],
 ['In which year did the Second World War end?',['1945','1918','1939','1950'],0,'The war ended in 1945.']]},
business:{name:'Business', so:'Ganacsi', sym:'Bu', cat:'arts', units:['Business Basics','Accounting','Economics'], q:[
 ['Profit is calculated as…',['Revenue − Costs','Costs − Revenue','Revenue + Costs','Revenue × Costs'],0,'Whatever remains after costs is profit.'],
 ['A shop earns $5,000 and spends $3,200. What is the profit?',['$1,800','$8,200','$3,200','$2,800'],0,'5,000 − 3,200 = 1,800.'],
 ['A sole proprietorship is owned by…',['One person','Shareholders','The government','Two partners'],0,'Sole means single.'],
 ['The accounting equation is: Assets = …',['Liabilities + Equity','Revenue − Expenses','Equity − Liabilities','Cash + Sales'],0,'Everything a business owns is funded by debts or owner\'s equity.'],
 ['According to the law of demand, when price falls, quantity demanded usually…',['Rises','Falls','Stays the same','Becomes zero'],0,'Price and quantity demanded move in opposite directions.'],
 ['Which is a fixed cost for a shop?',['Monthly rent','Stock bought for resale','Delivery fuel per order','Packaging'],0,'Rent stays the same however much you sell.']]},
islamic:{name:'Islamic Studies', so:'Tarbiyada Islaamka', sym:'إ', cat:'islamic', units:['Qur\'an Studies','Fiqh','Seerah'], q:[
 ['How many pillars of Islam are there?',['5','6','4','7'],0,'Shahada, Salah, Zakah, Sawm and Hajj.'],
 ['What was the first word revealed to the Prophet ﷺ?',['Iqra\' (Read)','Qul (Say)','Bismillah','Alhamdulillah'],0,'Surat al-\'Alaq 96:1 begins with <span lang="ar">اقْرَأْ</span>.'],
 ['How many surahs are in the Qur\'an?',['114','99','120','30'],0,'The Qur\'an has 114 surahs in 30 juz\'.'],
 ['What is the longest surah?',['Al-Baqarah','Al-Fatihah','Yasin','Al-Imran'],0,'Al-Baqarah has 286 verses.'],
 ['In which month is fasting obligatory?',['Ramadan','Shawwal','Muharram','Rajab'],0,'Ramadan is the ninth month of the Hijri calendar.'],
 ['The minimum amount of wealth on which Zakah is due is called…',['Nisab','Hawl','Sadaqah','Fitrah'],0,'Hawl is the full lunar year the wealth must be held.']]}
};
const ORDER = Object.keys(S);

/* ---------- course notes (one lesson per unit) ---------- */
const ar = t => `<span lang="ar">${t}</span>`;
const L = {
physics:{
 'Motion & Forces':[['Speed and velocity','Speed = distance ÷ time. Velocity is speed in a stated direction, so it is a vector quantity.'],['Newton\'s second law','F = m × a. A force in newtons (N) accelerates a mass in kilograms. Weight is W = m × g, with g ≈ 9.8 m/s².'],['Balanced forces','When forces balance, an object stays still or keeps moving at a steady speed.']],
 'Work & Energy':[['Work','Work = force × distance moved in the direction of the force. It is measured in joules (J).'],['Kinetic and potential energy','Kinetic energy = ½mv². Gravitational potential energy = mgh.'],['Conservation','Energy is never created or destroyed. It only changes from one form to another.']],
 'Electricity':[['Ohm\'s law','V = I × R: voltage in volts, current in amperes, resistance in ohms (Ω).'],['Electrical power','P = V × I, measured in watts. A 240 V kettle drawing 10 A uses 2,400 W.']],
 'Light & Waves':[['Speed of light','Light travels at 3 × 10⁸ m/s in a vacuum and slows down in water or glass. The change in speed bends it (refraction).'],['The wave equation','v = f × λ. Wave speed equals frequency times wavelength.']]},
mathematics:{
 'Algebra':[['Solving linear equations','Do the same thing to both sides. 2x + 6 = 14 → 2x = 8 → x = 4.'],['Expanding brackets','a(b + c) = ab + ac, and (x + 2)(x + 3) = x² + 5x + 6.']],
 'Geometry':[['Angles','Angles in a triangle add to 180°, angles on a straight line add to 180° and angles in a quadrilateral add to 360°.'],['Circles','Circumference = 2πr and area = πr². Use π ≈ 3.14 or 22/7.']],
 'Calculus':[['The power rule','d/dx (xⁿ) = n·xⁿ⁻¹, so d/dx (x³) = 3x².'],['What a derivative means','The derivative is the gradient of a curve at a point: how fast one quantity changes compared with another.']],
 'Logarithms':[['Definition','log_b x = y means bʸ = x. For example, log₁₀ 100 = 2 because 10² = 100.'],['Laws of logs','log(ab) = log a + log b · log(a/b) = log a − log b · log(aⁿ) = n log a.']]},
chemistry:{
 'Atomic Structure':[['Particles in the atom','Protons (+) and neutrons (no charge) sit in the nucleus. Electrons (−) move in shells around it.'],['Atomic and mass number','The atomic number is the number of protons. The mass number is protons + neutrons. Carbon: 6 protons, 6 neutrons, electrons 2, 4.']],
 'Chemical Bonding':[['Ionic bonds','Metals give electrons to non-metals. The ions formed have opposite charges and attract, e.g. Na⁺ and Cl⁻ in NaCl.'],['Covalent bonds','Non-metals share pairs of electrons, e.g. H₂O and CO₂.']],
 'Acids & Bases':[['The pH scale','pH runs from 0 to 14. Below 7 is acidic, 7 is neutral and above 7 is alkaline.'],['Neutralisation','Acid + base → salt + water. HCl + NaOH → NaCl + H₂O.']]},
biology:{
 'Cell Biology':[['Organelles','The nucleus holds DNA. Mitochondria release energy in respiration. Ribosomes build proteins.'],['Plant cells','Plant cells also have a cell wall, a large vacuole and chloroplasts for photosynthesis.']],
 'Human Body':[['The heart','Four chambers: two atria above, two ventricles below. The left ventricle pumps blood around the whole body.'],['Blood','Red cells carry oxygen using haemoglobin. White cells fight infection. Platelets help blood clot.']],
 'Genetics':[['DNA','DNA is a double helix. Its bases pair A–T and G–C.'],['Genes and chromosomes','A gene is a section of DNA that codes for a protein. Human body cells hold 23 pairs of chromosomes.']]},
technology:{
 'Computer Systems':[['Hardware','Input (keyboard, mouse) → processing (CPU) → output (monitor, printer), with storage keeping data.'],['Memory','RAM is fast but loses data without power (volatile). ROM keeps its contents.']],
 'Number Systems':[['Binary','Computers count in base 2. Place values from the right are 1, 2, 4, 8. So 0101 = 4 + 1 = 5.'],['Units of data','8 bits = 1 byte. 1,024 bytes = 1 kilobyte.']],
 'The Web':[['HTML','HTML gives a web page its structure using tags such as &lt;h1&gt; for headings and &lt;p&gt; for paragraphs.'],['URLs','A web address names the protocol (https), the domain and the path to the page.']]},
arabic:{
 'Grammar (النحو)':[['The definite article',`${ar('ال')} means "the". Before sun letters the ل is silent (${ar('الشَّمْس')}). Before moon letters you pronounce it (${ar('القَمَر')}).`],['Nominal sentences',`A sentence can begin with a noun: ${ar('الكِتَابُ جَدِيدٌ')} (The book is new).`]],
 'Vocabulary (المفردات)':[['At school',`${ar('مَدْرَسَة')} school · ${ar('مُدَرِّس')} teacher · ${ar('كِتَاب')} book · ${ar('قَلَم')} pen`],['Courtesy',`${ar('شُكْرًا')} thank you · ${ar('عَفْوًا')} you're welcome · ${ar('مِنْ فَضْلِكَ')} please`]],
 'Verbs (الأفعال)':[['Past, present, command',`${ar('كَتَبَ')} he wrote · ${ar('يَكْتُبُ')} he writes · ${ar('اُكْتُبْ')} write!`],['Three-letter roots',`Most words grow from a root. ك-ت-ب gives ${ar('كِتَاب')}, ${ar('كَاتِب')} and ${ar('مَكْتَبَة')}.`]]},
english:{
 'Grammar':[['Present simple','Add -s or -es for he, she and it: she goes, he plays.'],['Irregular verbs','Some verbs change form completely: go → went → gone, see → saw → seen.'],['Articles','Use "the" with superlatives: the best, the tallest.']],
 'Vocabulary':[['Synonyms and antonyms','Synonyms share a meaning (rapid, fast). Antonyms are opposites (ancient, modern).'],['Word classes','Nouns name things (happiness), adjectives describe nouns (happy), adverbs describe verbs (happily).']],
 'Comprehension':[['Find the main idea','Read the whole passage first. The first and last sentences of a paragraph usually carry its main idea.'],['Use evidence','Underline the exact words in the text that support your answer.']]},
somali:{
 'Higgaad':[['Shaqallada','Af Soomaaligu wuxuu leeyahay 5 shaqal gaagaab (a, e, i, o, u) iyo 5 shaqal dheer (aa, ee, ii, oo, uu).'],['Xarfaha gaarka ah','"c" waa cayn (caano), "x" waa xaa (xoolo), "kh" waa khaa (khamiis).']],
 'Naxwe':[['Jamac','Magacyo badan waxay jamac ku sameeyaan isbeddel: nin → niman, buug → buugaag.'],['Lab iyo dheddig','Qodobka "ka" wuxuu raacaa magac lab ah (ninka), "ta" wuxuu raacaa magac dheddig ah (naagta).']],
 'Suugaan':[['Qoraalka Af Soomaaliga','Farta Laatiinka ee Af Soomaaliga waxaa si rasmi ah loo ansixiyay 21 Oktoobar 1972.'],['Noocyada maansada','Suugaanta Soomaalidu waxay leedahay noocyo ay ka mid yihiin gabay, geeraar iyo buraambur.']]},
geography:{
 'Physical Geography of Somalia':[['Coastline','Somalia\'s coast runs about 3,300 km along the Gulf of Aden and the Indian Ocean, the longest on mainland Africa.'],['Rivers','The Jubba and Shabelle rise in the Ethiopian Highlands and water southern Somalia\'s main farmland.']],
 'Maps & Coordinates':[['Latitude','Lines of latitude run east–west and measure distance north or south of the Equator (0°).'],['Longitude','Lines of longitude run from pole to pole and measure distance east or west of the Prime Meridian at Greenwich.']],
 'World Regions':[['Continents','There are seven continents. Asia is the largest, followed by Africa.'],['The Horn of Africa','Somalia, Ethiopia, Eritrea and Djibouti make up the Horn of Africa.']]},
history:{
 'Ancient Somalia':[['The Land of Punt','Ancient Egyptians traded for gold, incense and ebony with Punt, which many historians place on the Horn coast.'],['The Adal Sultanate','In the 1500s Imam Ahmad ibn Ibrahim al-Ghazi (Axmed Gurey) led Adal\'s campaigns across the Horn.']],
 'Colonial Era':[['Partition','In the late 1800s Somali lands were divided between Britain, Italy, France and Ethiopia.'],['The Dervishes','Sayid Maxamed Cabdulle Xasan led the Dervish resistance from 1899 to 1920.']],
 'Independence':[['Somali Youth League','Founded in Mogadishu in 1943, the SYL campaigned for independence and unity.'],['1 July 1960','British Somaliland (independent on 26 June) and the Italian-administered south united as the Somali Republic.']]},
business:{
 'Business Basics':[['Types of ownership','Sole proprietor: one owner. Partnership: two or more owners. Company: owned by shareholders.'],['Profit and loss','Profit = revenue − costs. When costs are larger than revenue, the business makes a loss.']],
 'Accounting':[['The accounting equation','Assets = Liabilities + Equity. The two sides always balance.'],['Fixed and variable costs','Fixed costs such as rent stay the same. Variable costs such as stock rise as you sell more.']],
 'Economics':[['Demand','When price falls, quantity demanded usually rises.'],['Supply','When price rises, producers are usually willing to supply more.']]},
islamic:{
 'Qur\'an Studies':[['Structure','The Qur\'an has 114 surahs in 30 juz\'. Al-Baqarah is the longest and Al-Kawthar the shortest.'],['The first revelation',`The first word revealed was ${ar('اقْرَأْ')} (Read), in Surat al-'Alaq.`]],
 'Fiqh':[['The five pillars','Shahada, Salah, Zakah, Sawm in Ramadan, and Hajj.'],['Zakah','Zakah is 2.5% of savings above the nisab, held for one full lunar year (hawl).']],
 'Seerah':[['Birth','The Prophet ﷺ was born in Makkah in the Year of the Elephant, around 570 CE.'],['The Hijrah','In 622 CE the Prophet ﷺ migrated to Madinah. The Hijri calendar counts from that year.']]}
};

/* ---------- figures (one diagram per subject) ---------- */
const SKY='#0284C7', CORAL='#EF4444', EM='#10B981', MUT='var(--text-2)';
const arrow = (x1,y1,x2,y2,c) => { const a=Math.atan2(y2-y1,x2-x1), h=9;
  const p=(d)=>`${(x2-h*Math.cos(a+d)).toFixed(1)},${(y2-h*Math.sin(a+d)).toFixed(1)}`;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${c}" stroke-width="2.5" stroke-linecap="round"/><polygon points="${x2},${y2} ${p(.45)} ${p(-.45)}" style="fill:${c}"/>`; };
const tx = (x,y,t,o='') => `<text x="${x}" y="${y}" ${o}>${t}</text>`;
const M = 'text-anchor="middle"';
const fig = (inner, cap) => `<figure class="glass figure"><svg viewBox="0 0 320 170" role="img" aria-label="${plain(cap)}" font-size="12" font-weight="600">${inner}</svg><figcaption>${cap}</figcaption></figure>`;
const FIG = {
 physics:()=>fig(`<line x1="20" y1="120" x2="300" y2="120" style="stroke:${MUT}" stroke-width="2"/>
  ${Array.from({length:14},(_,i)=>`<line x1="${30+i*20}" y1="121" x2="${20+i*20}" y2="131" style="stroke:${MUT}" stroke-opacity=".5"/>`).join('')}
  <rect x="120" y="70" width="80" height="50" rx="8" class="f-ice" style="stroke:${SKY}" stroke-width="2"/>
  ${tx(160,100,'m = 5 kg',M+' class="f-on" font-weight="800"')}
  ${arrow(200,90,286,90,CORAL)}${tx(243,80,'F = 20 N',M+` style="fill:${CORAL}" font-weight="800"`)}
  ${arrow(120,108,62,108,MUT)}${tx(88,100,'friction',M+' class="f-mut"')}
  ${arrow(160,70,160,22,SKY)}${tx(174,30,'N',`style="fill:${SKY}" font-weight="800"`)}
  ${arrow(160,120,160,162,SKY)}${tx(174,160,'W = mg',`style="fill:${SKY}" font-weight="800"`)}`,
  'Free-body diagram. With no friction, a = F ÷ m = 20 ÷ 5 = 4 m/s²'),
 mathematics:()=>fig(`<circle cx="85" cy="80" r="58" class="f-ice" style="stroke:${SKY}" stroke-width="2"/>
  <line x1="85" y1="80" x2="143" y2="80" style="stroke:${CORAL}" stroke-width="2.5"/><circle cx="85" cy="80" r="3.5" style="fill:${CORAL}"/>
  ${tx(114,72,'r = 7',M+` style="fill:${CORAL}" font-weight="800"`)}${tx(85,160,'A = πr² = 154 cm²',M)}
  <polygon points="190,138 300,138 190,34" class="f-ice" style="stroke:${SKY}" stroke-width="2"/>
  <rect x="190" y="126" width="12" height="12" fill="none" style="stroke:${SKY}"/>
  ${tx(206,120,'90°','class="f-mut"')}${tx(196,62,'A','class="f-on" font-weight="800"')}${tx(276,132,'B','class="f-on" font-weight="800"')}
  ${tx(245,160,'A + B + 90° = 180°',M)}`,
  'Circle area and the angle sum of a triangle'),
 chemistry:()=>fig(`<circle cx="100" cy="85" r="42" fill="none" style="stroke:${MUT}" stroke-dasharray="3 4"/>
  <circle cx="100" cy="85" r="70" fill="none" style="stroke:${MUT}" stroke-dasharray="3 4"/>
  <circle cx="100" cy="85" r="23" style="fill:${CORAL}" fill-opacity=".9"/>${tx(100,82,'6p',M+' style="fill:#fff" font-size="11" font-weight="800"')}${tx(100,96,'6n',M+' style="fill:#fff" font-size="11" font-weight="800"')}
  ${[[142,85],[58,85],[149.5,35.5],[50.5,35.5],[50.5,134.5],[149.5,134.5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.5" style="fill:${SKY}"/>`).join('')}
  ${tx(200,52,'Carbon (C)','class="f-tx" font-size="16" font-weight="800"')}${tx(200,80,'Atomic number 6','class="f-mut"')}${tx(200,102,'Mass number 12','class="f-mut"')}${tx(200,124,'Electrons 2, 4','class="f-mut"')}`,
  'Bohr model of carbon: 2 electrons in the first shell, 4 in the second'),
 biology:()=>fig(`<ellipse cx="110" cy="85" rx="90" ry="65" class="f-ice" style="stroke:${SKY}" stroke-width="2.5"/>
  <circle cx="92" cy="78" r="26" style="fill:${SKY};stroke:${SKY}" fill-opacity=".22" stroke-width="2"/><circle cx="92" cy="78" r="8" style="fill:${SKY}"/>
  <ellipse cx="148" cy="118" rx="22" ry="11" style="fill:${CORAL};stroke:${CORAL}" fill-opacity=".2" stroke-width="2"/>
  <path d="M130 118 q4.5 -8 9 0 t9 0 t9 0 t9 0" fill="none" style="stroke:${CORAL}" stroke-width="1.5"/>
  ${[[55,52],[62,120],[140,58],[160,82],[50,92],[112,132],[130,40]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" style="fill:${MUT}"/>`).join('')}
  <line x1="116" y1="68" x2="218" y2="38" style="stroke:${MUT}"/>${tx(222,42,'Nucleus','class="f-tx"')}
  <line x1="163" y1="82" x2="218" y2="82" style="stroke:${MUT}"/>${tx(222,86,'Ribosomes','class="f-tx"')}
  <line x1="170" y1="118" x2="218" y2="118" style="stroke:${MUT}"/>${tx(222,122,'Mitochondrion','class="f-tx"')}
  <line x1="179" y1="127" x2="218" y2="150" style="stroke:${MUT}"/>${tx(222,154,'Cell membrane','class="f-tx"')}`,
  'An animal cell and its main organelles'),
 technology:()=>fig(`${tx(160,24,'Place value',M+' class="f-mut"')}
  ${[8,4,2,1].map((v,i)=>{const on=[0,1,0,1][i], x=48+i*60; return `${tx(x+26,50,v,M+' class="f-mut" font-weight="800"')}<rect x="${x}" y="60" width="52" height="52" rx="12" ${on?`style="fill:${SKY}"`:`class="f-ice" style="stroke:${SKY}"`}/>${tx(x+26,93,on,M+` font-size="22" font-weight="800" ${on?'style="fill:#fff"':'class="f-on"'}`)}`;}).join('')}
  ${tx(160,146,'0×8 + 1×4 + 0×2 + 1×1 = 5',M+' class="f-tx" font-size="14" font-weight="800"')}`,
  'Binary 0101 converts to the decimal number 5'),
 arabic:()=>{ const sun='ت ث د ذ ر ز س ش ص ض ط ظ ل ن'.split(' '), moon='ا ب ج ح خ ع غ ف ق ك م ه و ي'.split(' ');
  const grid=(ls,x0)=>ls.map((l,i)=>tx(x0+ (i%7)*20, i<7?82:114, l, M+' font-size="18" style="font-family:var(--f-ar)" class="f-tx"')).join('');
  return fig(`<rect x="8" y="30" width="148" height="104" rx="16" class="f-ice"/><rect x="164" y="30" width="148" height="104" rx="16" style="fill:${CORAL}" fill-opacity=".1"/>
   ${tx(82,52,'Sun letters',M+' class="f-on" font-weight="800"')}${tx(238,52,'Moon letters',M+` style="fill:${CORAL}" font-weight="800"`)}
   ${grid(sun,22)}${grid(moon,178)}
   ${tx(82,158,'الشَّمْس',M+' font-size="17" style="font-family:var(--f-ar)" class="f-tx"')}${tx(238,158,'القَمَر',M+' font-size="17" style="font-family:var(--f-ar)" class="f-tx"')}`,
   'The 14 sun letters and 14 moon letters'); },
 english:()=>fig(`${arrow(24,88,298,88,MUT)}
  ${[['Past','went','Yesterday'],['Present','goes','Every day'],['Future','will go','Tomorrow']].map(([a,b,c],i)=>{const x=70+i*90;return `<circle cx="${x}" cy="88" r="9" style="fill:${[CORAL,SKY,EM][i]}"/>${tx(x,60,a,M+' class="f-mut"')}${tx(x,124,b,M+' class="f-tx" font-size="16" font-weight="800"')}${tx(x,146,c,M+' class="f-mut" font-size="11"')}`;}).join('')}`,
  'Tense timeline for the verb "go" with she'),
 somali:()=>fig(`${tx(20,68,'Gaaban','class="f-mut"')}${tx(20,123,'Dheer','class="f-mut"')}
  ${['a','e','i','o','u'].map((v,i)=>{const x=92+i*44;return `<rect x="${x}" y="42" width="38" height="38" rx="11" class="f-ice" style="stroke:${SKY}"/>${tx(x+19,67,v,M+' class="f-on" font-size="17" font-weight="800"')}<rect x="${x}" y="97" width="38" height="38" rx="11" style="fill:${SKY}"/>${tx(x+19,122,v+v,M+' style="fill:#fff" font-size="15" font-weight="800"')}`;}).join('')}
  ${tx(160,160,'5 + 5 = 10 shaqal',M+' class="f-tx" font-weight="800"')}`,
  'Shaqallada Af Soomaaliga: gaagaab iyo dheer'),
 geography:()=>fig(`<circle cx="95" cy="85" r="65" class="f-ice" style="stroke:${SKY}" stroke-width="2"/>
  <ellipse cx="95" cy="85" rx="24" ry="65" fill="none" style="stroke:${SKY}" stroke-dasharray="4 4"/>
  <line x1="37" y1="55" x2="153" y2="55" style="stroke:${SKY}" stroke-opacity=".6"/><line x1="37" y1="115" x2="153" y2="115" style="stroke:${SKY}" stroke-opacity=".6"/>
  <line x1="30" y1="85" x2="160" y2="85" style="stroke:${CORAL}" stroke-width="2.5"/>
  ${tx(180,56,'Equator = 0°',`style="fill:${CORAL}" font-weight="800"`)}${tx(180,80,'Latitude: N or S','class="f-tx"')}${tx(180,100,'Longitude: E or W','class="f-tx"')}${tx(180,124,'Somalia lies about','class="f-mut"')}${tx(180,140,'2°S to 12°N','class="f-mut"')}`,
  'Latitude, longitude and the Equator'),
 history:()=>fig(`<line x1="16" y1="85" x2="304" y2="85" style="stroke:${MUT}" stroke-width="2"/>
  ${[[45,'1899','Dervish','resistance'],[122,'1943','SYL','founded'],[200,'1960','Independence','and union'],[276,'1972','Somali','script']].map(([x,y,a,b],i)=>`<circle cx="${x}" cy="85" r="${i===2?10:7}" style="fill:${i===2?CORAL:SKY}"/>${tx(x,62,y,M+' class="f-tx" font-size="15" font-weight="800"')}${tx(x,112,a,M+' class="f-tx" font-size="11"')}${tx(x,127,b,M+' class="f-mut" font-size="11"')}`).join('')}`,
  'Key dates in modern Somali history'),
 business:()=>fig(`<rect x="50" y="20" width="80" height="125" rx="10" style="fill:${SKY}"/>${tx(90,86,'$5,000',M+' style="fill:#fff" font-weight="800" font-size="14"')}
  ${tx(160,92,'=',M+' class="f-tx" font-size="26" font-weight="800"')}
  <rect x="190" y="65" width="80" height="80" rx="10" style="fill:${CORAL}" fill-opacity=".85"/>${tx(230,110,'$3,200',M+' style="fill:#fff" font-weight="800"')}
  <rect x="190" y="20" width="80" height="42" rx="10" style="fill:${EM}"/>${tx(230,46,'$1,800',M+' style="fill:#fff" font-weight="800"')}
  ${tx(90,163,'Revenue',M+' class="f-mut"')}${tx(230,163,'Costs + Profit',M+' class="f-mut"')}`,
  'Profit = revenue − costs'),
 islamic:()=>fig(`<polygon points="16,50 304,50 160,12" style="fill:${SKY}"/>
  <rect x="16" y="136" width="288" height="10" rx="3" style="fill:${SKY}"/>
  ${['Shahada','Salah','Zakah','Sawm','Hajj'].map((p,i)=>{const x=30+i*58;return `<rect x="${x}" y="56" width="30" height="76" rx="4" class="f-ice" style="stroke:${SKY}"/>${tx(x+15,164,p,M+' class="f-tx" font-size="11"')}`;}).join('')}`,
  'The five pillars of Islam')
};

/* ================= STATE ================= */
const store = {
  get(k, d){ try{ const v = localStorage.getItem('ha_'+k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('ha_'+k, JSON.stringify(v)); }catch(e){} }
};
const state = {
  user: store.get('user', null),
  attempts: store.get('attempts', []),
  settings: store.get('settings', {instant:true, timer:true}),
  done: new Set(store.get('done', [])),
  exam: {mode:'mixed', sid:'physics', count:10, time:45},
  cat: 'science',
  sid: 'chemistry',
  unit: 'Acids & Bases',
  query: '',
  lastResult: null,
  filter: 'all',
  rating: 4
};
const save = () => { store.set('attempts', state.attempts); store.set('settings', state.settings); store.set('user', state.user); store.set('done', [...state.done]); };
const isDone = (sid, u) => state.done.has(sid+'|'+u);
const TOTAL_LESSONS = Object.values(S).reduce((n,s)=>n+s.units.length,0);

/* ================= HELPERS ================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const plain = s => String(s).replace(/<[^>]+>/g,'');
const pct = a => Math.round(a.correct / a.total * 100);
const I = {
  chev:'<path d="m9 18 6-6-6-6"/>', back:'<path d="m15 18-6-6 6-6"/>', x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check:'<path d="M20 6 9 17l-5-5"/>', flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  play:'<path d="M6 4l14 8-14 8z" fill="currentColor"/>', zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', minus:'<path d="M5 12h14"/>',
  retry:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  star:'<path d="M12 2.8l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.6l-5.6 3.3 1.4-6.3L3 9.3l6.4-.6z"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>'
};
const ic = (n, cls='') => `<svg class="ic ${cls}" viewBox="0 0 24 24">${I[n]}</svg>`;
const menuBtn = `<button class="menu-btn glass" data-act="menu" aria-label="Open menu"><svg class="ic" viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/></svg></button>`;
const symTile = (sid, cls='') => `<span class="sym ${cls}"><small class="num">${String(ORDER.indexOf(sid)+1).padStart(2,'0')}</small>${S[sid].sym}</span>`;
function initials(n){ return n.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('') || 'HA'; }
function ago(t){
  const m = Math.round((Date.now()-t)/60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + ' min ago';
  const h = Math.round(m/60); if (h < 24) return h + ' h ago';
  const d = Math.round(h/24); return d === 1 ? 'yesterday' : d + ' days ago';
}
function hash(s){ let h=0; for (const c of s) h = (h*31 + c.charCodeAt(0)) >>> 0; return h; }
function unitBest(sid, unit){
  const best = state.attempts.filter(a=>a.sid===sid && a.unit===unit).map(pct);
  return best.length ? Math.max(...best) : null;
}
function lessonsDone(sid){ return S[sid].units.filter(u=>isDone(sid,u)).length; }
function subjProgress(sid){ return Math.round(lessonsDone(sid)/S[sid].units.length*100); }
function mastery(sid){ const a = state.attempts.filter(x=>x.sid===sid); if (!a.length) return null;
  return Math.round(a.reduce((s,x)=>s+x.correct,0)/a.reduce((s,x)=>s+x.total,0)*100); }
function shuffle(a){ a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function ring(p, r, stroke, color, track){
  const c = 2*Math.PI*r, s = r*2+stroke;
  return `<svg viewBox="0 0 ${s} ${s}"><circle cx="${s/2}" cy="${s/2}" r="${r}" fill="none" style="stroke:${track}" stroke-width="${stroke}"/><circle cx="${s/2}" cy="${s/2}" r="${r}" fill="none" style="stroke:${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p/100)}" style="transition:stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)"/></svg>`;
}
let toastT;
function toast(msg){ $('#toast-t').textContent = msg; const t=$('#toast'); t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'), 2600); }

/* ================= ROUTER ================= */
let current = null;
const TABS = {home:'home', explore:'explore', history:'history', support:'support', subject:'explore', lesson:'explore', results:'history'};
function go(name){
  if (name !== 'quiz') stopTimer();
  $('#menu').hidden = true;
  const R = {home:renderHome, subject:renderSubject, lesson:renderLesson, quiz:renderQuiz, results:renderResults, explore:renderExplore, history:renderHistory};
  if (R[name]) R[name]();
  $$('.screen').forEach(s => s.hidden = true);
  const el = $('#s-'+name);
  el.hidden = false; el.scrollTop = 0;
  el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter');
  current = name;
  $('#tabbar').hidden = (name === 'auth' || name === 'quiz');
  $$('#tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === TABS[name]));
  $$('#jump button').forEach(b => b.classList.toggle('on', b.dataset.jump === name));
}

/* ================= HOME ================= */
function greeting(){ const h = new Date().getHours(); return h < 12 ? 'Subax wanaagsan' : h < 18 ? 'Galab wanaagsan' : 'Habeen wanaagsan'; }
function stats(){
  const A = state.attempts;
  const q = A.reduce((s,a)=>s+a.total,0), c = A.reduce((s,a)=>s+a.correct,0);
  const today = new Date().toDateString();
  const days = new Set(A.map(a=>new Date(a.t).toDateString()));
  let streak = 0; const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate()-1);
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate()-1); }
  return {quizzes:A.length, questions:q, acc: q ? Math.round(c/q*100) : 0, streak, today: A.filter(a=>new Date(a.t).toDateString()===today).length};
}
function renderHome(){
  const st = stats(), u = state.user, first = u.name.split(' ')[0];
  const sorted = state.attempts.slice().sort((a,b)=>b.t-a.t);
  const recent = sorted.slice(0,3);
  const lastSid = (sorted.find(a=>a.sid!=='mock') || {sid:'chemistry'}).sid;
  const nextUnit = S[lastSid].units.find(u=>!isDone(lastSid,u)) || S[lastSid].units[0];
  const doneAll = state.done.size;
  const subjects = ORDER.filter(k => S[k].cat === state.cat);
  $('#s-home').innerHTML = `
    <div class="topbar">
      <button class="avatar" data-act="profile" aria-label="Open profile">${esc(initials(u.name))}</button>
      <div class="greet"><small>${greeting()}</small><b>${esc(first)}</b></div>
      <div class="streak glass" title="Day streak">${ic('flame')}<span class="num">${st.streak}</span></div>
      ${menuBtn}
    </div>

    <div class="glass card hero">
      <div class="ring">${ring(st.acc, 44, 10, 'url(#g1)', 'var(--hair)').replace('<svg viewBox="0 0 98 98">','<svg viewBox="0 0 98 98"><defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0284C7"/></linearGradient></defs>')}
        <div class="lbl"><b class="num">${st.acc}%</b><span>Accuracy</span></div></div>
      <div class="hstats">
        <div><b class="num">${st.quizzes}</b><span>Quizzes</span></div>
        <div><b class="num">${st.questions}</b><span>Questions</span></div>
        <div><b class="num">${doneAll}/${TOTAL_LESSONS}</b><span>Lessons</span></div>
        <div><b class="num">${st.streak} days</b><span>Streak</span></div>
      </div>
      <div class="hero-foot">
        <div class="row between small"><span class="muted" style="font-weight:600">Daily goal</span><span style="font-weight:700" class="num">${Math.min(st.today,5)} of 5 quizzes</span></div>
        <div class="bar"><i style="width:${Math.min(st.today,5)/5*100}%"></i></div>
      </div>
    </div>

    <button class="glass card row" style="text-align:left;width:100%" data-sid="${lastSid}" data-unit="${esc(nextUnit)}" data-act="lesson">
      ${symTile(lastSid)}
      <div class="stack" style="flex:1;min-width:0"><span class="eyebrow">Continue learning</span><b>${S[lastSid].name}</b><span class="muted small">Lesson: ${esc(nextUnit)}</span></div>
      <span class="icon-btn" style="background:var(--sky);color:#fff">${ic('book')}</span>
    </button>

    <button class="mock" data-act="exam">
      <div><b>Take an exam</b><span>Timed paper · pick subjects and length</span></div>
      <span class="go">${ic('zap')}</span>
    </button>

    <div class="sec-title"><h3>Subjects</h3><button class="link" data-tab="explore">See all 12</button></div>
    <div class="seg glass" role="tablist">
      ${CATS.map(c=>`<button class="${c.id===state.cat?'on':''}" data-cat="${c.id}" role="tab" aria-selected="${c.id===state.cat}">${c.name}</button>`).join('')}
    </div>
    <div class="glass subj-list">
      ${subjects.map(k => { const p = subjProgress(k); return `
        <button class="subj" data-act="subject" data-sid="${k}">
          ${symTile(k)}
          <span class="meta"><b>${S[k].name} <span>· ${S[k].so}</span></b><span class="bar"><i style="width:${p}%"></i></span></span>
          <span class="pct num" title="Lessons completed">${lessonsDone(k)}/${S[k].units.length}</span>
        </button>`; }).join('')}
    </div>

    <div class="sec-title"><h3>Recent activity</h3><button class="link" data-tab="history">History</button></div>
    <div class="glass activity">
      ${recent.map(actRow).join('') || '<p class="empty">No quizzes yet.</p>'}
    </div>

    <button class="glass card about-mini" data-tab="support">
      <span class="sym">${ic('info')}</span>
      <span style="flex:1"><b>About Horn Afriik</b><p>Our mission, contact details and feedback.</p></span>
      ${ic('chev')}
    </button>`;
}
function actRow(a){
  const p = pct(a), pass = p >= 50;
  const name = a.sid === 'mock' ? 'Mock exam' : S[a.sid].name;
  return `<div class="act">
    ${a.sid === 'mock' ? '<span class="sym" style="width:38px;height:38px;border-radius:12px;font-size:14px">Mx</span>' : symTile(a.sid)}
    <div class="meta"><b>${name} · ${esc(a.unit)}</b><span>${ago(a.t)} · ${a.correct}/${a.total} correct${a.sample?' · sample':''}</span></div>
    <span class="chip ${pass?'ok':'bad'} num">${p}%</span>
  </div>`;
}

/* ================= SUBJECT ================= */
function renderSubject(){
  const s = S[state.sid], sid = state.sid;
  const tries = state.attempts.filter(a=>a.sid===sid);
  const best = tries.length ? Math.max(...tries.map(pct)) + '%' : '–';
  $('#s-subject').innerHTML = `
    <div class="back-row"><button class="icon-btn glass" data-act="back" aria-label="Back">${ic('back')}</button><span class="t">${CATS.find(c=>c.id===s.cat).name}</span></div>
    <div class="subj-hero">
      ${symTile(sid,'lg')}
      <div class="stack" style="gap:4px"><h2 class="h-display">${s.name}</h2><p>${s.so} · ${esc(state.user.form)}</p></div>
    </div>
    <div class="glass facts">
      <div><b class="num">${lessonsDone(sid)}/${s.units.length}</b><span>Lessons</span></div>
      <div><b class="num">${mastery(sid) ?? '–'}${mastery(sid)!==null?'%':''}</b><span>Mastery</span></div>
      <div><b class="num">${best}</b><span>Best</span></div>
    </div>
    <div class="glass card" style="padding-block:6px">
      <div class="setting"><div class="meta"><b>Instant feedback</b><span>${state.settings.instant ? 'See the answer after each question' : 'See all answers at the end'}</span></div>
        <button class="switch" role="switch" aria-checked="${state.settings.instant}" data-setting="instant" aria-label="Instant feedback"></button></div>
      <div class="setting"><div class="meta"><b>Timer</b><span>30 seconds per question</span></div>
        <button class="switch" role="switch" aria-checked="${state.settings.timer}" data-setting="timer" aria-label="Timer"></button></div>
    </div>
    <div class="sec-title"><h3>Course</h3><span class="muted small">Read the lesson, then test yourself</span></div>
    <div class="units">
      ${s.units.map((u,i) => { const b = unitBest(sid,u), d = isDone(sid,u); return `
        <div class="glass unit">
          <button class="unit-main" data-act="lesson" data-unit="${esc(u)}">
            <span class="n num ${d?'done':''}">${d ? ic('check') : i+1}</span>
            <span class="meta"><b>${esc(u)}</b><span class="muted small">${d?'Lesson complete':'Lesson · '+L[sid][u].length+' key ideas'}${b!==null?' · best '+b+'%':''}</span></span>
          </button>
          <button class="play" data-act="start" data-unit="${esc(u)}" aria-label="Test ${esc(u)}">${ic('play')}</button>
        </div>`; }).join('')}
    </div>
    <button class="btn coral block" data-act="exam-subject">${ic('zap')}${s.name} exam</button>`;
}

/* ================= LESSON ================= */
function renderLesson(){
  const sid = state.sid, s = S[sid], u = state.unit, ui = s.units.indexOf(u);
  const notes = L[sid][u], d = isDone(sid,u), next = s.units[ui+1];
  const b = unitBest(sid,u);
  $('#s-lesson').innerHTML = `
    <div class="back-row"><button class="icon-btn glass" data-act="subject" data-sid="${sid}" aria-label="Back to ${s.name}">${ic('back')}</button><span class="t">${s.name} · Unit ${ui+1} of ${s.units.length}</span></div>
    <div class="lesson-head">
      <div class="row" style="gap:8px;flex-wrap:wrap"><span class="chip ice">${ic('book')}Lesson</span><span class="chip ice">${notes.length+1} min read</span>${d?`<span class="chip ok">${ic('check')}Completed</span>`:''}</div>
      <h2 class="h-display">${esc(u)}</h2>
    </div>
    ${FIG[sid]()}
    <div class="notes">
      ${notes.map(([h,p],i)=>`<div class="glass note"><span class="n num">${i+1}</span><div><b>${h}</b><p>${p}</p></div></div>`).join('')}
    </div>
    <div class="glass lesson-cta">
      <b style="font-size:17px">Test your knowledge</b>
      <p>${s.q.length} questions · ${state.settings.timer?'30 s each':'untimed'} · ${state.settings.instant?'instant feedback':'answers at the end'}${b!==null?' · your best: '+b+'%':''}</p>
      <button class="btn primary block" data-act="start" data-unit="${esc(u)}">${ic('play')}Start the test</button>
      <button class="btn ghost block" data-act="toggle-done">${d ? ic('check')+'Lesson completed' : 'Mark lesson as complete'}</button>
    </div>
    ${next ? `<button class="glass card row" style="text-align:left;width:100%" data-act="lesson" data-unit="${esc(next)}"><div class="stack" style="flex:1"><span class="eyebrow">Next lesson</span><b>${esc(next)}</b></div>${ic('chev')}</button>` : ''}`;
}

/* ================= QUIZ ================= */
let quiz = null, timerId = null;
const QTIME = 30;
function buildQuestions(pool){
  return pool.map(([q,o,a,e]) => {
    const idx = shuffle(o.map((_,i)=>i));
    return {q, o: idx.map(i=>o[i]), a: idx.indexOf(a), e};
  });
}
function startQuiz(sid, unit, opts = {}){
  const pool = shuffle(opts.pool || S[sid].q);
  const qtime = opts.qtime || QTIME;
  if (L[sid] && L[sid][unit] && !isDone(sid, unit)){ state.done.add(sid+'|'+unit); save(); }
  quiz = {sid, unit, opts, qs: buildQuestions(pool), i:0, answers:[], sel:null, locked:false, qtime, left:qtime, started:Date.now(),
    exam: !!opts.exam, instant: opts.exam ? false : state.settings.instant, timed: opts.exam ? true : state.settings.timer};
  go('quiz');
}
function renderQuiz(){
  if (!quiz) startQuizSilently();
  const Q = quiz.qs[quiz.i], n = quiz.qs.length;
  const title = (quiz.exam ? 'Exam · ' : '') + (quiz.sid === 'mock' ? 'Mixed subjects' : S[quiz.sid].name);
  const segs = quiz.qs.map((_,i) => {
    const a = quiz.answers[i];
    let c = '';
    if (i === quiz.i && !a) c = 'cur';
    else if (a) c = a.sel === null ? 'skip' : quiz.instant ? (a.ok ? 'ok' : 'bad') : 'done';
    return `<i class="${c}"></i>`;
  }).join('');
  $('#s-quiz').innerHTML = `
    <div class="quiz-top">
      <button class="icon-btn glass" data-act="quit" aria-label="Leave quiz">${ic('x')}</button>
      <div class="quiz-title"><b>${title}</b><span>${esc(quiz.unit)}</span></div>
      <div class="timer ${quiz.timed?'':'off'}" id="timer">${ring(100, 19, 4, quiz.timed ? '#EF4444' : 'var(--hair)', 'var(--hair)')}<b class="num" id="tsec">${quiz.timed ? quiz.qtime : 'off'}</b></div>
    </div>
    <div class="segs">${segs}</div>
    <p class="qcount num">Question ${quiz.i+1} of ${n}</p>
    <h2 class="qtext">${Q.q}</h2>
    <div class="opts" id="opts">
      ${Q.o.map((o,i)=>`<button class="glass opt" data-opt="${i}"><span class="l">${'ABCD'[i]}</span><span class="tx">${o}</span><svg class="ic mk" viewBox="0 0 24 24"></svg></button>`).join('')}
    </div>
    <div class="glass explain" id="explain" hidden></div>
    <div class="quiz-foot">
      <button class="btn ghost" data-act="skip" id="q-skip">Skip</button>
      <button class="btn primary" data-act="next" id="q-next" disabled>${quiz.i === n-1 ? 'Finish' : 'Next'}${ic('chev')}</button>
    </div>`;
  startTimer();
}
function startQuizSilently(){ // for direct jumps from the side panel
  const pool = shuffle(S.chemistry.q);
  quiz = {sid:'chemistry', unit:'Atomic Structure', opts:{}, qs: buildQuestions(pool), i:0, answers:[], sel:null, locked:false, qtime:QTIME, left:QTIME, started:Date.now(), instant:state.settings.instant, timed:state.settings.timer};
}
function startTimer(){
  stopTimer();
  quiz.left = quiz.qtime;
  if (!quiz.timed) return;
  timerId = setInterval(() => {
    if (!quiz || quiz.locked) return;
    quiz.left--;
    const t = $('#timer'); if (!t) return stopTimer();
    $('#tsec').textContent = quiz.left;
    const c = t.querySelectorAll('circle')[1], Lc = 2*Math.PI*19;
    c.setAttribute('stroke-dashoffset', Lc*(1-quiz.left/quiz.qtime));
    t.classList.toggle('low', quiz.left <= 5);
    if (quiz.left <= 0){ stopTimer(); timeUp(); }
  }, 1000);
}
function stopTimer(){ clearInterval(timerId); timerId = null; }
function timeUp(){
  if (quiz.instant){ record(null); reveal(null, true); }
  else { record(quiz.sel); advance(); }
}
function record(sel){
  const Q = quiz.qs[quiz.i];
  quiz.answers[quiz.i] = {sel, ok: sel === Q.a};
}
function choose(i){
  if (quiz.locked) return;
  if (quiz.instant){ record(i); reveal(i, false); }
  else {
    quiz.sel = i;
    $$('#opts .opt').forEach((b,j)=>b.classList.toggle('sel', j===i));
    $('#q-next').disabled = false;
  }
}
function reveal(sel, timedOut){
  quiz.locked = true; stopTimer();
  const Q = quiz.qs[quiz.i];
  $('#opts').classList.add('locked');
  $$('#opts .opt').forEach((b,j) => {
    const mk = b.querySelector('.mk');
    if (j === Q.a){ b.classList.add('right'); mk.innerHTML = I.check; }
    else if (j === sel){ b.classList.add('wrong'); mk.innerHTML = I.x; }
    else b.classList.add('dim');
  });
  const ex = $('#explain');
  const head = timedOut ? 'Time is up' : sel === Q.a ? 'Correct' : 'Not quite';
  ex.innerHTML = `${ic('info')}<div><b style="color:${timedOut||sel!==Q.a?'var(--bad-text)':'var(--ok-text)'}">${head}</b>${Q.e}</div>`;
  ex.hidden = false;
  const seg = $$('.segs i')[quiz.i]; seg.className = sel === null ? 'skip' : sel === Q.a ? 'ok' : 'bad';
  $('#q-skip').hidden = true;
  $('#q-next').disabled = false;
  ex.scrollIntoView({block:'nearest', behavior:'smooth'});
}
function advance(){
  quiz.i++; quiz.sel = null; quiz.locked = false;
  if (quiz.i >= quiz.qs.length) return finish();
  renderQuiz();
  $('#s-quiz').scrollTop = 0;
}
function finish(){
  stopTimer();
  const correct = quiz.answers.filter(a=>a && a.ok).length;
  const skipped = quiz.answers.filter(a=>!a || a.sel===null).length;
  const attempt = {sid:quiz.sid, unit:quiz.unit, correct, total:quiz.qs.length, t:Date.now()};
  state.attempts.push(attempt); save();
  state.lastResult = {...attempt, opts: quiz.opts, exam: quiz.exam, skipped, wrong: quiz.qs.length - correct - skipped, secs: Math.round((Date.now()-quiz.started)/1000), qs: quiz.qs, answers: quiz.answers};
  state.filter = 'all';
  quiz = null;
  go('results');
}

/* ================= RESULTS ================= */
function demoResult(){
  const qs = buildQuestions(S.chemistry.q.slice());
  const picks = [qs[0].a, qs[1].a, (qs[2].a+1)%4, qs[3].a, null, qs[5].a];
  const answers = picks.map((p,i)=>({sel:p, ok:p===qs[i].a}));
  const correct = answers.filter(a=>a.ok).length;
  return {sid:'chemistry', unit:'Atomic Structure', correct, total:6, skipped:1, wrong:6-correct-1, secs:142, qs, answers, sample:true};
}
function renderResults(){
  const r = state.lastResult || (state.lastResult = demoResult());
  const p = pct(r), pass = p >= 50;
  const name = r.sid === 'mock' ? 'Mock exam' : S[r.sid].name;
  const head = p >= 85 ? 'Excellent work' : p >= 50 ? 'You passed' : 'Keep practising';
  const sub = p >= 85 ? 'You are exam-ready on this unit.' : p >= 50 ? 'Review the answers below to push your score higher.' : 'Go through the explanations, then try again.';
  const items = r.qs.map((q,i)=>({q, a:r.answers[i] || {sel:null, ok:false}, i}))
    .filter(x => state.filter === 'all' || (state.filter === 'wrong' ? !x.a.ok : x.a.ok));
  $('#s-results').innerHTML = `
    <div class="back-row"><button class="icon-btn glass" data-act="home" aria-label="Home">${ic('back')}</button><span class="t">${name} · ${esc(r.unit)}${r.sample?' · sample':''}</span></div>
    <div class="glass card res-hero">
      <div class="res-ring">${ring(p, 66, 12, pass ? '#10B981' : '#EF4444', 'var(--hair)')}
        <div class="lbl"><b class="num">${p}%</b><span>${pass ? 'Pass' : 'Below pass'}</span></div></div>
      <h2 class="h-display">${head}</h2>
      <p class="muted small" style="max-width:30ch">${sub}</p>
    </div>
    <div class="glass res-stats">
      <div class="g"><b class="num">${r.correct}</b><span>Correct</span></div>
      <div class="r"><b class="num">${r.wrong}</b><span>Wrong</span></div>
      <div><b class="num">${r.skipped}</b><span>Skipped</span></div>
      <div><b class="num">${Math.floor(r.secs/60)}:${String(r.secs%60).padStart(2,'0')}</b><span>Time</span></div>
    </div>
    <div class="res-actions">
      <button class="btn primary" data-act="retry">${ic('retry')}Try again</button>
      <button class="btn ghost" data-act="${r.sid==='mock'?'home':'subject'}" data-sid="${r.sid}">${r.sid==='mock'?'Home':'All units'}</button>
    </div>
    <div class="sec-title"><h3>Answer review</h3></div>
    <div class="filters">
      <button class="${state.filter==='all'?'on':''}" data-filter="all">All ${r.total}</button>
      <button class="${state.filter==='wrong'?'on':''}" data-filter="wrong">Missed ${r.total - r.correct}</button>
      <button class="${state.filter==='correct'?'on':''}" data-filter="correct">Correct ${r.correct}</button>
    </div>
    <div class="review">
      ${items.map(({q,a,i}) => `
        <div class="glass rv">
          <div class="rv-head"><span class="rv-n num">${i+1}</span><b>${q.q}</b>${a.ok ? `<span class="chip ok">${ic('check')}Correct</span>` : a.sel===null ? '<span class="chip ice">Skipped</span>' : `<span class="chip bad">${ic('x')}Wrong</span>`}</div>
          ${!a.ok && a.sel!==null ? `<div class="ans bad">${ic('x')}<div><small>Your answer</small>${q.o[a.sel]}</div></div>` : ''}
          ${a.sel===null ? `<div class="ans skip">${ic('minus')}<div><small>Your answer</small>No answer given</div></div>` : ''}
          <div class="ans ok">${ic('check')}<div><small>Correct answer</small>${q.o[q.a]}</div></div>
          <p>${q.e}</p>
        </div>`).join('') || '<p class="glass empty">Nothing here. Try another filter.</p>'}
    </div>`;
}

/* ================= EXPLORE ================= */
function renderExplore(){
  const el = $('#s-explore');
  if (!el.dataset.built){
    el.innerHTML = `
      <div class="page-top"><div class="stack" style="gap:4px"><span class="eyebrow">12 subjects · ${TOTAL_LESSONS} lessons</span><h1 class="h-display page-h">Courses</h1></div>${menuBtn}</div>
      <div class="input glass" style="height:54px;border-radius:18px">${ic('search')}<input id="q-search" type="search" placeholder="Search subjects or units, e.g. algebra" autocomplete="off"></div>
      <div id="explore-list" class="stack" style="gap:20px"></div>`;
    el.dataset.built = '1';
    $('#q-search').addEventListener('input', e => { state.query = e.target.value; drawExplore(); });
  }
  drawExplore();
}
function drawExplore(){
  const q = state.query.trim().toLowerCase();
  const html = CATS.map(c => {
    const list = ORDER.filter(k => S[k].cat === c.id).map(k => {
      const s = S[k];
      const hitUnits = q ? s.units.filter(u => u.toLowerCase().includes(q)) : [];
      const hit = !q || s.name.toLowerCase().includes(q) || s.so.toLowerCase().includes(q) || hitUnits.length;
      if (!hit) return '';
      return `<button class="subj" data-act="subject" data-sid="${k}">${symTile(k)}
        <span class="meta"><b>${s.name} <span>· ${s.so}</span></b><span class="muted small">${hitUnits.length ? 'Unit: '+hitUnits.map(esc).join(', ') : lessonsDone(k)+' of '+s.units.length+' lessons done'}</span></span>${ic('chev')}</button>`;
    }).join('');
    return list ? `<div class="stack" style="gap:10px"><span class="eyebrow">${c.name}</span><div class="glass subj-list">${list}</div></div>` : '';
  }).join('');
  $('#explore-list').innerHTML = html || `<p class="glass empty">No subject or unit matches “${esc(state.query)}”.</p>`;
}

/* ================= HISTORY ================= */
function renderHistory(){
  const A = state.attempts.slice().sort((a,b)=>a.t-b.t);
  const st = stats();
  const W = 320;

  /* weekly activity: questions answered per day, last 7 days */
  const days = Array.from({length:7}, (_,i) => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-6+i); return d; });
  const perDay = days.map(d => { const e = d.getTime()+864e5; const xs = A.filter(a=>a.t>=d.getTime() && a.t<e); return {d, q: xs.reduce((s,a)=>s+a.total,0), n: xs.length}; });
  const weekQ = perDay.reduce((s,x)=>s+x.q,0), weekN = perDay.reduce((s,x)=>s+x.n,0);
  const maxQ = Math.max(10, Math.ceil(Math.max(...perDay.map(x=>x.q))/5)*5);
  const aH = 140, aL = 28, aR = 6, aT = 14, aB = 24, aih = aH-aT-aB, abw = (W-aL-aR)/7;
  const ay = v => aT + aih - v/maxQ*aih;
  const aGrid = [0, maxQ/2, maxQ].map(v => `<line x1="${aL}" x2="${W-aR}" y1="${ay(v)}" y2="${ay(v)}" style="stroke:var(--hair)"/><text x="${aL-6}" y="${ay(v)+4}" text-anchor="end" font-size="10" class="f-mut">${v}</text>`).join('');
  const aBars = perDay.map((x,i) => { const bx = aL + i*abw + abw*.22, w = abw*.56, today = i===6;
    return `${x.q ? `<rect x="${bx}" y="${ay(x.q)}" width="${w}" height="${aT+aih-ay(x.q)}" rx="6" style="fill:${today?CORAL:SKY}" fill-opacity="${today?1:.8}"/>${tx(bx+w/2, ay(x.q)-5, x.q, 'text-anchor="middle" font-size="10" font-weight="800"')}` : ''}
      <text x="${bx+w/2}" y="${aH-7}" text-anchor="middle" font-size="10" font-weight="${today?800:600}" class="${today?'':'f-mut'}">${today?'Today':x.d.toLocaleDateString('en',{weekday:'short'})}</text>`; }).join('');

  /* score trend: last 8 attempts */
  const last = A.slice(-8);
  const Hh = 150, sL = 34, sR = 8, sT = 12, sB = 26;
  const iw = W-sL-sR, ih = Hh-sT-sB, bw = iw / Math.max(last.length,1);
  const y = v => sT + ih - v/100*ih;
  const grid = [0,50,100].map(v => `<line x1="${sL}" x2="${W-sR}" y1="${y(v)}" y2="${y(v)}" style="stroke:${v===50?'var(--text-2)':'var(--hair)'}" ${v===50?'stroke-dasharray="4 4" stroke-opacity=".6"':''}/><text x="${sL-8}" y="${y(v)+4}" text-anchor="end" font-size="10" class="f-mut">${v}%</text>`).join('');
  const bars = last.map((a,i) => {
    const p = pct(a), x = sL + i*bw + bw*0.2, w = bw*0.6;
    const lab = a.sid==='mock' ? 'Mx' : S[a.sid].sym;
    return `<rect x="${x}" y="${y(p)}" width="${w}" height="${Math.max(ih - (y(p)-sT), 2)}" rx="5" style="fill:${p>=50?EM:CORAL}" fill-opacity="${i===last.length-1?1:.75}"/>
      <text x="${x+w/2}" y="${Hh-8}" text-anchor="middle" font-size="10" font-weight="700" class="f-mut">${lab}</text>`;
  }).join('');

  /* course completion by category */
  const done = state.done.size, cp = Math.round(done/TOTAL_LESSONS*100);
  const catRows = CATS.map(c => { const ks = ORDER.filter(k=>S[k].cat===c.id); const tot = ks.reduce((s,k)=>s+S[k].units.length,0), d = ks.reduce((s,k)=>s+lessonsDone(k),0);
    return `<div class="stack" style="gap:5px"><div class="row between small"><b>${c.name}</b><span class="muted num">${d}/${tot}</span></div><div class="bar"><i style="width:${d/tot*100}%"></i></div></div>`; }).join('');

  /* subject mastery */
  const mRows = ORDER.map(k=>({k, m:mastery(k)})).sort((a,b)=>(b.m??-1)-(a.m??-1)).map(({k,m}) => `
    <button class="mrow" data-act="subject" data-sid="${k}" style="text-align:left">${symTile(k)}
      <span class="nm"><b>${S[k].name}</b><span class="bar"><i class="${m===null?'':m>=50?'ok':'bad'}" style="width:${m??0}%"></i></span></span>
      <span class="v num">${m===null?'–':m+'%'}</span></button>`).join('');

  const weakest = ORDER.map(k=>({k,m:mastery(k)})).filter(x=>x.m!==null).sort((a,b)=>a.m-b.m)[0];

  $('#s-history').innerHTML = `
    <div class="page-top"><div class="stack" style="gap:4px"><span class="eyebrow">Dashboard</span><h1 class="h-display page-h">Your progress</h1></div>${menuBtn}</div>
    <div class="kpis">
      <div class="glass kpi"><span>Accuracy</span><b class="num">${st.acc}%</b><small class="${st.acc>=50?'up':''}">${st.acc>=50?'Above':'Below'} the 50% pass mark</small></div>
      <div class="glass kpi"><span>Questions</span><b class="num">${st.questions}</b><small>${weekQ} this week</small></div>
      <div class="glass kpi"><span>Lessons</span><b class="num">${done}<span style="font-size:15px;color:var(--text-2)">/${TOTAL_LESSONS}</span></b><small>${cp}% of all courses</small></div>
      <div class="glass kpi"><span>Streak</span><b class="num" style="color:var(--coral)">${st.streak} days</b><small>${st.quizzes} quizzes in total</small></div>
    </div>

    <div class="glass chart">
      <div class="row between" style="margin-bottom:8px"><b style="font-size:14px">Questions answered</b><span class="muted small">${weekN} quizzes · last 7 days</span></div>
      <svg viewBox="0 0 ${W} ${aH}" role="img" aria-label="Questions answered per day over the last 7 days">${aGrid}${aBars}</svg>
    </div>

    <div class="glass card split">
      <div class="ring" style="width:96px;height:96px">${ring(cp, 40, 10, SKY, 'var(--hair)')}<div class="lbl"><b class="num" style="font-size:20px">${cp}%</b><span>Courses</span></div></div>
      <div class="stack" style="gap:10px">${catRows}</div>
    </div>

    <div class="glass card stack" style="gap:12px">
      <div class="row between"><b style="font-size:14px">Subject mastery</b><div class="legend"><span><i style="background:${EM}"></i>Pass</span><span><i style="background:${CORAL}"></i>Needs work</span></div></div>
      <div class="mastery">${mRows}</div>
      ${weakest ? `<button class="btn ghost block" data-act="subject" data-sid="${weakest.k}">Work on ${S[weakest.k].name} next (${weakest.m}%)</button>` : ''}
    </div>

    <div class="glass chart">
      <div class="row between" style="margin-bottom:8px"><b style="font-size:14px">Last ${last.length} scores</b><span class="muted small">Dashed line: pass mark 50%</span></div>
      <svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Bar chart of recent quiz scores">${grid}${bars}</svg>
    </div>
    <div class="sec-title"><h3>All attempts</h3>${state.attempts.some(a=>a.sample)?'<span class="muted small">Includes sample data</span>':''}</div>
    <div class="glass activity">${A.slice().reverse().map(actRow).join('')}</div>`;
}

/* ================= AUTH ================= */
let authMode = 'signin', method = 'email';
function setAuth(mode){
  authMode = mode;
  $('#tab-signin').classList.toggle('on', mode==='signin');
  $('#tab-register').classList.toggle('on', mode==='register');
  $('#f-name').hidden = $('#f-form').hidden = mode !== 'register';
  $('#auth-submit').textContent = mode === 'register' ? 'Create account' : 'Sign in';
  $('#in-pass').autocomplete = mode === 'register' ? 'new-password' : 'current-password';
  $('#auth-err').hidden = true;
}
function setMethod(m){
  method = m;
  $('#m-email').classList.toggle('on', m==='email'); $('#m-phone').classList.toggle('on', m==='phone');
  $('#f-email').hidden = m !== 'email'; $('#f-phone').hidden = m !== 'phone';
  $('#auth-err').hidden = true;
}
$('#auth-form').addEventListener('submit', e => {
  e.preventDefault();
  const err = $('#auth-err'), fail = m => { err.textContent = m; err.hidden = false; };
  const email = $('#in-email').value.trim(), phone = $('#in-phone').value.replace(/\s/g,''), pass = $('#in-pass').value;
  const name = $('#in-name').value.trim();
  if (authMode === 'register' && name.length < 2) return fail('Enter your full name.');
  if (method === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('Enter an email like name@example.com.');
  if (method === 'phone' && !/^[0-9]{7,9}$/.test(phone)) return fail('Enter your number without +252, e.g. 61 234 5678.');
  if (pass.length < 6) return fail('Password needs at least 6 characters.');
  const id = method==='email' ? email : '+252 '+phone;
  if (authMode === 'register') state.user = {name, email:id, form: $('#in-form').value};
  else if (!state.user || state.user.email !== id){
    const guess = method==='email' ? email.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g, c=>c.toUpperCase()) : 'Student';
    state.user = {name: guess, email:id, form:'Form 4'};
  }
  $('#in-pass').value = '';
  save();
  go('home');
  toast(authMode === 'register' ? 'Account created. Soo dhawoow!' : 'Signed in');
});
$('#guest').addEventListener('click', () => { state.user = {name:'Guest student', email:'Not signed in', form:'Form 4'}; save(); go('home'); });
function signOut(){
  $('#profile').hidden = true; $('#menu').hidden = true;
  state.user = null; store.set('user', null);
  setAuth('signin'); go('auth'); toast('Signed out');
}

/* ================= PROFILE ================= */
function openProfile(){
  $('#p-avatar').textContent = initials(state.user.name);
  $('#p-name').textContent = state.user.name;
  $('#p-email').textContent = state.user.email;
  $('#p-forms').innerHTML = ['Form 1','Form 2','Form 3','Form 4'].map(f=>`<button class="${f===state.user.form?'on':''}" data-form="${f}">${f.replace('Form ','F')}</button>`).join('');
  $('#sw-theme').setAttribute('aria-checked', isDark());
  $('#profile').hidden = false;
}
function isDark(){
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
}
$('#profile').addEventListener('click', e => {
  if (e.target.id === 'profile' || e.target.closest('#p-close')) $('#profile').hidden = true;
  const f = e.target.closest('[data-form]');
  if (f){ state.user.form = f.dataset.form; save(); $$('#p-forms button').forEach(b=>b.classList.toggle('on', b===f)); toast('Class set to '+f.dataset.form); }
  if (e.target.closest('#sw-theme')) toggleTheme();
  if (e.target.closest('#p-signout')) signOut();
});

/* ================= SUPPORT ================= */
function drawStars(){
  $('#stars').innerHTML = [1,2,3,4,5].map(n=>`<button type="button" class="${n<=state.rating?'on':''}" data-star="${n}" aria-label="${n} star${n>1?'s':''}">${ic('star')}</button>`).join('');
}
drawStars();
$('#stars').addEventListener('click', e => { const b = e.target.closest('[data-star]'); if (b){ state.rating = +b.dataset.star; drawStars(); } });
$('#fb-form').addEventListener('submit', e => e.preventDefault());
function feedbackText(){
  const stars = '★'.repeat(state.rating) + '☆'.repeat(5-state.rating);
  return `Horn Afriik feedback\nTopic: ${$('#fb-topic').value}\nRating: ${stars}\nFrom: ${state.user.name} (${state.user.form})\n\n${$('#fb-msg').value.trim()}`;
}
/* ================= CONTACT US (one button, every channel) ================= */
const WA = 'https://wa.me/252619892112', MAIL = 'alamiin177@gmail.com';
const CTA = `<button class="contact-cta" data-act="contact">
  <span class="dots"><span class="ib wa"><svg class="ic" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span><span class="ib fb"><svg class="ic" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></span><span class="ib ml"><svg class="ic" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span><span class="ib ph"><svg class="ic" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span></span>
  <span class="txt"><b>Contact us</b><small>WhatsApp · Facebook · Email · Call</small></span>
  <svg class="ic" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>`;
$$('.cta-slot').forEach(s => s.innerHTML = CTA);
let contactMsg = null;
function openContact(msg){
  contactMsg = msg;
  $('#ct-wa').href = WA + (msg ? '?text=' + encodeURIComponent(msg) : '');
  $('#ct-mail').href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(msg ? 'Horn Afriik: ' + $('#fb-topic').value : 'Horn Afriik support') + (msg ? '&body=' + encodeURIComponent(msg) : '');
  $('#ct-note').hidden = !msg;
  $('#menu').hidden = true;
  $('#contact').hidden = false;
}
$('#contact').addEventListener('click', e => {
  if (e.target.id === 'contact' || e.target.closest('#ct-close')){ $('#contact').hidden = true; return; }
  if (e.target.closest('#ct-fb') && contactMsg){
    try { navigator.clipboard.writeText(contactMsg).then(()=>toast('Message copied. Paste it in Messenger'), ()=>{}); } catch(_) {}
  }
});
function sendFeedback(){
  const err = $('#fb-err');
  if ($('#fb-msg').value.trim().length < 10){ err.textContent = 'Write at least 10 characters so we can help.'; err.hidden = false; $('#fb-msg').focus(); return; }
  err.hidden = true;
  openContact(feedbackText());
}

/* ================= MENU ================= */
function openMenu(){
  $('#m-avatar').textContent = initials(state.user.name);
  $('#m-name').textContent = state.user.name;
  $('#m-form').textContent = state.user.form + ' · ' + state.user.email;
  $('#m-lessons').textContent = state.done.size + '/' + TOTAL_LESSONS;
  $('#m-acc').textContent = stats().acc + '%';
  $('#m-theme').setAttribute('aria-checked', isDark());
  $$('#m-nav [data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === TABS[current]));
  $('#menu').hidden = false;
}
function toggleTheme(){
  const d = !isDark(); document.documentElement.dataset.theme = d ? 'dark' : 'light';
  store.set('theme', d ? 'dark' : 'light');
  ['#m-theme','#sw-theme'].forEach(s => $(s).setAttribute('aria-checked', d));
}
$('#menu').addEventListener('click', e => {
  if (e.target.id === 'menu') $('#menu').hidden = true;
  if (e.target.closest('#m-theme')) toggleTheme();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape'){ $('#menu').hidden = true; $('#profile').hidden = true; $('#exam').hidden = true; $('#contact').hidden = true; } });

/* ================= GLOBAL EVENTS ================= */
document.addEventListener('click', e => {
  const t = e.target;
  const tab = t.closest('[data-tab]'); if (tab){ go(tab.dataset.tab); return; }
  const cat = t.closest('[data-cat]'); if (cat){ state.cat = cat.dataset.cat; renderHome(); return; }
  const au = t.closest('[data-auth]'); if (au){ setAuth(au.dataset.auth); return; }
  const me = t.closest('[data-method]'); if (me){ setMethod(me.dataset.method); return; }
  const tt = t.closest('[data-toast]'); if (tt){ toast(tt.dataset.toast); return; }
  const op = t.closest('[data-opt]'); if (op){ choose(+op.dataset.opt); return; }
  const fl = t.closest('[data-filter]'); if (fl){ state.filter = fl.dataset.filter; const y = $('#s-results').scrollTop; renderResults(); $('#s-results').scrollTop = y; return; }
  const set = t.closest('[data-setting]');
  if (set){ const k = set.dataset.setting; state.settings[k] = !state.settings[k]; save(); const y = $('#s-subject').scrollTop; renderSubject(); $('#s-subject').scrollTop = y; return; }
  const cp = t.closest('[data-copy]');
  if (cp){
    const el = document.getElementById(cp.dataset.copy), text = el.textContent;
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Selected. Press Ctrl+C to copy'); };
    try { navigator.clipboard.writeText(text).then(()=>toast('Copied '+text), fallback); } catch(_) { fallback(); }
    return;
  }
  const j = t.closest('[data-jump]');
  if (j){
    const k = j.dataset.jump;
    $('#profile').hidden = true; $('#leave').hidden = true; $('#exam').hidden = true;
    if (k === 'subject' || k === 'lesson'){ state.sid = 'chemistry'; state.unit = 'Acids & Bases'; }
    if (k === 'exam'){ if (current === 'auth' || current === 'quiz' || !current) go('home'); openExam(); return; }
    if (k === 'quiz'){ state.sid = 'chemistry'; startQuiz('chemistry','Atomic Structure'); return; }
    if (k === 'auth') setAuth('signin');
    go(k); return;
  }
  const a = t.closest('[data-act]'); if (!a) return;
  switch (a.dataset.act){
    case 'profile': $('#menu').hidden = true; openProfile(); break;
    case 'menu': openMenu(); break;
    case 'contact': openContact(null); break;
    case 'contact-feedback': sendFeedback(); break;
    case 'menu-close': $('#menu').hidden = true; break;
    case 'signout': signOut(); break;
    case 'subject': state.sid = a.dataset.sid; go('subject'); break;
    case 'lesson': if (a.dataset.sid) state.sid = a.dataset.sid; state.unit = a.dataset.unit; go('lesson'); break;
    case 'toggle-done': { const k = state.sid+'|'+state.unit; state.done.has(k) ? state.done.delete(k) : state.done.add(k); save(); const y = $('#s-lesson').scrollTop; renderLesson(); $('#s-lesson').scrollTop = y; toast(state.done.has(k) ? 'Lesson marked complete' : 'Lesson marked not done'); break; }
    case 'back': go('home'); break;
    case 'home': go('home'); break;
    case 'exam': $('#menu').hidden = true; openExam(); break;
    case 'exam-subject': state.exam.mode = 'single'; state.exam.sid = state.sid; openExam(true); break;
    case 'start': startQuiz(state.sid, a.dataset.unit); break;
    case 'next':
      if (quiz.instant) advance();
      else { record(quiz.sel); advance(); }
      break;
    case 'skip': record(null); advance(); break;
    case 'quit': $('#leave').hidden = false; break;
    case 'retry': {
      const r = state.lastResult;
      if (r.sid !== 'mock') state.sid = r.sid;
      startQuiz(r.sid, r.unit, r.opts || {}); break;
    }
  }
});

/* ================= EXAM SETUP ================= */
const PAPERS = [{id:'mixed', name:'Mixed (all 12)'}, ...CATS.map(c=>({id:c.id, name:c.name})), {id:'single', name:'One subject'}];
function examPool(){
  const e = state.exam;
  const keys = e.mode === 'mixed' ? ORDER : e.mode === 'single' ? [e.sid] : ORDER.filter(k=>S[k].cat===e.mode);
  return {keys, pool: keys.flatMap(k=>S[k].q)};
}
function drawExam(){
  const e = state.exam, {keys, pool} = examPool();
  let counts = [5,10,20,30].filter(n=>n<pool.length);
  if (pool.length <= 30) counts.push(pool.length);
  if (!counts.includes(e.count)) e.count = counts.includes(10) ? 10 : counts[counts.length-1];
  $('#ex-mode').innerHTML = PAPERS.map(p=>`<button class="${p.id===e.mode?'on':''}" data-exmode="${p.id}">${p.name}</button>`).join('');
  $('#ex-subj-wrap').hidden = e.mode !== 'single';
  $('#ex-subj').innerHTML = ORDER.map(k=>`<button class="${k===e.sid?'on':''}" data-exsid="${k}">${S[k].name}</button>`).join('');
  $('#ex-count').innerHTML = counts.map(n=>`<button class="${n===e.count?'on':''}" data-excount="${n}">${n===pool.length?'All '+n:n}</button>`).join('');
  $('#ex-time').innerHTML = [30,45,60,90].map(n=>`<button class="${n===e.time?'on':''}" data-extime="${n}">${n} s</button>`).join('');
  const secs = e.count*e.time;
  $('#ex-sum').innerHTML = `${ic('zap')}<span>${e.count} questions from ${keys.length} subject${keys.length>1?'s':''} · up to ${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')} · pass mark 50%</span>`;
}
function openExam(){ drawExam(); $('#exam').hidden = false; }
$('#exam').addEventListener('click', e => {
  const t = e.target, e2 = state.exam;
  if (t.id === 'exam' || t.closest('#ex-cancel')){ $('#exam').hidden = true; return; }
  const m = t.closest('[data-exmode]'); if (m){ e2.mode = m.dataset.exmode; drawExam(); return; }
  const s = t.closest('[data-exsid]'); if (s){ e2.sid = s.dataset.exsid; drawExam(); return; }
  const c = t.closest('[data-excount]'); if (c){ e2.count = +c.dataset.excount; drawExam(); return; }
  const ti = t.closest('[data-extime]'); if (ti){ e2.time = +ti.dataset.extime; drawExam(); return; }
  if (t.closest('#ex-start')){
    const {pool} = examPool();
    const picked = shuffle(pool).slice(0, e2.count);
    const paper = PAPERS.find(p=>p.id===e2.mode).name.replace(' (all 12)','');
    $('#exam').hidden = true;
    if (e2.mode === 'single'){ state.sid = e2.sid; startQuiz(e2.sid, 'Exam · '+e2.count+' questions', {pool:picked, qtime:e2.time, exam:true}); }
    else startQuiz('mock', paper+' paper · '+e2.count+' questions', {pool:picked, qtime:e2.time, exam:true});
  }
});
$('#leave-stay').addEventListener('click', () => $('#leave').hidden = true);
$('#leave-go').addEventListener('click', () => { $('#leave').hidden = true; const sid = quiz && quiz.sid; stopTimer(); quiz = null; go(sid && sid !== 'mock' ? 'subject' : 'home'); });
$('#leave').addEventListener('click', e => { if (e.target.id === 'leave') $('#leave').hidden = true; });
document.addEventListener('keydown', e => {
  if (current !== 'quiz' || !quiz) return;
  const k = e.key.toUpperCase(), i = 'ABCD'.indexOf(k);
  if (i >= 0 && i < quiz.qs[quiz.i].o.length) choose(i);
  if (e.key === 'Enter' && !$('#q-next').disabled) $('#q-next').click();
});

/* ================= BOOT ================= */
const th = store.get('theme', null); if (th) document.documentElement.dataset.theme = th;
go(state.user ? 'home' : 'auth');

/* ================= PWA: offline + install ================= */
if ('serviceWorker' in navigator && location.protocol !== 'file:'){
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; $('#install-btn').hidden = false; });
$('#install-btn').addEventListener('click', async () => {
  if (!installEvt) return;
  installEvt.prompt();
  try { await installEvt.userChoice; } catch(_) {}
  installEvt = null; $('#install-btn').hidden = true;
});
window.addEventListener('appinstalled', () => { $('#install-btn').hidden = true; toast('Horn Afriik installed'); });
})();
