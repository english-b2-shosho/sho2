/* Sho2 v2 — رحلة ٣٠ يوم: مواقف متعددة المراحل باختيارات بتفتح أحداث */
"use strict";
const $app = document.getElementById("app");
const LS = "sho2j_v2";
function load(){ try{ return JSON.parse(localStorage.getItem(LS)) || {done:{}}; }catch(e){ return {done:{}}; } }
function save(s){ try{ localStorage.setItem(LS, JSON.stringify(s)); }catch(e){} }
let store = load();
const doneCount = () => Object.keys(store.done).length;
const catDays = id => DAYS.filter(d => d.cat === id);
const catDone = id => catDays(id).filter(d => store.done[d.day] !== undefined).length;

function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
function videoBox(src, label){
  return '<video controls playsinline preload="metadata" style="width:100%;border-radius:14px;display:block" aria-label="' + esc(label) + '">' +
    '<source src="' + src + '" type="video/mp4"></video>' +
    '<p class="muted" style="margin:6px 0 0">' + esc(label) + '</p>';
}

function home(){
  const done = doneCount();
  const pct = Math.round(done / DAYS.length * 100);
  const nextDay = DAYS.find(d => store.done[d.day] === undefined);
  let h = '<div class="hero">' +
    '<h1>Sho2 🌸</h1>' +
    '<div class="tagline">رحلة ٣٠ يوم: مواقف من الحياة... تختاري ردّك وتشوفي ممكن يوصلك لفين</div>' +
  '</div>' +
  '<div class="card"><h2>اتفرّجي الأول 👇</h2>' + videoBox("videos/v01-welcome.mp4", "فيديو تعريفي بـ Sho2") + '</div>' +
  '<div class="card"><div class="progress-wrap">' +
    '<div class="progress-label"><span>رحلتك</span><span>' + done + ' من ' + DAYS.length + ' يوم</span></div>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
  '</div></div>';
  if(nextDay){
    h += '<a class="card cat-card" href="#/day/' + nextDay.day + '">' +
      '<div class="cat-head"><div class="cat-emoji">' + nextDay.emoji + '</div>' +
      '<div class="cat-meta"><h3>يوم ' + nextDay.day + ': ' + esc(nextDay.title) + '</h3>' +
      '<p class="muted">' + (done ? 'كمّلي رحلتك من حيث وقفتي' : 'أول يوم في رحلتك، يلا نبدأ') + '</p></div>' +
      '<span class="chev">‹</span></div></a>';
  } else {
    h += '<div class="card"><h3>خلّصتي الـ ٣٠ يوم كلهم 🎉</h3><p class="muted">تقدري ترجعي لأي يوم وتجرّبي طريق مختلف.</p></div>';
  }
  h += '<div id="cats"></div>' +
  '<div class="warn-card">' +
    '<h3>مهم تعرفيه 🌱</h3>' +
    '<p>النتائج اللي هنا احتمالات مش وعود، لأن كل موقف وناسه مختلفين. والمواقف دي تدريب على الكلام اليومي، مش نصيحة شخصية لحالتك إنتي بالذات.</p>' +
    '<p style="margin-top:8px">ولو اللي بتعيشيه فيه أذى أو عنف أو تهديد، ده أكبر من أي رد في محادثة. كلامك مع حد تثقّي فيه أو جهة دعم متخصصة هو الخطوة الصح.</p>' +
  '</div>' +
  '<div class="card">' +
    '<h2>ثبّتي التطبيق على موبايلك 📲</h2>' +
    '<div class="install-steps">' +
      '<p><strong>أندرويد (Chrome):</strong></p>' +
      '<ul><li>افتحي الرابط في Chrome</li><li>اضغطي على النقاط التلاتة فوق</li><li>اختاري «إضافة إلى الشاشة الرئيسية»</li></ul>' +
      '<p style="margin-top:8px"><strong>آيفون (Safari):</strong></p>' +
      '<ul><li>افتحي الرابط في Safari</li><li>اضغطي زرار المشاركة</li><li>اختاري «Add to Home Screen»</li></ul>' +
    '</div>' +
  '</div>' +
  '<div class="footer">Sho2 🌸 خطوة خطوة<br>المحتوى للتدريب العام، ومش بديل عن دعم متخصص</div>';
  $app.innerHTML = h;
  const cats = document.getElementById("cats");
  CATS.forEach(c => {
    const n = catDays(c.id).length, dn = catDone(c.id);
    const el = document.createElement("a");
    el.className = "card cat-card";
    el.href = "#/cat/" + c.id;
    el.innerHTML = '<div class="cat-head">' +
      '<div class="cat-emoji">' + c.emoji + '</div>' +
      '<div class="cat-meta"><h3>' + c.name + '</h3>' +
      '<p class="muted">' + c.desc + '</p>' +
      (dn === n ? '<span class="badge-done">خلّصتيها كلها 🎉</span>' : '<span class="badge-new">' + dn + ' من ' + n + ' أيام</span>') +
      '</div><span class="chev">‹</span></div>';
    cats.appendChild(el);
  });
}

