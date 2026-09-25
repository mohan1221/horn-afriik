/* Horn Afriik: tiny Supabase client (auth, database, storage) using fetch.
   The publishable key is meant to be public; the database rules protect the data. */
(function(){
const URL_ = 'https://kbvvxcsmpqcddwlmgdnl.supabase.co';
const KEY = 'sb_publishable_Y_szCYYe2gSZjonjPOxkrA_6iMNkstL';
const SKEY = 'ha_session';

class SBError extends Error {
  constructor(message, status, code){ super(message); this.status = status; this.code = code; }
}

let session = null;
try { session = JSON.parse(localStorage.getItem(SKEY)); } catch(_) {}
const listeners = [];
function persist(s){
  session = s;
  try { s ? localStorage.setItem(SKEY, JSON.stringify(s)) : localStorage.removeItem(SKEY); } catch(_) {}
  listeners.forEach(f => { try { f(s); } catch(_) {} });
}
function withExpiry(s){
  if (s && !s.expires_at) s.expires_at = Math.floor(Date.now()/1000) + (s.expires_in || 3600);
  return s;
}

async function call(path, {method='GET', body, headers={}, auth=true, retry=true} = {}){
  const h = {apikey: KEY, ...headers};
  if (auth){ const t = await token(); if (t) h.Authorization = 'Bearer ' + t; }
  let payload = body;
  if (body !== undefined && !(body instanceof Blob)){ h['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  let res;
  try { res = await fetch(URL_ + path, {method, headers: h, body: payload}); }
  catch(e){ throw new SBError('No internet connection. Check your data and try again.', 0, 'offline'); }
  if (res.status === 401 && auth && retry && session){
    const ok = await refresh(true);
    if (ok) return call(path, {method, body, headers, auth, retry:false});
  }
  const text = await res.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch(_) { data = text; }
  if (!res.ok){
    const msg = (data && (data.msg || data.message || data.error_description || data.error)) || res.statusText || 'Request failed';
    throw new SBError(msg, res.status, data && (data.error_code || data.code));
  }
  return {data, res};
}

let refreshing = null;
function refresh(force){
  if (!session || !session.refresh_token) return Promise.resolve(false);
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const {data} = await call('/auth/v1/token?grant_type=refresh_token', {method:'POST', body:{refresh_token: session.refresh_token}, auth:false});
      persist(withExpiry(data)); return true;
    } catch(e){
      if (e.code === 'offline') return false;       // keep the old session while offline
      if (e.status >= 400 && e.status < 500) persist(null);
      return false;
    } finally { refreshing = null; }
  })();
  return refreshing;
}
async function token(){
  if (!session) return null;
  if (session.expires_at * 1000 - Date.now() < 60000) await refresh();
  return session ? session.access_token : null;
}

const enc = encodeURIComponent;
const qs = params => Object.entries(params).filter(([,v]) => v !== undefined && v !== null).map(([k,v]) => enc(k) + '=' + enc(v)).join('&');

window.SB = {
  url: URL_,
  SBError,
  get session(){ return session; },
  get user(){ return session && session.user; },
  onAuth(f){ listeners.push(f); },

  async signUp(email, password, meta){
    const {data} = await call('/auth/v1/signup', {method:'POST', body:{email, password, data: meta || {}}, auth:false});
    if (data && data.access_token){ persist(withExpiry(data)); return {session: data, user: data.user}; }
    return {session: null, user: data && (data.user || data)};
  },
  async signIn(email, password){
    const {data} = await call('/auth/v1/token?grant_type=password', {method:'POST', body:{email, password}, auth:false});
    persist(withExpiry(data)); return data;
  },
  async signOut(){
    try { if (session) await call('/auth/v1/logout', {method:'POST', retry:false}); } catch(_) {}
    persist(null);
  },
  async updatePassword(password){
    const {data} = await call('/auth/v1/user', {method:'PUT', body:{password}});
    return data;
  },

  /* Database (PostgREST). params: {select, order, limit, 'col': 'eq.value', ...} */
  async select(table, params = {}){
    const {data} = await call(`/rest/v1/${table}?${qs({select:'*', ...params})}`);
    return data;
  },
  async selectAll(table, params = {}){   // pages past the 1000-row limit
    const out = [], size = 1000;
    for (let offset = 0; ; offset += size){
      const page = await this.select(table, {...params, limit: size, offset});
      out.push(...page);
      if (page.length < size) return out;
    }
  },
  async insert(table, rows, {returning = true, upsert = false, ignore = false, onConflict} = {}){
    const prefer = [returning ? 'return=representation' : 'return=minimal'];
    if (upsert) prefer.push('resolution=merge-duplicates');
    if (ignore) prefer.push('resolution=ignore-duplicates');
    const q = onConflict ? '?on_conflict=' + enc(onConflict) : '';
    const {data} = await call(`/rest/v1/${table}${q}`, {method:'POST', body: rows, headers:{Prefer: prefer.join(',')}});
    return data;
  },
  async update(table, filter, patch){
    const {data} = await call(`/rest/v1/${table}?${qs(filter)}`, {method:'PATCH', body: patch, headers:{Prefer:'return=representation'}});
    return data;
  },
  async remove(table, filter){
    await call(`/rest/v1/${table}?${qs(filter)}`, {method:'DELETE', headers:{Prefer:'return=minimal'}});
  },
  async rpc(fn, args = {}){
    const {data} = await call(`/rest/v1/rpc/${fn}`, {method:'POST', body: args});
    return data;
  },

  /* Storage */
  async upload(bucket, path, file){
    await call(`/storage/v1/object/${bucket}/${path.split('/').map(enc).join('/')}`, {
      method:'POST', body: file, headers:{'Content-Type': file.type || 'application/octet-stream', 'cache-control':'3600', 'x-upsert':'false'}});
    return this.publicUrl(bucket, path);
  },
  publicUrl(bucket, path){ return `${URL_}/storage/v1/object/public/${bucket}/${path.split('/').map(enc).join('/')}`; },
  async removeFile(bucket, path){
    await call(`/storage/v1/object/${bucket}`, {method:'DELETE', body:{prefixes:[path]}});
  }
};
})();
