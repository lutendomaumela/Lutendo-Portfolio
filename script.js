// ===== BOOT SEQUENCE =====
function initBoot(){
  const boot = document.getElementById('boot');
  if(!boot) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      boot.classList.add('hide');
      setTimeout(() => boot.style.display = 'none', 400);
    }, 1100);
  });
  // fallback in case load already fired
  setTimeout(() => {
    if(boot.style.display !== 'none'){
      boot.classList.add('hide');
      setTimeout(() => boot.style.display = 'none', 400);
    }
  }, 2500);
}

// ===== MOBILE MENU =====
function initMenu(){
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('navLinks');
  if(!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ===== HEADER ON SCROLL =====
function initHeaderScroll(){
  const header = document.getElementById('siteHeader');
  if(!header) return;
  const onScroll = () => {
    header.style.borderBottomColor = window.scrollY > 40 ? 'var(--signal)' : 'var(--line)';
  };
  window.addEventListener('scroll', onScroll, { passive:true });
}

// ===== SCROLL REVEAL =====
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold:0.15, rootMargin:'40px' });
  items.forEach(i => obs.observe(i));
}

// ===== SKILL BARS =====
function initSkillBars(){
  const fills = document.querySelectorAll('.fill');
  if(!fills.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const target = e.target.getAttribute('data-level') || '0';
        e.target.style.width = target + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold:0.4 });
  fills.forEach(f => obs.observe(f));
}

// ===== HERO PIPELINE ANIMATION =====
function initPipeline(){
  const stages = document.querySelectorAll('#pipelineStages .stage');
  const log = document.getElementById('pipelineLog');
  if(!stages.length || !log) return;

  const messages = [
    '$ workflow triggered on push',
    '→ build: flask + next.js ... ok',
    '→ test: pytest / lint ... passed',
    '→ containerize: docker build → ECR ... ok',
    '→ provision: terraform apply → AWS ... ok',
    '→ deploy: EC2 / RDS / S3 ... live'
  ];

  let i = -1;
  let started = false;

  function pushLog(text, isPass){
    const line = document.createElement('div');
    line.className = 'log-line' + (isPass ? ' pass' : '');
    line.textContent = text;
    log.appendChild(line);
    if(log.children.length > 3) log.removeChild(log.firstChild);
  }

  function step(){
    if(i >= 0 && stages[i]){
      stages[i].classList.remove('active');
      stages[i].classList.add('done');
    }
    i++;
    if(i >= stages.length){
      setTimeout(() => {
        stages.forEach(s => s.classList.remove('done','active'));
        log.innerHTML = '';
        i = -1;
        pushLog(messages[0]);
        setTimeout(step, 1400);
      }, 2200);
      return;
    }
    stages[i].classList.add('active');
    pushLog(messages[i+1] || messages[0], i === stages.length - 1);
    setTimeout(step, 1500);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting && !started){
        started = true;
        pushLog(messages[0]);
        setTimeout(step, 900);
      }
    });
  }, { threshold:0.3 });
  obs.observe(document.querySelector('.pipeline-card'));
}

// ===== SMOOTH SCROLL OFFSET (account for fixed header) =====
function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if(id.length < 2) return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      const headerH = document.querySelector('header').offsetHeight;
      window.scrollTo({
        top: target.offsetTop - headerH + 1,
        behavior: 'smooth'
      });
    });
  });
}

// ===== INIT =====
function initAll(){
  initBoot();
  initMenu();
  initHeaderScroll();
  initReveal();
  initSkillBars();
  initPipeline();
  initSmoothScroll();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}