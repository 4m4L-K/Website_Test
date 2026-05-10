/* ============================================================
   MESSI — The Eternal King  |  script.js
   Shared across all pages
   ============================================================ */

'use strict';

/* ── CURSOR ──────────────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('lux-cursor');
  const ring   = document.getElementById('lux-cursor-ring');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = Math.round(rx) + 'px';
    ring.style.top  = Math.round(ry) + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, .stat-pillar, .nav-card, .club-card, .award-cell, .impact-card, .t-card, .q-option, .quiz-btn, .f-submit, .record-row';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ── PRELOADER (home page only) ──────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar       = document.getElementById('pre-bar');
  if (!preloader || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      bar.style.width = '100%';
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          startStatCounters();
        }, 1200);
      }, 600);
    }
    bar.style.width = Math.min(progress, 96) + '%';
  }, 80);
})();

/* ── STAT COUNTERS (home page only) ──────────────────────────── */
function startStatCounters() {
  document.querySelectorAll('.pillar-val[data-target], .stat-val[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current  = 0;
    const step   = Math.max(1, Math.ceil(target / 50));
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 28);
  });
}

/* If preloader is absent (inner pages), fire counters immediately */
if (!document.getElementById('preloader')) {
  startStatCounters();
}

/* ── NAV: scroll shrink & active state ───────────────────────── */
(function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile toggle
  const toggle    = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }
})();

/* ── INTERSECTION OBSERVER — reveal & section titles ──────────── */
(function initObservers() {
  // General reveals
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .t-node').forEach(el => revealObs.observe(el));

  // Section title fill animation
  const titleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const h2 = e.target.querySelector('.section-title');
        if (h2) h2.classList.add('revealed');
        titleObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section-header').forEach(el => titleObs.observe(el));
})();

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id     = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── QUIZ (fan zone only) ────────────────────────────────────── */
(function initQuiz() {
  const questionEl  = document.getElementById('quiz-question');
  if (!questionEl) return;

  const questions = [
    { q: "In what year did Messi make his competitive debut for FC Barcelona?",
      opts: ["2003","2004","2005","2006"], ans: 1 },
    { q: "How many Ballon d'Or awards has Messi won as of 2024?",
      opts: ["6","7","8","10"], ans: 2 },
    { q: "What world record did Messi break in 2012?",
      opts: ["Most assists in a year","Most goals in a calendar year","Most hat-tricks in La Liga","Most trophies won"], ans: 1 },
    { q: "Which city is Messi's hometown in Argentina?",
      opts: ["Buenos Aires","Córdoba","Rosario","Mendoza"], ans: 2 },
    { q: "Messi scored the winning penalty in which World Cup final?",
      opts: ["2014","2018","2022","2026"], ans: 2 },
    { q: "How many La Liga titles did Messi win with Barcelona?",
      opts: ["8","9","10","11"], ans: 2 },
    { q: "At what age did Messi join FC Barcelona's La Masia academy?",
      opts: ["10","11","12","13"], ans: 3 },
    { q: "How many goals did Messi score in the 2011–12 La Liga season (a record)?",
      opts: ["46","48","50","52"], ans: 2 },
    { q: "Which club did Messi join after leaving PSG in 2023?",
      opts: ["Inter Milan","Manchester City","Inter Miami","Al Hilal"], ans: 2 },
    { q: "Messi surpassed which legend to become Argentina's all-time top scorer?",
      opts: ["Diego Maradona","Gabriel Batistuta","Hernán Crespo","Mario Kempes"], ans: 1 },
  ];

  let qIdx = 0, score = 0, answered = false;
  const keys = ['A','B','C','D'];

  const feedbackEl  = document.getElementById('quiz-feedback');
  const optionsEl   = document.getElementById('quiz-options');
  const scoreEl     = document.getElementById('quiz-score');
  const nextBtn     = document.getElementById('quiz-next');
  const restartBtn  = document.getElementById('quiz-restart');
  const progressFill = document.getElementById('quiz-progress-fill');

  function updateProgress() {
    if (!progressFill) return;
    progressFill.style.width = ((qIdx / questions.length) * 100) + '%';
  }

  function updateScore() {
    if (scoreEl) scoreEl.textContent = `${score} / ${qIdx}`;
  }

  function loadQuestion() {
    answered = false;
    if (feedbackEl) { feedbackEl.className = ''; feedbackEl.style.display = 'none'; }
    if (nextBtn)    nextBtn.querySelector('span').textContent = 'Next Question →';

    const q = questions[qIdx];
    questionEl.textContent = q.q;

    optionsEl.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'q-option';
      btn.innerHTML = `<span class="q-key">${keys[i]}</span><span class="q-text">${opt}</span>`;
      btn.addEventListener('click', () => handleAnswer(i, btn));
      optionsEl.appendChild(btn);
    });

    updateScore();
    updateProgress();
  }

  function handleAnswer(i, btn) {
    if (answered) return;
    answered = true;

    const q = questions[qIdx];
    const allBtns = optionsEl.querySelectorAll('.q-option');
    allBtns[q.ans].classList.add('correct');

    if (i === q.ans) {
      score++;
      if (feedbackEl) {
        feedbackEl.textContent = '✓ Correct — Exquisite knowledge of the legend.';
        feedbackEl.className = 'correct';
        feedbackEl.style.display = 'block';
      }
    } else {
      btn.classList.add('wrong');
      if (feedbackEl) {
        feedbackEl.textContent = '✗ Incorrect — The correct answer is highlighted above.';
        feedbackEl.className = 'wrong';
        feedbackEl.style.display = 'block';
      }
    }

    updateScore();
    if (qIdx === questions.length - 1) {
      if (nextBtn) nextBtn.querySelector('span').textContent = 'View Results';
      if (restartBtn) restartBtn.style.display = 'inline-flex';
    }
  }

  function showResults() {
    const total = questions.length;
    const pct   = Math.round(score / total * 100);
    let rank    = 'Enthusiast';
    if (pct >= 90) rank = 'GOAT Analyst — Unmatchable';
    else if (pct >= 70) rank = 'Elite Fan — Exceptional';
    else if (pct >= 50) rank = 'True Devotee — Well Known';

    questionEl.textContent  = `Final Score: ${score} / ${total} (${pct}%) — Rank: ${rank}`;
    optionsEl.innerHTML     = '';
    if (feedbackEl)  feedbackEl.style.display = 'none';
    if (nextBtn)     nextBtn.style.display    = 'none';
    if (progressFill) progressFill.style.width = '100%';
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!answered && qIdx < questions.length) return;
      qIdx++;
      if (qIdx < questions.length) loadQuestion();
      else showResults();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      qIdx = 0; score = 0; answered = false;
      if (nextBtn)    { nextBtn.style.display = 'inline-flex'; }
      if (restartBtn) { restartBtn.style.display = 'none'; }
      loadQuestion();
    });
  }

  loadQuestion();
})();

