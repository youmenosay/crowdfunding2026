// youmenosay CF メインスクリプト v1.2

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyContent();
  applySoreosLinks();
  applyRewardVisibility();
  applyImages();
  applyProgress();
  applyScheduleToday();
  initNav();
  initRewardTabs();
  initParticles();
  initScrollAnimations();
});

// ── テーマ ──────────────────────────────────────────
function applyTheme() {
  const t = window.YMS_CONFIG.theme;
  const r = document.documentElement.style;
  r.setProperty('--color-primary',    t.colorPrimary);
  r.setProperty('--color-secondary',  t.colorSecondary);
  r.setProperty('--color-accent',     t.colorAccent);
  r.setProperty('--color-bg',         t.colorBg);
  r.setProperty('--color-surface',    t.colorSurface);
  r.setProperty('--color-border',     t.colorBorder);
  r.setProperty('--color-text',       t.colorText);
  r.setProperty('--color-text-muted', t.colorTextMuted);
  r.setProperty('--font-heading',     t.fontHeading);
  r.setProperty('--font-body',        t.fontBody);
}

// ── テキストコンテンツ ─────────────────────────────
function applyContent() {
  const c = (window.YMS_CONFIG || {}).content || {};

  if (c.heroTitle) {
    const el = document.getElementById('heroTitleText');
    if (el) el.textContent = c.heroTitle;
  }
  if (c.heroLead) {
    const el = document.getElementById('heroLeadText');
    if (el) el.innerHTML = c.heroLead.replace(/\n/g, '<br>');
  }
  if (c.goalAmount) {
    const el = document.getElementById('goalAmountDisplay');
    if (el) el.textContent = '¥' + c.goalAmount;
  }
  if (c.aboutMain) {
    const el = document.getElementById('aboutMainText');
    if (el) el.innerHTML = c.aboutMain.replace(/\n/g, '<br>');
  }
  if (c.projectMain) {
    const el = document.getElementById('projectMainText');
    if (el) el.innerHTML = c.projectMain.replace(/\n/g, '<br>');
  }
  if (c.producerMessage) {
    const el = document.getElementById('producerMessageText');
    if (el) el.innerHTML = c.producerMessage.replace(/\n/g, '<br>');
  }
}

// ── ソレオスリンク ─────────────────────────────────
function applySoreosLinks() {
  const url = window.YMS_CONFIG.soreosUrl || '#';
  document.querySelectorAll('.soreos-link').forEach(el => {
    el.href = url;
    if (url === '#') {
      el.setAttribute('aria-disabled', 'true');
      el.title = 'ソレオスのURLは近日公開予定です';
    }
  });
}

// ── リワード表示制御 ────────────────────────────────
function applyRewardVisibility() {
  const rw = window.YMS_CONFIG.rewards;
  Object.entries(rw).forEach(([key, cfg]) => {
    const panel = document.getElementById('tab-' + key);
    const tab   = document.querySelector(`[data-tab="${key}"]`);
    if (!panel) return;
    if (!cfg.visible) {
      panel.style.display = 'none';
      if (tab) tab.style.display = 'none';
      return;
    }
    if (cfg.comingSoon) {
      panel.querySelectorAll('.btn-reward').forEach(btn => {
        btn.textContent    = '近日公開予定';
        btn.classList.add('btn-disabled');
        btn.removeAttribute('href');
      });
    }
    if (cfg.periodText) {
      const el = panel.querySelector('.plan-period');
      if (el) el.textContent = cfg.periodText;
    }
  });
}

// ── 画像適用 ──────────────────────────────────────
function applyImages() {
  const imgs = window.YMS_IMAGES;
  if (!imgs) return;

  // ヒーロー背景
  if (imgs.hero) {
    const bg = document.getElementById('heroImgBg');
    if (bg) { bg.style.backgroundImage = `url(${imgs.hero})`; bg.classList.add('active'); }
  }

  // メンバー写真
  if (imgs.members) {
    Object.entries(imgs.members).forEach(([key, src]) => {
      if (!src) return;
      const avatar = document.querySelector(`.member-avatar[data-member="${key}"]`);
      if (!avatar) return;
      const img = document.createElement('img');
      img.src     = src;
      img.alt     = avatar.textContent.trim();
      img.loading = 'lazy';
      avatar.textContent = '';
      avatar.appendChild(img);
      avatar.classList.add('has-photo');
    });
  }

  // 各リターンカード画像
  if (imgs.rewardCards) {
    Object.entries(imgs.rewardCards).forEach(([id, src]) => {
      if (!src) return;
      const card = document.querySelector(`.reward-card[data-reward-id="${id}"]`);
      if (!card) return;
      const wrap = card.querySelector('.reward-card-img');
      if (!wrap) return;
      wrap.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
      wrap.style.display = 'block';
    });
  }

  // プロジェクト説明画像
  if (imgs.projectImages && imgs.projectImages.length > 0) {
    const gallery = document.getElementById('projectImageGallery');
    if (gallery) {
      gallery.innerHTML = imgs.projectImages.map(item => `
        <figure class="proj-img-item fade-in">
          <img src="${item.data}" alt="${item.label || ''}" loading="lazy">
          ${item.label ? `<figcaption>${item.label}</figcaption>` : ''}
        </figure>`).join('');
      gallery.style.display = 'grid';
    }
  }

  // リターン比較表
  if (imgs.comparison) {
    const section = document.getElementById('comparison');
    const img     = document.getElementById('comparisonImg');
    if (section && img) { img.src = imgs.comparison; section.style.display = ''; }
  }

  // リターン品ギャラリー
  if (imgs.rewardImages && imgs.rewardImages.length > 0) {
    const section = document.getElementById('rewardGallerySection');
    const gallery = document.getElementById('rewardGallery');
    if (section && gallery) {
      gallery.innerHTML = imgs.rewardImages.map(item => `
        <figure class="gallery-item fade-in">
          <img src="${item.data}" alt="${item.label}" loading="lazy">
          ${item.label ? `<figcaption>${item.label}</figcaption>` : ''}
        </figure>`).join('');
      section.style.display = '';
    }
  }
}

