const THEME_KEY = 'cv-theme';
const ACCENT_KEY = 'cv-accent';
const ACHIEVEMENTS_KEY = 'cv-achievements';

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

// Toast notifications
const toastEl = document.getElementById('toast');
let toastTimer = 0;

const showToast = (message) => {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastEl.classList.add('is-visible');

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastEl.classList.remove('is-visible');
    window.setTimeout(() => {
      toastEl.hidden = true;
    }, 300);
  }, 2400);
};

// Achievements
const ACHIEVEMENT_DEFS = [
  {
    id: 'theme',
    icon: '🌗',
    title: 'Theme switcher',
    desc: 'Смени светлую или тёмную тему',
  },
  {
    id: 'accent',
    icon: '🎨',
    title: 'Color stylist',
    desc: 'Выбери accent-цвет сайта',
  },
  {
    id: 'facts',
    icon: '🃏',
    title: 'Fact hunter',
    desc: 'Открой все flip-карточки',
  },
  {
    id: 'quiz',
    icon: '🏆',
    title: 'CV expert',
    desc: 'Ответь на все 5 вопросов викторины',
  },
  {
    id: 'email',
    icon: '📋',
    title: 'Copy master',
    desc: 'Скопируй email в буфер',
  },
  {
    id: 'explorer',
    icon: '🧭',
    title: 'Site explorer',
    desc: 'Посети все секции CV',
  },
];

const loadAchievements = () => {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

let achievementsState = loadAchievements();
const achievementsList = document.getElementById('achievements-list');
const achievementsProgress = document.getElementById('achievements-progress');
const visitedSections = new Set();

const renderAchievements = () => {
  if (!achievementsList) return;

  achievementsList.innerHTML = '';
  ACHIEVEMENT_DEFS.forEach((item) => {
    const unlocked = Boolean(achievementsState[item.id]);
    const li = document.createElement('li');
    li.className = `achievement ${unlocked ? 'is-unlocked' : 'is-locked'}`;
    li.dataset.id = item.id;
    li.innerHTML = `
      <span class="achievement__icon" aria-hidden="true">${item.icon}</span>
      <span class="achievement__title">${item.title}</span>
      <span class="achievement__desc">${item.desc}</span>
    `;
    achievementsList.appendChild(li);
  });

  const unlockedCount = ACHIEVEMENT_DEFS.filter((item) => achievementsState[item.id]).length;
  if (achievementsProgress) {
    achievementsProgress.textContent = `${unlockedCount} / ${ACHIEVEMENT_DEFS.length} unlocked`;
  }
};

const unlockAchievement = (id, message) => {
  if (achievementsState[id]) return;
  achievementsState[id] = true;
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievementsState));

  const badge = achievementsList?.querySelector(`[data-id="${id}"]`);
  if (badge) {
    badge.classList.remove('is-locked');
    badge.classList.add('is-unlocked', 'is-unlocked-new');
    window.setTimeout(() => badge.classList.remove('is-unlocked-new'), 600);
  }

  renderAchievements();
  showToast(message ?? `Achievement unlocked: ${id}`);

  const allDone = ACHIEVEMENT_DEFS.every((item) => achievementsState[item.id]);
  if (allDone) {
    window.setTimeout(() => showToast('All badges unlocked — you explored everything!'), 2600);
  }
};

renderAchievements();

// Theme persistence
const getInitialTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
};

const themeToggle = document.getElementById('theme-toggle');
applyTheme(getInitialTheme());

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme;
  applyTheme(current === 'dark' ? 'light' : 'dark');
  unlockAchievement('theme', 'Theme switched — badge unlocked!');
});

// Accent color picker
const ACCENTS = {
  blue: {
    accent: '#4f6ef7',
    'accent-soft': 'rgba(79, 110, 247, 0.16)',
    'accent-glow': 'rgba(79, 110, 247, 0.45)',
    'blob-1': 'rgba(79, 110, 247, 0.55)',
    'blob-2': 'rgba(168, 120, 255, 0.45)',
    'blob-3': 'rgba(56, 189, 198, 0.4)',
    'blob-4': 'rgba(255, 183, 120, 0.35)',
  },
  violet: {
    accent: '#8b5cf6',
    'accent-soft': 'rgba(139, 92, 246, 0.16)',
    'accent-glow': 'rgba(139, 92, 246, 0.45)',
    'blob-1': 'rgba(139, 92, 246, 0.55)',
    'blob-2': 'rgba(196, 120, 255, 0.45)',
    'blob-3': 'rgba(99, 102, 241, 0.4)',
    'blob-4': 'rgba(232, 121, 249, 0.35)',
  },
  teal: {
    accent: '#14b8a6',
    'accent-soft': 'rgba(20, 184, 166, 0.16)',
    'accent-glow': 'rgba(20, 184, 166, 0.45)',
    'blob-1': 'rgba(20, 184, 166, 0.55)',
    'blob-2': 'rgba(56, 189, 198, 0.45)',
    'blob-3': 'rgba(45, 212, 191, 0.4)',
    'blob-4': 'rgba(110, 231, 183, 0.35)',
  },
  coral: {
    accent: '#f97316',
    'accent-soft': 'rgba(249, 115, 22, 0.16)',
    'accent-glow': 'rgba(249, 115, 22, 0.45)',
    'blob-1': 'rgba(249, 115, 22, 0.55)',
    'blob-2': 'rgba(251, 146, 60, 0.45)',
    'blob-3': 'rgba(244, 114, 182, 0.35)',
    'blob-4': 'rgba(253, 186, 116, 0.4)',
  },
};

