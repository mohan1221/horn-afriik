/* Horn Afriik admin dashboard */
(function(){
'use strict';

/* ================= helpers ================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain = s => String(s ?? '').replace(/<[^>]+>/g, '');
const initials = n => String(n||'').split(/\s+/).filter(Boolean).slice(0,2).map(w => w[0].toUpperCase()).join('') || '?';
const pct = (c, t) => t ? Math.round(c / t * 100) : 0;
const DAY = 86400000;
const CATS = [{id:'science', name:'Science'}, {id:'languages', name:'Languages'}, {id:'arts', name:'Arts'}, {id:'islamic', name:'Islamic'}];
const FORMS = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
const I = {
  home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', back:'<path d="m15 18-6-6 6-6"/>', plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',
  up:'<path d="m18 15-6-6-6 6"/>', down:'<path d="m6 9 6 6 6-6"/>', edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', play:'<path d="M6 4l14 8-14 8z"/>', img:'<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>', download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  check:'<path d="M20 6 9 17l-5-5"/>', mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24">${I[n]}</svg>`;
function ago(t){
  if (!t) return 'never';
  const m = Math.round((Date.now() - new Date(t).getTime()) / 60000);
  if (m < 1) return 'just now'; if (m < 60) return m + ' min ago';
  const h = Math.round(m / 60); if (h < 24) return h + ' h ago';
  const d = Math.round(h / 24); if (d === 1) return 'yesterday'; if (d < 30) return d + ' days ago';
  return new Date(t).toLocaleDateString(undefined, {day:'numeric', month:'short', year:'numeric'});
}
const dateStr = t => new Date(t).toLocaleString(undefined, {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'});
const slug = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
let toastT;
function toast(msg, bad){
  const t = $('#toast'); t.textContent = msg; t.classList.toggle('bad', !!bad); t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), bad ? 4200 : 2600);
}
const fail = e => toast((e && e.code === 'offline') ? 'No internet connection' : (e && e.message) || 'Something went wrong', true);
async function busy(btn, fn){
  if (btn && btn.disabled) return;
  const label = btn && btn.innerHTML;
  if (btn){ btn.disabled = true; btn.innerHTML = '<span class="spin" style="width:16px;height:16px;border-width:2px"></span>'; }
  try { return await fn(); } catch(e){ fail(e); } finally { if (btn){ btn.disabled = false; btn.innerHTML = label; } }
}

/* ================= state ================= */
const A = {me:null, profiles:[], attempts:[], done:[], feedback:[], subjects:[], lessons:[], questions:[], settings:null,
  view:'overview', q:'', status:'all', form:'all', fbFilter:'new', subject:null, ctab:'lessons', qlesson:'all'};
const subjName = id => (A.subjects.find(s => s.id === id) || {name: id === 'mock' ? 'Mock exam' : id}).name;
const person = id => A.profiles.find(p => p.id === id);
const students = () => A.profiles.filter(p => p.role !== 'admin');

/* ================= theme ================= */
try { const th = localStorage.getItem('ha_theme'); if (th) document.documentElement.dataset.theme = JSON.parse(th); } catch(_) {}
function toggleTheme(){
  const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const next = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('ha_theme', JSON.stringify(next)); } catch(_) {}
}

/* ================= auth ================= */
async function checkAdmin(){
  const rows = await SB.select('profiles', {id:'eq.' + SB.user.id});
  const p = rows[0];
  if (!p || p.role !== 'admin' || p.status !== 'active') return null;
  return p;
}
function showLogin(msg){
  $('#shell').hidden = true; $('#login').hidden = false;
  const e = $('#l-err'); e.hidden = !msg; e.textContent = msg || '';
}
$('#login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = $('#l-email').value.trim().toLowerCase(), pass = $('#l-pass').value, err = $('#l-err');
  if (!email || !pass){ err.textContent = 'Enter your email and password.'; err.hidden = false; return; }
  const btn = $('#l-btn'); btn.disabled = true; btn.textContent = 'Signing in…'; err.hidden = true;
  try {
    await SB.signIn(email, pass);
    const me = await checkAdmin();
    if (!me){ await SB.signOut(); throw new Error('This account is not an admin.'); }
    $('#l-pass').value = '';
    start(me);
  } catch(ex){
    const m = String(ex.message || '').toLowerCase();
    err.textContent = ex.code === 'offline' ? 'No internet connection.' : m.includes('invalid login') ? 'Wrong email or password.' : ex.message;
    err.hidden = false;
  } finally { btn.disabled = false; btn.textContent = 'Sign in'; }
});
async function signOut(){ await SB.signOut(); A.me = null; showLogin(); }
SB.onAuth(s => { if (!s && A.me){ A.me = null; showLogin('Your session ended. Sign in again.'); } });

/* ================= data ================= */
async function loadAll(){
  const [profiles, attempts, done, feedback, subjects, lessons, questions, settings] = await Promise.all([
    SB.selectAll('profiles', {order:'created_at.desc'}),
    SB.selectAll('attempts', {order:'created_at.desc', select:'id,user_id,sid,unit,correct,total,exam,created_at'}),
    SB.selectAll('lesson_done', {select:'user_id,sid,unit,done_at'}),
    SB.selectAll('feedback', {order:'created_at.desc'}),
    SB.selectAll('subjects', {order:'sort.asc,name.asc'}),
    SB.selectAll('lessons', {order:'sort.asc,title.asc'}),
    SB.selectAll('questions', {order:'sort.asc,id.asc'}),
    SB.select('settings', {id:'eq.1'})
  ]);
  Object.assign(A, {profiles, attempts, done, feedback, subjects, lessons, questions, settings: settings[0] || null});
  loadedAt = Date.now();
}
let loadedAt = 0, softBusy = false;
async function softRefresh(force){   // keep numbers fresh without a manual reload
  if (softBusy || !A.me || document.hidden || $('#scrim')) return;
  if (!force && Date.now() - loadedAt < 15000) return;
  const typing = document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  softBusy = true;
  try { await loadAll(); if (!$('#scrim') && !typing) redraw(); else drawNav(); } catch(_) {} finally { softBusy = false; }
}
document.addEventListener('visibilitychange', () => softRefresh());
setInterval(() => softRefresh(true), 60000);

