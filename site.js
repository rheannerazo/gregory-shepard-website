/* Shepard site — motion layer: scroll-reveal, count-up, nav state. No deps. */
(function () {
  function ready(fn){ document.readyState!='loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    function trackEvent(name, details) {
      var payload = Object.assign({ source_page: location.pathname }, details || {});
      if (typeof window.gtag === 'function') window.gtag('event', name, payload);
      else if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: name }, payload));
      window.dispatchEvent(new CustomEvent('gregory:analytics', { detail: { event: name, parameters: payload } }));
    }
    window.gregoryTrackEvent = trackEvent;
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      var href = link.href;
      var details = {
        link_url: href,
        link_text: link.textContent.trim().replace(/\s+/g, ' ').slice(0, 100)
      };
      if (link.matches('.btn,.tlink,.nav-ghost,.nav-connect')) trackEvent('cta_click', details);
      if (/^https?:/i.test(href) && new URL(href).origin !== location.origin) trackEvent('outbound_click', details);
    });

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
      var labelValue = label.toLowerCase();
      var pageValue = page.toLowerCase();
      if (/shop|apparel|merch|music/.test(pageValue) || /drop alert|drop list|shop/.test(labelValue)) return 'Shop / Drop Alerts';
      if (/notify|drop alert|early access/.test(labelValue)) return 'Updates / Newsletter';
      if (/advis|board|director|philanthrop|cause/.test(labelValue)) return 'Advisory / Board';
      if (/speak|speaker|keynote|panel|book greg|booking inquiry/.test(labelValue)) return 'Speaking';
      if (/podcast|show|media|piece|press|author|read|listen|watch/.test(labelValue)) return 'Media / Podcast';
      if (/invest|venture|pitch/.test(labelValue)) return 'Investment / Pitch';
      if (/advisory|about-causes/.test(pageValue)) return 'Advisory / Board';
      if (/venture/.test(pageValue)) return 'Investment / Pitch';
      if (/workshop|lecture|event/.test(pageValue)) return 'Workshop / Event';
      if (/speaking/.test(pageValue)) return 'Speaking';
      if (/author|authority/.test(pageValue)) return 'Media / Podcast';
      if (/workshop|lecture|reserve|seat|event|intensive|cohort/.test(labelValue)) return 'Workshop / Event';
      if (/partner/.test(labelValue)) return 'Partnership';
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
      var sourceField = contactForm.querySelector('[name="source_page"]');
      var subjectField = contactForm.querySelector('[name="_subject"]');
      var nextField = contactForm.querySelector('[name="_next"]');
      var requestedTopic = params.get('topic');
      if (requestedTopic && topicField) {
        var match = Array.prototype.find.call(topicField.options, function (option) { return option.value === requestedTopic; });
        if (match) topicField.value = requestedTopic;
      }
      var sourcePage = params.get('from') || 'contact.html';
      if (sourceField) sourceField.value = sourcePage;
      if (nextField) nextField.value = new URL('thanks.html', location.href).href;
      contactForm.addEventListener('submit', function () {
        var topic = topicField ? topicField.value : 'General Inquiry';
        if (subjectField) subjectField.value = 'Gregory Shepard website inquiry: ' + topic;
        trackEvent('contact_form_submit', { inquiry_topic: topic, source_page: sourcePage });
      });
    }

    // mobile hamburger (injected — no per-page markup needed)
    var navWrap = document.querySelector('.nav .wrap'), navRow1 = document.querySelector('.nav-row1'), menu = document.querySelector('.menu');
    if (navWrap && menu && nav) {
      // desktop mega menu: one panel, every section as a column (injected from the .drop markup)
      var mega = document.createElement('div'); mega.className = 'mega'; mega.id = 'site-mega-menu'; mega.setAttribute('aria-label', 'Explore all sections');
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
      burger.className = 'nav-burger'; burger.setAttribute('aria-label', 'Open menu'); burger.setAttribute('aria-controls', menu.id); burger.setAttribute('aria-expanded', 'false'); burger.innerHTML = '☰';
      (navRow1 || navWrap).appendChild(burger);
      function setOpen(o){
        nav.classList.toggle('menu-open', o);
        burger.setAttribute('aria-expanded', o ? 'true' : 'false');
        burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
        burger.innerHTML = o ? '✕' : '☰';
      }
      burger.addEventListener('click', function(){ setOpen(!nav.classList.contains('menu-open')); });
      menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setOpen(false); }); });
      document.addEventListener('keydown', function(e){
        if (e.key !== 'Escape') return;
        if (nav.classList.contains('menu-open')) {
          setOpen(false);
          burger.focus();
          return;
        }
        if (window.innerWidth > 1040 && (menu.contains(document.activeElement) || mega.contains(document.activeElement))) {
          var brandLink = nav.querySelector('.brand');
          if (brandLink) brandLink.focus();
        }
      });
      document.addEventListener('click', function(e){ if (nav.classList.contains('menu-open') && !nav.contains(e.target)) setOpen(false); });
      window.addEventListener('resize', function(){ if (window.innerWidth > 1040 && nav.classList.contains('menu-open')) setOpen(false); });
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
