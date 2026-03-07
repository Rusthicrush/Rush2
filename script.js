/* ============================================================
   RUSH — script.js
   Vanilla JS for full personal social platform functionality
============================================================ */

/* ===================================================
   SECTION 1: ANIMATED BACKGROUND PARTICLES
=================================================== */
(function initParticles() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Create particles
  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      angle: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * 0.02 + 0.005,
      pulseDir: 1,
    };
  }

  for (let i = 0; i < 120; i++) particles.push(createParticle());

  // Lines between close particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(33,150,243,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Gradient overlay
    const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    grad.addColorStop(0, 'rgba(7,20,40,0)');
    grad.addColorStop(1, 'rgba(2,11,24,0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    drawConnections();

    particles.forEach(p => {
      // Move
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      // Pulse alpha
      p.alpha += p.pulse * p.pulseDir;
      if (p.alpha > 0.6 || p.alpha < 0.05) p.pulseDir *= -1;
      // Wrap
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const blue = Math.random() > 0.8 ? `rgba(0,180,216,${p.alpha})` : `rgba(33,150,243,${p.alpha})`;
      ctx.fillStyle = blue;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(33,150,243,${p.alpha * 0.08})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===================================================
   SECTION 2: STATE & STORAGE
=================================================== */
let posts = JSON.parse(localStorage.getItem('rush_posts') || '[]');
let activeFilter = 'all';
let activeSection = 'home';
let commentTargetId = null;

function savePosts() {
  localStorage.setItem('rush_posts', JSON.stringify(posts));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatTime(ts) {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ===================================================
   SECTION 3: NAVIGATION
=================================================== */
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Sidebar toggle (mobile)
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('open');
});
sidebarOverlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
}

// Section switching
function switchSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const target = document.getElementById('section-' + name);
  if (target) target.classList.add('active');

  const link = document.querySelector(`.nav-link[data-section="${name}"]`);
  if (link) link.classList.add('active');

  activeSection = name;
  closeSidebar();

  // Render relevant feed
  if (name === 'home') renderFeed('mainFeed', getFilteredPosts());
  if (name === 'posts') renderFeed('postsFeed', posts);
  if (name === 'media') renderMediaGallery();
  if (name === 'about') updateAboutStats();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const section = link.dataset.section;
    if (section) switchSection(section);
  });
});

// CTA buttons that navigate to sections
document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => switchSection(btn.dataset.goto));
});

// FAB
document.getElementById('fab').addEventListener('click', () => switchSection('create'));

/* ===================================================
   SECTION 4: POST CREATION
=================================================== */
let selectedImageData = null;

// Image upload preview
document.getElementById('imgUpload').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    selectedImageData = e.target.result;
    document.getElementById('imgPreview').src = selectedImageData;
    document.getElementById('imgPreviewWrap').style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// Remove image
document.getElementById('removeImg').addEventListener('click', () => {
  selectedImageData = null;
  document.getElementById('imgPreviewWrap').style.display = 'none';
  document.getElementById('imgPreview').src = '';
  document.getElementById('imgUpload').value = '';
});

// Publish post
document.getElementById('publishBtn').addEventListener('click', publishPost);

function publishPost() {
  const text = document.getElementById('postText').value.trim();
  if (!text && !selectedImageData) {
    showToast('Please write something or add an image!', 'warning');
    return;
  }

  const post = {
    id: generateId(),
    text,
    image: selectedImageData,
    timestamp: Date.now(),
    likes: 0,
    liked: false,
    comments: [],
    type: selectedImageData ? 'photos' : 'thoughts',
  };

  posts.unshift(post);
  savePosts();

  // Reset form
  document.getElementById('postText').value = '';
  document.getElementById('removeImg').click();

  // Update feeds & stats
  renderFeed('mainFeed', getFilteredPosts());
  renderFeed('postsFeed', posts);
  renderMediaGallery();
  updateStats();
  addActivity('You published a new post');

  showToast('Post published! 🚀');
  switchSection('home');
}

/* ===================================================
   SECTION 5: FEED RENDERING
=================================================== */
function getFilteredPosts() {
  if (activeFilter === 'all') return posts;
  return posts.filter(p => p.type === activeFilter);
}