/* ================= shell ================= */
const VIEWS = [
  {id:'overview', name:'Overview', icon:'home'},
  {id:'students', name:'Students', icon:'users'},
  {id:'courses', name:'Courses', icon:'book'},
  {id:'feedback', name:'Feedback', icon:'msg'},
  {id:'settings', name:'Settings', icon:'gear'}
];
function drawNav(){
  const pending = A.profiles.filter(p => p.status === 'pending').length, fresh = A.feedback.filter(f => f.status === 'new').length;
  const badge = v => { const n = v === 'students' ? pending : v === 'feedback' ? fresh : 0; return n ? `<span class="badge num">${n}</span>` : ''; };
  const html = VIEWS.map(v => `<button data-view="${v.id}" class="${A.view === v.id ? 'on' : ''}">${ic(v.icon)}${v.name}${badge(v.id)}</button>`).join('');
  $('#nav-side').innerHTML = html; $('#nav-top').innerHTML = html;
}
function go(view, opts = {}){
  A.view = view; Object.assign(A, opts);
  drawNav();
  const R = {overview:vOverview, students:vStudents, courses:vCourses, subject:vSubject, feedback:vFeedback, settings:vSettings};
  $('#main').innerHTML = R[view]();
  if (!opts.keepScroll) window.scrollTo(0, 0);
  const s = $('#s-search'); if (s && opts.focus){ s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
}
const redraw = () => go(A.view, {keepScroll:true});
async function start(me){
  A.me = me;
  $('#login').hidden = true; $('#shell').hidden = false;
  $('#me-av').textContent = initials(me.full_name || me.email);
  $('#me-name').textContent = me.full_name || 'Admin';
  $('#me-email').textContent = me.email;
  $('#main').innerHTML = '<div class="loading"><span class="spin"></span></div>';
  try { await loadAll(); go(A.view === 'subject' ? 'courses' : A.view); }
  catch(e){ $('#main').innerHTML = `<div class="card"><h3>Could not load data</h3><p class="muted">${esc(e.message)}</p><p class="muted small">If this is the first time, make sure you ran the database setup (schema.sql) in Supabase.</p><button class="btn" data-act="reload">Try again</button></div>`; }
}

/* ================= stats ================= */
function studentStats(uid){
  const at = A.attempts.filter(a => a.user_id === uid);
  const c = at.reduce((s, a) => s + a.correct, 0), t = at.reduce((s, a) => s + a.total, 0);
  const last = at[0] ? at[0].created_at : null;
  return {quizzes: at.length, avg: t ? pct(c, t) : null, lessons: A.done.filter(d => d.user_id === uid).length, last};
}

/* ================= OVERVIEW ================= */
function vOverview(){
  const st = students(), now = Date.now();
  const week = now - 7 * DAY;
  const activeIds = new Set(A.attempts.filter(a => new Date(a.created_at) > week).map(a => a.user_id));
  const newWeek = st.filter(p => new Date(p.created_at) > week).length;
  const pending = A.profiles.filter(p => p.status === 'pending');
  const c = A.attempts.reduce((s, a) => s + a.correct, 0), t = A.attempts.reduce((s, a) => s + a.total, 0);
  const freshFb = A.feedback.filter(f => f.status === 'new').length;

  // quizzes per day, last 14 days
  const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - (13 - i)); return d; });
  const counts = days.map(d => A.attempts.filter(a => { const x = new Date(a.created_at); return x >= d && x < new Date(d.getTime() + DAY); }).length);
  const max = Math.max(1, ...counts), W = 560, H = 170, pb = 22, bw = W / 14;
  const bars = counts.map((n, i) => {
    const h = Math.max(n ? 4 : 1, (H - pb - 14) * n / max);
    return `<rect class="bar" x="${i*bw + bw*.18}" y="${H - pb - h}" width="${bw*.64}" height="${h}" rx="4" opacity="${n ? 1 : .25}"><title>${n} quizzes · ${days[i].toDateString()}</title></rect>
      ${n ? `<text class="axis" x="${i*bw + bw/2}" y="${H - pb - h - 4}" text-anchor="middle">${n}</text>` : ''}
      ${i % 2 === 1 || i === 13 ? `<text class="axis" x="${i*bw + bw/2}" y="${H - 6}" text-anchor="middle">${days[i].getDate()}/${days[i].getMonth()+1}</text>` : ''}`;
  }).join('');

  // subjects by attempts
  const bySub = {};
  A.attempts.forEach(a => { const s = bySub[a.sid] || (bySub[a.sid] = {n:0, c:0, t:0}); s.n++; s.c += a.correct; s.t += a.total; });
  const subRows = Object.entries(bySub).sort((a, b) => b[1].n - a[1].n).slice(0, 8);

  const recent = A.attempts.slice(0, 8);
  return `
  <div class="page-head"><div><h1 class="h-display">Overview</h1><p>How Horn Afriik is doing today.</p></div>
    <button class="btn" data-act="reload">${ic('download')}Refresh</button></div>
  <div class="tiles">
    <button class="tile" data-view="students"><span>Students</span><b class="num">${st.length}</b><small>+${newWeek} this week</small></button>
    <div class="tile"><span>Active this week</span><b class="num">${activeIds.size}</b><small>took at least one quiz</small></div>
    <div class="tile"><span>Quizzes taken</span><b class="num">${A.attempts.length}</b><small>average score ${t ? pct(c, t) + '%' : '–'}</small></div>
    <button class="tile ${freshFb ? 'alert' : ''}" data-view="feedback"><span>New feedback</span><b class="num">${freshFb}</b><small>${A.feedback.length} messages in total</small></button>
  </div>
  ${pending.length ? `<div class="card section"><div class="row between"><h3 style="margin:0">Waiting for approval <span class="chip warn">${pending.length}</span></h3></div>
    <div class="list" style="margin-top:8px">${pending.slice(0, 6).map(p => `
      <div class="li"><div class="avatar">${esc(initials(p.full_name || p.email))}</div>
        <div class="grow"><b>${esc(p.full_name || '(no name)')}</b><span>${esc(p.email)} · ${esc(p.form)} · signed up ${ago(p.created_at)}</span></div>
        <button class="btn sm ok" data-act="approve" data-id="${p.id}">${ic('check')}Approve</button></div>`).join('')}</div></div>` : ''}
  <div class="two section">
    <div class="card chart"><h3>Quizzes per day <span class="muted small">(last 14 days)</span></h3>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Quizzes per day over the last 14 days"><line class="gl" x1="0" x2="${W}" y1="${H-pb}" y2="${H-pb}"/>${bars}</svg></div>
    <div class="card"><h3>Subjects</h3>
      ${subRows.length ? `<div class="list">${subRows.map(([sid, s]) => { const p = pct(s.c, s.t); return `
        <div class="li"><div class="grow"><b>${esc(subjName(sid))}</b><span>${s.n} quizzes</span></div>
        <div class="pbar"><i class="${p < 50 ? 'low' : ''}" style="width:${p}%"></i></div><b class="num" style="width:40px;text-align:right">${p}%</b></div>`; }).join('')}</div>`
      : '<p class="empty">No quizzes yet.</p>'}
    </div>
  </div>
  <div class="card section"><h3>Latest quizzes</h3>
    ${recent.length ? `<div class="list">${recent.map(a => { const p = person(a.user_id) || {}; const s = pct(a.correct, a.total); return `
      <div class="li"><div class="avatar">${esc(initials(p.full_name || p.email))}</div>
        <div class="grow"><b>${esc(p.full_name || p.email || 'Student')}</b><span>${esc(subjName(a.sid))} · ${esc(a.unit)}${a.exam ? ' · exam' : ''} · ${ago(a.created_at)}</span></div>
        <span class="chip ${s >= 50 ? 'ok' : 'bad'} num">${a.correct}/${a.total} · ${s}%</span></div>`; }).join('')}</div>`
    : '<p class="empty">When students take quizzes, they show up here.</p>'}
  </div>`;
}

/* ================= STUDENTS ================= */
const statusChip = p => p.role === 'admin' ? '<span class="chip sky">Admin</span>'
  : p.status === 'active' ? '<span class="chip ok">Active</span>' : p.status === 'pending' ? '<span class="chip warn">Pending</span>' : '<span class="chip bad">Blocked</span>';
