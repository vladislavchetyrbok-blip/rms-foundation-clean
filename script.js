/**
 * Разом ми — сила (Together We Are Power)
 * Public Interactive Logic (`script.js`)
 */

let selectedAmount = 100;
let isMonthly = false;
let currentHonorFilter = 'all';
let currentCampFilter = 'all';
let statsAnimated = false;

// Global Debounce Utility
function debounce(func, wait = 200) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Init i18n
  if (window.I18nStore) {
    I18nStore.init();
    updateLanguageFlagUI(I18nStore.currentLang);
  }

  // 2. Setup Language Switcher Dropdown
  const langSelector = document.getElementById('langSelector');
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langSelector.classList.toggle('open');
    });
  }

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.getAttribute('data-lang');
      I18nStore.setLanguage(lang);
      updateLanguageFlagUI(lang);
      langSelector.classList.remove('open');
      renderAll();
    });
  });

  document.addEventListener('click', () => {
    if (langSelector) langSelector.classList.remove('open');
  });

  window.addEventListener('language_changed', () => {
    renderAll();
  });

  // 3. Listen for FoundationStore live updates (sync from Admin Panel)
  window.addEventListener('foundation_data_changed', () => {
    renderAll();
    showToast('⚡ Дані сайту оновлено!');
  });

  // 4. Initial Render
  renderAll();
  initLiveTicker();
});

function updateLanguageFlagUI(lang) {
  const flagEl = document.getElementById('currentFlag');
  const nameEl = document.getElementById('currentLangName');
  const flags = { uk: '🇺🇦', en: '🇬🇧', pl: '🇵🇱', ro: '🇷🇴', it: '🇮🇹', de: '🇩🇪' };
  if (flagEl) flagEl.textContent = flags[lang] || '🇺🇦';
  if (nameEl) nameEl.textContent = lang.toUpperCase();
}

// === Mobile Drawer Functions ===
function toggleMobileMenu() {
  const overlay = document.getElementById('mobileDrawerOverlay');
  if (overlay) overlay.classList.toggle('active');
}

function closeMobileMenu() {
  const overlay = document.getElementById('mobileDrawerOverlay');
  if (overlay) overlay.classList.remove('active');
}

function setMobileLang(lang) {
  if (window.I18nStore) {
    I18nStore.setLanguage(lang);
    updateLanguageFlagUI(lang);
    renderAll();
  }
  closeMobileMenu();
}

function renderAll() {
  renderStats();
  renderCampaigns();
  renderGallery();
  renderHonorBoard();
}

// === Render Stats ===
function renderStats() {
  const stats = FoundationStore.getStats();
  const stCollected = document.getElementById('statCollected');
  const stDrones = document.getElementById('statDrones');
  const stFamilies = document.getElementById('statFamilies');
  const stVolunteers = document.getElementById('statVolunteers');

  if (!statsAnimated) {
    const statsSec = document.getElementById('stats');
    if (statsSec && window.IntersectionObserver) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animateStatsOnce();
          obs.disconnect();
        }
      }, { threshold: 0.2 });
      obs.observe(statsSec);
      return;
    } else {
      animateStatsOnce();
      return;
    }
  }

  if (stCollected) stCollected.textContent = `${(stats.totalCollected / 1000000).toFixed(2)}+ млн ₴`;
  if (stDrones) stDrones.textContent = stats.dronesAndVehicles;
  if (stFamilies) stFamilies.textContent = `${stats.familiesSupported.toLocaleString()}+`;
  if (stVolunteers) stVolunteers.textContent = stats.volunteersCount;
}

function animateStatsOnce() {
  if (statsAnimated) return;
  const stats = FoundationStore.getStats();
  const stCollected = document.getElementById('statCollected');
  const stDrones = document.getElementById('statDrones');
  const stFamilies = document.getElementById('statFamilies');
  const stVolunteers = document.getElementById('statVolunteers');

  if (stCollected) animateNumber(stCollected, stats.totalCollected / 1000000, '', '+ млн ₴', true);
  if (stDrones) animateNumber(stDrones, stats.dronesAndVehicles, '', '', false);
  if (stFamilies) animateNumber(stFamilies, stats.familiesSupported, '', '+', false);
  if (stVolunteers) animateNumber(stVolunteers, stats.volunteersCount, '', '', false);
  statsAnimated = true;
}