function renderFeed(feedId, postList) {
  const feed = document.getElementById(feedId);
  if (!feed) return;

  if (postList.length === 0) {
    feed.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-wind"></i>
        <p>No posts here yet. Be the first to share something!</p>
      </div>`;
    return;
  }

  feed.innerHTML = postList.map(post => buildPostCard(post)).join('');

  // Bind events for each card
  postList.forEach(post => {
    // Like button
    const likeBtn = feed.querySelector(`[data-like="${post.id}"]`);
    if (likeBtn) likeBtn.addEventListener('click', () => toggleLike(post.id, feedId, postList));

    // Comment button
    const commentBtn = feed.querySelector(`[data-comment="${post.id}"]`);
    if (commentBtn) commentBtn.addEventListener('click', () => openCommentModal(post.id));

    // Share button
    const shareBtn = feed.querySelector(`[data-share="${post.id}"]`);
    if (shareBtn) shareBtn.addEventListener('click', () => showToast('Link copied to clipboard! 🔗'));

    // Image click → lightbox
    const img = feed.querySelector(`[data-img="${post.id}"]`);
    if (img) img.addEventListener('click', () => openLightbox(post.image));
  });

  // Update post count display
  const countEl = document.getElementById('myPostCount');
  if (countEl && feedId === 'postsFeed') {
    countEl.textContent = posts.length + ' post' + (posts.length !== 1 ? 's' : '');
  }
}

function buildPostCard(post) {
  const imgHtml = post.image
    ? `<div class="post-img-wrap">
         <img src="${post.image}" alt="Post image" data-img="${post.id}" loading="lazy"/>
       </div>`
    : '';

  return `
    <div class="post-card">
      <div class="post-header">
        <div class="post-avatar">R</div>
        <div class="post-meta">
          <span class="post-username">Rush</span>
          <span class="post-time"><i class="fas fa-clock"></i> ${formatTime(post.timestamp)}</span>
        </div>
        <button class="post-more" title="More options"><i class="fas fa-ellipsis"></i></button>
      </div>
      ${post.text ? `<p class="post-body">${escapeHtml(post.text)}</p>` : ''}
      ${imgHtml}
      <div class="post-actions">
        <button class="action-btn ${post.liked ? 'liked' : ''}" data-like="${post.id}">
          <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
          <span>${post.likes}</span>
        </button>
        <button class="action-btn" data-comment="${post.id}">
          <i class="far fa-comment"></i>
          <span>${post.comments.length}</span>
        </button>
        <button class="action-btn" data-share="${post.id}">
          <i class="fas fa-share-nodes"></i>
          <span>Share</span>
        </button>
      </div>
    </div>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}

/* ===================================================
   SECTION 6: LIKE TOGGLE
=================================================== */
function toggleLike(postId, feedId, postList) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  savePosts();
  renderFeed(feedId, postList);
  if (post.liked) addActivity('You liked a post ❤️');
}

/* ===================================================
   SECTION 7: COMMENT MODAL
=================================================== */
const commentModal = document.getElementById('commentModal');

document.getElementById('commentModalClose').addEventListener('click', closeCommentModal);
commentModal.addEventListener('click', e => { if (e.target === commentModal) closeCommentModal(); });

function openCommentModal(postId) {
  commentTargetId = postId;
  renderComments(postId);
  commentModal.classList.add('open');
}

function closeCommentModal() {
  commentModal.classList.remove('open');
  commentTargetId = null;
}

function renderComments(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const list = document.getElementById('commentList');
  if (post.comments.length === 0) {
    list.innerHTML = '<p style="color:var(--text-dim);text-align:center;font-size:13px;padding:20px">No comments yet. Be the first!</p>';
  } else {
    list.innerHTML = post.comments.map(c => `
      <div class="comment-item">
        <div class="post-avatar">${c.author[0].toUpperCase()}</div>
        <div class="comment-bubble">
          <strong>${c.author}</strong>
          ${escapeHtml(c.text)}
        </div>
      </div>`).join('');
  }
}

document.getElementById('commentSubmit').addEventListener('click', submitComment);
document.getElementById('commentInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitComment();
});

function submitComment() {
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  if (!text || !commentTargetId) return;

  const post = posts.find(p => p.id === commentTargetId);
  if (!post) return;
  post.comments.push({ author: 'Rush', text, timestamp: Date.now() });
  savePosts();
  renderComments(commentTargetId);
  renderFeed('mainFeed', getFilteredPosts());
  renderFeed('postsFeed', posts);
  input.value = '';
  addActivity('You commented on a post 💬');
}

/* ===================================================
   SECTION 8: FILTER TABS
=================================================== */
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    renderFeed('mainFeed', getFilteredPosts());
  });
});

/* ===================================================
   SECTION 9: SEARCH
=================================================== */
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');

searchInput.addEventListener('input', function () {
  const q = this.value.trim().toLowerCase();
  searchClear.style.display = q ? 'flex' : 'none';

  if (!q) {
    renderFeed('mainFeed', getFilteredPosts());
    return;
  }
  const results = posts.filter(p =>
    (p.text && p.text.toLowerCase().includes(q))
  );
  renderFeed('mainFeed', results);

  // Switch to home to see results
  if (activeSection !== 'home') switchSection('home');
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchClear.style.display = 'none';
  renderFeed('mainFeed', getFilteredPosts());
});

