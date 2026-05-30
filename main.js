// youmenosay CF メインスクリプト v1.3

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyHeroTypography();
  applyContent();
  applyImages();
  applyImageSlots();
  applyProgress();
  fetchLiveAmount();
  renderSchedule();
  renderRewards();
  applyRewardImages();
  renderContentBlocks();
  renderGroupIntro();
  renderMemberMessages();
  applySoreosLinks();   // must run after renderRewards() creates .soreos-link elements
  initNav();
  initParticles();
  initScrollAnimations();
  initDragCarousels();
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

// ── ヒーロータイポグラフィ ─────────────────────────
function applyHeroTypography() {
  const ht = (window.YMS_CONFIG.heroTypography) || {};
  const titleEl = document.getElementById('heroTitleEl');
  const leadEl  = document.getElementById('heroLeadText');
  if (titleEl && ht.titleSize) titleEl.style.fontSize = ht.titleSize;
  if (leadEl  && ht.leadSize)  leadEl.style.fontSize  = ht.leadSize;
}

// ── **bold** → <strong> 変換 ─────────────────────
function parseBold(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
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
    if (el) el.innerHTML = parseBold(c.heroLead);
  }
  if (c.goalAmount) {
    const el = document.getElementById('goalAmountDisplay');
    if (el) el.textContent = '¥' + c.goalAmount;
  }
  if (c.aboutMain) {
    const el = document.getElementById('aboutMainText');
    if (el) el.innerHTML = parseBold(c.aboutMain);
  }
  if (c.projectMain) {
    const el = document.getElementById('projectMainText');
    if (el) el.innerHTML = parseBold(c.projectMain);
  }
  if (c.producerMessage) {
    const el = document.getElementById('producerMessageText');
    if (el) el.innerHTML = parseBold(c.producerMessage);
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

// ── 画像適用 ──────────────────────────────────────
function applyImages() {
  const imgs = window.YMS_IMAGES;
  const cfg  = window.YMS_CONFIG;

  // ヒーロー背景オーバーレイ
  const heroBg = document.getElementById('heroImgBg');
  if (heroBg) {
    const heroSrc = (imgs && imgs.hero) || null;
    if (heroSrc) { heroBg.style.backgroundImage = `url("${heroSrc}")`; heroBg.classList.add('active'); }
  }

  if (!imgs) return;

  // ヒーロー上部画像（以降は imgs が必要）
  if (imgs.heroAbove) {
    const wrap = document.getElementById('heroImgAbove');
    const img  = document.getElementById('heroImgAboveImg');
    if (wrap && img) { img.src = imgs.heroAbove; wrap.style.display = ''; }
  }

  // ヒーロー下部メインビジュアル
  if (imgs.heroBelow) {
    const wrap = document.getElementById('heroImgBelow');
    const img  = document.getElementById('heroImgBelowImg');
    if (wrap && img) { img.src = imgs.heroBelow; wrap.style.display = ''; }
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

// ── ページ内画像スロット ───────────────────────────
function applyImageSlots() {
  const slots = (window.YMS_IMAGES || {}).slots || {};
  Object.entries(slots).forEach(([key, src]) => {
    if (!src) return;
    const el = document.getElementById(`slot-${key}`);
    if (!el) return;
    const img = el.querySelector('img');
    if (img) { img.src = src; el.style.display = ''; }
  });
}

// ── リワードカード画像を動的に適用 ──────────────────
function applyRewardImages() {
  const cards = (window.YMS_IMAGES || {}).rewardCards || {};
  Object.entries(cards).forEach(([id, src]) => {
    if (!src) return;
    const card = document.querySelector(`.reward-card[data-reward-id="${id}"]`);
    if (!card) return;
    const wrap = card.querySelector('.reward-card-img');
    if (!wrap) return;
    wrap.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    wrap.style.display = 'block';
  });
}

// ── ソレオス 支援金額リアルタイム取得 ─────────────────
async function fetchLiveAmount() {
  try {
    const res = await fetch('/api/amount');
    if (!res.ok) return;
    const data = await res.json();
    if (typeof data.amount !== 'number') return;

    window.YMS_CONFIG.currentAmount = data.amount;

    const d = new Date(data.fetchedAt);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    window.YMS_CONFIG.currentAmountDateText =
      `${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）` +
      `${d.getHours()}時${String(d.getMinutes()).padStart(2, '0')}分 現在`;

    applyProgress();
  } catch {
    // config.js の値をそのまま使用
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

  const barEl = document.getElementById('mpbBar');
  if (barEl) barEl.style.width = percent + '%';

  const amtEl = document.getElementById('mpbAmount');
  if (amtEl) amtEl.textContent = '¥' + current.toLocaleString('ja-JP');

  const pctEl = document.getElementById('mpbPercent');
  if (pctEl) pctEl.textContent = '達成率 ' + percent.toFixed(1) + '%';

  const nextEl = document.getElementById('mpbNext');
  if (nextEl) {
    if (current >= GOAL_TOTAL) {
      nextEl.textContent = '🎉 最終目標達成！ありがとうございます！';
      nextEl.className = 'mpb-next achieved';
    } else if (nextMs) {
      nextEl.innerHTML = `次のマイルストーン <strong>¥${nextMs.toLocaleString('ja-JP')}</strong> まで あと <strong>¥${remaining.toLocaleString('ja-JP')}</strong>`;
    }
  }

  const updatedAt = window.YMS_CONFIG.currentAmountUpdatedAt;
  const dateText  = window.YMS_CONFIG.currentAmountDateText;
  const dateEl    = document.getElementById('mpbUpdated');
  if (dateEl) {
    if (dateText) {
      dateEl.textContent = dateText;
    } else if (updatedAt) {
      const d = new Date(updatedAt);
      dateEl.textContent = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} 更新`;
    }
  }

  // マイルストーンカードの状態
  document.querySelectorAll('.milestone-card[data-amount]').forEach(card => {
    const amt = parseInt(card.dataset.amount);
    card.classList.remove('ms-achieved', 'ms-current', 'ms-upcoming');
    if (current >= amt) {
      card.classList.add('ms-achieved');
    } else if (amt === nextMs) {
      card.classList.add('ms-current');
    } else {
      card.classList.add('ms-upcoming');
    }
  });
}

// ── スケジュール動的レンダリング（タイムラインカード）──────
function renderSchedule() {
  const schedule = (window.YMS_CONFIG.schedule) || [];
  const container = document.getElementById('scheduleTimeline');
  if (!container) return;

  if (schedule.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);padding:24px 0">スケジュールはまもなく公開予定です</p>';
    return;
  }

  container.innerHTML = schedule.map(item => `
    <div class="schedule-item fade-in${item.highlight ? ' highlight' : ''}" data-date="${item.date}" data-sid="${item.id}">
      <div class="schedule-dot"></div>
      <div class="schedule-card">
        <div class="schedule-date">${escHtml(item.dateLabel)}</div>
        <h4>${escHtml(item.title)}</h4>
        ${item.description ? `<p>${escHtml(item.description).replace(/\n/g, '<br>')}</p>` : ''}
      </div>
    </div>
  `).join('');

  applyScheduleToday();
}

function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── スケジュール「今日/次のイベント」マーカー ────────
function applyScheduleToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const items = Array.from(document.querySelectorAll('.schedule-item[data-date]'));
  if (!items.length) return;

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const todayStr = `${today.getMonth() + 1}月${today.getDate()}日（${dayNames[today.getDay()]}）`;

  let todayItem   = null;
  let nearestItem = null;
  let nearestDiff = Infinity;

  items.forEach(item => {
    const d = new Date(item.dataset.date);
    d.setHours(0, 0, 0, 0);
    const diff = d - today;
    if (diff === 0) {
      todayItem = item;
    } else if (diff < 0) {
      item.classList.add('schedule-past');
    } else if (diff < nearestDiff) {
      nearestDiff = diff;
      nearestItem = item;
    }
  });

  // 「今日」ラインを次のイベントの直前に挿入（当日イベントがない場合）
  if (!todayItem && nearestItem) {
    const marker = document.createElement('div');
    marker.className = 'schedule-today-line';
    marker.innerHTML = `<span>📅 今日：${todayStr}</span>`;
    nearestItem.parentNode.insertBefore(marker, nearestItem);
  }

  const target = todayItem || nearestItem;
  if (target) {
    target.classList.add('schedule-today');
    const label = document.createElement('div');
    label.className   = 'schedule-today-label';
    label.textContent = todayItem ? `⭐ 本日開催！（${todayStr}）` : '⭐ 次のイベント';
    target.querySelector('.schedule-card')?.prepend(label);
  }
}

// ── コンテンツブロック ─────────────────────────────
function renderContentBlocks() {
  const blocks = (window.YMS_CONFIG.contentBlocks || []).filter(b => b.visible !== false);
  if (!blocks.length) return;

  const imgs = (window.YMS_IMAGES || {}).contentBlockImages || {};

  // altナンバリング（偶数/奇数で背景を交互に）
  let altCount = 0;

  blocks.forEach(block => {
    const slot = document.getElementById('cb-' + block.position);
    if (!slot) return;

    const imgSrc   = imgs[block.id] || '';
    const hasImg   = !!imgSrc;
    const hasText  = !!(block.heading || block.text);
    const type     = block.type || 'image-left';

    const imgHtml  = hasImg
      ? `<figure class="cb-img fade-in"><img src="${imgSrc}" alt="${escHtml(block.heading || '')}" loading="lazy"></figure>`
      : '';
    const textHtml = hasText
      ? `<div class="cb-text fade-in">
          ${block.heading ? `<h3>${parseBold(escHtml(block.heading))}</h3>` : ''}
          ${block.text    ? `<p>${parseBold(escHtml(block.text))}</p>`      : ''}
         </div>`
      : '';

    let innerContent = '';
    if (type === 'image-only')  innerContent = imgHtml;
    else if (type === 'text-only') innerContent = textHtml;
    else innerContent = imgHtml + textHtml;

    const isAlt = (altCount++ % 2 === 1);
    const section = document.createElement('section');
    section.className = `cb-block cb-type-${type}${isAlt ? ' cb-block-alt' : ''}`;
    section.innerHTML = `<div class="cb-inner">${innerContent}</div>`;
    slot.appendChild(section);
  });
}

// ── メンバーモーダル ───────────────────────────────
function openMemberModal(key) {
  const profile = ((window.YMS_CONFIG || {}).memberProfiles || {})[key] || {};
  const imgs    = (window.YMS_IMAGES || {}).members || {};
  const imgSrc  = imgs[key] || '';

  // 写真
  const photoEl = document.getElementById('mmPhoto');
  if (photoEl) {
    if (imgSrc) {
      photoEl.innerHTML = `<img src="${imgSrc}" alt="${escHtml(profile.fullName || '')}">`;
    } else {
      const initial = (profile.fullName || key).charAt(0);
      photoEl.innerHTML = `<div class="mm-initial" style="background:linear-gradient(135deg,${profile.color||'var(--color-primary)'},var(--color-secondary))">${initial}</div>`;
    }
    photoEl.style.borderColor = profile.color || 'var(--color-primary)';
  }

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };
  set('mmFullName', profile.fullName);
  set('mmNickname', profile.nickname ? `「${profile.nickname}」` : '');

  // 詳細リスト
  const detailEl = document.getElementById('mmDetails');
  if (detailEl) {
    const rows = [];
    if (profile.birthday)   rows.push(['誕生日',  profile.birthday]);
    if (profile.height)     rows.push(['身長',    profile.height]);
    if (profile.bloodType)  rows.push(['血液型',  profile.bloodType]);
    if (profile.birthplace) rows.push(['出身地',  profile.birthplace]);
    detailEl.innerHTML = rows.map(([dt, dd]) => `<dt>${dt}</dt><dd>${escHtml(dd)}</dd>`).join('');
    detailEl.style.display = rows.length ? '' : 'none';
  }

  const descEl = document.getElementById('mmDescription');
  if (descEl) {
    descEl.innerHTML  = profile.description ? parseBold(escHtml(profile.description)) : '';
    descEl.style.display = profile.description ? '' : 'none';
  }

  const skillsEl = document.getElementById('mmSkills');
  if (skillsEl) {
    const skills = (profile.skills || '').split(/[,、\n]/).map(s => s.trim()).filter(Boolean);
    skillsEl.innerHTML = skills.map(s => `<span class="mm-skill-tag">${escHtml(s)}</span>`).join('');
    skillsEl.style.display = skills.length ? '' : 'none';
  }

  const snsEl = document.getElementById('mmSns');
  if (snsEl) {
    const icon = {
      x:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      tiktok:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.13 8.13 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/></svg>`,
      instagram:`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
      youtube:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`,
    };
    let sns = '';
    if (profile.twitter)   sns += `<a href="${escHtml(profile.twitter)}"   class="sns-x"        target="_blank" rel="noopener" aria-label="X (Twitter)">${icon.x}</a>`;
    if (profile.tiktok)    sns += `<a href="${escHtml(profile.tiktok)}"    class="sns-tiktok"   target="_blank" rel="noopener" aria-label="TikTok">${icon.tiktok}</a>`;
    if (profile.instagram) sns += `<a href="${escHtml(profile.instagram)}" class="sns-instagram" target="_blank" rel="noopener" aria-label="Instagram">${icon.instagram}</a>`;
    if (profile.youtube)   sns += `<a href="${escHtml(profile.youtube)}"   class="sns-youtube"  target="_blank" rel="noopener" aria-label="YouTube">${icon.youtube}</a>`;
    snsEl.innerHTML = sns;
    snsEl.style.display = sns ? '' : 'none';
  }

  const overlay = document.getElementById('memberModal');
  if (overlay) {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMemberModal(e) {
  if (e && e.target !== document.getElementById('memberModal')) return;
  const overlay = document.getElementById('memberModal');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Escキーで閉じる
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMemberModal();
});

// ── リワード動的レンダリング ───────────────────────
function renderRewards() {
  const plans = (window.YMS_CONFIG.rewardsData) || [];
  const tabsEl   = document.getElementById('rewardTabs');
  const panelsEl = document.getElementById('rewardPanels');
  if (!tabsEl || !panelsEl) return;

  const visiblePlans = plans
    .filter(p => p.visible !== false)
    .sort((a, b) => (a.headerType === 'expired' ? 1 : 0) - (b.headerType === 'expired' ? 1 : 0));
  if (visiblePlans.length === 0) return;

  tabsEl.innerHTML   = visiblePlans.map((p, i) => `
    <button class="reward-tab${i === 0 ? ' active' : ''}${p.headerType === 'expired' ? ' tab-expired' : ''}" data-tab="${p.id}">${escHtml(p.tabLabel)}</button>
  `).join('');

  panelsEl.innerHTML = visiblePlans.map((p, i) => {
    const headerClass = p.headerType === 'limited'     ? 'plan-header limited'
                      : p.headerType === 'coming-soon' ? 'plan-header coming-soon'
                      : p.headerType === 'expired'     ? 'plan-header expired'
                      : 'plan-header';
    const badge = p.headerType === 'limited'     ? '<span class="plan-badge">期間限定</span>'
                : p.headerType === 'coming-soon' ? '<span class="plan-badge">近日公開</span>'
                : p.headerType === 'expired'     ? '<span class="plan-badge badge-expired">販売終了</span>'
                : '';

    const cardsHtml = p.comingSoon
      ? renderComingSoonCards(p.cards)
      : p.cards.map(card => renderCard(card)).join('');

    const noticesHtml = p.notices && p.notices.length > 0
      ? `<div class="plan-notice">
           <h4>${escHtml(p.tabLabel)} 共通注意事項</h4>
           <ul>${p.notices.map(n => `<li>${escHtml(n)}</li>`).join('')}</ul>
         </div>`
      : '';

    return `
      <div class="reward-panel${i === 0 ? ' active' : ''}" id="tab-${p.id}">
        <div class="${headerClass}">
          ${badge}
          <h3>${escHtml(p.title)}</h3>
          ${p.periodText ? `<p class="plan-period">${escHtml(p.periodText)}</p>` : ''}
          ${p.periodNote ? `<p class="plan-note">${escHtml(p.periodNote)}</p>` : ''}
        </div>
        <div class="reward-cards">${cardsHtml}</div>
        ${noticesHtml}
      </div>
    `;
  }).join('');

  // タブ初期化
  initRewardTabs();
}

function renderComingSoonCards(cards) {
  return cards.map(card => `
    <div class="reward-card" data-reward-id="${card.id}">
      <div class="reward-card-img" style="display:none"></div>
      <div class="reward-price">¥${escHtml(card.price)}</div>
      ${card.limit ? `<div class="reward-limit">★ ${escHtml(card.limit)}</div>` : ''}
      <h4>${escHtml(card.title)}</h4>
      <button class="btn-reward btn-disabled" disabled>近日公開予定</button>
    </div>
  `).join('');
}

function renderCard(card) {
  // 販売開始日時を description から自動抽出（明示的な saleDate がない場合）
  let saleDate = card.saleDate || '';
  let desc = card.description || '';
  if (!saleDate) {
    if (desc.includes('｜') && /販売開始/.test(desc.substring(0, desc.indexOf('｜')))) {
      const idx = desc.indexOf('｜');
      saleDate = desc.substring(0, idx);
      desc = desc.substring(idx + 1);
    } else if (/販売開始$/.test(desc)) {
      saleDate = desc;
      desc = '';
    }
  }

  const saleDateHtml = saleDate
    ? `<div class="reward-sale-date">🗓 ${escHtml(saleDate)}</div>`
    : '';

  const subItemsHtml = card.subItems && card.subItems.length > 0
    ? `<div class="offkai-list">${card.subItems.map(s => `
        <div class="offkai-item">
          <strong>${escHtml(s.title)}</strong>
          <span>${escHtml(s.detail)}</span>
        </div>`).join('')}</div>`
    : '';

  const itemsHtml = card.items && card.items.length > 0
    ? `<ul class="reward-items">${card.items.map(i => `<li>${escHtml(i)}</li>`).join('')}</ul>`
    : '';

  const deliveryHtml = card.delivery && card.delivery.length > 0
    ? `<div class="reward-delivery">${card.delivery.map(d => `<p>${escHtml(d)}</p>`).join('')}</div>`
    : '';

  const descHtml = desc
    ? `<p class="reward-desc">${escHtml(desc)}</p>`
    : '';

  const imgHtml = card.image
    ? `<a href="plan.html?id=${escHtml(card.id)}" target="_blank" class="reward-card-img-link">
         <div class="reward-card-img"><img src="${escHtml(card.image)}" alt="${escHtml(card.title)}" loading="lazy"></div>
       </a>`
    : '<div class="reward-card-img" style="display:none"></div>';

  return `
    <div class="reward-card" data-reward-id="${card.id}">
      ${imgHtml}
      ${saleDateHtml}
      <div class="reward-price">¥${escHtml(card.price)}</div>
      ${card.limit ? `<div class="reward-limit">★ ${escHtml(card.limit)}</div>` : ''}
      <h4><a href="plan.html?id=${escHtml(card.id)}" target="_blank" class="reward-title-link">${escHtml(card.title)}</a></h4>
      ${descHtml}
      ${subItemsHtml}
      ${itemsHtml}
      ${deliveryHtml}
      <div class="reward-card-actions">
        <a href="plan.html?id=${escHtml(card.id)}" class="btn-reward btn-detail" target="_blank">詳細を見る</a>
        <a href="#" class="btn-reward soreos-link">ソレオスで支援する →</a>
      </div>
    </div>
  `;
}

// ── グループ紹介カルーセル ─────────────────────────
function renderGroupIntro() {
  const container = document.getElementById('groupIntroCarousel');
  if (!container) return;

  const images = [
    { src: 'intro-01.jpg', alt: 'youmenosayって？①' },
    { src: 'intro-02.jpg', alt: 'youmenosayって？②' },
    { src: 'member-intro.jpg',             alt: 'メンバー紹介' },
  ];

  container.innerHTML = images.map(m => `
    <figure class="h-carousel-item fade-in">
      <img src="${escHtml(m.src)}" alt="${escHtml(m.alt)}" loading="lazy">
    </figure>
  `).join('');
}

// ── メンバーメッセージカルーセル ───────────────────
function renderMemberMessages() {
  const container = document.getElementById('memberMessagesGrid');
  if (!container) return;

  container.classList.add('h-carousel');

  const messages = [
    { src: 'message-kano-1.jpg', alt: '北郷可恩からのメッセージ' },
    { src: 'message-kano-2.jpg', alt: '北郷可恩からのメッセージ②' },
    { src: 'message-sari.jpg',   alt: '雪乃さりからのメッセージ' },
    { src: 'message-reina.jpg', alt: '雨宮れいなからのメッセージ' },
    { src: 'message-haru.jpg', alt: 'ねむいのはるからのメッセージ' },
    { src: 'message-yuka.jpg',   alt: '陽葵優叶からのメッセージ' },
  ];

  container.innerHTML = messages.map(m => `
    <figure class="h-carousel-item fade-in">
      <img src="${escHtml(m.src)}" alt="${escHtml(m.alt)}" loading="lazy">
    </figure>
  `).join('');
}

// ── ドラッグスクロール（デスクトップ用） ─────────────
function initDragCarousels() {
  document.querySelectorAll('.h-carousel').forEach(el => {
    let isDown = false;
    let startX, scrollLeft;

    el.addEventListener('mousedown', e => {
      isDown    = true;
      startX    = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.classList.add('grabbing');
    });
    el.addEventListener('mouseleave', () => { isDown = false; el.classList.remove('grabbing'); });
    el.addEventListener('mouseup',    () => { isDown = false; el.classList.remove('grabbing'); });
    el.addEventListener('mousemove',  e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  });
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
  for (let i = 0; i < 60; i++) {
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
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