function animateNumber(el, target, prefix = '', suffix = '', isFloat = false) {
  let start = 0;
  const duration = 2000;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = start + (target - start) * easeProgress;
    
    if (isFloat) {
      el.textContent = `${prefix}${currentVal.toFixed(2)}${suffix}`;
    } else {
      el.textContent = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${prefix}${isFloat ? target.toFixed(2) : target.toLocaleString()}${suffix}`;
    }
  }
  requestAnimationFrame(update);
}

// === Render Campaigns ===
function filterCampaigns(cat, btnEl) {
  currentCampFilter = cat;
  const btns = document.querySelectorAll('.camp-filter-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderCampaigns();
}

function renderCampaigns() {
  const container = document.getElementById('campaignsContainer');
  if (!container) return;
  const campaigns = FoundationStore.getCampaigns();
  const lang = I18nStore.currentLang || 'uk';

  const filteredCampaigns = currentCampFilter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.category === currentCampFilter);

  container.innerHTML = filteredCampaigns.map(camp => {
    const titleText = typeof camp.title === 'object' ? (camp.title[lang] || camp.title.uk) : camp.title;
    const descText = typeof camp.desc === 'object' ? (camp.desc[lang] || camp.desc.uk) : camp.desc;
    const percent = Math.min(Math.round((camp.collected / camp.target) * 100), 100);

    const goalLbl = I18nStore.t('camp_goal') || 'Ціль:';
    const collLbl = I18nStore.t('camp_collected') || 'Зібрано:';
    const btnLbl = I18nStore.t('camp_btn') || 'Підтримати збір';
    const urgentLbl = I18nStore.t('camp_urgent_badge') || '🔥 КРИТИЧНО ТЕРМІНОВО';
    const copyHintLbl = I18nStore.t('copy_hint') || 'Скопіювати';

    return `
      <div class="campaign-card">
        <div>
          ${camp.image ? `<img src="${camp.image}" class="campaign-img" alt="${titleText}">` : ''}
          <div class="campaign-top">
            <div class="campaign-icon">${camp.icon || '🎯'}</div>
            ${camp.urgent ? `<span class="badge-urgent">${urgentLbl}</span>` : ''}
          </div>
          <h3 class="campaign-title">${titleText}</h3>
          <p class="campaign-desc">${descText}</p>
          ${camp.jarUrl ? `
            <div style="margin: 14px 0; padding: 14px; background: rgba(0,0,0,0.35); border-radius: 14px; border: 1px dashed var(--accent-gold);">
              <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 4px;">💳 Номер картки Банки (Monobank):</div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 4px;">
                <div style="font-size: 1.05rem; font-weight: 700; color: #fff; letter-spacing: 1.5px; user-select: all;">${camp.cardNum || ''}</div>
                <button class="btn btn-outline" style="padding: 6px 14px; font-size: 0.75rem; border-radius: 20px;" onclick="copyTxtWithFeedback('${camp.cardNum}', this)">📋 <span>${copyHintLbl}</span></button>
              </div>
              <a href="${camp.jarUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; color: var(--accent-gold); font-weight: 600; font-size: 0.9rem; text-decoration: none;">🔗 Перейти на офіційну Банку →</a>
            </div>
          ` : ''}
        </div>

        <div>
          ${(camp.target && camp.collected && !camp.hideProgress) ? `
          <div class="progress-wrap">
            <div class="progress-stats">
              <span>${collLbl} <strong style="color: var(--accent-gold);">${Number(camp.collected).toLocaleString()} ₴</strong></span>
              <span>${goalLbl} ${Number(camp.target).toLocaleString()} ₴ (${percent}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
          </div>
          ` : ''}

          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: ${(!camp.target || camp.hideProgress) ? '14px' : '0'};">
            <button class="btn btn-primary" style="flex: 1; min-width: 200px; padding: 14px 18px; font-size: 0.95rem;" onclick="openModalForCamp('${camp.id}')">
              <span>⚡ ${btnLbl} (Monobank)</span>
            </button>
            <button class="btn" style="flex: 1; min-width: 200px; padding: 14px 18px; font-size: 0.95rem; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border-radius: 35px; font-weight: 800; box-shadow: 0 6px 20px rgba(37,99,235,0.4);" onclick="simulateDonate('WayForPay')">
              <span>🌐 WayForPay (Картка/Apple Pay)</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// === Render Honor Board ===
function filterHonor(cat, btnEl) {
  currentHonorFilter = cat;
  document.querySelectorAll('.honor-filter-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderHonorBoard();
}

function renderHonorBoard() {
  const container = document.getElementById('honorContainer');
  if (!container) return;
  const list = FoundationStore.getHonorBoard();
  const filtered = currentHonorFilter === 'all' ? list : list.filter(h => h.category === currentHonorFilter);
  const contribLbl = I18nStore.t('honor_contribution') || 'Внесок:';

  container.innerHTML = filtered.map(item => `
    <div class="honor-card">
      ${item.image ? `<img src="${item.image}" class="honor-img" style="object-fit: ${item.imageFit || 'cover'}; object-position: ${item.imagePos || 'top center'};" alt="${item.name}">` : ''}
      <div class="honor-top">
        <div class="honor-avatar">${item.icon || '🌟'}</div>
        <span class="honor-badge ${item.badgeClass || 'badge-gold'}">${item.badge || 'Благодійник'}</span>
      </div>
      <h3 class="honor-name">${item.name}</h3>
      <div class="honor-role">${item.role}</div>
      <p class="honor-desc" style="margin-top: 8px;">${item.desc || ''}</p>
    </div>
  `).join('');
}

// === Render Gallery / Work Reports (Horizontal Carousel) ===
function renderGallery() {
  const container = document.getElementById('galleryContainer');
  if (!container) return;

  const list = FoundationStore.getGallery();
  if (!list || list.length === 0) {
    container.innerHTML = '<p style="color: #ccc; text-align: center; width: 100%; padding: 40px 0;">Хроніка фотозвітів оновлюється...</p>';
    return;
  }

  // Show up to 15 latest photos inside the horizontal scroll carousel
  const carouselItems = list.slice(0, 15);

  let html = carouselItems.map(item => `
    <div class="gallery-card" style="flex: 0 0 310px; max-width: 310px; scroll-snap-align: start; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: 0.3s; display: flex; flex-direction: column;">
      <div style="background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; height: 260px; overflow: hidden; position: relative;">
        <img src="${item.image || 'work_medical_aid.jpg'}" alt="${item.title || 'Фотозвіт'}" style="width: 100%; height: 100%; object-fit: ${item.imageFit || 'contain'}; object-position: ${item.imagePos || 'center center'}; transition: transform 0.5s;">
        ${item.category ? `<span style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); color: #fff; font-size: 0.8rem; font-weight: 600; padding: 4px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);">${item.category}</span>` : ''}
      </div>
      ${(item.title || item.desc) ? `
      <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: center;">
        ${item.title ? `<h3 style="font-size: 1.1rem; font-family: var(--font-heading); margin-bottom: ${item.desc ? '6px' : '0'}; color: #fff;">${item.title}</h3>` : ''}
        ${item.desc ? `<p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.4; margin: 0;">${item.desc}</p>` : ''}
      </div>
      ` : ''}
    </div>
  `).join('');

  const allTitle = I18nStore.t('gallery_card_all_title') || 'Показати всі фото';
  const allDesc = I18nStore.t('gallery_card_all_desc') || 'Відкрити повний архів фотозвітів на окремій сторінці';
  const allBtn = I18nStore.t('gallery_card_all_btn') || 'Відкрити весь архів ➔';

  // Add the "Show All Photos" card right at the end of the slider!
  html += `
    <a href="gallery.html" class="gallery-card show-all-card" style="flex: 0 0 300px; max-width: 300px; scroll-snap-align: start; background: linear-gradient(135deg, rgba(255,183,3,0.15), rgba(30,96,242,0.25)); border: 2px dashed var(--accent-gold); border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-decoration: none; text-align: center; transition: 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.35); min-height: 260px;">
      <div style="font-size: 3.5rem; margin-bottom: 12px; filter: drop-shadow(0 0 10px rgba(255,183,3,0.5));">📂</div>
      <h3 style="color: #fff; font-size: 1.25rem; font-weight: 900; margin-bottom: 8px;">${allTitle}</h3>
      <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 18px; line-height: 1.4;">${allDesc} (${list.length})</p>
      <span class="btn btn-primary" style="padding: 10px 22px; font-size: 0.88rem;">${allBtn}</span>
    </a>
  `;

  container.innerHTML = html;
}

function scrollGalleryLeft() {
  const container = document.getElementById('galleryContainer');
  if (container) container.scrollBy({ left: -340, behavior: 'smooth' });
}

function scrollGalleryRight() {
  const container = document.getElementById('galleryContainer');
  if (container) container.scrollBy({ left: 340, behavior: 'smooth' });
}

// === Render News & Frontline Reports ===
function renderNews() {
  const container = document.getElementById('newsContainer');
  if (!container) return;
  const newsList = FoundationStore.getNews();
  const lang = I18nStore.currentLang || 'uk';

  container.innerHTML = newsList.map(item => {
    const titleText = typeof item.title === 'object' ? (item.title[lang] || item.title.uk) : item.title;
    const descText = typeof item.desc === 'object' ? (item.desc[lang] || item.desc.uk) : item.desc;

    return `
      <div class="news-card">
        ${item.image ? `<img src="${item.image}" class="news-img" alt="${titleText}">` : ''}
        <div class="news-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="news-date">${item.date || ''}</span>
            ${item.badge ? `<span style="background: rgba(30,96,242,0.2); color: #60a5fa; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">${item.badge}</span>` : ''}
          </div>
          <h3 class="news-title">${titleText}</h3>
          <p class="news-desc">${descText}</p>
        </div>
      </div>
    `;
  }).join('');
}

// === Interactive Impact Calculator ===
function updateCalculator(val) {
  val = Number(val);
  const disp = document.getElementById('calcValDisplay');
  const btnVal = document.getElementById('calcBtnVal');
  if (disp) disp.textContent = `${val.toLocaleString()} ₴`;
  if (btnVal) btnVal.textContent = `${val.toLocaleString()} ₴`;

  const wCount = Math.max(1, Math.floor(val / 150));
  const tCount = (val / 500).toFixed(1);
  const iCount = (val / 2500).toFixed(1);
  const ePercent = Math.min(100, ((val / 40000) * 100)).toFixed(1);

  const resWarm = document.getElementById('resWarm');
  const resTourniquet = document.getElementById('resTourniquet');
  const resIfak = document.getElementById('resIfak');
  const resEcoflow = document.getElementById('resEcoflow');

  if (resWarm) resWarm.textContent = `${wCount} шт.`;
  if (resTourniquet) resTourniquet.textContent = `${tCount} шт.`;
  if (resIfak) resIfak.textContent = `${iCount} шт.`;
  if (resEcoflow) resEcoflow.textContent = `${ePercent}%`;
}

function donateFromCalc() {
  const slider = document.getElementById('impactSlider');
  const val = slider ? Number(slider.value) : 500;
  selectedAmount = val;
  openModal();
  showToast(`Оформлення внеску на суму ${val.toLocaleString()} ₴...`);
}


// === Widget Controls ===
function setFreq(el) {
  document.querySelectorAll('.freq-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  isMonthly = el.textContent.includes('Щомісяч') || el.textContent.includes('Monthly') || el.textContent.includes('co miesiąc');
}

function selectAmount(amt) {
  selectedAmount = amt;
  const customIn = document.getElementById('customAmount');
  if (customIn) customIn.value = '';
  document.querySelectorAll('.amount-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.includes(amt));
  });
  updateSubmitBtnTxt();
}

function clearPresetBtns() {
  const customIn = document.getElementById('customAmount');
  if (customIn && customIn.value) {
    selectedAmount = Number(customIn.value);
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
  }
  updateSubmitBtnTxt();
}

function updateSubmitBtnTxt() {
  const txt = document.getElementById('submitAmountTxt');
  if (txt) {
    const customIn = document.getElementById('customAmount');
    const val = (customIn && customIn.value) ? customIn.value : selectedAmount;
    txt.textContent = `${val} ₴`;
  }
}

function processQuickDonate() {
  const customIn = document.getElementById('customAmount');
  const val = (customIn && customIn.value) ? Number(customIn.value) : selectedAmount;
  openModal();
  showToast(`Оформлення внеску на суму ${val} ₴...`);
}

function openModalForCamp(id) {
  const camps = FoundationStore.getCampaigns();
  const camp = camps.find(c => c.id === id);
  if (camp && camp.jarUrl) {
    window.open(camp.jarUrl, '_blank');
    showToast('⏳ Перехід на офіційну Банку Monobank...');
    return;
  }
  openModal();
  showToast('Оберіть зручний спосіб оплати для цього збору');
}

// === Modal Window ===
function openModal() {
  const m = document.getElementById('donationModal');
  if (!m) return;
  showModalTab('card');
  m.classList.add('active');
  document.body.style.overflow = 'hidden';
  const closeBtn = m.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus({ preventScroll: true });
}

function closeModal() {
  const m = document.getElementById('donationModal');
  if (m) {
    m.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function closeModalOutside(e) {
  if (e.target.id === 'donationModal') closeModal();
}

// Modal Keyboard Accessibility (Escape to close, Focus Trap)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  const m = document.getElementById('donationModal');
  if (m && m.classList.contains('active') && e.key === 'Tab') {
    const focusable = m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
});

function showModalTab(tabId) {
  const panels = {
    card: document.getElementById('modalTabCard'),
    iban: document.getElementById('modalTabIban'),
    crypto: document.getElementById('modalTabCrypto'),
    qr: document.getElementById('modalTabQr')
  };

  Object.entries(panels).forEach(([key, el]) => {
    if (el) el.style.display = key === tabId ? 'block' : 'none';
  });

  document.querySelectorAll('.modal-tab').forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
}

function simulateDonate(method) {
  const camps = window.FoundationStore ? window.FoundationStore.getCampaigns() : [];
  if (method === 'Monobank') {
    const mUrl = (camps.length > 0 && camps[0].jarUrl) ? camps[0].jarUrl : 'https://send.monobank.ua/jar/6iL3oH5Vde';
    window.open(mUrl, '_blank');
    closeModal();
    showToast('🐱 Відкриваємо офіційну Банку Monobank...');
    return;
  }
  if (method === 'WayForPay') {
    const wUrl = (camps.length > 0 && camps[0].wayforpayUrl) ? camps[0].wayforpayUrl : window.WAYFORPAY_URL || 'https://secure.wayforpay.com/donate';
    window.open(wUrl, '_blank');
    closeModal();
    showToast('🌐 Відкриваємо захищений шлюз WayForPay (Картка/Apple Pay/Google Pay)...');
    return;
  }
  if (method === 'Privat24' || method === 'LiqPay') {
    window.open('https://www.privat24.ua', '_blank');
    closeModal();
    showToast('🟢 Переходимо на офіційний портал Приват24...');
    return;
  }
  showToast(`⏳ Перехід до захищеного шлюзу ${method}...`);
  setTimeout(() => {
    if (camps.length > 0 && camps[0].target && !camps[0].hideProgress) {
      window.FoundationStore.updateCampaignAmount(camps[0].id, 500);
    }
    closeModal();
    showToast('❤️ Дякуємо за ваш внесок! Дані збору оновлено.');
  }, 1200);
}

function copyTxt(text) {
  copyTxtWithFeedback(text, null);
}

function copyTxtWithFeedback(text, btnEl) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(I18nStore.t('copied') || '✅ Реквізити скопійовано в буфер обміну!');
    if (btnEl) {
      const originalHtml = btnEl.innerHTML;
      btnEl.classList.add('btn-copied');
      btnEl.innerHTML = `<span>${I18nStore.t('copied') || '✅ Скопійовано!'}</span>`;
      setTimeout(() => {
        btnEl.classList.remove('btn-copied');
        btnEl.innerHTML = originalHtml;
      }, 2000);
    }
  }).catch(() => {
    showToast('📋 Реквізити скопійовано!');
  });
}


// ==========================================
// TOP-5 NEW FEATURES RENDERING FUNCTIONS
// ==========================================

// --- 1. Render Mega-Goal ---
function renderMegaGoal() {
  const container = document.getElementById('megaGoalContainer');
  if (!container || !FoundationStore.getMegaGoal) return;
  const mg = FoundationStore.getMegaGoal();
  const lang = I18nStore.currentLang || 'uk';
  const titleText = typeof mg.title === 'object' ? (mg.title[lang] || mg.title.uk) : mg.title;
  const subText = typeof mg.subtitle === 'object' ? (mg.subtitle[lang] || mg.subtitle.uk) : mg.subtitle;
  const percent = Math.min(Math.round((mg.collected / mg.target) * 100), 100);

  const goalLbl = I18nStore.t('camp_goal') || 'Ціль:';
  const collLbl = I18nStore.t('camp_collected') || 'Зібрано:';

  const milestonesHtml = (mg.milestones || []).map(m => {
    const mTitle = typeof m.title === 'object' ? (m.title[lang] || m.title.uk) : m.title;
    const mDesc = typeof m.desc === 'object' ? (m.desc[lang] || m.desc.uk) : m.desc;
    return `
      <div class="milestone-card ${m.unlocked ? 'unlocked' : ''}">
        <div class="milestone-icon">${m.icon || '🎯'}</div>
        <div style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 4px;">${m.pct}% РІВЕНЬ</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 6px;">${mTitle}</div>
        <div style="font-size: 0.8rem; color: #aaa;">${mDesc}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="text-align: center; max-width: 800px; margin: 0 auto 24px;">
      <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 10px; text-shadow: 0 0 20px rgba(0, 212, 255, 0.4);">${titleText}</h2>
      <p style="font-size: 1.05rem; color: #ccc;">${subText}</p>
    </div>
    <div class="progress-wrap" style="max-width: 860px; margin: 0 auto;">
      <div class="progress-stats" style="font-size: 1.1rem; margin-bottom: 8px;">
        <span>${collLbl} <strong style="color: var(--accent-gold); font-size: 1.3rem;">${Number(mg.collected).toLocaleString()} ₴</strong></span>
        <span>${goalLbl} <strong>${Number(mg.target).toLocaleString()} ₴</strong> (${percent}%)</span>
      </div>
      <div class="progress-bar-bg" style="height: 18px; border-radius: 10px; background: rgba(0,0,0,0.6); padding: 3px; border: 1px solid rgba(255,255,255,0.15);">
        <div class="progress-bar-fill" style="width: ${percent}%; height: 100%; border-radius: 8px; background: linear-gradient(90deg, #00d4ff, #ffb703); box-shadow: 0 0 15px rgba(255,183,3,0.6);"></div>
      </div>
    </div>
    <div class="milestones-grid">
      ${milestonesHtml}
    </div>
    <div style="text-align: center; margin-top: 30px;">
      <button class="btn btn-primary" style="padding: 16px 40px; font-size: 1.1rem; box-shadow: 0 0 25px rgba(255, 183, 3, 0.5);" onclick="openModalForCamp('drones_camp_2')">
        <span>⚡ Підтримати Мега-Ціль (Monobank)</span>
      </button>
    </div>
  `;
}

// --- 2. Render Frontline Needs Radar ---
function renderFrontlineRadar() {
  const container = document.getElementById('radarContainer');
  if (!container || !FoundationStore.getFrontlineRadar) return;
  const requests = FoundationStore.getFrontlineRadar();
  const lang = I18nStore.currentLang || 'uk';
  const btnLbl = I18nStore.t('radar_btn') || '⚡ Закрити запит';

  container.innerHTML = requests.map(req => {
    const bName = typeof req.brigade === 'object' ? (req.brigade[lang] || req.brigade.uk) : req.brigade;
    const nText = typeof req.need === 'object' ? (req.need[lang] || req.need.uk) : req.need;
    const badgeText = typeof req.badge === 'object' ? (req.badge[lang] || req.badge.uk) : req.badge;
    const percent = Math.min(Math.round((req.collected / req.target) * 100), 100);
    const isComp = req.status === 'completed';

    return `
      <div class="radar-card">
        <div>
          <span class="radar-badge ${isComp ? 'radar-completed' : 'radar-urgent'}">${badgeText}</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 10px;">${bName}</h3>
          <p style="font-size: 1.05rem; color: var(--accent-gold); font-weight: 600; margin-bottom: 20px;">📌 ${nText}</p>
        </div>
        <div>
          <div class="progress-wrap" style="margin-bottom: 20px;">
            <div class="progress-stats" style="font-size: 0.85rem;">
              <span>Зібрано: <strong style="color: #fff;">${Number(req.collected).toLocaleString()} ₴</strong></span>
              <span>Ціль: ${Number(req.target).toLocaleString()} ₴ (${percent}%)</span>
            </div>
            <div class="progress-bar-bg" style="height: 10px;">
              <div class="progress-bar-fill" style="width: ${percent}%; ${isComp ? 'background: #10b981;' : ''}"></div>
            </div>
          </div>
          <button class="btn ${isComp ? 'btn-outline' : 'btn-primary'}" style="width: 100%; ${isComp ? 'opacity: 0.6; cursor: not-allowed;' : ''}" onclick="${isComp ? '' : `openModalForCamp('drones_camp_2')`}" ${isComp ? 'disabled' : ''}>
            <span>${isComp ? '✅ Виконано' : btnLbl}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// --- 3. Render Impact Map ---
function renderImpactMap() {
  const container = document.getElementById('impactMapContainer');
  if (!container || !FoundationStore.getImpactMap) return;
  const mapData = FoundationStore.getImpactMap();
  const lang = I18nStore.currentLang || 'uk';

  const lblDrones = I18nStore.t('map_drones') || '🛸 Дрони / РЕБ:';
  const lblMed = I18nStore.t('map_med') || '🏥 Тактична медицина:';
  const lblAuto = I18nStore.t('map_auto') || '🚗 Транспорт / Логістика:';

  container.innerHTML = mapData.map(item => {
    const rName = typeof item.name === 'object' ? (item.name[lang] || item.name.uk) : item.name;
    const rDesc = typeof item.desc === 'object' ? (item.desc[lang] || item.desc.uk) : item.desc;
    
    let badgeClass = 'map-status-active';
    let badgeTxt = 'АКТИВНИЙ НАПРЯМОК';
    if (item.status === 'hot') { badgeClass = 'map-status-hot'; badgeTxt = '🔥 ГАРЯЧА ТОЧКА'; }
    else if (item.status === 'logistics') { badgeClass = 'map-status-logistics'; badgeTxt = '📦 ЛОГІСТИЧНИЙ ХАБ'; }

    return `
      <div class="map-card">
        <div>
          <div class="map-card-header">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #fff; margin: 0;">${item.icon} ${rName}</h3>
            <span class="${badgeClass}">${badgeTxt}</span>
          </div>
          <p style="font-size: 0.9rem; color: #bbb; margin-bottom: 20px; line-height: 1.5;">${rDesc}</p>
        </div>
        <div style="background: rgba(0,0,0,0.35); padding: 14px 18px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
          <div class="map-stat-row"><span>${lblDrones}</span> <span class="map-stat-val">${item.drones}</span></div>
          <div class="map-stat-row"><span>${lblMed}</span> <span class="map-stat-val">${item.med}</span></div>
          <div class="map-stat-row"><span>${lblAuto}</span> <span class="map-stat-val">${item.auto}</span></div>
        </div>
      </div>
    `;
  }).join('');
}

// --- 4. Render Patron Club ---
function renderPatronClub() {
  const container = document.getElementById('patronContainer');
  if (!container || !FoundationStore.getPatronTiers) return;
  const tiers = FoundationStore.getPatronTiers();
  const lang = I18nStore.currentLang || 'uk';
  const btnLbl = I18nStore.t('patron_btn') || '🤝 Оформити підписку';

  container.innerHTML = tiers.map(tier => {
    const tTitle = typeof tier.title === 'object' ? (tier.title[lang] || tier.title.uk) : tier.title;
    const tPeriod = typeof tier.period === 'object' ? (tier.period[lang] || tier.period.uk) : tier.period;
    const tDesc = typeof tier.desc === 'object' ? (tier.desc[lang] || tier.desc.uk) : tier.desc;
    
    const perksHtml = (tier.perks || []).map(p => {
      const pText = typeof p === 'object' ? (p[lang] || p.uk) : p;
      return `<li>✔ ${pText}</li>`;
    }).join('');

    return `
      <div class="patron-card ${tier.popular ? 'popular' : ''}">
        ${tier.popular ? `<div class="patron-badge-popular">🔥 НАЙПОПУЛЯРНІШИЙ</div>` : ''}
        <div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff;">${tTitle}</h3>
          <div class="patron-price">${tier.amount} <span style="font-size: 1rem; font-weight: 500; color: #aaa;">${tPeriod}</span></div>
          <p style="font-size: 0.9rem; color: #bbb; min-height: 48px;">${tDesc}</p>
          <ul class="patron-perk-list">
            ${perksHtml}
          </ul>
        </div>
        <button class="btn ${tier.popular ? 'btn-primary' : 'btn-outline'}" style="width: 100%; padding: 16px;" onclick="openModalForCamp('drones_camp_2')">
          <span>${btnLbl}</span>
        </button>
      </div>
    `;
  }).join('');
}

// --- 5. Viral Certificate Generator ---
function drawCertificate() {
  const canvas = document.getElementById('certCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const nameEl = document.getElementById('certInputName');
  const tierEl = document.getElementById('certSelectTier');
  
  const donorName = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : 'Олександр Благодійник';
  const tierVal = tierEl ? tierEl.value : 'sky';
  
  let tierTitle = '🛡️ ЗАХИСНИК НЕБА (ДРОНИ ТА РЕБ)';
  if (tierVal === 'med') tierTitle = '🏥 АНГЕЛ МЕДИЦИНИ (ТАКТИЧНА МЕДИЦИНА)';
  if (tierVal === 'patron') tierTitle = '🌟 ПОЧЕСНИЙ МЕЦЕНАТ ФОНДУ';

  // Draw Background
  const grad = ctx.createLinearGradient(0, 0, 800, 560);
  grad.addColorStop(0, '#0d1832');
  grad.addColorStop(1, '#080c1e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 560);

  // Draw Gold Border
  ctx.strokeStyle = '#ffb703';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 768, 528);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, 748, 508);

  // Foundation Header
  ctx.fillStyle = '#ffb703';
  ctx.font = 'bold 22px "Inter", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('БЛАГОДІЙНИЙ ФОНД «РАЗОМ МИ — СИЛА»', 400, 80);

  ctx.fillStyle = '#aaa';
  ctx.font = '14px "Inter", sans-serif';
  ctx.fillText('ОФІЦІЙНИЙ СЕРТИФІКАТ ПОДЯКИ • ЄДРПОУ 44859201', 400, 106);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "Inter", sans-serif';
  ctx.fillText('СЕРТИФІКАТ БЛАГОДІЙНИКА', 400, 170);

  // Text
  ctx.fillStyle = '#cccccc';
  ctx.font = '18px "Inter", sans-serif';
  ctx.fillText('Цим сертифікатом висловлюється щира подяка та пошана:', 400, 220);

  // Donor Name
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 36px "Inter", sans-serif';
  ctx.fillText(donorName, 400, 280);

  // Underline
  ctx.strokeStyle = '#ffb703';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(150, 295);
  ctx.lineTo(650, 295);
  ctx.stroke();

  // Tier
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Inter", sans-serif';
  ctx.fillText('За вагомий внесок у спільну Перемогу в статусі:', 400, 340);

  ctx.fillStyle = '#ffb703';
  ctx.font = 'bold 24px "Inter", sans-serif';
  ctx.fillText(tierTitle, 400, 380);

  // Footer / Signature
  ctx.fillStyle = '#999999';
  ctx.font = '14px "Inter", sans-serif';
  ctx.textAlign = 'left';
  const dateStr = new Date().toLocaleDateString('uk-UA');
  ctx.fillText(`Дата видачі: ${dateStr}`, 60, 470);
  ctx.fillText(`ID: RMS-${Date.now().toString().slice(-6)}`, 60, 495);

  ctx.textAlign = 'right';
  ctx.fillText('Директор фонду: В. Четырбок _________', 740, 470);
  ctx.fillText('Офіційна печатка БФ «Разом ми — сила»', 740, 495);

  // Gold Seal Graphic
  ctx.beginPath();
  ctx.arc(400, 480, 40, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 183, 3, 0.15)';
  ctx.fill();
  ctx.strokeStyle = '#ffb703';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#ffb703';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★', 400, 488);
}

function downloadCertificate() {
  const canvas = document.getElementById('certCanvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `Certificate_RMS_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('💾 Сертифікат успішно завантажено на ваш пристрій!');
}

// === Toast ===
function showToast(msg) {
  const t = document.getElementById('toastBox');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => {
    t.classList.remove('show');
  }, 3500);
}

// === Form Submit ===
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('appName').value;
  const phone = document.getElementById('appPhone').value;
  const email = document.getElementById('appEmail').value;
  const type = document.getElementById('appType').value;
  const message = document.getElementById('appMsg').value;

  const app = window.FoundationStore.addApplication({ name, phone, email, type, message });

  e.target.reset();
  showToast(`🎉 Дякуємо, ${name}! Ваша заявка № ${app.id.slice(-6)} прийнята до обробки.`);
  
  // Додаємо подію в живу стрічку
  TICKER_EVENTS.unshift({
    name: name,
    amount: type === 'volunteer' ? 'Волонтер' : 'Партнер',
    camp: 'Приєднався до команди!',
    icon: '🤝'
  });
}

// === Live Support Ticker (Social Proof) ===
const TICKER_EVENTS = [
  { name: 'Олександр М.', amount: '500 ₴', camp: 'на Паливо для евакуації', icon: '⛽' },
  { name: 'Компанія "Логістик-Транс"', amount: '10 000 ₴', camp: 'Офіційний збір на пальне', icon: '🚙' },
  { name: 'Володимир П.', amount: '200 ₴', camp: 'на Паливо для гуманітарних місій', icon: '🚗' },
  { name: 'Ірина В.', amount: '50 €', camp: 'на Пальне для шпитального рейсу', icon: '🚑' },
  { name: 'Денис С.', amount: '1 500 ₴', camp: 'на Ремонт евакуаційного авто', icon: '🔧' },
  { name: 'Анонімний благодійник', amount: '5 000 ₴', camp: 'на Паливо для фронту', icon: '⛽' },
  { name: 'Олена Т.', amount: '300 ₴', camp: 'на Бензин для волонтерів', icon: '⚡' },
  { name: 'Марія К.', amount: '2 500 ₴', camp: 'на Гуманітарний конвой', icon: '🤝' }
];

function initLiveTicker() {
  const tickerEl = document.getElementById('liveTicker');
  if (!tickerEl) return;
  
  let eventIndex = 0;
  
  function showNextEvent() {
    const ev = TICKER_EVENTS[eventIndex];
    eventIndex = (eventIndex + 1) % TICKER_EVENTS.length;
    
    tickerEl.innerHTML = `
      <div style="font-size: 1.5rem;">${ev.icon}</div>
      <div>
        <div style="color: #aaa; font-size: 0.76rem;">${ev.name} • <span style="color: var(--accent-gold); font-weight: 700;">+${ev.amount}</span></div>
        <div style="color: #fff; font-size: 0.86rem; font-weight: 600;">${ev.camp}</div>
      </div>
    `;
    
    tickerEl.classList.add('show');
    
    setTimeout(() => {
      tickerEl.classList.remove('show');
    }, 5000);
  }

  setTimeout(() => {
    showNextEvent();
    setInterval(showNextEvent, 12000);
  }, 4000);
}



// Live Ticker Simulator
const TICKER_NAMES = ['🇺🇸 Michael D.', '🇩🇪 Hans M.', '🇵🇱 Piotr K.', '🇺🇦 Олена В.', '🇫🇷 Antoine R.', '🇳🇱 Jan B.', '🇮🇹 Marco P.', '🇪🇸 Elena G.', '🇨🇭 Stefan W.', '🇸🇪 Erik N.', '🇺🇸 Jessica M.', '🇬🇧 James P.', '🇩🇪 Klaus B.', '🇨🇦 Robert H.', '🇺🇦 Тарас М.', '🇺🇦 Максим Л.', '🇵🇱 Katarzyna Z.'];
const TICKER_AMOUNTS = ['$50', '$100', '$250', '$500', '€200', '€1,000', '£150', '$1,500', '2,000 ₴', '5,000 ₴', '10,000 ₴', '$300', '€450', '$2,500', '$750', '€600', '$1,200'];
const TICKER_TARGETS = ['Паливо для евакуації', 'Пальне для гуманітарних місій', 'Шпитальний транспорт', 'Бензин для волонтерських авто', 'Офіційний збір на пальне', 'Ремонт евакуаційних пікапів', 'Гуманітарний конвой на Схід', 'Пальне для медиків', 'Логістика вантажів', 'Дизель для генераторів'];

function initLiveTickerSimulator() {
  const stream = document.getElementById('liveTickerStream');
  if (!stream) return;

  setInterval(() => {
    const name = TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
    const amount = TICKER_AMOUNTS[Math.floor(Math.random() * TICKER_AMOUNTS.length)];
    const target = TICKER_TARGETS[Math.floor(Math.random() * TICKER_TARGETS.length)];

    const item = document.createElement('div');
    item.className = 'live-ticker-item';
    item.innerHTML = `
      <span>${name}</span>
      <span class="live-ticker-amount">${amount}</span>
      <span>➔</span>
      <span class="live-ticker-target">${target}</span>
      <span class="live-ticker-time">• щойно</span>
    `;

    if (stream.firstChild) {
      stream.insertBefore(item, stream.firstChild);
    } else {
      stream.appendChild(item);
    }

    if (stream.children.length > 8) {
      stream.removeChild(stream.lastChild);
    }
  }, 7000);
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(initLiveTickerSimulator, 1500);
  });
}

