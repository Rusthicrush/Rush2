// ===========================
//   DATA — Sample Updates
// ===========================
const sampleUpdates = [
  {
    id: 1,
    title: "Launched My Personal Website 🚀",
    date: "2025-06-09",
    category: "project",
    description: "Finally went live! I've been building this personal site for the past 2 weeks — featuring daily updates, my portfolio, and a way for people to connect with me directly. Super excited about this milestone!",
    featured: true,
    isNew: false
  },
  {
    id: 2,
    title: "Exploring AI Tools for Daily Productivity",
    date: "2025-06-08",
    category: "tech",
    description: "Spent the morning testing GPT-4o, Claude, and Gemini for various tasks. Claude is hands-down the best for long-form writing and coding. Also tried Cursor AI — it's genuinely impressive for VS Code workflows.",
    featured: false,
    isNew: true
  },
  {
    id: 3,
    title: "Weekend Trip to Pondicherry 🌊",
    date: "2025-06-07",
    category: "travel",
    description: "Drove down to Pondy with friends — the French Quarter is always magical. We caught the sunrise at the beach, ate amazing crepes, and spent hours exploring the streets. Recharged completely.",
    featured: false,
    isNew: false
  },
  {
    id: 4,
    title: "Random Thought: On Consistency vs Motivation",
    date: "2025-06-06",
    category: "thoughts",
    description: "Everyone talks about 'staying motivated' but motivation is fleeting. Consistency is what actually builds things. I've been journaling every day for 90 days now — not because I'm motivated, but because I made it a habit.",
    featured: false,
    isNew: false
  },
  {
    id: 5,
    title: "Started Learning Three.js",
    date: "2025-06-05",
    category: "tech",
    description: "Diving deep into 3D web graphics. Three.js is both insane and incredibly fun. Built a rotating Earth globe today just from following the docs. The browser can do SO much more than I imagined.",
    featured: false,
    isNew: false
  },
  {
    id: 6,
    title: "Life Update: New Morning Routine",
    date: "2025-06-04",
    category: "life",
    description: "Week 3 of my new morning routine: 5:30am wake-up, 20 mins yoga, journal, then code before breakfast. Honestly? It slaps. My focus at work has improved dramatically and I feel more at peace overall.",
    featured: false,
    isNew: false
  },
  {
    id: 7,
    title: "Started Building a Budget Tracker App",
    date: "2025-06-03",
    category: "project",
    description: "Tired of not knowing where my money goes every month. Started a simple budget tracker with React and localStorage. Goal: make it dead simple, no account required, works offline. Will open-source it once done.",
    featured: false,
    isNew: false
  }
];

// ===========================
//   STATE
// ===========================
let allUpdates = [...sampleUpdates];
let activeFilter = 'all';
let searchQuery = '';
let nextId = allUpdates.length + 1;

// ===========================
//   RENDER
// ===========================
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function catLabel(cat) {
  const map = { tech: 'Tech', life: 'Life', travel: 'Travel', thoughts: 'Thoughts', project: 'Project' };
  return map[cat] || cat;
}

function renderFeatured() {
  const wrap = document.getElementById('featuredWrap');
  const featured = allUpdates.find(u => u.featured);
  if (!featured) { wrap.innerHTML = ''; return; }

  // Check if featured passes current filter/search
  const passesFilter = activeFilter === 'all' || featured.category === activeFilter;
  const passesSearch = !searchQuery || featured.title.toLowerCase().includes(searchQuery) || featured.description.toLowerCase().includes(searchQuery);

  if (!passesFilter || !passesSearch) { wrap.innerHTML = ''; return; }

  wrap.innerHTML = `
    <div class="featured-card">
      <div>
        <div class="featured-badge">⭐ Featured Update</div>
        <h3>${featured.title}</h3>
        <p>${featured.description}</p>
        <div class="card-meta">
          <span class="card-date"><i class="fa-regular fa-calendar"></i> ${formatDate(featured.date)}</span>
          <span class="card-cat">${catLabel(featured.category)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderUpdates() {
  const grid = document.getElementById('updatesGrid');
  const noResults = document.getElementById('noResults');

  const filtered = allUpdates
    .filter(u => !u.featured)
    .filter(u => activeFilter === 'all' || u.category === activeFilter)
    .filter(u => {
      if (!searchQuery) return true;
      return u.title.toLowerCase().includes(searchQuery) ||
             u.description.toLowerCase().includes(searchQuery) ||
             u.category.toLowerCase().includes(searchQuery);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Check featured visibility too
  const featuredEl = document.getElementById('featuredWrap');
  const hasFeaturedVisible = featuredEl && featuredEl.innerHTML.trim() !== '';
  const hasAny = filtered.length > 0 || hasFeaturedVisible;

  noResults.classList.toggle('hidden', hasAny);

  grid.innerHTML = filtered.map((u, i) => `
    <div class="update-card glass" style="animation-delay:${i * 0.07}s">
      <div class="card-top">
        <span class="card-cat">${catLabel(u.category)}</span>
        ${u.isNew ? '<span class="new-badge">New</span>' : ''}
      </div>
      <h3>${u.title}</h3>
      <p>${u.description}</p>
      <div class="card-meta">
        <span class="card-date"><i class="fa-regular fa-calendar"></i> ${formatDate(u.date)}</span>
      </div>
    </div>
  `).join('');
}

function render() {
  renderFeatured();
  renderUpdates();
}

// ===========================
//   FILTERS & SEARCH
// ===========================
document.getElementById('filterBar').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.cat;
  render();
});

document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase().trim();
  render();
});

// ===========================
//   ADD UPDATE FORM
// ===========================
document.getElementById('submitBtn').addEventListener('click', () => {
  const title = document.getElementById('formTitle').value.trim();
  const category = document.getElementById('formCategory').value;
  const date = document.getElementById('formDate').value;
  const desc = document.getElementById('formDesc').value.trim();

  if (!title || !date || !desc) {
    showToast('⚠️ Please fill in all fields!');
    return;
  }

  const newUpdate = {
    id: nextId++,
    title,
    date,
    category,
    description: desc,
    featured: false,
    isNew: true
  };

  allUpdates.unshift(newUpdate);
  render();

  // Clear form
  document.getElementById('formTitle').value = '';
  document.getElementById('formDate').value = '';
  document.getElementById('formDesc').value = '';
  document.getElementById('formCategory').value = 'tech';

  // Reset filter to show new post
  activeFilter = 'all';
  searchQuery = '';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-cat="all"]').classList.add('active');
  document.getElementById('searchInput').value = '';

  render();
  showToast('✅ Update posted successfully!');

  // Scroll to updates
  document.getElementById('updates').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===========================
//   TOAST
// ===========================
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ===========================
//   THEME TOGGLE
// ===========================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});

// ===========================
//   NAVBAR SCROLL
// ===========================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===========================
//   HAMBURGER MENU
// ===========================
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

// ===========================
//   SET DEFAULT DATE
// ===========================
document.getElementById('formDate').valueAsDate = new Date();

// ===========================
//   INIT
// ===========================
render();