function catPage(id){
  const c = CATS.find(x => x.id === id);
  if(!c){ location.hash = "#/"; return; }
  let h = '<a class="back" href="#/">› الرئيسية</a>' +
    '<div class="hero"><h1>' + c.emoji + ' ' + c.name + '</h1><div class="tagline">' + c.desc + '</div></div>';
  if(c.video) h += '<div class="card">' + videoBox(c.video.src, c.video.label) + '</div>';
  catDays(id).forEach(d => {
    const doneMark = store.done[d.day] !== undefined ? ' <span class="badge-done">اتعمل ✓</span>' : '';
    h += '<a class="card cat-card" href="#/day/' + d.day + '"><div class="cat-head">' +
      '<div class="cat-emoji">' + d.emoji + '</div>' +
      '<div class="cat-meta"><h3>يوم ' + d.day + ': ' + esc(d.title) + '</h3>' +
      '<p class="muted">' + esc(d.hint) + '</p>' + doneMark +
      '</div><span class="chev">‹</span></div></a>';
  });
  $app.innerHTML = h;
}

function dayPage(n){
  const d = DAYS.find(x => x.day === n);
  if(!d){ location.hash = "#/"; return; }
  let h = '<a class="back" href="#/cat/' + d.cat + '">› ' + CATS.find(c=>c.id===d.cat).name + '</a>' +
    '<div class="hero"><h1>' + d.emoji + ' يوم ' + d.day + ': ' + esc(d.title) + '</h1></div>' +
    '<div class="card story-card"><p>' + esc(d.intro) + '</p></div>' +
    '<div id="stage"></div>';
  $app.innerHTML = h;
  showNode(d, "s1");
}

function showNode(d, key){
  const node = d.nodes[key];
  const st = document.getElementById("stage");
  if(!node) return;
  let h = '<div class="card stage-card"><h3>' + esc(node.x) + '</h3><div class="choices">';
  node.c.forEach((ch, i) => { h += '<button class="choice-btn" data-i="' + i + '">' + esc(ch.t) + '</button>'; });
  h += '</div></div>';
  st.innerHTML = h;
  st.scrollIntoView({behavior:"smooth", block:"start"});
  st.querySelectorAll(".choice-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const ch = node.c[Number(btn.dataset.i)];
      showReaction(d, ch);
    });
  });
}

function showReaction(d, ch){
  const st = document.getElementById("stage");
  let h = '<div class="card reaction-card"><p>' + esc(ch.r) + '</p>';
  h += '<button class="choice-btn primary" id="go-next">' + (ch.go ? 'كمّلي، اللي حصل بعد كده 👇' : 'شوفي النهاية دي 👇') + '</button></div>';
  st.innerHTML = h;
  st.scrollIntoView({behavior:"smooth", block:"start"});
  document.getElementById("go-next").addEventListener("click", () => {
    if(ch.go) showNode(d, ch.go);
    else showEnding(d, ch.e);
  });
}

function showEnding(d, ei){
  const e = d.ends[ei];
  const st = document.getElementById("stage");
  store.done[d.day] = ei; save(store);
  const next = DAYS.find(x => x.day === d.day + 1);
  let h = '<div class="card outcome-card"><h3>نتيجة محتملة 🌱</h3><p>' + esc(e.o) + '</p></div>' +
    '<div class="card takeaway-card"><h3>الخلاصة</h3><p>' + esc(e.k) + '</p></div>' +
    '<div class="end-actions">' +
    '<a class="choice-btn" href="#/day/' + d.day + '">جرّبي طريق تاني 🔁</a>' +
    (next ? '<a class="choice-btn primary" href="#/day/' + next.day + '">يوم ' + next.day + ': ' + esc(next.title) + ' ‹</a>' : '') +
    '<a class="choice-btn" href="#/">الرئيسية 🏠</a></div>';
  st.innerHTML = h;
  st.scrollIntoView({behavior:"smooth", block:"start"});
}

function route(){
  const h = location.hash || "#/";
  window.scrollTo(0,0);
  if(h.startsWith("#/cat/")) return catPage(h.slice(6));
  if(h.startsWith("#/day/")) return dayPage(Number(h.slice(6)));
  return home();
}
window.addEventListener("hashchange", route);
route();

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