const accentSwatches = document.querySelectorAll('.accent-picker__swatch');

const applyAccent = (name) => {
  const palette = ACCENTS[name];
  if (!palette) return;

  Object.entries(palette).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });
  localStorage.setItem(ACCENT_KEY, name);

  accentSwatches.forEach((swatch) => {
    const active = swatch.dataset.accent === name;
    swatch.classList.toggle('is-active', active);
    swatch.setAttribute('aria-pressed', String(active));
  });
};

const savedAccent = localStorage.getItem(ACCENT_KEY) ?? 'blue';
applyAccent(savedAccent in ACCENTS ? savedAccent : 'blue');

accentSwatches.forEach((swatch) => {
  swatch.addEventListener('click', () => {
    const name = swatch.dataset.accent;
    if (!name) return;
    applyAccent(name);
    unlockAchievement('accent', 'Accent color updated!');
    showToast(`Accent: ${name}`);
  });
});

// Copy email
const copyEmailBtn = document.getElementById('copy-email');

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.left = '-9999px';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
};

copyEmailBtn?.addEventListener('click', async () => {
  const email = copyEmailBtn.dataset.email;
  if (!email) return;

  try {
    await copyText(email);
    showToast('Email copied to clipboard!');
    unlockAchievement('email', 'Email copied — badge unlocked!');
  } catch {
    showToast('Could not copy — try manually');
  }
});

// Typing effect
const TYPED_PHRASES = [
  'личной жизни',
  'учебе',
  'олимпиадах',
  'спорте',
  'прогулках с друзьями',
];

const typedEl = document.getElementById('typed-text');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeTick = () => {
  if (!typedEl) return;

  const current = TYPED_PHRASES[phraseIndex];
  const displayed = isDeleting
    ? current.slice(0, charIndex - 1)
    : current.slice(0, charIndex + 1);

  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
  typedEl.textContent = displayed;

  let delay = isDeleting ? 45 : 85;

  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % TYPED_PHRASES.length;
    delay = 400;
  }

  window.setTimeout(typeTick, delay);
};

if (typedEl && !prefersReducedMotion) {
  typeTick();
} else if (typedEl) {
  typedEl.textContent = TYPED_PHRASES[0];
}

// Scroll progress bar
const progressBar = document.getElementById('progress-bar');

const updateProgress = () => {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Reveal on scroll + skill animations
const revealEls = document.querySelectorAll('.reveal');
const skillCards = document.querySelectorAll('.skill-card[data-level]');
const skillRows = document.querySelectorAll('.skill-row[data-level]');

const animateSkills = () => {
  skillCards.forEach((item) => {
    const level = item.getAttribute('data-level') ?? '0';
    const meter = item.querySelector('.skill-card__meter');
    if (meter) meter.style.setProperty('--level', level);
    item.classList.add('is-visible');
  });

  skillRows.forEach((item) => {
    const level = item.getAttribute('data-level') ?? '0';
    item.style.setProperty('--level', level);
    item.classList.add('is-visible');
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');

      if (entry.target.id === 'skills') {
        animateSkills();
      }

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
);

revealEls.forEach((el) => revealObserver.observe(el));

// Scroll-spy: active nav + sliding indicator + "You are here" pill
const navLinks = document.querySelectorAll('.nav__links a');
const navIndicator = document.getElementById('nav-indicator');
const scrollSpy = document.getElementById('scroll-spy');
const scrollSpySection = document.getElementById('scroll-spy-section');

const spySections = [...navLinks]
  .map((link) => {
    const id = link.getAttribute('href')?.slice(1);
    const section = id ? document.getElementById(id) : null;
    const label = link.dataset.label ?? link.textContent?.trim() ?? id;
    return section ? { link, section, label, id } : null;
  })
  .filter(Boolean);

const trackSectionVisit = (id) => {
  if (!id) return;
  visitedSections.add(id);
  if (visitedSections.size >= spySections.length) {
    unlockAchievement('explorer', 'All sections visited — explorer badge!');
  }
};

const moveNavIndicator = (link) => {
  if (!navIndicator || !link) return;
  const rect = link.getBoundingClientRect();
  navIndicator.style.left = `${rect.left}px`;
  navIndicator.style.width = `${rect.width}px`;
  navIndicator.classList.add('is-visible');
};

const setActiveSection = (item) => {
  navLinks.forEach((link) => link.classList.remove('is-active'));
  item.link.classList.add('is-active');
  moveNavIndicator(item.link);

  if (scrollSpySection) scrollSpySection.textContent = item.label;
  if (scrollSpy) scrollSpy.classList.remove('is-hidden');

  trackSectionVisit(item.id);
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length === 0) return;

    const activeId = visible[0].target.id;
    const match = spySections.find((item) => item.id === activeId);
    if (match) setActiveSection(match);
  },
  { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.15, 0.4] },
);

