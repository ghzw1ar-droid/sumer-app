/* Modern Plaza Hotel: interactions. All visible text lives in assets/js/i18n.js */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const WA = '9647800098611'; // hotel WhatsApp number, international format
const KEYS = ['facade', 'rest', 'twin', 'dbl', 'lobby', 'lobby2', 'single'];
const IMG = Object.fromEntries(KEYS.map(k => [k, `assets/img/${k}.jpg`]));
const CAP = { facade: 'cap_facade', rest: 'cap_rest', lobby: 'cap_lobby', lobby2: 'cap_lobby2', dbl: 'room_dbl', twin: 'room_twin', single: 'room_single' };
const ICONS = [
  'M3 18h18M5 18a7 7 0 0 1 14 0M12 11V9M10 9h4',
  'M4 10h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM16 11h2a2 2 0 0 1 0 4h-2M7 3v3M11 3v3',
  'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
  'M6 7h12v12H6zM9 7V4h6v3M9 19v2M15 19v2',
  'M3 3h18v18H3zM9 17V7h4a3 3 0 0 1 0 6H9',
  'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z',
  'M12 2v20M4.9 7l14.2 10M4.9 17 19.1 7M9 3.5l3 2 3-2M9 20.5l3-2 3 2',
  'M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01',
  'M4 3v7a2 2 0 0 0 2 2v9M8 3v7a2 2 0 0 1-2 2M18 21V3c-2.5 1.5-4 4-4 8h4'
];

/* ---------- language ---------- */
let lang = 'ar';
try { lang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('lang') || 'ar'; } catch (e) {}
if (!I18N[lang]) lang = 'ar';
const t = k => (I18N[lang] || {})[k] || I18N.ar[k] || k;

/* ---------- services and gallery ---------- */
$('#svc').innerHTML = ICONS.map((p, i) =>
  `<div class="sv rv" style="--d:${(i % 5) * .07}s"><svg viewBox="0 0 24 24"><path d="${p}"/></svg><b data-i="sv${i}"></b></div>`).join('');

const GO = [['facade', 'big'], ['twin', ''], ['dbl', ''], ['lobby', 'wide'], ['single', ''], ['rest', ''], ['lobby2', 'wide']];
$('#gal').innerHTML = GO.map(([k, c]) =>
  `<figure class="${c} rv" data-lb="${k}"><img src="${IMG[k]}" loading="lazy" alt="" data-i-alt="${CAP[k]}"${k === 'facade' ? ' style="object-position:50% 40%"' : ''}><figcaption data-i="${CAP[k]}"></figcaption></figure>`).join('');

/* ---------- carousel ---------- */
const car = $('#car'), CK = ['rest', 'lobby', 'lobby2'], dots = $('.dots', car);
CK.forEach((k, i) => {
  const s = document.createElement('div');
  s.className = 'sl' + (i ? '' : ' on');
  s.dataset.lb = k;
  s.innerHTML = `<img src="${IMG[k]}" loading="lazy" alt="" data-i-alt="${CAP[k]}"><div class="cap" data-i="${CAP[k]}"></div>`;
  car.insertBefore(s, $('.ar.p', car));
});
const sl = $$('.sl', car);
dots.innerHTML = CK.map((_, i) => `<button type="button" aria-label="${i + 1}"></button>`).join('');
const db = $$('button', dots);
let ci = 0, ct;
const go = n => {
  ci = (n + CK.length) % CK.length;
  sl.forEach((s, i) => s.classList.toggle('on', i === ci));
  db.forEach((d, i) => d.classList.toggle('on', i === ci));
};
const play = () => { clearInterval(ct); ct = setInterval(() => go(ci + 1), 5500); };
db.forEach((d, i) => d.onclick = () => { go(i); play(); });
$('.ar.p', car).onclick = () => { go(ci - 1); play(); };
$('.ar.n', car).onclick = () => { go(ci + 1); play(); };
car.onmouseenter = () => clearInterval(ct);
car.onmouseleave = play;
go(0); play();