// ── マイルストーン進捗 ─────────────────────────────
const MILESTONE_AMOUNTS = [500000, 1000000, 1500000, 2000000, 2500000,
                            3000000, 3500000, 4000000, 4500000, 5000000];
const GOAL_TOTAL = 5000000;

function applyProgress() {
  const current  = window.YMS_CONFIG.currentAmount || 0;
  const percent  = Math.min(100, (current / GOAL_TOTAL) * 100);
  const nextMs   = MILESTONE_AMOUNTS.find(m => m > current);
  const remaining = nextMs ? nextMs - current : 0;

  // 進捗バー
  const barEl = document.getElementById('mpbBar');
  if (barEl) barEl.style.width = percent + '%';

  const amtEl = document.getElementById('mpbAmount');
  if (amtEl) amtEl.textContent = '¥' + current.toLocaleString('ja-JP');

  const pctEl = document.getElementById('mpbPercent');
  if (pctEl) pctEl.textContent = percent.toFixed(1) + '%';

  const nextEl = document.getElementById('mpbNext');
  if (nextEl) {
    if (current >= GOAL_TOTAL) {
      nextEl.textContent = '🎉 最終目標達成！ありがとうございます！';
      nextEl.className = 'mpb-next achieved';
    } else if (nextMs) {
      nextEl.innerHTML = `次のマイルストーン <strong>¥${nextMs.toLocaleString('ja-JP')}</strong> まで あと <strong>¥${remaining.toLocaleString('ja-JP')}</strong>`;
    }
  }

  // 更新日時
  const updatedAt = window.YMS_CONFIG.currentAmountUpdatedAt;
  const dateEl    = document.getElementById('mpbUpdated');
  if (dateEl && updatedAt) {
    const d = new Date(updatedAt);
    const fmt = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} 更新`;
    dateEl.textContent = fmt;
  }

  // 各マイルストーンアイテムの状態
  document.querySelectorAll('.milestone-item[data-amount]').forEach(item => {
    const amt = parseInt(item.dataset.amount);
    item.classList.remove('ms-achieved', 'ms-current', 'ms-upcoming');
    if (current >= amt) {
      item.classList.add('ms-achieved');
    } else if (amt === nextMs) {
      item.classList.add('ms-current');
    } else {
      item.classList.add('ms-upcoming');
    }
  });
}

// ── スケジュール「今日」マーカー ─────────────────────
function applyScheduleToday() {
  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  const items    = Array.from(document.querySelectorAll('.schedule-item[data-date]'));
  if (!items.length) return;

  let todayItem  = null;
  let nearestItem = null;
  let nearestDiff = Infinity;

  items.forEach(item => {
    const d = new Date(item.dataset.date);
    d.setHours(0, 0, 0, 0);
    const diff = d - today;

    if (diff === 0) {
      todayItem = item;
    } else if (diff > 0 && diff < nearestDiff) {
      nearestDiff = diff;
      nearestItem = item;
    }
  });

  const targetItem = todayItem || nearestItem;
  if (targetItem) {
    targetItem.classList.add('schedule-today');
    const label = document.createElement('div');
    label.className   = 'schedule-today-label';
    label.textContent = todayItem ? '⭐ 本日！' : '⭐ 次のイベント';
    targetItem.querySelector('.schedule-content')?.prepend(label);
  }
}

// ── ナビゲーション ─────────────────────────────────
function initNav() {
  const nav    = document.getElementById('mainNav');
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('navLinks');

  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  menu.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', () => { menu.classList.remove('open'); burger.classList.remove('open'); })
  );

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ── リワードタブ ────────────────────────────────────
function initRewardTabs() {
  const tabs   = document.querySelectorAll('.reward-tab');
  const panels = document.querySelectorAll('.reward-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
}

// ── パーティクル ────────────────────────────────────
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('span');
    star.className = 'particle';
    star.style.cssText = `
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;
      animation-delay:${Math.random()*4}s;
      animation-duration:${Math.random()*3+2}s;
      opacity:${Math.random()*0.7+0.3}`;
    container.appendChild(star);
  }
}

// ── スクロールアニメーション ────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
