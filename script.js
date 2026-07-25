const body = document.body;
  const toggleBtn = document.getElementById('themeToggle');
  const knobIcon = document.getElementById('knobIcon');

  function applyTheme(theme){
    body.setAttribute('data-theme', theme);
    knobIcon.textContent = theme === 'dark' ? '☾' : '☀';
    localStorage.setItem('portfolio-theme', theme);
  }
  const saved = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  toggleBtn.addEventListener('click', () => {
    applyTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // Scroll-reveal
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .timeline');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Scroll progress
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docHeight > 0 ? (scrollTop/docHeight)*100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  // Mouse spotlight (hero area only, cheap)
  document.addEventListener('mousemove', (e) => {
    document.getElementById('spotlight').style.setProperty('--mx', e.clientX + 'px');
    document.getElementById('spotlight').style.setProperty('--my', e.clientY + 'px');
  }, { passive:true });

  // Typed role text
  const roles = ["Computer Science Engineering Student", "Aspiring SDE", "DSA & Java Enthusiast", "Building things on GitHub"];
  const typedEl = document.getElementById('typedRole');
  let ri = 0, ci = 0, deleting = false;
  function typeLoop(){
    const current = roles[ri];
    if (!deleting){
      ci++;
      typedEl.textContent = current.slice(0, ci);
      if (ci === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
    } else {
      ci--;
      typedEl.textContent = current.slice(0, ci);
      if (ci === 0){ deleting = false; ri = (ri+1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 35 : 55);
  }
  typeLoop();

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1100;
      const start = performance.now();
      function step(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterIO.observe(c));

  // Animated skill bars
  const bars = document.querySelectorAll('.bar-fill');
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.width = entry.target.getAttribute('data-fill') + '%';
        barIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barIO.observe(b));

  // Tilt effect on project cards
  document.querySelectorAll('.project.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-2px)`;
      card.style.boxShadow = `${x*10+7}px ${y*10+7}px 0 var(--fg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
      card.style.boxShadow = 'none';
    });
  });
