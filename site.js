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

    // Route contact CTAs to the form with useful context instead of a generic page top.
    function contactTopic(label, page) {
      var value = (label + ' ' + page).toLowerCase();
      if (/notify|drop alert|early access/.test(value)) return 'Updates / Newsletter';
      if (/workshop|lecture|reserve|seat|event/.test(value)) return 'Workshop / Event';
      if (/book|speak|speaker|availability/.test(value)) return 'Speaking';
      if (/podcast|show|media|piece|press|author|read|listen|watch/.test(value)) return 'Media / Podcast';
      if (/invest|venture|pitch/.test(value)) return 'Investment / Pitch';
      if (/advis|board|philanthrop|cause/.test(value)) return 'Advisory / Board';
      if (/partner/.test(value)) return 'Partnership';
      return 'General Inquiry';
    }
    document.querySelectorAll('a[href="contact.html"]').forEach(function (link) {
      var topic = contactTopic(link.textContent.trim(), location.pathname);
      var source = location.pathname.split('/').pop() || 'index.html';
      link.href = 'contact.html?topic=' + encodeURIComponent(topic) + '&from=' + encodeURIComponent(source) + '#contact-form';
    });

    var contactForm = document.querySelector('[data-contact-form]');
    if (contactForm) {
      var params = new URLSearchParams(location.search);
      var topicField = contactForm.querySelector('[name="topic"]');
      var requestedTopic = params.get('topic');
      if (requestedTopic && topicField) {
        var match = Array.prototype.find.call(topicField.options, function (option) { return option.value === requestedTopic; });
        if (match) topicField.value = requestedTopic;
      }
      contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!contactForm.reportValidity()) return;
        var data = new FormData(contactForm);
        var topic = data.get('topic') || 'General Inquiry';
        var sourcePage = params.get('from') || 'contact.html';
        var subject = 'Gregory Shepard website inquiry: ' + topic;
        var body = [
          'Name: ' + data.get('name'),
          'Email: ' + data.get('email'),
          'Topic: ' + topic,
          'Source page: ' + sourcePage,
          '',
          data.get('message')
        ].join('\n');
        var status = contactForm.querySelector('[data-form-status]');
        if (status) status.innerHTML = 'Opening your email app now. If it does not open, email <a href="mailto:contact@gregoryshepard.com">contact@gregoryshepard.com</a>.';
        location.href = 'mailto:contact@gregoryshepard.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      });
    }

    // mobile hamburger (injected — no per-page markup needed)
    var navWrap = document.querySelector('.nav .wrap'), navRow1 = document.querySelector('.nav-row1'), menu = document.querySelector('.menu');
    if (navWrap && menu && nav) {
      // desktop mega menu: one panel, every section as a column (injected from the .drop markup)
      var mega = document.createElement('div'); mega.className = 'mega';
      var megaIn = document.createElement('div'); megaIn.className = 'mega-in';
      menu.querySelectorAll('.ni').forEach(function (ni) {
        var top = ni.querySelector('.top'), drop = ni.querySelector('.drop');
        if (!top || !drop) return;
        var col = document.createElement('div'); col.className = 'mcol';
        var head = document.createElement('a'); head.className = 'mhead';
        head.href = top.getAttribute('href');
        head.textContent = (top.firstChild && top.firstChild.nodeValue || top.textContent).replace('▾', '').trim();
        if (top.classList.contains('active')) head.classList.add('active');
        col.appendChild(head);
        drop.querySelectorAll('a').forEach(function (a) {
          if (a.getAttribute('href') === top.getAttribute('href')) return; // hub link lives in the column head
          col.appendChild(a.cloneNode(true));
        });
        megaIn.appendChild(col);
      });
      mega.appendChild(megaIn);
      navWrap.appendChild(mega);
      var burger = document.createElement('button');
      menu.id = menu.id || 'primary-navigation';
      burger.className = 'nav-burger'; burger.setAttribute('aria-label', 'Toggle menu'); burger.setAttribute('aria-controls', menu.id); burger.setAttribute('aria-expanded', 'false'); burger.innerHTML = '☰';
      (navRow1 || navWrap).appendChild(burger);
      function setOpen(o){ nav.classList.toggle('menu-open', o); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); burger.innerHTML = o ? '✕' : '☰'; }
      burger.addEventListener('click', function(){ setOpen(!nav.classList.contains('menu-open')); });
      menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setOpen(false); }); });
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && nav.classList.contains('menu-open')) { setOpen(false); burger.focus(); } });
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