function filteredStudents(){
  const q = A.q.trim().toLowerCase();
  return A.profiles.filter(p =>
    (A.status === 'all' || (A.status === 'admin' ? p.role === 'admin' : p.status === A.status && p.role !== 'admin')) &&
    (A.form === 'all' || p.form === A.form) &&
    (!q || (p.full_name || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q)));
}
function vStudents(){
  const list = filteredStudents();
  const cnt = s => A.profiles.filter(p => s === 'admin' ? p.role === 'admin' : p.status === s && p.role !== 'admin').length;
  return `
  <div class="page-head"><div><h1 class="h-display">Students</h1><p>${students().length} student accounts · tap a row to manage it.</p></div>
    <button class="btn" data-act="csv">${ic('download')}Export CSV</button></div>
  <div class="toolbar">
    <label class="search">${ic('search')}<input class="input" id="s-search" placeholder="Search name or email" value="${esc(A.q)}" aria-label="Search students"></label>
    <select class="input" id="s-form" aria-label="Class"><option value="all">All classes</option>${FORMS.map(f => `<option ${A.form === f ? 'selected' : ''}>${f}</option>`).join('')}</select>
  </div>
  <div class="seg" style="margin-bottom:14px">
    ${[['all', 'All', A.profiles.length], ['active', 'Active', cnt('active')], ['pending', 'Pending', cnt('pending')], ['blocked', 'Blocked', cnt('blocked')], ['admin', 'Admins', cnt('admin')]]
      .map(([k, n, c]) => `<button data-status="${k}" class="${A.status === k ? 'on' : ''}">${n} <span class="muted num">${c}</span></button>`).join('')}
  </div>
  <div class="table">
    <div class="tr head"><span>Student</span><span>Class</span><span>Status</span><span>Quizzes</span><span>Avg</span><span>Lessons</span><span>Last quiz</span></div>
    ${list.length ? list.map(p => { const s = studentStats(p.id); return `
    <button class="tr" data-student="${p.id}">
      <span class="who"><span class="avatar">${esc(initials(p.full_name || p.email))}</span><div><b>${esc(p.full_name || '(no name)')}</b><span>${esc(p.email)}</span></div></span>
      <span class="c-hide">${esc(p.form)}</span>
      <span class="c-status">${statusChip(p)}</span>
      <span class="c-hide num">${s.quizzes}</span>
      <span class="c-hide num">${s.avg === null ? '–' : s.avg + '%'}</span>
      <span class="c-hide num">${s.lessons}</span>
      <span class="c-hide muted small">${ago(s.last)}</span>
    </button>`; }).join('') : '<p class="empty">No students match.</p>'}
  </div>`;
}
function openStudent(id){
  const p = person(id); if (!p) return;
  const s = studentStats(id), at = A.attempts.filter(a => a.user_id === id);
  const bySub = {};
  at.forEach(a => { const x = bySub[a.sid] || (bySub[a.sid] = {n:0, c:0, t:0}); x.n++; x.c += a.correct; x.t += a.total; });
  const self = id === A.me.id;
  drawer(`${esc(p.full_name || p.email)}`, `
    <div class="row"><div class="avatar" style="width:48px;height:48px;font-size:16px">${esc(initials(p.full_name || p.email))}</div>
      <div class="grow" style="min-width:0"><b style="font-size:16px">${esc(p.full_name || '(no name)')}</b><div class="muted small">${esc(p.email)} · joined ${ago(p.created_at)}</div></div>${statusChip(p)}</div>
    <div class="kv">
      <div><b class="num">${s.quizzes}</b><span>Quizzes</span></div>
      <div><b class="num">${s.avg === null ? '–' : s.avg + '%'}</b><span>Average</span></div>
      <div><b class="num">${s.lessons}</b><span>Lessons done</span></div>
      <div><b style="font-size:14px;padding-top:6px">${ago(s.last)}</b><span>Last quiz</span></div>
    </div>
    <div class="card stack">
      <h3 style="margin:0">Profile</h3>
      <div class="grid2">
        <div class="field"><label for="st-name">Full name</label><input class="input" id="st-name" value="${esc(p.full_name)}"></div>
        <div class="field"><label for="st-form">Class</label><select class="input" id="st-form">${FORMS.map(f => `<option ${p.form === f ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
      </div>
      <div><button class="btn primary sm" data-act="st-save" data-id="${id}">Save profile</button></div>
    </div>
    <div class="card stack">
      <h3 style="margin:0">Account</h3>
      ${self ? '<p class="muted small" style="margin:0">This is your own admin account.</p>' : `
      <div class="row wrap">
        ${p.status === 'pending' ? `<button class="btn ok sm" data-act="approve" data-id="${id}">${ic('check')}Approve</button>` : ''}
        ${p.status === 'blocked' ? `<button class="btn ok sm" data-act="set-status" data-status="active" data-id="${id}">Unblock</button>`
          : `<button class="btn danger sm" data-act="set-status" data-status="blocked" data-id="${id}">Block</button>`}
        ${p.role === 'admin' ? `<button class="btn sm" data-act="set-role" data-role="student" data-id="${id}">Remove admin</button>`
          : `<button class="btn sm" data-act="set-role" data-role="admin" data-id="${id}">Make admin</button>`}
        <a class="btn sm" href="mailto:${esc(p.email)}?subject=${encodeURIComponent('Horn Afriik')}">${ic('mail')}Email</a>
        <span class="sp"></span>
        <button class="btn danger solid sm" data-act="delete-user" data-id="${id}">${ic('trash')}Delete account</button>
      </div>
      <p class="hint" style="margin:0">Blocked students can't sign in. Deleting removes the account, scores and lessons for good.</p>`}
    </div>
    <div class="card"><h3>By subject</h3>
      ${Object.keys(bySub).length ? `<div class="list">${Object.entries(bySub).sort((a, b) => b[1].n - a[1].n).map(([sid, x]) => { const q = pct(x.c, x.t); return `
        <div class="li"><div class="grow"><b>${esc(subjName(sid))}</b><span>${x.n} quizzes</span></div><div class="pbar"><i class="${q < 50 ? 'low' : ''}" style="width:${q}%"></i></div><b class="num" style="width:40px;text-align:right">${q}%</b></div>`; }).join('')}</div>`
      : '<p class="empty">No quizzes yet.</p>'}
    </div>
    <div class="card"><h3>Quiz history</h3>
      ${at.length ? `<div class="list">${at.slice(0, 50).map(a => { const q = pct(a.correct, a.total); return `
        <div class="li"><div class="grow"><b>${esc(subjName(a.sid))}</b><span>${esc(a.unit)}${a.exam ? ' · exam' : ''} · ${dateStr(a.created_at)}</span></div>
        <span class="chip ${q >= 50 ? 'ok' : 'bad'} num">${a.correct}/${a.total} · ${q}%</span></div>`; }).join('')}</div>`
      : '<p class="empty">No quizzes yet.</p>'}
    </div>`);
}
function exportCsv(){
  const rows = [['Name', 'Email', 'Class', 'Role', 'Status', 'Quizzes', 'Average %', 'Lessons done', 'Last quiz', 'Joined']];
  filteredStudents().forEach(p => { const s = studentStats(p.id);
    rows.push([p.full_name, p.email, p.form, p.role, p.status, s.quizzes, s.avg ?? '', s.lessons, s.last ? new Date(s.last).toISOString() : '', new Date(p.created_at).toISOString()]); });
  const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], {type:'text/csv'}));
  a.download = `horn-afriik-students-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
async function patchProfile(id, patch, msg){
  const rows = await SB.update('profiles', {id:'eq.' + id}, patch);
  if (!rows.length) throw new Error('Not saved. Check that you are still an admin.');
  const i = A.profiles.findIndex(p => p.id === id); if (i >= 0) A.profiles[i] = rows[0];
  toast(msg); redraw(); if ($('.drawer')) openStudent(id);
}

/* ================= COURSES ================= */
const lessonsOf = sid => A.lessons.filter(l => l.subject_id === sid).sort((a, b) => a.sort - b.sort || a.title.localeCompare(b.title));
const questionsOf = sid => A.questions.filter(q => q.subject_id === sid).sort((a, b) => a.sort - b.sort);
function vCourses(){
  return `
  <div class="page-head"><div><h1 class="h-display">Courses</h1><p>${A.subjects.length} courses · ${A.lessons.length} lessons · ${A.questions.length} questions</p></div>
    <button class="btn primary" data-act="new-subject">${ic('plus')}New course</button></div>
  ${CATS.map(c => { const subs = A.subjects.filter(s => s.cat === c.id); return subs.length ? `
    <h3 style="margin:22px 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-2)">${c.name}</h3>
    <div class="cards">${subs.map(s => `
      <button class="ccard" data-subject="${esc(s.id)}">
        <div class="row"><span class="sym">${esc(s.sym || s.name.slice(0, 2))}</span><div class="grow" style="min-width:0"><b style="display:block;font-size:15px">${esc(s.name)}</b><span class="muted small">${esc(s.so)}</span></div>
        ${s.published ? '' : '<span class="chip warn">Hidden</span>'}</div>
        <div class="meta"><span>${lessonsOf(s.id).length} lessons</span><span>${questionsOf(s.id).length} questions</span></div>
      </button>`).join('')}</div>` : ''; }).join('')}
  ${A.subjects.length ? '' : '<div class="card"><p class="empty">No courses yet. Run the database setup to add the 12 starter subjects, or add a new course.</p></div>'}`;
}
function vSubject(){
  const s = A.subjects.find(x => x.id === A.subject);
  if (!s) return vCourses();
  const ls = lessonsOf(s.id), qs = questionsOf(s.id);
  const qf = A.qlesson === 'all' ? qs : A.qlesson === '_general' ? qs.filter(q => !q.lesson_title) : qs.filter(q => q.lesson_title === A.qlesson);
  return `
  <button class="crumb" data-view="courses">${ic('back')}All courses</button>
  <div class="page-head">
    <div class="row"><span class="sym" style="width:52px;height:52px;font-size:19px">${esc(s.sym || s.name.slice(0, 2))}</span>
      <div><h1 class="h-display">${esc(s.name)}</h1><p>${esc(s.so)} · ${esc((CATS.find(c => c.id === s.cat) || {}).name || s.cat)} ${s.published ? '' : '· <span class="chip warn">Hidden from students</span>'}</p></div></div>
    <button class="btn" data-act="edit-subject" data-id="${esc(s.id)}">${ic('edit')}Edit course</button>
  </div>
  <div class="seg" style="margin-bottom:14px">
    <button data-ctab="lessons" class="${A.ctab === 'lessons' ? 'on' : ''}">Lessons <span class="muted num">${ls.length}</span></button>
    <button data-ctab="questions" class="${A.ctab === 'questions' ? 'on' : ''}">Questions <span class="muted num">${qs.length}</span></button>
  </div>
  ${A.ctab === 'lessons' ? `
    <div class="card" style="padding:0">
      ${ls.length ? ls.map((l, i) => `
      <div class="lrow">
        <span class="n num">${i + 1}</span>
        <div class="grow"><b>${esc(l.title)}</b><span>${(l.sections || []).length} key ideas${l.video_url ? ' · video' : ''}${l.image_url ? ' · image' : ''} · ${qs.filter(q => q.lesson_title === l.title).length} own questions</span></div>
        ${l.published ? '' : '<span class="chip warn">Hidden</span>'}
        <div class="acts">
          <button class="btn sm icon" data-act="move-lesson" data-dir="-1" data-id="${l.id}" aria-label="Move up" ${i === 0 ? 'disabled' : ''}>${ic('up')}</button>
          <button class="btn sm icon" data-act="move-lesson" data-dir="1" data-id="${l.id}" aria-label="Move down" ${i === ls.length - 1 ? 'disabled' : ''}>${ic('down')}</button>
          <button class="btn sm" data-act="edit-lesson" data-id="${l.id}">${ic('edit')}Edit</button>
        </div>
      </div>`).join('') : '<p class="empty">No lessons yet.</p>'}
    </div>
    <button class="btn primary section" data-act="new-lesson">${ic('plus')}Add lesson</button>`
  : `
    <div class="toolbar">
      <select class="input" id="q-lesson" aria-label="Filter by lesson">
        <option value="all">All questions</option><option value="_general" ${A.qlesson === '_general' ? 'selected' : ''}>Whole course (no lesson)</option>
        ${ls.map(l => `<option ${A.qlesson === l.title ? 'selected' : ''}>${esc(l.title)}</option>`).join('')}
      </select>
      <span class="sp"></span>
      <button class="btn primary" data-act="new-question">${ic('plus')}Add question</button>
    </div>
    <p class="hint" style="margin:-4px 0 12px">A lesson test uses that lesson's own questions when it has 3 or more. Otherwise it uses every question in the course.</p>
    <div class="card" style="padding:0">
      ${qf.length ? qf.map((q, i) => `
      <div class="lrow">
        <span class="n num">${i + 1}</span>
        <div class="grow"><b>${esc(plain(q.question))}</b><span><span class="q-ans">✓ ${esc(plain((q.options || [])[q.correct]))}</span> · ${q.lesson_title ? esc(q.lesson_title) : 'whole course'}${q.image_url ? ' · image' : ''}</span></div>
        <div class="acts"><button class="btn sm" data-act="edit-question" data-id="${q.id}">${ic('edit')}Edit</button></div>
      </div>`).join('') : '<p class="empty">No questions here yet.</p>'}
    </div>`}`;
}

/* ---------- subject editor ---------- */
function subjectEditor(s){
  const isNew = !s; s = s || {id:'', name:'', so:'', sym:'', cat:'science', description:'', published:true, sort:(A.subjects.length + 1) * 10};
  drawer(isNew ? 'New course' : 'Edit course', `
    <div class="grid2">
      <div class="field"><label for="se-name">Course name</label><input class="input" id="se-name" value="${esc(s.name)}" placeholder="e.g. Physics"></div>
      <div class="field"><label for="se-so">Somali name</label><input class="input" id="se-so" value="${esc(s.so)}" placeholder="e.g. Fiisigis"></div>
    </div>
    <div class="grid3">
      <div class="field"><label for="se-sym">Short symbol</label><input class="input" id="se-sym" maxlength="3" value="${esc(s.sym)}" placeholder="Ph"><span class="hint">1–3 letters on the tile</span></div>
      <div class="field"><label for="se-cat">Group</label><select class="input" id="se-cat">${CATS.map(c => `<option value="${c.id}" ${s.cat === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
      <div class="field"><label for="se-sort">Order</label><input class="input" id="se-sort" type="number" value="${s.sort}"><span class="hint">Smaller shows first</span></div>
    </div>
    <div class="field"><label for="se-id">Course ID</label><input class="input" id="se-id" value="${esc(s.id)}" ${isNew ? '' : 'disabled'} placeholder="made from the name">
      <span class="hint">${isNew ? 'Lowercase letters, numbers and dashes. Cannot be changed later.' : 'Cannot be changed.'}</span></div>
    <div class="field"><label for="se-desc">Description (optional)</label><textarea class="input" id="se-desc" rows="3">${esc(s.description)}</textarea></div>
    <div class="card toggle-row"><div><b>Visible to students</b><div class="hint">Turn off to hide the course while you prepare it.</div></div>
      <button class="switch" id="se-pub" role="switch" aria-checked="${!!s.published}" aria-label="Visible to students"></button></div>
    <p class="err" id="se-err" hidden></p>`,
    `${isNew ? '' : `<button class="btn danger" data-act="del-subject" data-id="${esc(s.id)}">${ic('trash')}Delete</button>`}<span class="sp"></span>
     <button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="save-subject" data-new="${isNew ? 1 : ''}" data-id="${esc(s.id)}">Save course</button>`);
  if (isNew) $('#se-name').addEventListener('input', e => { const id = $('#se-id'); if (!id.dataset.touched) id.value = slug(e.target.value); if (!$('#se-sym').dataset.touched) $('#se-sym').value = e.target.value.trim().slice(0, 2); });
  $('#se-id').addEventListener('input', e => e.target.dataset.touched = 1);
  $('#se-sym').addEventListener('input', e => e.target.dataset.touched = 1);
}
async function saveSubject(btn){
  const isNew = !!btn.dataset.new, err = $('#se-err'), bad = m => { err.textContent = m; err.hidden = false; };
  const row = {name:$('#se-name').value.trim(), so:$('#se-so').value.trim(), sym:$('#se-sym').value.trim(), cat:$('#se-cat').value,
    sort:parseInt($('#se-sort').value, 10) || 0, description:$('#se-desc').value.trim(), published:$('#se-pub').getAttribute('aria-checked') === 'true', updated_at:new Date().toISOString()};
  if (row.name.length < 2) return bad('Enter a course name.');
  if (!row.sym) row.sym = row.name.slice(0, 2);
  await busy(btn, async () => {
    if (isNew){
      const id = $('#se-id').value.trim();
      if (!/^[a-z0-9-]{2,40}$/.test(id)) return bad('Course ID: 2–40 lowercase letters, numbers or dashes.');
      if (A.subjects.some(s => s.id === id)) return bad('A course with this ID already exists.');
      const [s] = await SB.insert('subjects', {id, ...row});
      A.subjects.push(s); closeDrawer(); toast('Course added'); go('subject', {subject:s.id, ctab:'lessons', qlesson:'all'});
    } else {
      const [s] = await SB.update('subjects', {id:'eq.' + btn.dataset.id}, row);
      A.subjects[A.subjects.findIndex(x => x.id === s.id)] = s; closeDrawer(); toast('Course saved'); redraw();
    }
  });
}

/* ---------- media field (upload or link) ---------- */
function mediaField(key, label, url, kind){
  return `<div class="field"><span class="label">${label}</span>
    <div class="media-box" id="mb-${key}">
      <div id="mp-${key}">${mediaPreview(url, kind)}</div>
      <input class="input" id="mf-${key}" value="${esc(url || '')}" placeholder="${kind === 'video' ? 'Paste a YouTube link, or upload a video' : 'Paste an image link, or upload a picture'}">
      <div class="row wrap"><button type="button" class="btn sm" data-act="upload" data-key="${key}" data-kind="${kind}">${ic('upload')}Upload ${kind}</button>
        <button type="button" class="btn sm" data-act="clear-media" data-key="${key}">Remove</button>
        <span class="hint">${kind === 'video' ? 'MP4 up to 50 MB. For longer videos, use YouTube (unlisted is fine).' : 'PNG, JPG or WebP up to 50 MB.'}</span></div>
    </div></div>`;
}
function ytId(u){ const m = String(u).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/); return m && m[1]; }
function mediaPreview(url, kind){
  if (!url) return '';
  if (kind === 'video'){
    const y = ytId(url);
    return y ? `<iframe class="media-prev video" src="https://www.youtube-nocookie.com/embed/${y}" title="Video preview" allowfullscreen></iframe>`
      : `<video class="media-prev video" src="${esc(url)}" controls preload="metadata"></video>`;
  }
  return `<img class="media-prev" src="${esc(url)}" alt="Preview">`;
}
function bindMedia(key, kind){
  const inp = $('#mf-' + key);
  inp.addEventListener('change', () => { $('#mp-' + key).innerHTML = mediaPreview(inp.value.trim(), kind); });
}
function pickFile(kind){
  return new Promise(res => {
    const f = $('#file-pick');
    f.value = ''; f.accept = kind === 'video' ? 'video/mp4,video/webm' : 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml';
    f.onchange = () => res(f.files[0] || null);
    f.click();
  });
}
async function uploadMedia(btn){
  const key = btn.dataset.key, kind = btn.dataset.kind;
  const file = await pickFile(kind); if (!file) return;
  if (file.size > 50 * 1024 * 1024) return toast('That file is over 50 MB. Use a smaller file or a YouTube link.', true);
  await busy(btn, async () => {
    const ext = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '') || (kind === 'video' ? 'mp4' : 'jpg');
    const path = `${kind}s/${Date.now()}-${slug(file.name.replace(/\.[^.]+$/, '')) || kind}.${ext}`;
    const url = await SB.upload('media', path, file);
    $('#mf-' + key).value = url; $('#mp-' + key).innerHTML = mediaPreview(url, kind);
    toast('Uploaded. Remember to save.');
  });
}

/* ---------- lesson editor ---------- */
function lessonEditor(l){
  const s = A.subjects.find(x => x.id === A.subject), isNew = !l;
  l = l || {title:'', sections:[{h:'', p:''}], image_url:'', video_url:'', published:true};
  drawer(isNew ? 'New lesson' : 'Edit lesson', `
    <p class="muted small" style="margin:0">${esc(s.name)}</p>
    <div class="field"><label for="le-title">Lesson title</label><input class="input" id="le-title" value="${esc(l.title)}" placeholder="e.g. Motion & Forces"></div>
    ${mediaField('video', 'Video (optional)', l.video_url, 'video')}
    ${mediaField('image', 'Picture or diagram (optional)', l.image_url, 'image')}
    <div class="field"><span class="label">Key ideas</span><span class="hint">Each idea has a short heading and a few sentences. Students read them before the test.</span></div>
    <div class="stack" id="le-secs" style="gap:10px"></div>
    <button class="btn sm" data-act="add-sec" type="button" style="align-self:flex-start">${ic('plus')}Add key idea</button>
    <div class="card toggle-row"><div><b>Visible to students</b><div class="hint">Hidden lessons stay in the dashboard only.</div></div>
      <button class="switch" id="le-pub" role="switch" aria-checked="${!!l.published}" aria-label="Visible to students"></button></div>
    <p class="err" id="le-err" hidden></p>`,
    `${isNew ? '' : `<button class="btn danger" data-act="del-lesson" data-id="${l.id}">${ic('trash')}Delete</button>`}<span class="sp"></span>
     <button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="save-lesson" data-id="${l.id || ''}">Save lesson</button>`);
  secs = (l.sections || []).map(x => ({h:x.h || '', p:x.p || ''}));
  if (!secs.length) secs.push({h:'', p:''});
  drawSecs(); bindMedia('video', 'video'); bindMedia('image', 'image');
}
let secs = [];
function readSecs(){ $$('#le-secs .sec-edit').forEach((el, i) => { secs[i] = {h: el.querySelector('.sh').value, p: el.querySelector('.sp2').value}; }); }
function drawSecs(){
  $('#le-secs').innerHTML = secs.map((x, i) => `
    <div class="sec-edit">
      <div class="row"><b class="muted small" style="flex:1">Idea ${i + 1}</b>
        <button type="button" class="btn sm icon" data-act="sec-move" data-i="${i}" data-dir="-1" aria-label="Move up" ${i ? '' : 'disabled'}>${ic('up')}</button>
        <button type="button" class="btn sm icon" data-act="sec-move" data-i="${i}" data-dir="1" aria-label="Move down" ${i < secs.length - 1 ? '' : 'disabled'}>${ic('down')}</button>
        <button type="button" class="btn sm icon danger" data-act="sec-del" data-i="${i}" aria-label="Remove idea">${ic('x')}</button></div>
      <input class="input sh" value="${esc(x.h)}" placeholder="Heading, e.g. Speed and velocity" aria-label="Heading">
      <textarea class="input sp2" rows="3" placeholder="Explanation" aria-label="Explanation">${esc(x.p)}</textarea>
    </div>`).join('');
}
async function saveLesson(btn){
  readSecs();
  const err = $('#le-err'), bad = m => { err.textContent = m; err.hidden = false; };
  const title = $('#le-title').value.trim(), id = btn.dataset.id;
  const sections = secs.map(x => ({h:x.h.trim(), p:x.p.trim()})).filter(x => x.h || x.p);
  if (title.length < 2) return bad('Enter a lesson title.');
  if (A.lessons.some(l => l.subject_id === A.subject && l.title.toLowerCase() === title.toLowerCase() && l.id !== id)) return bad('This course already has a lesson with that title.');
  const video = $('#mf-video').value.trim(), image = $('#mf-image').value.trim();
  if (video && !/^https:\/\//.test(video)) return bad('The video link must start with https://');
  if (image && !/^https:\/\//.test(image)) return bad('The image link must start with https://');
  const row = {title, sections, video_url: video || null, image_url: image || null, published: $('#le-pub').getAttribute('aria-checked') === 'true', updated_at: new Date().toISOString()};
  await busy(btn, async () => {
    if (!id){
      const ls = lessonsOf(A.subject);
      const [l] = await SB.insert('lessons', {...row, subject_id:A.subject, sort: ls.length ? ls[ls.length - 1].sort + 10 : 10});
      A.lessons.push(l); toast('Lesson added');
    } else {
      const old = A.lessons.find(l => l.id === id);
      const [l] = await SB.update('lessons', {id:'eq.' + id}, row);
      A.lessons[A.lessons.findIndex(x => x.id === id)] = l;
      if (old && old.title !== title){   // keep questions linked to the renamed lesson
        const moved = await SB.update('questions', {subject_id:'eq.' + A.subject, lesson_title:'eq.' + old.title}, {lesson_title:title});
        moved.forEach(q => { const i = A.questions.findIndex(x => x.id === q.id); if (i >= 0) A.questions[i] = q; });
      }
      toast('Lesson saved');
    }
    closeDrawer(); redraw();
  });
}
async function moveLesson(id, dir){
  const ls = lessonsOf(A.subject), i = ls.findIndex(l => l.id === id), j = i + dir;
  if (j < 0 || j >= ls.length) return;
  [ls[i], ls[j]] = [ls[j], ls[i]];
  const changes = ls.map((l, k) => ({l, sort:(k + 1) * 10})).filter(x => x.l.sort !== x.sort);
  changes.forEach(x => x.l.sort = x.sort); redraw();
  try { await Promise.all(changes.map(x => SB.update('lessons', {id:'eq.' + x.l.id}, {sort:x.sort}))); }
  catch(e){ fail(e); await reload(); }
}

/* ---------- question editor ---------- */
let qopts = [], qcorrect = 0;
function questionEditor(q){
  const isNew = !q, ls = lessonsOf(A.subject);
  q = q || {question:'', options:['', '', '', ''], correct:0, explanation:'', lesson_title: A.qlesson !== 'all' && A.qlesson !== '_general' ? A.qlesson : null, image_url:''};
  qopts = [...q.options]; qcorrect = q.correct;
  drawer(isNew ? 'New question' : 'Edit question', `
    <div class="field"><label for="qe-lesson">Lesson</label><select class="input" id="qe-lesson">
      <option value="">Whole course (any lesson test and exams)</option>
      ${ls.map(l => `<option ${q.lesson_title === l.title ? 'selected' : ''}>${esc(l.title)}</option>`).join('')}</select></div>
    <div class="field"><label for="qe-q">Question</label><textarea class="input" id="qe-q" rows="3" placeholder="e.g. What is the SI unit of force?">${esc(q.question)}</textarea></div>
    <div class="field"><span class="label">Answers <span class="hint">· tick the correct one</span></span><div class="stack" id="qe-opts" style="gap:8px"></div>
      <button class="btn sm" type="button" data-act="opt-add" style="align-self:flex-start">${ic('plus')}Add answer</button></div>
    <div class="field"><label for="qe-e">Explanation</label><textarea class="input" id="qe-e" rows="3" placeholder="Shown after the student answers">${esc(q.explanation)}</textarea></div>
    ${mediaField('qimg', 'Picture (optional)', q.image_url, 'image')}
    <p class="err" id="qe-err" hidden></p>`,
    `${isNew ? '' : `<button class="btn danger" data-act="del-question" data-id="${q.id}">${ic('trash')}Delete</button>`}<span class="sp"></span>
     <button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="save-question" data-id="${q.id || ''}">Save question</button>`);
  drawOpts(); bindMedia('qimg', 'image');
}
function readOpts(){ $$('#qe-opts .opt-row').forEach((r, i) => { qopts[i] = r.querySelector('.input').value; if (r.querySelector('input[type=radio]').checked) qcorrect = i; }); }
function drawOpts(){
  $('#qe-opts').innerHTML = qopts.map((o, i) => `
    <label class="opt-row"><input type="radio" name="qe-ok" ${i === qcorrect ? 'checked' : ''} aria-label="Answer ${'ABCDEF'[i]} is correct">
      <b class="muted" style="width:16px">${'ABCDEF'[i]}</b><input class="input" value="${esc(o)}" placeholder="Answer ${'ABCDEF'[i]}">
      <button type="button" class="btn sm icon" data-act="opt-del" data-i="${i}" aria-label="Remove answer" ${qopts.length <= 2 ? 'disabled' : ''}>${ic('x')}</button></label>`).join('');
}
async function saveQuestion(btn){
  readOpts();
  const err = $('#qe-err'), bad = m => { err.textContent = m; err.hidden = false; };
  const question = $('#qe-q').value.trim(), options = qopts.map(o => o.trim()), id = btn.dataset.id;
  if (question.length < 3) return bad('Write the question.');
  if (options.some(o => !o)) return bad('Fill in every answer, or remove the empty ones.');
  if (new Set(options.map(o => o.toLowerCase())).size !== options.length) return bad('Two answers are the same.');
  const image = $('#mf-qimg').value.trim();
  if (image && !/^https:\/\//.test(image)) return bad('The image link must start with https://');
  const row = {question, options, correct: Math.min(qcorrect, options.length - 1), explanation: $('#qe-e').value.trim(),
    lesson_title: $('#qe-lesson').value || null, image_url: image || null, updated_at: new Date().toISOString()};
  await busy(btn, async () => {
    if (!id){
      const qs = questionsOf(A.subject);
      const [q] = await SB.insert('questions', {...row, subject_id:A.subject, sort: qs.length ? qs[qs.length - 1].sort + 10 : 10});
      A.questions.push(q); toast('Question added');
    } else {
      const [q] = await SB.update('questions', {id:'eq.' + id}, row);
      A.questions[A.questions.findIndex(x => x.id === id)] = q; toast('Question saved');
    }
    closeDrawer(); redraw();
  });
}

/* ================= FEEDBACK ================= */
function vFeedback(){
  const list = A.feedback.filter(f => A.fbFilter === 'all' || f.status === A.fbFilter);
  const n = s => A.feedback.filter(f => f.status === s).length;
  return `
  <div class="page-head"><div><h1 class="h-display">Feedback</h1><p>Messages students send from the Support page.</p></div></div>
  <div class="seg" style="margin-bottom:14px">
    ${[['new', 'New', n('new')], ['read', 'Read', n('read')], ['done', 'Done', n('done')], ['all', 'All', A.feedback.length]]
      .map(([k, l, c]) => `<button data-fb="${k}" class="${A.fbFilter === k ? 'on' : ''}">${l} <span class="muted num">${c}</span></button>`).join('')}
  </div>
  <div class="stack">
  ${list.length ? list.map(f => { const p = f.user_id && person(f.user_id); return `
    <div class="fb ${f.status === 'new' ? 'new' : ''}">
      <div class="row wrap"><div class="avatar">${esc(initials(f.name))}</div>
        <div class="grow" style="min-width:0"><b>${esc(f.name || 'Anonymous')}</b> <span class="muted small">${esc(f.form)}${p ? ' · ' + esc(p.email) : f.user_id ? '' : ' · guest'}</span>
          <div class="muted small">${esc(f.topic)} · ${ago(f.created_at)}</div></div>
        ${f.rating ? `<span class="stars" aria-label="${f.rating} of 5 stars">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}</span>` : ''}</div>
      <p>${esc(f.message)}</p>
      <div class="row wrap">
        ${f.status !== 'read' && f.status !== 'done' ? `<button class="btn sm" data-act="fb-status" data-status="read" data-id="${f.id}">Mark read</button>` : ''}
        ${f.status !== 'done' ? `<button class="btn sm ok" data-act="fb-status" data-status="done" data-id="${f.id}">${ic('check')}Done</button>` : `<button class="btn sm" data-act="fb-status" data-status="new" data-id="${f.id}">Mark as new</button>`}
        ${p ? `<a class="btn sm" href="mailto:${esc(p.email)}?subject=${encodeURIComponent('Re: ' + f.topic)}">${ic('mail')}Reply</a>` : ''}
        ${p ? `<button class="btn sm" data-student="${p.id}">View student</button>` : ''}
        <span class="sp"></span>
        <button class="btn sm danger icon" data-act="fb-del" data-id="${f.id}" aria-label="Delete">${ic('trash')}</button>
      </div>
    </div>`; }).join('') : `<div class="card"><p class="empty">${A.fbFilter === 'new' ? 'No new feedback. You are all caught up.' : 'Nothing here.'}</p></div>`}
  </div>`;
}

/* ================= SETTINGS ================= */
function vSettings(){
  const s = A.settings || {require_approval:false, admin_emails:[]};
  return `
  <div class="page-head"><div><h1 class="h-display">Settings</h1><p>How sign-up works for new students.</p></div></div>
  <div class="stack" style="max-width:720px">
    <div class="card toggle-row"><div><b>Approve new students first</b>
      <div class="hint">When on, new accounts wait in Students → Pending until you approve them. When off, students can start right away.</div></div>
      <button class="switch" role="switch" aria-checked="${!!s.require_approval}" data-act="toggle-approval" aria-label="Approve new students first"></button></div>
    <div class="card stack">
      <div><b>Admin emails</b><div class="hint">Anyone who signs up with one of these emails becomes an admin. To make an existing student an admin, open them in Students.</div></div>
      <textarea class="input" id="set-admins" rows="3">${esc((s.admin_emails || []).join('\n'))}</textarea>
      <div><button class="btn primary sm" data-act="save-admins">Save admin emails</button></div>
    </div>
    <div class="card stack">
      <b>Your data</b>
      <div class="hint">Everything is stored in your Supabase project. Log in at supabase.com to see tables, back up data or change your password rules.</div>
      <div class="row wrap"><a class="btn sm" href="https://supabase.com/dashboard/project/kbvvxcsmpqcddwlmgdnl" target="_blank" rel="noopener">Open Supabase</a>
        <button class="btn sm" data-act="reload">Reload all data</button></div>
    </div>
  </div>`;
}

/* ================= drawer ================= */
function drawer(title, body, foot){
  $('#drawer-root').innerHTML = `<div class="scrim" id="scrim"><div class="drawer" role="dialog" aria-modal="true" aria-label="${esc(plain(title))}">
    <div class="drawer-head"><h2 class="h-display">${title}</h2><button class="btn sm icon" data-act="close" aria-label="Close">${ic('x')}</button></div>
    <div class="drawer-body">${body}</div>${foot ? `<div class="drawer-foot">${foot}</div>` : ''}</div></div>`;
  document.body.style.overflow = 'hidden';
  const first = $('.drawer-body input:not([disabled]), .drawer-body textarea'); if (first && window.innerWidth > 640) first.focus();
}
function closeDrawer(){ $('#drawer-root').innerHTML = ''; document.body.style.overflow = ''; }
async function reload(){ try { await loadAll(); redraw(); toast('Up to date'); } catch(e){ fail(e); } }

/* ================= events ================= */
document.addEventListener('input', e => {
  if (e.target.id === 's-search'){ A.q = e.target.value; go('students', {focus:true, keepScroll:true}); }
});
document.addEventListener('change', e => {
  if (e.target.id === 's-form'){ A.form = e.target.value; redraw(); }
  if (e.target.id === 'q-lesson'){ A.qlesson = e.target.value; redraw(); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#scrim')) closeDrawer(); });
document.addEventListener('click', async e => {
  const t = e.target;
  if (t.id === 'scrim'){ closeDrawer(); return; }
  const v = t.closest('[data-view]'); if (v){ closeDrawer(); go(v.dataset.view); softRefresh(); return; }
  const st = t.closest('[data-student]'); if (st){ openStudent(st.dataset.student); return; }
  const sb = t.closest('[data-subject]'); if (sb){ go('subject', {subject: sb.dataset.subject, ctab:'lessons', qlesson:'all'}); return; }
  const ss = t.closest('[data-status]:not([data-act])'); if (ss){ A.status = ss.dataset.status; redraw(); return; }
  const ct = t.closest('[data-ctab]'); if (ct){ A.ctab = ct.dataset.ctab; redraw(); return; }
  const fb = t.closest('[data-fb]'); if (fb){ A.fbFilter = fb.dataset.fb; redraw(); return; }
  const sw = t.closest('.drawer .switch'); if (sw){ sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') !== 'true'); return; }
  const a = t.closest('[data-act]'); if (!a) return;
  const id = a.dataset.id;
  switch (a.dataset.act){
    case 'close': closeDrawer(); break;
    case 'theme': toggleTheme(); break;
    case 'signout': signOut(); break;
    case 'reload': await busy(a, reload); break;
    case 'csv': exportCsv(); break;
    /* students */
    case 'approve': await busy(a, () => patchProfile(id, {status:'active'}, 'Approved')); break;
    case 'set-status': {
      const blocking = a.dataset.status === 'blocked';
      if (blocking && !confirm('Block this student? They will be signed out and cannot sign in until you unblock them.')) return;
      await busy(a, () => patchProfile(id, {status:a.dataset.status}, blocking ? 'Blocked' : 'Unblocked')); break;
    }
    case 'set-role': {
      const toAdmin = a.dataset.role === 'admin';
      if (!confirm(toAdmin ? 'Make this person an admin? They will be able to change everything here.' : 'Remove admin rights from this person?')) return;
      await busy(a, () => patchProfile(id, {role:a.dataset.role, status:'active'}, toAdmin ? 'Now an admin' : 'Admin rights removed')); break;
    }
    case 'st-save': {
      const name = $('#st-name').value.trim(); if (name.length < 2) return toast('Enter a name', true);
      await busy(a, () => patchProfile(id, {full_name:name, form:$('#st-form').value}, 'Profile saved')); break;
    }
    case 'delete-user': {
      const p = person(id);
      if (!confirm(`Delete ${p.full_name || p.email} for good? Their account, scores and lessons will be removed. This cannot be undone.`)) return;
      await busy(a, async () => {
        await SB.rpc('admin_delete_user', {target:id});
        A.profiles = A.profiles.filter(x => x.id !== id); A.attempts = A.attempts.filter(x => x.user_id !== id); A.done = A.done.filter(x => x.user_id !== id);
        closeDrawer(); redraw(); toast('Account deleted');
      }); break;
    }
    /* courses */
    case 'new-subject': subjectEditor(null); break;
    case 'edit-subject': subjectEditor(A.subjects.find(s => s.id === id)); break;
    case 'save-subject': await saveSubject(a); break;
    case 'del-subject': {
      const s = A.subjects.find(x => x.id === id);
      const n = lessonsOf(id).length, q = questionsOf(id).length;
      if (prompt(`Delete "${s.name}" with its ${n} lessons and ${q} questions? Students' old scores stay. Type DELETE to confirm.`) !== 'DELETE') return;
      await busy(a, async () => {
        await SB.remove('subjects', {id:'eq.' + id});
        A.subjects = A.subjects.filter(x => x.id !== id); A.lessons = A.lessons.filter(x => x.subject_id !== id); A.questions = A.questions.filter(x => x.subject_id !== id);
        closeDrawer(); go('courses'); toast('Course deleted');
      }); break;
    }
    case 'new-lesson': lessonEditor(null); break;
    case 'edit-lesson': lessonEditor(A.lessons.find(l => l.id === id)); break;
    case 'save-lesson': await saveLesson(a); break;
    case 'move-lesson': await moveLesson(id, +a.dataset.dir); break;
    case 'del-lesson': {
      if (!confirm('Delete this lesson? Its questions stay in the course.')) return;
      await busy(a, async () => {
        const l = A.lessons.find(x => x.id === id);
        await SB.remove('lessons', {id:'eq.' + id});
        A.lessons = A.lessons.filter(x => x.id !== id);
        const moved = await SB.update('questions', {subject_id:'eq.' + l.subject_id, lesson_title:'eq.' + l.title}, {lesson_title:null});
        moved.forEach(q => { const i = A.questions.findIndex(x => x.id === q.id); if (i >= 0) A.questions[i] = q; });
        closeDrawer(); redraw(); toast('Lesson deleted');
      }); break;
    }
    case 'add-sec': readSecs(); secs.push({h:'', p:''}); drawSecs(); $$('#le-secs .sh').pop().focus(); break;
    case 'sec-del': readSecs(); secs.splice(+a.dataset.i, 1); if (!secs.length) secs.push({h:'', p:''}); drawSecs(); break;
    case 'sec-move': { readSecs(); const i = +a.dataset.i, j = i + +a.dataset.dir; [secs[i], secs[j]] = [secs[j], secs[i]]; drawSecs(); break; }
    case 'upload': await uploadMedia(a); break;
    case 'clear-media': $('#mf-' + a.dataset.key).value = ''; $('#mp-' + a.dataset.key).innerHTML = ''; break;
    case 'new-question': questionEditor(null); break;
    case 'edit-question': questionEditor(A.questions.find(q => q.id === id)); break;
    case 'save-question': await saveQuestion(a); break;
    case 'opt-add': readOpts(); if (qopts.length >= 6) return toast('Up to 6 answers', true); qopts.push(''); drawOpts(); $$('#qe-opts .input').pop().focus(); break;
    case 'opt-del': { readOpts(); const i = +a.dataset.i; qopts.splice(i, 1); if (qcorrect >= i && qcorrect > 0) qcorrect--; drawOpts(); break; }
    case 'del-question': {
      if (!confirm('Delete this question?')) return;
      await busy(a, async () => { await SB.remove('questions', {id:'eq.' + id}); A.questions = A.questions.filter(x => x.id !== id); closeDrawer(); redraw(); toast('Question deleted'); }); break;
    }
    /* feedback */
    case 'fb-status': await busy(a, async () => {
      const [f] = await SB.update('feedback', {id:'eq.' + id}, {status:a.dataset.status});
      A.feedback[A.feedback.findIndex(x => x.id === f.id)] = f; redraw();
    }); break;
    case 'fb-del': {
      if (!confirm('Delete this message?')) return;
      await busy(a, async () => { await SB.remove('feedback', {id:'eq.' + id}); A.feedback = A.feedback.filter(x => String(x.id) !== String(id)); redraw(); toast('Deleted'); }); break;
    }
    /* settings */
    case 'toggle-approval': await busy(a, async () => {
      const on = a.getAttribute('aria-checked') !== 'true';
      const [s] = await SB.update('settings', {id:'eq.1'}, {require_approval:on});
      A.settings = s; redraw(); toast(on ? 'New students now need approval' : 'New students can start right away');
    }); break;
    case 'save-admins': {
      const list = $('#set-admins').value.split(/[\s,;]+/).map(x => x.trim().toLowerCase()).filter(Boolean);
      if (list.some(x => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x))) return toast('One of the emails looks wrong', true);
      if (!list.length) return toast('Keep at least one admin email', true);
      await busy(a, async () => { const [s] = await SB.update('settings', {id:'eq.1'}, {admin_emails:list}); A.settings = s; redraw(); toast('Admin emails saved'); });
      break;
    }
  }
});

/* ================= boot ================= */
(async () => {
  if (!SB.session) return showLogin();
  try {
    const me = await checkAdmin();
    if (!me) return showLogin('This account is not an admin. Sign in with an admin account.');
    start(me);
  } catch(e){ showLogin(e.code === 'offline' ? 'No internet connection.' : 'Please sign in.'); }
})();
})();