/* ---------- lightbox ---------- */
const lb = $('#lb'), lbi = $('img', lb), lbc = $('.cap', lb), LK = GO.map(g => g[0]);
let li = 0;
const show = i => {
  li = (i + LK.length) % LK.length;
  const k = LK[li];
  lbi.src = IMG[k];
  lbi.alt = lbc.textContent = t(CAP[k]);
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-lb]');
  if (el && !e.target.closest('button,dialog')) { show(LK.indexOf(el.dataset.lb)); lb.showModal(); }
});
$('.p', lb).onclick = () => show(li - 1);
$('.n', lb).onclick = () => show(li + 1);
$('.x', lb).onclick = () => lb.close();
lb.onclick = e => { if (e.target === lb) lb.close(); };
lb.onkeydown = e => {
  const rtl = document.documentElement.dir === 'rtl';
  if (e.key === 'ArrowLeft') show(li + (rtl ? 1 : -1));
  if (e.key === 'ArrowRight') show(li + (rtl ? -1 : 1));
};

/* ---------- booking forms (page + modal) ---------- */
const iso = d => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const fmt = s => new Date(s + 'T12:00').toLocaleDateString(lang === 'ar' ? 'ar-IQ-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function makeForm(host, after) {
  const f = $('#ft').content.firstElementChild.cloneNode(true);
  host.append(f);
  const a = f.a, d = f.d, err = $('.err', f);
  a.min = d.min = iso(new Date());
  a.onchange = () => {
    const n = new Date(a.value + 'T12:00');
    n.setDate(n.getDate() + 1);
    d.min = iso(n);
    if (d.value && d.value < d.min) d.value = '';
  };
  f.onsubmit = e => {
    e.preventDefault();
    err.textContent = '';
    const fail = k => { err.dataset.i = k; err.textContent = t(k); };
    delete err.dataset.i;
    if (!f.n.value.trim()) return fail('err_name');
    if (!a.value || !d.value) return fail('err_dates');
    if (d.value <= a.value) return fail('err_order');
    const nights = Math.round((new Date(d.value) - new Date(a.value)) / 864e5);
    const text = [
      t('m_hi'),
      `- ${t('m_name')}: ${f.n.value.trim()}`,
      `- ${t('m_arr')}: ${fmt(a.value)}`,
      `- ${t('m_dep')}: ${fmt(d.value)}`,
      `- ${t('m_nights')}: ${nights}`,
      `- ${t('m_guests')}: ${f.g.value}`,
      `- ${t('m_room')}: ${t('room_' + f.r.value)}`,
      t('m_end')
    ].join('\n');
    const l = document.createElement('a');
    l.href = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
    l.target = '_blank'; l.rel = 'noopener';
    document.body.append(l); l.click(); l.remove();
    if (after) after();
  };
  return f;
}
const md = $('#md');
makeForm($('#bkf'));
const mf = makeForm($('#mbf'), () => md.close());
$('.x', md).onclick = () => md.close();
md.onclick = e => { if (e.target === md) md.close(); };
$$('[data-book]').forEach(b => b.onclick = () => { if (b.dataset.book) mf.r.value = b.dataset.book; md.showModal(); });

/* ---------- apply language ---------- */
function apply() {
  const d = document.documentElement;
  d.lang = lang; d.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('title');
  $$('[data-i]').forEach(e => e.textContent = t(e.dataset.i));
  $$('[data-i-alt]').forEach(e => e.alt = t(e.dataset.iAlt));
  $$('[data-i-aria]').forEach(e => e.setAttribute('aria-label', t(e.dataset.iAria)));
  $('#lang').textContent = t('lang_to');
  if (lb.open) show(li);
}
$('#lang').onclick = () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  try { localStorage.setItem('lang', lang); } catch (e) {}
  apply();
};
apply();

/* ---------- scroll: navbar, parallax, reveal ---------- */
const nav = $('#nav'), par = $$('[data-par]');
function onScroll() {
  nav.classList.toggle('s', scrollY > 40);
  const h = innerHeight;
  par.forEach(e => {
    const r = e.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > h) return;
    e.style.transform = `translateY(${-(r.top + r.height / 2 - h / 2) * e.dataset.par}px)`;
  });
}
let tick;
addEventListener('scroll', () => { tick || (tick = requestAnimationFrame(() => { tick = 0; onScroll(); })); }, { passive: true });
onScroll();
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
$$('.rv').forEach(e => io.observe(e));
})();
