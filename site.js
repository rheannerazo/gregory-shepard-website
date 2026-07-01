/* Shepard site — motion layer: scroll-reveal, count-up, nav state. No deps. */
(function () {
  function ready(fn){ document.readyState!='loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var sel = '.sec-head, .sec-title, .card, .quote, .cred, .book-stage, .collage > *, .blueprint, .video, .chcard, .topiclist div, .thumbs > div, .tile, .marquee .wrap > *, .framework .wrap > *, .darksplit .top > *, .form, .hero-copy > *, .press .logo, .press .lbl';
    var els = Array.prototype.slice.call(document.querySelectorAll(sel));
    els.forEach(function (el, i) { el.classList.add('reveal'); el.style.transitionDelay = ((i % 6) * 55) + 'ms'; });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
      els.forEach(function (el) { io.observe(el); });
    } else { els.forEach(function (el) { el.classList.add('in'); }); }

    var nav = document.querySelector('.nav');
    function onScroll(){ if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    // mobile hamburger (injected — no per-page markup needed)
    var navWrap = document.querySelector('.nav .wrap'), menu = document.querySelector('.menu');
    if (navWrap && menu && nav) {
      var burger = document.createElement('button');
      burger.className = 'nav-burger'; burger.setAttribute('aria-label', 'Toggle menu'); burger.innerHTML = '☰';
      navWrap.appendChild(burger);
      function setOpen(o){ nav.classList.toggle('menu-open', o); burger.innerHTML = o ? '✕' : '☰'; }
      burger.addEventListener('click', function(){ setOpen(!nav.classList.contains('menu-open')); });
      menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setOpen(false); }); });
    }

    function countup(el) {
      var raw = el.textContent.trim();
      var m = raw.match(/^([^\d]*)([\d,\.]+)(.*)$/);
      if (!m) return;
      var pre = m[1], numStr = m[2].replace(/,/g, ''), suf = m[3];
      var target = parseFloat(numStr); if (isNaN(target)) return;
      var dec = (numStr.split('.')[1] || '').length, dur = 1200, t0 = null;
      function fmt(n){ var s = n.toFixed(dec); if (target >= 1000) s = Number(s).toLocaleString('en-US'); return pre + s + suf; }
      function step(ts){ if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(target * e); if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target); }
      el.textContent = fmt(0); requestAnimationFrame(step);
    }
    var nums = Array.prototype.slice.call(document.querySelectorAll('.stat b, .cred b')).filter(function (el) { return /\d/.test(el.textContent); });
    if ('IntersectionObserver' in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { countup(e.target); io2.unobserve(e.target); } });
      }, { threshold: 0.6 });
      nums.forEach(function (el) { io2.observe(el); });
    }
  });
})();