/* ===================================================
   SECTION 10: MEDIA GALLERY
=================================================== */
function renderMediaGallery() {
  const grid = document.getElementById('mediaGrid');
  const mediaEmpty = document.getElementById('mediaEmpty');
  const imagePosts = posts.filter(p => p.image);

  if (imagePosts.length === 0) {
    grid.innerHTML = `<div class="empty-state" id="mediaEmpty">
      <i class="fas fa-photo-film"></i>
      <p>No media yet. Upload images in Create Post!</p>
    </div>`;
    return;
  }

  grid.innerHTML = imagePosts.map(p => `
    <div class="media-item" data-media-img="${p.id}">
      <img src="${p.image}" alt="Media" loading="lazy"/>
    </div>`).join('');

  grid.querySelectorAll('.media-item').forEach(item => {
    item.addEventListener('click', () => {
      const post = posts.find(p => p.id === item.dataset.mediaImg);
      if (post) openLightbox(post.image);
    });
  });
}

/* ===================================================
   SECTION 11: LIGHTBOX
=================================================== */
const lightbox = document.getElementById('lightbox');

function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  lightbox.classList.add('open');
}

document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.classList.remove('open');
});

/* ===================================================
   SECTION 12: YOUTUBE EMBED
=================================================== */
document.getElementById('ytLoadBtn').addEventListener('click', loadYouTube);
document.getElementById('ytUrl').addEventListener('keydown', e => {
  if (e.key === 'Enter') loadYouTube();
});

function extractYtId(url) {
  const regexps = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];
  for (const re of regexps) {
    const match = url.match(re);
    if (match) return match[1];
  }
  return null;
}

function loadYouTube(videoId) {
  const url = document.getElementById('ytUrl').value.trim();
  const id = videoId || extractYtId(url);
  if (!id) {
    showToast('Please enter a valid YouTube URL', 'warning');
    return;
  }
  const iframe = document.getElementById('ytIframe');
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  document.getElementById('ytPlayerWrap').style.display = 'block';
  document.getElementById('ytPlayerWrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// YouTube card clicks
document.querySelectorAll('.yt-card').forEach(card => {
  card.addEventListener('click', () => {
    const vid = card.dataset.vid;
    document.getElementById('ytUrl').value = `https://www.youtube.com/watch?v=${vid}`;
    loadYouTube(vid);
  });
});

/* ===================================================
   SECTION 13: TOAST NOTIFICATION
=================================================== */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = toast.querySelector('i');
  document.getElementById('toastMsg').textContent = msg;

  icon.className = type === 'warning'
    ? 'fas fa-exclamation-circle'
    : 'fas fa-check-circle';
  icon.style.color = type === 'warning' ? '#facc15' : '#4ade80';

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ===================================================
   SECTION 14: ACTIVITY FEED (right sidebar)
=================================================== */
let activityItems = JSON.parse(localStorage.getItem('rush_activity') || '[]');

function addActivity(msg) {
  activityItems.unshift({ msg, time: Date.now() });
  if (activityItems.length > 10) activityItems = activityItems.slice(0, 10);
  localStorage.setItem('rush_activity', JSON.stringify(activityItems));
  renderActivity();
}

function renderActivity() {
  const list = document.getElementById('activityList');
  if (!list) return;
  if (activityItems.length === 0) {
    list.innerHTML = '<li class="activity-empty">No activity yet</li>';
    return;
  }
  list.innerHTML = activityItems.slice(0, 5).map(a => `
    <li class="activity-item">
      <div class="activity-dot"></div>
      <span>${a.msg}</span>
    </li>`).join('');
}

/* ===================================================
   SECTION 15: STATS
=================================================== */
function updateStats() {
  const total = posts.length;
  const photos = posts.filter(p => p.image).length;

  // Widget
  const wPosts = document.getElementById('wStatPosts');
  const wPhotos = document.getElementById('wStatPhotos');
  if (wPosts) wPosts.textContent = total;
  if (wPhotos) wPhotos.textContent = photos;
}

function updateAboutStats() {
  const sPosts = document.getElementById('statPosts');
  const sPhotos = document.getElementById('statPhotos');
  if (sPosts) sPosts.textContent = posts.length;
  if (sPhotos) sPhotos.textContent = posts.filter(p => p.image).length;
}

/* ===================================================
   SECTION 16: INIT
=================================================== */
function init() {
  // Render initial feed
  renderFeed('mainFeed', getFilteredPosts());
  renderFeed('postsFeed', posts);
  renderMediaGallery();
  updateStats();
  renderActivity();

  // Keyboard shortcut: Escape closes modals/lightbox/sidebar
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('open');
      closeCommentModal();
      closeSidebar();
    }
  });

  // Welcome toast for first-time visitor
  if (!localStorage.getItem('rush_visited')) {
    localStorage.setItem('rush_visited', '1');
    setTimeout(() => showToast('Welcome to RUSH! 🚀'), 800);
  }

  console.log('🚀 RUSH Platform initialized');
}

init();