spySections.forEach((item) => sectionObserver.observe(item.section));

window.addEventListener('resize', () => {
  const active = document.querySelector('.nav__links a.is-active');
  if (active instanceof HTMLElement) moveNavIndicator(active);
});

if (spySections[0]) {
  setActiveSection(spySections[0]);
}

window.addEventListener('scroll', () => {
  if (!scrollSpy) return;
  if (window.scrollY < 80) scrollSpy.classList.add('is-hidden');
}, { passive: true });

// Mobile menu
const menuToggle = document.getElementById('menu-toggle');
const navLinksEl = document.getElementById('nav-links');

const closeMenu = () => {
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open menu');
};

menuToggle?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navLinksEl?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Footer year + back to top
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// Confetti
const spawnConfetti = () => {
  const colors = ['#4f6ef7', '#a878ff', '#38bdc6', '#ffb778'];
  const count = 48;

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      left: ${50 + (Math.random() - 0.5) * 30}%;
      top: -10px;
      background: ${colors[i % colors.length]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 300;
      animation: confetti-fall ${1.2 + Math.random() * 1.2}s ease-out forwards;
      animation-delay: ${Math.random() * 0.4}s;
      transform: rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 2600);
  }

  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confetti-fall {
        to {
          transform: translateY(110vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Konami code
const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];
let konamiIndex = 0;

document.addEventListener('keydown', (event) => {
  if (event.code === KONAMI[konamiIndex]) {
    konamiIndex += 1;
    if (konamiIndex === KONAMI.length) {
      spawnConfetti();
      showToast('Konami code activated!');
      konamiIndex = 0;
    }
    return;
  }
  konamiIndex = event.code === KONAMI[0] ? 1 : 0;
});

// Flip cards
const factCards = document.querySelectorAll('.fact-card');
const factsCounter = document.getElementById('facts-counter');
const totalFacts = factCards.length;

const updateFactsCounter = () => {
  if (!factsCounter) return;
  const opened = document.querySelectorAll('.fact-card.is-flipped').length;
  factsCounter.textContent = `Открыто карточек: ${opened} / ${totalFacts}`;
  factsCounter.classList.toggle('is-complete', opened === totalFacts);

  if (opened === totalFacts) {
    spawnConfetti();
    unlockAchievement('facts', 'All fact cards flipped!');
  }
};

factCards.forEach((card) => {
  card.addEventListener('click', () => {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(isFlipped));
    updateFactsCounter();
  });
});

// Quiz
const QUIZ_QUESTIONS = [
  {
    question: 'Каким спортом увлекается Мирон?',
    options: ['Футбол', 'Горные лыжи', 'Спортивное программирование', 'Большой теннис'],
    correct: 3,
    hint: 'Смотри раздел Experience — первая запись.',
  },
  {
    question: 'На каком направлении обучается Мирон?',
    options: [
      'Математика и комп. науки',
      'Програмная инженерия',
      'МОиАИС',
      'Управление в тех. системах',
    ],
    correct: 2,
    hint: 'Вторая запись в Experience.',
  },
  {
    question: 'Из какого Мирон города?',
    options: [
      'Санкт-Петербург', 
      'Анапа', 
      'Казань', 
      'Саратов'
    ],
    correct: 0,
    hint: 'Третья запись в Experience.',
  },
  {
    question: 'На каком языке никогда не писал Мирон?',
    options: ['Java', 'Pascal', 'Kotlin', 'C++'],
    correct: 1,
    hint: 'Раздел Skills → Core.',
  },
  {
    question: 'День рожения Мирона?',
    options: [
      '14 октября',
      '20 февраля',
      '5 марта',
      '8 августа',
    ],
    correct: 1,
    hint: 'Раздел Skills → Growing.',
  },
];

const quizPlay = document.getElementById('quiz-play');
const quizResult = document.getElementById('quiz-result');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const quizNext = document.getElementById('quiz-next');
const quizProgressText = document.getElementById('quiz-progress-text');
const quizScoreText = document.getElementById('quiz-score-text');
const quizBarFill = document.getElementById('quiz-bar-fill');
const quizResultTitle = document.getElementById('quiz-result-title');
const quizResultText = document.getElementById('quiz-result-text');
const quizRestart = document.getElementById('quiz-restart');

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

const updateQuizProgress = () => {
  const total = QUIZ_QUESTIONS.length;
  const current = Math.min(quizIndex + 1, total);
  if (quizProgressText) {
    quizProgressText.textContent = `Вопрос ${current} из ${total}`;
  }
  if (quizScoreText) {
    quizScoreText.textContent = `Счёт: ${quizScore}`;
  }
  if (quizBarFill) {
    const pct = quizIndex === 0 ? 0 : (quizIndex / total) * 100;
    quizBarFill.style.width = `${pct}%`;
  }
};

const showQuizQuestion = () => {
  const item = QUIZ_QUESTIONS[quizIndex];
  if (!item || !quizQuestion || !quizOptions) return;

  quizAnswered = false;
  quizQuestion.textContent = item.question;
  quizOptions.innerHTML = '';
  if (quizFeedback) {
    quizFeedback.hidden = true;
    quizFeedback.classList.remove('is-correct', 'is-wrong');
  }
  if (quizNext) quizNext.hidden = true;

  item.options.forEach((label, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz__option';
    btn.textContent = label;
    btn.addEventListener('click', () => pickQuizAnswer(index, item));
    quizOptions.appendChild(btn);
  });

  updateQuizProgress();
};

const pickQuizAnswer = (chosen, item) => {
  if (quizAnswered) return;
  quizAnswered = true;

  const { correct, hint } = item;
  const buttons = quizOptions?.querySelectorAll('.quiz__option');
  const isCorrect = chosen === correct;

  if (isCorrect) quizScore += 1;

  buttons?.forEach((btn, index) => {
    btn.disabled = true;
    if (index === correct) btn.classList.add('is-correct');
    if (index === chosen && !isCorrect) btn.classList.add('is-wrong');
  });

  if (quizFeedback) {
    quizFeedback.hidden = false;
    quizFeedback.classList.toggle('is-correct', isCorrect);
    quizFeedback.classList.toggle('is-wrong', !isCorrect);
    quizFeedback.textContent = isCorrect ? 'Верно!' : `Неверно. ${hint}`;
  }

  if (quizScoreText) quizScoreText.textContent = `Счёт: ${quizScore}`;
  if (quizNext) quizNext.hidden = false;
};

const finishQuiz = () => {
  const total = QUIZ_QUESTIONS.length;
  if (quizBarFill) quizBarFill.style.width = '100%';
  if (quizPlay) quizPlay.hidden = true;
  if (quizResult) quizResult.hidden = false;

  const ratio = quizScore / total;
  let title = 'Неплохо!';
  let text = `Ты набрал ${quizScore} из ${total}. Перечитай CV и попробуй снова.`;

  if (ratio === 1) {
    title = 'Идеально!';
    text = `Все ${total} ответов верны — ты отлично знаешь Мирона`;
    spawnConfetti();
    unlockAchievement('quiz', 'Perfect quiz score — CV expert!');
  } else if (ratio >= 0.6) {
    title = 'Хороший результат!';
    text = `${quizScore} из ${total} — почти эксперт по этому портфолио.`;
  }

  if (quizResultTitle) quizResultTitle.textContent = title;
  if (quizResultText) quizResultText.textContent = text;
};

const resetQuiz = () => {
  quizIndex = 0;
  quizScore = 0;
  if (quizPlay) quizPlay.hidden = false;
  if (quizResult) quizResult.hidden = true;
  showQuizQuestion();
};

quizNext?.addEventListener('click', () => {
  quizIndex += 1;
  if (quizIndex >= QUIZ_QUESTIONS.length) {
    finishQuiz();
    return;
  }
  showQuizQuestion();
});

quizRestart?.addEventListener('click', resetQuiz);

if (quizQuestion && quizOptions) {
  showQuizQuestion();
}