/* ── CONTACT FORM ────────────────────────────────────────────── */
function handleContact() {
  const name    = (document.getElementById('c-name')    || {}).value || '';
  const email   = (document.getElementById('c-email')   || {}).value || '';
  const msg     = (document.getElementById('c-msg')     || {}).value || '';

  const errorEl = document.getElementById('form-error');

  if (!name.trim() || !email.trim() || !msg.trim()) {
    if (errorEl) {
      errorEl.querySelector('p').textContent = 'Please fill in all required fields before sending.';
      errorEl.style.display = 'block';
    }
    return;
  }

  if (errorEl) { errorEl.style.display = 'none'; errorEl.querySelector('p').textContent = ''; }

  const successEl = document.getElementById('form-success');
  if (successEl) {
    successEl.style.display = 'block';
    setTimeout(() => {
      ['c-name','c-email','c-subject','c-msg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }, 800);
  }
}

/* ── TRIBUTE FORM (fan zone) ─────────────────────────────────── */
function handleTribute() {
  const name    = (document.getElementById('t-name')    || {}).value || '';
  const email   = (document.getElementById('t-email')   || {}).value || '';
  const moment  = (document.getElementById('t-moment')  || {}).value || '';
  const goal    = (document.getElementById('t-goal')    || {}).value || '';
  const admire  = (document.getElementById('t-admire')  || {}).value || '';
  const rating  = (document.getElementById('t-rating')  || {}).value || '';

  const errorEl   = document.getElementById('tribute-error');
  const successEl = document.getElementById('tribute-success');

  function showError(msg) {
    if (errorEl) {
      errorEl.querySelector('p').textContent = msg;
      errorEl.style.display = 'block';
    }
    if (successEl) successEl.style.display = 'none';
  }

  function clearError() {
    if (errorEl) { errorEl.style.display = 'none'; errorEl.querySelector('p').textContent = ''; }
  }

  if (!name.trim() || !email.trim() || !moment.trim() || !goal.trim() || !admire.trim() || !rating) {
    showError('Please fill in all required fields before submitting your tribute.'); return;
  }
  if (!/^[A-Za-z\s\-']{2,50}$/.test(name.trim())) {
    showError('Please enter a valid name (letters only, 2–50 characters).'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    showError('Please enter a valid email address.'); return;
  }
  if (moment.trim().length < 5) {
    showError('Please describe your favourite Messi moment (at least 5 characters).'); return;
  }
  if (goal.trim().length < 5) {
    showError('Please describe your favourite Messi goal (at least 5 characters).'); return;
  }
  if (admire.trim().length < 10) {
    showError('Please share why you admire him (at least 10 characters).'); return;
  }

  clearError();
  if (successEl) successEl.style.display = 'block';
  setTimeout(() => {
    ['t-name','t-email','t-moment','t-goal','t-admire','t-rating'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = el.tagName === 'SELECT' ? '' : '';
    });
  }, 800);
}
