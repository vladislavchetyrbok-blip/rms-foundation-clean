/**
 * Разом ми — сила (Together We Are Power)
 * Admin Panel Interactive Logic (`admin.js`)
 */

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});

function checkAuth() {
  const logged = sessionStorage.getItem('rms_admin_logged');
  const loginScr = document.getElementById('loginScreen');
  const dash = document.getElementById('adminDashboard');

  if (logged === 'true') {
    if (loginScr) loginScr.style.display = 'none';
    if (dash) dash.style.display = 'flex';
    renderAllAdmin();
  } else {
    if (loginScr) loginScr.style.display = 'flex';
    if (dash) dash.style.display = 'none';
  }
}

function attemptLogin() {
  const input = document.getElementById('adminPassInput');
  const pass = input ? input.value.trim() : '';
  if (pass === '2026' || pass === 'admin') {
    sessionStorage.setItem('rms_admin_logged', 'true');
    checkAuth();
  } else {
    alert('Невірний пароль! Спробуйте 2026 або admin');
  }
}

function logout() {
  sessionStorage.removeItem('rms_admin_logged');
  checkAuth();
}

function switchSection(sec, btnEl) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  document.getElementById('sec-stats').style.display = sec === 'stats' ? 'block' : 'none';
  document.getElementById('sec-campaigns').style.display = sec === 'campaigns' ? 'block' : 'none';
  document.getElementById('sec-gallery').style.display = sec === 'gallery' ? 'block' : 'none';
  document.getElementById('sec-honor').style.display = sec === 'honor' ? 'block' : 'none';
  document.getElementById('sec-apps').style.display = sec === 'apps' ? 'block' : 'none';
  document.getElementById('sec-megagoal').style.display = sec === 'megagoal' ? 'block' : 'none';
  document.getElementById('sec-radar').style.display = sec === 'radar' ? 'block' : 'none';
  document.getElementById('sec-map').style.display = sec === 'map' ? 'block' : 'none';
  document.getElementById('sec-patron').style.display = sec === 'patron' ? 'block' : 'none';
  document.getElementById('sec-requests').style.display = sec === 'requests' ? 'block' : 'none';
  document.getElementById('sec-honorwall').style.display = sec === 'honorwall' ? 'block' : 'none';
  document.getElementById('sec-shop').style.display = sec === 'shop' ? 'block' : 'none';
  document.getElementById('sec-training').style.display = sec === 'training' ? 'block' : 'none';
  document.getElementById('sec-rehab').style.display = sec === 'rehab' ? 'block' : 'none';
  document.getElementById('sec-inter').style.display = sec === 'inter' ? 'block' : 'none';
  document.getElementById('sec-memorial').style.display = sec === 'memorial' ? 'block' : 'none';
  document.getElementById('sec-auctions').style.display = sec === 'auctions' ? 'block' : 'none';
  document.getElementById('sec-battles').style.display = sec === 'battles' ? 'block' : 'none';
  if (document.getElementById('sec-b2b')) document.getElementById('sec-b2b').style.display = sec === 'b2b' ? 'block' : 'none';
  if (document.getElementById('sec-podcasts')) document.getElementById('sec-podcasts').style.display = sec === 'podcasts' ? 'block' : 'none';
  if (document.getElementById('sec-support')) document.getElementById('sec-support').style.display = sec === 'support' ? 'block' : 'none';
  if (document.getElementById('sec-dronehub')) document.getElementById('sec-dronehub').style.display = sec === 'dronehub' ? 'block' : 'none';

  renderAllAdmin();
}

function renderAllAdmin() {
  renderAdminStats();
  renderAdminCampaigns();
  renderAdminGallery();
  renderAdminHonor();
  renderAdminApps();
  renderAdminMegaGoal();
  renderAdminRadar();
  renderAdminMap();
  renderAdminPatron();
  if (typeof renderAdminRequests === 'function') renderAdminRequests();
  if (typeof renderAdminHonorWall === 'function') renderAdminHonorWall();
  if (typeof renderAdminShop === 'function') renderAdminShop();
  if (typeof renderAdminTraining === 'function') renderAdminTraining();
  if (typeof renderAdminRehab === 'function') renderAdminRehab();
  if (typeof renderAdminInter === 'function') renderAdminInter();
  if (typeof renderAdminMemorial === 'function') renderAdminMemorial();
  if (typeof renderAdminAuctions === 'function') renderAdminAuctions();
  if (typeof renderAdminBattles === 'function') renderAdminBattles();
  if (typeof renderAdminB2b === 'function') renderAdminB2b();
  if (typeof renderAdminPodcasts === 'function') renderAdminPodcasts();
  if (typeof renderAdminSupport === 'function') renderAdminSupport();
  if (typeof renderAdminDroneHub === 'function') renderAdminDroneHub();
}

// === Section 1: Stats ===
function renderAdminStats() {
  const stats = FoundationStore.getStats();
  document.getElementById('stTotal').textContent = `${Number(stats.totalCollected).toLocaleString()} ₴`;
  document.getElementById('stDrones').textContent = stats.dronesAndVehicles;
  document.getElementById('stFamilies').textContent = stats.familiesSupported;
  document.getElementById('stVolunteers').textContent = stats.volunteersCount;

  document.getElementById('editTotal').value = stats.totalCollected;
  document.getElementById('editDrones').value = stats.dronesAndVehicles;
  document.getElementById('editFamilies').value = stats.familiesSupported;
  document.getElementById('editVolunteers').value = stats.volunteersCount;
}

function saveStats(e) {
  e.preventDefault();
  const totalCollected = Number(document.getElementById('editTotal').value);
  const dronesAndVehicles = Number(document.getElementById('editDrones').value);
  const familiesSupported = Number(document.getElementById('editFamilies').value);
  const volunteersCount = Number(document.getElementById('editVolunteers').value);

  FoundationStore.updateStats({ totalCollected, dronesAndVehicles, familiesSupported, volunteersCount });
  renderAdminStats();
  alert('💾 Нові показники успішно збережено! Вони вже на публічному сайті.');
}

function resetDemoData() {
  if (confirm('Скинути всі збори, героїв та статистику до початкових демо-даних?')) {
    FoundationStore.resetToDefault();
    renderAllAdmin();
    alert('🔄 Початкові демо-дані відновлено.');
  }
}

// === Section 2: Campaigns ===
function renderAdminCampaigns() {
  const tbody = document.getElementById('adminCampaignsTbody');
  if (!tbody) return;
  const campaigns = FoundationStore.getCampaigns();

  tbody.innerHTML = campaigns.map(camp => {
    const titleText = typeof camp.title === 'object' ? camp.title.uk : camp.title;
    const percent = Math.min(Math.round((camp.collected / camp.target) * 100), 100);

    return `
      <tr>
        <td style="font-size: 1.5rem;">${camp.icon || '🎯'}</td>
        <td><strong>${titleText}</strong></td>
        <td><span style="color: var(--admin-accent); font-weight: 600;">${camp.category}</span></td>
        <td>${Number(camp.target).toLocaleString()} ₴</td>
        <td><strong style="color: #10b981;">${Number(camp.collected).toLocaleString()} ₴</strong></td>
        <td>
          <div style="width: 100px; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 4px;">
            <div style="width: ${percent}%; height: 100%; background: #10b981;"></div>
          </div>
          <span style="font-size: 0.8rem;">${percent}%</span>
        </td>
        <td>
          <button class="btn-admin btn-edit" style="padding: 4px 8px; font-size: 0.75rem; margin-right: 4px;" onclick="addTopUp('${camp.id}', 10000)">+10k ₴</button>
          <button class="btn-admin btn-edit" style="padding: 4px 8px; font-size: 0.75rem;" onclick="addTopUp('${camp.id}', 50000)">+50k ₴</button>
        </td>
        <td>
          <button class="btn-admin btn-del" onclick="deleteCamp('${camp.id}')">Видалити</button>
        </td>
      </tr>
    `;
  }).join('');
}

function addTopUp(id, amount) {
  FoundationStore.updateCampaignAmount(id, amount);
  renderAllAdmin();
}

function deleteCamp(id) {
  if (confirm('Видалити цей збір?')) {
    FoundationStore.deleteCampaign(id);
    renderAllAdmin();
  }
}

function showAddCampaignModal() {
  document.getElementById('modalAddCamp').style.display = 'flex';
}

function handleCreateCamp(e) {
  e.preventDefault();
  const titleUk = document.getElementById('newCampTitle').value;
  const descUk = document.getElementById('newCampDesc').value;
  const target = Number(document.getElementById('newCampTarget').value);
  const collected = Number(document.getElementById('newCampCollected').value);
  const category = document.getElementById('newCampCat').value;
  const icon = document.getElementById('newCampIcon').value || '🎯';

  FoundationStore.addCampaign({
    title: { uk: titleUk, en: titleUk, pl: titleUk, ro: titleUk, it: titleUk, de: titleUk },
    desc: { uk: descUk, en: descUk, pl: descUk, ro: descUk, it: descUk, de: descUk },
    target,
    collected,
    category,
    icon,
    urgent: true
  });

  document.getElementById('modalAddCamp').style.display = 'none';
  e.target.reset();
  renderAllAdmin();
  alert('🚀 Новий збір додано на сайт!');
}

// === Section 3: Honor Board ===
function renderAdminHonor() {
  const tbody = document.getElementById('adminHonorTbody');
  if (!tbody) return;
  const list = FoundationStore.getHonorBoard();

  tbody.innerHTML = list.map(item => `
    <tr>
      <td style="text-align: center;">
        ${item.image ? `<img src="${item.image}" style="width: 48px; height: 48px; border-radius: 10px; object-fit: ${item.imageFit || 'cover'}; object-position: ${item.imagePos || 'center center'}; border: 1px solid var(--admin-border); display: block; margin: 0 auto;">` : `<span style="font-size: 1.5rem;">${item.icon || '🌟'}</span>`}
      </td>
      <td><strong>${item.name}</strong></td>
      <td>${item.role}</td>
      <td><strong style="color: var(--admin-accent);">${item.contribution}</strong></td>
      <td>${item.category}</td>
      <td><span style="background: rgba(255,183,3,0.15); border: 1px solid var(--admin-accent); padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; color: var(--admin-accent);">${item.badge}</span></td>
      <td style="display: flex; gap: 8px;">
        <button class="btn-admin" style="background: rgba(43,108,176,0.2); color: #63b3ed; border-color: #63b3ed; padding: 6px 12px;" onclick="editHonor('${item.id}')">✏️ Редагувати</button>
        <button class="btn-admin btn-del" onclick="deleteHonor('${item.id}')">Видалити</button>
      </td>
    </tr>
  `).join('');
}

function deleteHonor(id) {
  if (confirm('Видалити учасника з Дошки пошани?')) {
    FoundationStore.deleteHonorItem(id);
    renderAllAdmin();
  }
}

function showAddHonorModal() {
  document.getElementById('modalHonTitle').textContent = 'Додати на Дошку пошани';
  document.getElementById('btnSaveHon').textContent = 'Додати на дошку';
  document.getElementById('editHonId').value = '';
  
  document.getElementById('newHonName').value = '';
  document.getElementById('newHonRole').value = '';
  document.getElementById('newHonContrib').value = '';
  document.getElementById('newHonDesc').value = '';
  document.getElementById('newHonCat').value = 'corporate';
  document.getElementById('newHonBadge').value = 'Титани добра';
  document.getElementById('newHonIcon').value = '🏆';
  document.getElementById('newHonImage').value = '';
  document.getElementById('newHonPos').value = 'center center';
  document.getElementById('newHonFit').value = 'cover';

  updateHonPreview();
  document.getElementById('modalAddHonor').style.display = 'flex';
}

function editHonor(id) {
  const list = FoundationStore.getHonorBoard();
  const item = list.find(h => h.id === id);
  if (!item) return;

  document.getElementById('modalHonTitle').textContent = 'Редагувати запис';
  document.getElementById('btnSaveHon').textContent = 'Зберегти зміни';
  document.getElementById('editHonId').value = item.id;

  document.getElementById('newHonName').value = item.name || '';
  document.getElementById('newHonRole').value = item.role || '';
  document.getElementById('newHonContrib').value = item.contribution || '';
  document.getElementById('newHonDesc').value = item.desc || '';
  document.getElementById('newHonCat').value = item.category || 'donor';
  document.getElementById('newHonBadge').value = item.badge || '';
  document.getElementById('newHonIcon').value = item.icon || '🏆';
  document.getElementById('newHonImage').value = item.image || '';
  document.getElementById('newHonPos').value = item.imagePos || 'center center';
  document.getElementById('newHonFit').value = item.imageFit || 'cover';

  updateHonPreview();
  document.getElementById('modalAddHonor').style.display = 'flex';
}

function closeHonModal() {
  document.getElementById('modalAddHonor').style.display = 'none';
}

function compressImageFile(file, maxWidth, maxHeight, quality, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleHonFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  compressImageFile(file, 600, 600, 0.75, function(base64) {
    document.getElementById('newHonImage').value = base64;
    updateHonPreview();
  });
}

function updateHonPreview() {
  const imgUrl = document.getElementById('newHonImage').value.trim();
  const pos = document.getElementById('newHonPos').value;
  const fit = document.getElementById('newHonFit').value;
  const previewImg = document.getElementById('honPreviewImg');
  const previewText = document.getElementById('honPreviewText');

  if (imgUrl) {
    previewImg.src = imgUrl;
    previewImg.style.objectPosition = pos;
    previewImg.style.objectFit = fit;
    previewImg.style.display = 'block';
    if (previewText) previewText.style.display = 'none';
  } else {
    previewImg.style.display = 'none';
    if (previewText) previewText.style.display = 'block';
  }
}

function handleSaveHonor(e) {
  e.preventDefault();
  const id = document.getElementById('editHonId').value;
  const name = document.getElementById('newHonName').value;
  const role = document.getElementById('newHonRole').value;
  const contribution = document.getElementById('newHonContrib').value;
  const desc = document.getElementById('newHonDesc').value;
  const category = document.getElementById('newHonCat').value;
  const badge = document.getElementById('newHonBadge').value || 'Герой фонду';
  const icon = document.getElementById('newHonIcon').value || '🏆';
  const image = document.getElementById('newHonImage').value.trim();
  const imagePos = document.getElementById('newHonPos').value;
  const imageFit = document.getElementById('newHonFit').value;

  let badgeClass = 'badge-gold';
  if (category === 'volunteer') badgeClass = 'badge-purple';
  if (category === 'corporate') badgeClass = 'badge-blue';

  const itemData = { name, role, contribution, desc, category, badge, badgeClass, icon, image, imagePos, imageFit };

  if (id) {
    itemData.id = id;
    FoundationStore.updateHonorItem(itemData);
    alert('✅ Запис на Дошці пошани успішно оновлено!');
  } else {
    FoundationStore.addHonorItem(itemData);
    alert('🌟 Нового героя успішно додано на Дошку пошани!');
  }

  closeHonModal();
  renderAllAdmin();
}

// === Section 4: Applications ===
function renderAdminApps() {
  const tbody = document.getElementById('adminAppsTbody');
  if (!tbody) return;
  const list = FoundationStore.getApplications();

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Заявок поки немає</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(app => `
    <tr>
      <td style="font-size: 0.8rem; color: var(--text-muted);">${app.date || 'Нещодавно'}</td>
      <td><strong>${app.name}</strong></td>
      <td><a href="tel:${app.phone}" style="color: var(--admin-blue);">${app.phone}</a></td>
      <td><a href="mailto:${app.email}" style="color: var(--admin-blue);">${app.email}</a></td>
      <td><span style="background: rgba(16,185,129,0.15); color: #10b981; padding: 4px 8px; border-radius: 8px; font-size: 0.8rem;">${app.type}</span></td>
      <td><div style="max-width: 250px; white-space: normal;">${app.message || ''}</div></td>
      <td>
        <button class="btn-admin btn-del" onclick="deleteApp('${app.id}')">Оброблено</button>
      </td>
    </tr>
  `).join('');
}

function deleteApp(id) {
  FoundationStore.deleteApplication(id);
  renderAllAdmin();
}

// === Section: Gallery / Work Reports Management ===
function renderAdminGallery() {
  const tbody = document.getElementById('adminGalleryTbody');
  if (!tbody) return;
  const list = FoundationStore.getGallery();

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Фотозвітів поки немає</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(item => `
    <tr>
      <td>
        <img src="${item.image || 'work_medical_aid.jpg'}" style="width: 70px; height: 50px; object-fit: ${item.imageFit || 'contain'}; object-position: ${item.imagePos || 'center center'}; border-radius: 8px; border: 1px solid var(--admin-border);">
      </td>
      <td><strong>${item.title ? item.title : '<span style="color:#777; font-weight:normal;">(Без підпису)</span>'}</strong></td>
      <td>${item.category ? `<span style="background: rgba(30,96,242,0.15); color: #60a5fa; padding: 4px 8px; border-radius: 8px; font-size: 0.8rem;">${item.category}</span>` : ''}</td>
      <td><div style="max-width: 300px; font-size: 0.85rem; color: #ccc;">${item.desc || ''}</div></td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn-admin btn-edit" onclick="editGalleryItem('${item.id}')">✏️</button>
          <button class="btn-admin btn-del" onclick="deleteGallery('${item.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function showAddGalleryModal() {
  document.getElementById('galleryForm').reset();
  document.getElementById('editGalId').value = '';
  document.getElementById('galleryModalTitle').textContent = 'Додати фотозвіт справи';
  document.getElementById('newGalFit').value = 'contain';
  document.getElementById('galPreviewImg').style.display = 'none';
  document.getElementById('galPreviewText').style.display = 'block';
  document.getElementById('galleryModal').style.display = 'flex';
}

function editGalleryItem(id) {
  const item = FoundationStore.getGallery().find(g => g.id === id);
  if (!item) return;

  document.getElementById('editGalId').value = item.id;
  document.getElementById('newGalTitle').value = item.title || '';
  document.getElementById('newGalCat').value = item.category || '';
  document.getElementById('newGalDesc').value = item.desc || '';
  document.getElementById('newGalImage').value = item.image || '';
  document.getElementById('newGalPos').value = item.imagePos || 'center center';
  document.getElementById('newGalFit').value = item.imageFit || 'contain';
  document.getElementById('galleryModalTitle').textContent = 'Редагувати фотозвіт';

  updateGalPreview();
  document.getElementById('galleryModal').style.display = 'flex';
}

function closeGalModal() {
  document.getElementById('galleryModal').style.display = 'none';
}

function deleteGallery(id) {
  if (confirm('Видалити цей звіт з хроніки?')) {
    FoundationStore.deleteGalleryItem(id);
    renderAllAdmin();
  }
}

function handleGalFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  compressImageFile(file, 800, 800, 0.75, function(base64) {
    document.getElementById('newGalImage').value = base64;
    updateGalPreview();
  });
}

function updateGalPreview() {
  const url = document.getElementById('newGalImage').value.trim();
  const pos = document.getElementById('newGalPos').value;
  const fit = document.getElementById('newGalFit').value;
  const imgEl = document.getElementById('galPreviewImg');
  const txtEl = document.getElementById('galPreviewText');

  if (url) {
    imgEl.src = url;
    imgEl.style.objectPosition = pos;
    imgEl.style.objectFit = fit;
    imgEl.style.display = 'block';
    txtEl.style.display = 'none';
  } else {
    imgEl.style.display = 'none';
    txtEl.style.display = 'block';
  }
}

function saveGalleryItem(event) {
  event.preventDefault();
  const id = document.getElementById('editGalId').value;
  const title = document.getElementById('newGalTitle').value.trim();
  const category = document.getElementById('newGalCat').value.trim();
  const desc = document.getElementById('newGalDesc').value.trim();
  const image = document.getElementById('newGalImage').value.trim() || 'work_medical_aid.jpg';
  const imagePos = document.getElementById('newGalPos').value;
  const imageFit = document.getElementById('newGalFit').value;

  const itemData = { title, category, desc, image, imagePos, imageFit };

  if (id) {
    itemData.id = id;
    FoundationStore.updateGalleryItem(itemData);
    alert('✅ Фотозвіт успішно оновлено!');
  } else {
    FoundationStore.addGalleryItem(itemData);
    alert('📸 Нове фото успішно додано до хроніки справ фонду!');
  }

  closeGalModal();
  renderAllAdmin();
}

async function handleBulkGalleryUpload(event) {
  const files = Array.from(event.target.files);
  if (!files || files.length === 0) return;

  const total = files.length;
  const modal = document.getElementById('bulkProgressModal');
  const textEl = document.getElementById('bulkProgressText');
  const barEl = document.getElementById('bulkProgressBar');

  if (modal) modal.style.display = 'flex';
  if (textEl) textEl.textContent = `Обробка 0 з ${total} фото...`;
  if (barEl) barEl.style.width = '0%';

  const data = FoundationStore.getData();
  if (!data.gallery) data.gallery = [];

  let processed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    await new Promise((resolve) => {
      compressImageFile(file, 550, 550, 0.62, function(base64) {
        data.gallery.unshift({
          id: 'gal_' + Date.now() + '_' + i + '_' + Math.floor(Math.random()*10000),
          title: '',
          category: '',
          desc: '',
          image: base64,
          imagePos: 'center center',
          imageFit: 'contain'
        });
        processed++;
        if (textEl) textEl.textContent = `Обробка ${processed} з ${total} фото...`;
        if (barEl) barEl.style.width = `${Math.round((processed / total) * 100)}%`;
        setTimeout(resolve, 30);
      });
    });
  }

  FoundationStore.saveData(data);
  if (modal) modal.style.display = 'none';
  event.target.value = '';
  renderAllAdmin();
  alert(`🚀 Успішно завантажено та оптимізовано ${processed} фотографій! Вони вже на сайті.`);
}


// ==========================================
// TOP-5 NEW FEATURES ADMIN MANAGEMENT
// ==========================================

function renderAdminMegaGoal() {
  if (!window.FoundationStore || !FoundationStore.getMegaGoal) return;
  const mg = FoundationStore.getMegaGoal();
  const elColl = document.getElementById('mgCollected');
  const elTarg = document.getElementById('mgTarget');
  if (elColl && elTarg) {
    elColl.value = mg.collected;
    elTarg.value = mg.target;
  }

  const container = document.getElementById('adminMilestonesContainer');
  if (!container) return;
  container.innerHTML = (mg.milestones || []).map((m, idx) => {
    const title = typeof m.title === 'object' ? m.title.uk : m.title;
    const desc = typeof m.desc === 'object' ? m.desc.uk : m.desc;
    return `
      <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 14px; border: 1px solid var(--admin-border); display: flex; align-items: center; justify-content: space-between;">
        <div>
          <strong style="color: var(--admin-accent); font-size: 1.1rem;">${m.icon} ${m.pct}% — ${title}</strong>
          <div style="color: #aaa; font-size: 0.9rem;">${desc}</div>
        </div>
        <div>
          <button class="btn-admin ${m.unlocked ? 'btn-del' : 'btn-add'}" onclick="toggleMilestone(${idx})">
            ${m.unlocked ? '✅ Розблоковано (Натисніть щоб заблокувати)' : '🔒 Заблоковано (Натисніть щоб розблокувати)'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function saveAdminMegaGoal(e) {
  e.preventDefault();
  const mg = FoundationStore.getMegaGoal();
  mg.collected = Number(document.getElementById('mgCollected').value);
  mg.target = Number(document.getElementById('mgTarget').value);
  FoundationStore.save();
  renderAdminMegaGoal();
  alert('✅ Дані Мега-Цілі оновлено!');
}

function toggleMilestone(idx) {
  const mg = FoundationStore.getMegaGoal();
  if (mg && mg.milestones && mg.milestones[idx]) {
    mg.milestones[idx].unlocked = !mg.milestones[idx].unlocked;
    FoundationStore.save();
    renderAdminMegaGoal();
  }
}

function renderAdminRadar() {
  const container = document.getElementById('adminRadarContainer');
  if (!container || !window.FoundationStore || !FoundationStore.getFrontlineRadar) return;
  const requests = FoundationStore.getFrontlineRadar();
  container.innerHTML = requests.map((req, idx) => {
    const bName = typeof req.brigade === 'object' ? req.brigade.uk : req.brigade;
    const need = typeof req.need === 'object' ? req.need.uk : req.need;
    const isComp = req.status === 'completed';
    return `
      <div class="panel" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="color: #fff; font-size: 1.1rem;">${bName}</strong>
            <span style="background: ${isComp ? '#10b981' : '#ef4444'}; color: #fff; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem;">${isComp ? 'Виконано' : 'В процесі'}</span>
          </div>
          <div style="color: var(--admin-accent); margin-bottom: 12px;">📌 ${need}</div>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 16px;">Зібрано: ${Number(req.collected).toLocaleString()} ₴ / ${Number(req.target).toLocaleString()} ₴</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-admin ${isComp ? 'btn-add' : 'btn-del'}" style="flex: 1;" onclick="toggleRadarStatus(${idx})">${isComp ? '↩️ Повернути в роботу' : '✅ Позначити виконаним'}</button>
          <button class="btn-admin btn-del" onclick="deleteRadarItem(${idx})">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleRadarStatus(idx) {
  const reqs = FoundationStore.getFrontlineRadar();
  if (reqs && reqs[idx]) {
    reqs[idx].status = reqs[idx].status === 'completed' ? 'urgent' : 'completed';
    reqs[idx].badge = reqs[idx].status === 'completed' ? '✅ Збір закрито! В дорозі' : '🔥 Збираємо зараз';
    FoundationStore.save();
    renderAdminRadar();
  }
}

function deleteRadarItem(idx) {
  if (confirm('Видалити цей запит?')) {
    const reqs = FoundationStore.getFrontlineRadar();
    reqs.splice(idx, 1);
    FoundationStore.save();
    renderAdminRadar();
  }
}

function openRadarModal() {
  document.getElementById('radarModal').style.display = 'flex';
}

function saveNewRadarItem(e) {
  e.preventDefault();
  const reqs = FoundationStore.getFrontlineRadar();
  reqs.push({
    brigade: document.getElementById('newRadarBrigade').value,
    need: document.getElementById('newRadarNeed').value,
    target: Number(document.getElementById('newRadarTarget').value),
    collected: Number(document.getElementById('newRadarCollected').value),
    status: 'urgent',
    badge: '🔥 Збираємо зараз'
  });
  FoundationStore.save();
  document.getElementById('radarModal').style.display = 'none';
  renderAdminRadar();
  alert('✅ Запит від бригади успішно додано!');
}

function renderAdminMap() {
  const container = document.getElementById('adminMapContainer');
  if (!container || !window.FoundationStore || !FoundationStore.getImpactMap) return;
  const mapData = FoundationStore.getImpactMap();
  container.innerHTML = mapData.map((item, idx) => {
    const name = typeof item.name === 'object' ? item.name.uk : item.name;
    return `
      <div class="panel">
        <h3 style="color: #fff; margin-bottom: 12px;">${item.icon} ${name}</h3>
        <form onsubmit="saveAdminMapItem(${idx}, event)" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-size: 0.8rem; color: #aaa;">Дрони / РЕБ:</label>
            <input type="text" id="mapDrones_${idx}" value="${item.drones}" style="width: 100%; padding: 8px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--admin-border); color: #fff;">
          </div>
          <div>
            <label style="font-size: 0.8rem; color: #aaa;">Медицина (IFAK):</label>
            <input type="text" id="mapMed_${idx}" value="${item.med}" style="width: 100%; padding: 8px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--admin-border); color: #fff;">
          </div>
          <div>
            <label style="font-size: 0.8rem; color: #aaa;">Транспорт:</label>
            <input type="text" id="mapAuto_${idx}" value="${item.auto}" style="width: 100%; padding: 8px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--admin-border); color: #fff;">
          </div>
          <div>
            <label style="font-size: 0.8rem; color: #aaa;">Статус:</label>
            <select id="mapStatus_${idx}" style="width: 100%; padding: 8px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--admin-border); color: #fff;">
              <option value="hot" ${item.status === 'hot' ? 'selected' : ''}>🔥 Гаряча точка</option>
              <option value="active" ${item.status === 'active' ? 'selected' : ''}>Активний напрямок</option>
              <option value="logistics" ${item.status === 'logistics' ? 'selected' : ''}>📦 Логістичний хаб</option>
            </select>
          </div>
          <div style="grid-column: span 2;">
            <button type="submit" class="btn-admin btn-add" style="width: 100%;">💾 Зберегти регіон</button>
          </div>
        </form>
      </div>
    `;
  }).join('');
}

function saveAdminMapItem(idx, e) {
  e.preventDefault();
  const mapData = FoundationStore.getImpactMap();
  if (mapData && mapData[idx]) {
    mapData[idx].drones = document.getElementById(`mapDrones_${idx}`).value;
    mapData[idx].med = document.getElementById(`mapMed_${idx}`).value;
    mapData[idx].auto = document.getElementById(`mapAuto_${idx}`).value;
    mapData[idx].status = document.getElementById(`mapStatus_${idx}`).value;
    FoundationStore.save();
    alert('✅ Статистику регіону оновлено!');
  }
}

function renderAdminPatron() {
  const container = document.getElementById('adminPatronContainer');
  if (!container || !window.FoundationStore || !FoundationStore.getPatronTiers) return;
  const tiers = FoundationStore.getPatronTiers();
  container.innerHTML = tiers.map((tier, idx) => {
    const title = typeof tier.title === 'object' ? tier.title.uk : tier.title;
    const desc = typeof tier.desc === 'object' ? tier.desc.uk : tier.desc;
    return `
      <div class="panel" style="text-align: center;">
        <h3 style="color: #fff; margin-bottom: 8px;">${title}</h3>
        <div style="font-size: 1.5rem; color: var(--admin-accent); font-weight: 800; margin-bottom: 12px;">${tier.amount} / ${typeof tier.period === 'object' ? tier.period.uk : tier.period}</div>
        <p style="font-size: 0.85rem; color: #aaa; margin-bottom: 16px;">${desc}</p>
        <button class="btn-admin btn-add" style="width: 100%;" onclick="alert('Редагування пакетів меценатів у розробці')">✏️ Редагувати пакет</button>
      </div>
    `;
  }).join('');
}

// === Section 10: Military Requests CRM ===
function renderAdminRequests() {
  const tbody = document.getElementById('reqCrmTableBody');
  if (!tbody || !window.FoundationStore || !FoundationStore.getMilitaryRequests) return;
  const list = FoundationStore.getMilitaryRequests();
  
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #888;">Запитів від ЗСУ поки немає</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(r => `
    <tr>
      <td style="font-family: monospace; font-weight: 700; color: #ffb703;">${r.id}</td>
      <td>
        <strong>${r.unit}</strong><br>
        <span style="font-size: 0.8rem; color: #aaa;">${r.contact}</span>
      </td>
      <td>
        <strong style="color: #60a5fa;">${r.category}</strong><br>
        <span style="font-size: 0.85rem; color: #ccc;">${r.items}</span>
      </td>
      <td style="color: #f59e0b;">${r.priority}</td>
      <td>
        <select onchange="changeReqStatus('${r.id}', this.value)" style="padding: 6px; border-radius: 6px; background: #1e293b; color: #fff; border: 1px solid #475569;">
          <option value="review" ${r.status === 'review' ? 'selected' : ''}>🔍 Верифікація</option>
          <option value="fundraising" ${r.status === 'fundraising' ? 'selected' : ''}>🟡 Збір відкрито</option>
          <option value="purchased" ${r.status === 'purchased' ? 'selected' : ''}>🟢 Закуплено / В дорозі</option>
          <option value="delivered" ${r.status === 'delivered' ? 'selected' : ''}>✅ Доставлено / Акт підписано</option>
        </select>
      </td>
      <td>
        <button class="btn-admin btn-del" onclick="deleteAdminRequest('${r.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function changeReqStatus(id, status) {
  let label = '🔍 Верифікація безпеки та документів';
  if (status === 'fundraising') label = '🟡 Відкрито публічний збір';
  if (status === 'purchased') label = '🟢 Закуплено — у дорозі на фронт';
  if (status === 'delivered') label = '✅ Доставлено — Акт підписано';
  
  FoundationStore.updateMilitaryRequestStatus(id, status, label);
  renderAdminRequests();
  alert(`✅ Статус запиту ${id} оновлено на "${label}"!`);
}

function deleteAdminRequest(id) {
  if (confirm(`Видалити запит ${id}?`)) {
    FoundationStore.deleteMilitaryRequest(id);
    renderAdminRequests();
  }
}

// === Section 11: Honor Wall Bricks CRM ===
function renderAdminHonorWall() {
  const tbody = document.getElementById('honorWallTableBody');
  if (!tbody || !window.FoundationStore || !FoundationStore.getHonorWallBricks) return;
  const list = FoundationStore.getHonorWallBricks();
  
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #888;">Цеглинок на стіні поки немає</td></tr>';
    return;
  }

  const flagMap = { uk: '🇺🇦', us: '🇺🇸', pl: '🇵🇱', de: '🇩🇪', gb: '🇬🇧', ro: '🇷🇴', it: '🇮🇹' };

  tbody.innerHTML = list.map(b => `
    <tr>
      <td><strong>${b.name}</strong></td>
      <td style="color: #10b981; font-weight: 700;">${b.amount}</td>
      <td>${flagMap[b.country] || '🌍'} (${b.country})</td>
      <td style="font-style: italic; max-width: 300px;">«${b.message}»</td>
      <td style="color: #aaa; font-size: 0.8rem;">${b.date}</td>
      <td>
        <button class="btn-admin btn-del" onclick="deleteAdminBrick('${b.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function deleteAdminBrick(id) {
  if (confirm('Видалити цю цеглинку з Стіни Слави?')) {
    FoundationStore.deleteHonorWallBrick(id);
    renderAdminHonorWall();
  }
}


// === Section 12: Shop Orders CRM ===
function renderAdminShop() {
  const tbody = document.getElementById('shopOrdersTableBody');
  if (!tbody || !window.FoundationStore || !FoundationStore.getShopOrders) return;
  const list = FoundationStore.getShopOrders();
  
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Замовлень поки немає</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(o => `
    <tr>
      <td><strong style="color: var(--accent-gold);">${o.id}</strong><br><small style="color: #888;">${o.date}</small></td>
      <td style="font-weight: 700; color: #fff;">${o.item}</td>
      <td><strong>${o.customer}</strong></td>
      <td><a href="tel:${o.phone}" style="color: #60a5fa;">${o.phone}</a></td>
      <td style="font-size: 0.85rem; color: #ccc;">${o.address}</td>
      <td>
        <select onchange="changeShopStatus('${o.id}', this.value)" style="padding: 6px; border-radius: 8px; background: #0b1530; border: 1px solid var(--admin-border); color: #fff; font-size: 0.85rem;">
          <option value="new" ${o.status === 'new' ? 'selected' : ''}>🟡 Очікує відправки</option>
          <option value="sent" ${o.status === 'sent' ? 'selected' : ''}>🟢 Відправлено Новою Поштою</option>
          <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>✅ Доставлено меценату</option>
        </select>
      </td>
      <td>
        <button class="btn-admin btn-del" onclick="deleteAdminShopOrder('${o.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function changeShopStatus(id, status) {
  let label = '🟡 Очікує відправки';
  if (status === 'sent') label = '🟢 Відправлено Новою Поштою / DHL';
  if (status === 'delivered') label = '✅ Доставлено меценату';
  
  FoundationStore.updateShopOrderStatus(id, status, label);
  renderAdminShop();
  alert(`✅ Статус замовлення ${id} оновлено!`);
}

function deleteAdminShopOrder(id) {
  if (confirm(`Видалити замовлення ${id}?`)) {
    FoundationStore.deleteShopOrder(id);
    renderAdminShop();
  }
}

// === Section 13: Training Registrations CRM ===
function renderAdminTraining() {
  const tbody = document.getElementById('trainingRegTableBody');
  if (!tbody || !window.FoundationStore || !FoundationStore.getTrainingRegistrations) return;
  const list = FoundationStore.getTrainingRegistrations();
  
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Заявок на тренінги поки немає</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(r => `
    <tr>
      <td><strong style="color: var(--accent-gold);">${r.id}</strong><br><small style="color: #888;">${r.date}</small></td>
      <td style="font-weight: 700; color: #fff;">${r.courseTitle}</td>
      <td><strong>${r.name}</strong></td>
      <td><a href="tel:${r.phone}" style="color: #60a5fa;">${r.phone}</a></td>
      <td><span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">${r.role}</span></td>
      <td>
        <select onchange="changeTrainingStatus('${r.id}', this.value)" style="padding: 6px; border-radius: 8px; background: #0b1530; border: 1px solid var(--admin-border); color: #fff; font-size: 0.85rem;">
          <option value="pending" ${r.status === 'pending' ? 'selected' : ''}>🟡 В обробці</option>
          <option value="approved" ${r.status === 'approved' ? 'selected' : ''}>🟢 Підтверджено (Зараховано)</option>
          <option value="rejected" ${r.status === 'rejected' ? 'selected' : ''}>🔴 Відхилено / Перенесено</option>
        </select>
      </td>
      <td>
        <button class="btn-admin btn-del" onclick="deleteAdminTrainingReg('${r.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function changeTrainingStatus(id, status) {
  let label = '🟡 В обробці';
  if (status === 'approved') label = '🟢 Підтверджено (Зараховано у групу)';
  if (status === 'rejected') label = '🔴 Відхилено / Перенесено на наступний місяць';
  
  FoundationStore.updateTrainingRegStatus(id, status, label);
  renderAdminTraining();
  alert(`✅ Статус заявки ${id} оновлено!`);
}

function deleteAdminTrainingReg(id) {
  if (confirm(`Видалити заявку ${id}?`)) {
    FoundationStore.deleteTrainingRegistration(id);
    renderAdminTraining();
  }
}

// === Section 14: Rehab Applications CRM ===
function renderAdminRehab() {
  const tbody = document.getElementById('rehabAppTableBody');
  if (!tbody || !window.FoundationStore || !FoundationStore.getRehabApplications) return;
  const list = FoundationStore.getRehabApplications();
  
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Заявок на реабілітацію поки немає</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(a => `
    <tr>
      <td><strong style="color: var(--accent-gold);">${a.id}</strong><br><small style="color: #888;">${a.date}</small></td>
      <td style="font-weight: 700; color: #fff;">${a.name}</td>
      <td><a href="tel:${a.phone}" style="color: #60a5fa;">${a.phone}</a></td>
      <td><span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">${a.type}</span></td>
      <td style="font-size: 0.85rem; color: #ccc; max-width: 250px;">${a.details}</td>
      <td>
        <select onchange="changeRehabStatus('${a.id}', this.value)" style="padding: 6px; border-radius: 8px; background: #0b1530; border: 1px solid var(--admin-border); color: #fff; font-size: 0.85rem;">
          <option value="review" ${a.status === 'review' ? 'selected' : ''}>🟡 Медична перевірка</option>
          <option value="active" ${a.status === 'active' ? 'selected' : ''}>🟢 В роботі клініки</option>
          <option value="done" ${a.status === 'done' ? 'selected' : ''}>✅ Протез виготовлено / Терапію завершено</option>
        </select>
      </td>
      <td>
        <button class="btn-admin btn-del" onclick="deleteAdminRehabApp('${a.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function changeRehabStatus(id, status) {
  let label = '🟡 Медична перевірка';
  if (status === 'active') label = '🟢 В роботі клініки (Superhumans/Unbroken)';
  if (status === 'done') label = '✅ Протез виготовлено / Терапію успішно завершено';
  
  FoundationStore.updateRehabAppStatus(id, status, label);
  renderAdminRehab();
  alert(`✅ Статус заявки ${id} оновлено!`);
}

function deleteAdminRehabApp(id) {
  if (confirm(`Видалити заявку ${id}?`)) {
    FoundationStore.deleteRehabApplication(id);
    renderAdminRehab();
  }
}

// === Section 15: International Donors CRM ===
function renderAdminInter() {
  const tbody = document.getElementById('interDonorsTableBody');
  if (!tbody || !window.FoundationStore || !FoundationStore.getInternationalDonors) return;
  const list = FoundationStore.getInternationalDonors();
  
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Міжнародних переказів поки немає</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(d => `
    <tr>
      <td><strong style="color: var(--accent-gold);">${d.id}</strong><br><small style="color: #888;">${d.date}</small></td>
      <td style="font-weight: 700; color: #fff;">${d.donor}</td>
      <td>${d.countryName}</td>
      <td style="font-weight: 800; color: #10b981;">${d.amount}</td>
      <td><span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">${d.method}</span></td>
      <td style="font-style: italic; color: #aaa; max-width: 250px;">«${d.msg || ''}»</td>
      <td>
        <button class="btn-admin btn-del" onclick="deleteAdminInterDonor('${d.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function deleteAdminInterDonor(id) {
  if (confirm(`Видалити запис про міжнародний переказ ${id}?`)) {
    FoundationStore.deleteInternationalDonor(id);
    renderAdminInter();
  }
}

// === Section 16: Memorial Applications CRM ===
function renderAdminMemorial() {
  const tbody = document.getElementById('memAppTableBody');
  if (!tbody || !window.FoundationStore || !FoundationStore.getMemorialApplications) return;
  const list = FoundationStore.getMemorialApplications();
  
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Заявок в Пантеон поки немає</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(a => `
    <tr>
      <td><strong style="color: var(--accent-gold);">${a.id}</strong><br><small style="color: #888;">${a.date}</small></td>
      <td style="font-weight: 700; color: #fff;">${a.name}</td>
      <td><a href="tel:${a.phone}" style="color: #60a5fa;">${a.phone}</a></td>
      <td><strong style="color: #fff;">${a.heroName}</strong><br><small style="color: #aaa;">${a.brigade}</small></td>
      <td style="font-size: 0.85rem; color: #ccc; max-width: 250px;">${a.details}</td>
      <td>
        <select onchange="changeMemStatus('${a.id}', this.value)" style="padding: 6px; border-radius: 8px; background: #0b1530; border: 1px solid var(--admin-border); color: #fff; font-size: 0.85rem;">
          <option value="review" ${a.status === 'review' ? 'selected' : ''}>🟡 Перевірка документів</option>
          <option value="approved" ${a.status === 'approved' ? 'selected' : ''}>🟢 Додано в Пантеон</option>
        </select>
      </td>
      <td>
        <button class="btn-admin btn-del" onclick="deleteAdminMemApp('${a.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function changeMemStatus(id, status) {
  let label = '🟡 Перевірка документів';
  if (status === 'approved') label = '🟢 Додано в Пантеон';
  
  const data = FoundationStore.getData();
  if (data.memorialApplications) {
    const idx = data.memorialApplications.findIndex(a => a.id === id);
    if (idx !== -1) {
      data.memorialApplications[idx].status = status;
      data.memorialApplications[idx].statusLabel = label;
      FoundationStore.saveData(data);
    }
  }
  renderAdminMemorial();
  alert(`✅ Статус заявки ${id} оновлено!`);
}

function deleteAdminMemApp(id) {
  if (confirm(`Видалити заявку ${id}?`)) {
    FoundationStore.deleteMemorialApp(id);
    renderAdminMemorial();
  }
}

// === Section 17: Auctions & Raffles CRM ===
function renderAdminAuctions() {
  const tbody = document.getElementById('aucTrxTableBody');
  if (!tbody || !window.FoundationStore || !FoundationStore.getAuctionTransactions) return;
  const list = FoundationStore.getAuctionTransactions();
  
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Операцій лотерей поки немає</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(t => `
    <tr>
      <td><strong style="color: var(--accent-gold);">${t.id}</strong><br><small style="color: #888;">${t.date}</small></td>
      <td style="font-weight: 700; color: #fff;">${t.lotTitle}</td>
      <td><strong style="color: #fff;">${t.participant}</strong></td>
      <td><a href="tel:${t.phone}" style="color: #60a5fa;">${t.phone}</a></td>
      <td style="font-weight: 800; color: #10b981;">${t.amount}</td>
      <td><span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; color: #ccc;">${t.ticketsCount}</span><br><small style="color: #888;">${t.type}</small></td>
      <td>
        <button class="btn-admin btn-del" onclick="deleteAdminAucTrx('${t.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function deleteAdminAucTrx(id) {
  if (confirm(`Видалити операцію ${id}?`)) {
    FoundationStore.deleteAuctionTransaction(id);
    renderAdminAuctions();
  }
}


// === Section 18: Corporate Battles ===
function renderAdminBattles() {
  const battlesBody = document.getElementById('battlesTableBody');
  const appsBody = document.getElementById('battleAppsTableBody');
  if (!battlesBody || !appsBody || !window.FoundationStore) return;

  const list = FoundationStore.getBattles();
  battlesBody.innerHTML = list.map(b => {
    const pct = Math.min(100, Math.round((b.collectedAmount / b.targetAmount) * 100));
    return `
      <tr>
        <td><strong style="color: var(--accent-gold);">${b.rankBadge}</strong></td>
        <td style="font-size: 1.5rem;">${b.icon || '🏆'}</td>
        <td><strong style="color: #fff;">${b.name}</strong></td>
        <td>${b.category}</td>
        <td>
          <div style="color: #10b981; font-weight: 700;">${b.collectedAmount.toLocaleString()} ₴</div>
          <div style="font-size: 0.75rem; color: #888;">з ${b.targetAmount.toLocaleString()} ₴ (${pct}%)</div>
        </td>
        <td>👥 ${b.supportersCount}</td>
        <td>
          <button class="btn-admin btn-del" onclick="deleteAdminBattleTeam('${b.id}')">Видалити</button>
        </td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="7" style="text-align:center; color:#888;">Немає активних команд</td></tr>';

  const apps = FoundationStore.getBattleApplications();
  appsBody.innerHTML = apps.map(a => `
    <tr>
      <td><code>${a.id}</code></td>
      <td><strong style="color: #fff;">${a.teamName}</strong></td>
      <td>${a.category}</td>
      <td>${a.captainName}<br><small style="color:#aaa;">${a.phone}</small></td>
      <td style="color: var(--accent-gold); font-weight: 700;">${a.goal}</td>
      <td style="max-width: 200px; font-size: 0.85rem; color:#ccc;">${a.details}</td>
      <td><span class="status-badge ${a.status === 'approved' ? 'status-active' : 'status-pending'}">${a.statusLabel}</span></td>
      <td>
        ${a.status !== 'approved' ? `<button class="btn-admin btn-add" style="margin-bottom: 4px;" onclick="approveBattleApp('${a.id}')">Прийняти</button><br>` : ''}
        <button class="btn-admin btn-del" onclick="deleteAdminBattleApp('${a.id}')">Видалити</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="8" style="text-align:center; color:#888;">Немає нових заявок</td></tr>';
}

function deleteAdminBattleTeam(id) {
  if (confirm('Ви впевнені, що хочете видалити цю команду з турніру?')) {
    FoundationStore.deleteBattleTeam(id);
    renderAdminBattles();
  }
}

function deleteAdminBattleApp(id) {
  if (confirm('Видалити заявку?')) {
    FoundationStore.deleteBattleApp(id);
    renderAdminBattles();
  }
}

function approveBattleApp(id) {
  const apps = FoundationStore.getBattleApplications();
  const app = apps.find(a => a.id === id);
  if (!app) return;

  const targetNum = parseInt(app.goal.replace(/[^0-9]/g, ''), 10) || 500000;
  const data = FoundationStore.getData();
  if (!data.battles) data.battles = [];
  data.battles.push({
    id: 'bat_' + Date.now().toString().slice(-4),
    name: app.teamName,
    category: app.category,
    targetAmount: targetNum,
    collectedAmount: 0,
    supportersCount: 1,
    rank: data.battles.length + 1,
    rankBadge: `🎖️ ${data.battles.length + 1} місце`,
    icon: '🏢',
    desc: `Команда ${app.teamName}. Капітан: ${app.captainName}. ${app.details}`
  });

  app.status = 'approved';
  app.statusLabel = '🟢 Прийнято в турнір';
  FoundationStore.saveData(data);
  renderAdminBattles();
  alert(`🎉 Команда «${app.teamName}» успішно додана в Турнірну Таблицю!`);
}

function showAddBattleTeamModal() {
  document.getElementById('battleTeamModal').style.display = 'flex';
}

function saveNewBattleTeam(event) {
  event.preventDefault();
  const name = document.getElementById('newBatName').value.trim();
  const cat = document.getElementById('newBatCat').value;
  const icon = document.getElementById('newBatIcon').value.trim() || '🏆';
  const target = parseInt(document.getElementById('newBatTarget').value, 10) || 1000000;
  const collected = parseInt(document.getElementById('newBatCollected').value, 10) || 0;
  const desc = document.getElementById('newBatDesc').value.trim();

  const data = FoundationStore.getData();
  if (!data.battles) data.battles = [];
  data.battles.push({
    id: 'bat_' + Date.now().toString().slice(-4),
    name,
    category: cat,
    targetAmount: target,
    collectedAmount: collected,
    supportersCount: 15,
    rank: data.battles.length + 1,
    rankBadge: `🎖️ ${data.battles.length + 1} місце`,
    icon,
    desc: desc || `Офіційна турнірна команда ${name} у зборі на потреби ЗСУ.`
  });

  FoundationStore.saveData(data);
  document.getElementById('battleTeamModal').style.display = 'none';
  event.target.reset();
  renderAdminBattles();
  alert('🎉 Команду успішно додано на Арену Батлів!');
}


// === Section 19: B2B Partners & CSR CRM ===
function renderAdminB2b() {
  const pBody = document.getElementById('b2bPartnersTableBody');
  const aBody = document.getElementById('b2bAppsTableBody');
  if (!pBody || !aBody || !window.FoundationStore) return;

  const partners = FoundationStore.getB2bPartners ? FoundationStore.getB2bPartners() : [];
  const apps = FoundationStore.getB2bApplications ? FoundationStore.getB2bApplications() : [];

  if (partners.length === 0) {
    pBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #888;">Партнеров поки немає</td></tr>';
  } else {
    pBody.innerHTML = partners.map(p => `
      <tr>
        <td><strong style="color: var(--accent-gold);">${p.id}</strong></td>
        <td style="font-weight: 700; color: #fff;"><span style="font-size: 1.2rem; margin-right: 6px;">${p.icon || '🤝'}</span> ${p.name}</td>
        <td><span style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.85rem;">${p.tier}</span></td>
        <td style="color: #10b981; font-weight: 700;">${p.contribution}</td>
        <td style="font-size: 0.85rem; color: #ccc; max-width: 250px;">${p.desc}</td>
        <td>
          <button class="btn-admin btn-del" onclick="deleteAdminB2bPartner('${p.id}')">🗑️ Видалити</button>
        </td>
      </tr>
    `).join('');
  }

  if (apps.length === 0) {
    aBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #888;">Нових заявок поки немає</td></tr>';
  } else {
    aBody.innerHTML = apps.map(a => `
      <tr>
        <td><strong style="color: var(--accent-gold);">${a.id}</strong><br><small style="color: #888;">${a.date}</small></td>
        <td style="font-weight: 700; color: #fff;">${a.company}</td>
        <td><strong>${a.contactName}</strong></td>
        <td><a href="tel:${a.phone}" style="color: #60a5fa;">${a.phone}</a><br><small style="color: #aaa;">${a.email}</small></td>
        <td><span style="background: rgba(255,183,3,0.15); color: #ffb703; padding: 4px 8px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;">${a.tier}</span></td>
        <td style="font-size: 0.85rem; color: #ccc; max-width: 200px;">${a.details}</td>
        <td>
          <span style="background: ${a.status === 'approved' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${a.status === 'approved' ? '#10b981' : '#f59e0b'}; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 700;">${a.statusLabel}</span>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            ${a.status !== 'approved' ? `<button class="btn-admin btn-add" style="padding: 4px 10px; font-size: 0.8rem;" onclick="changeB2bAppStatus('${a.id}')">🤝 Підписати договір</button>` : ''}
            <button class="btn-admin btn-del" style="padding: 4px 8px;" onclick="deleteAdminB2bApp('${a.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function changeB2bAppStatus(id) {
  const apps = FoundationStore.getB2bApplications();
  const app = apps.find(a => a.id === id);
  if (!app) return;

  const data = FoundationStore.getData();
  if (!data.b2bPartners) data.b2bPartners = [];
  
  let tierClass = 'tier-gold';
  if (app.tier.includes('Срібний')) tierClass = 'tier-silver';
  if (app.tier.includes('Бронзовий')) tierClass = 'tier-bronze';

  data.b2bPartners.push({
    id: 'b2b_' + Date.now().toString().slice(-4),
    name: app.company,
    tier: app.tier.split(' ')[0] + ' ' + app.tier.split(' ')[1],
    tierClass,
    contribution: 'За договором КСВ',
    icon: '🤝',
    desc: `Офіційний партнер фонду. Контакт: ${app.contactName}. ${app.details}`
  });

  app.status = 'approved';
  app.statusLabel = '🟢 Договір підписано';
  FoundationStore.saveData(data);
  renderAdminB2b();
  alert(`🎉 Компанію «${app.company}» переведено в статус офіційного B2B-Партнера!`);
}

function deleteAdminB2bApp(id) {
  if (confirm(`Видалити заявку ${id}?`)) {
    FoundationStore.deleteB2bApp(id);
    renderAdminB2b();
  }
}

function deleteAdminB2bPartner(id) {
  if (confirm(`Видалити партнера ${id} з реєстру?`)) {
    FoundationStore.deleteB2bPartner(id);
    renderAdminB2b();
  }
}

function showAddB2bPartnerModal() {
  document.getElementById('b2bPartnerModal').style.display = 'flex';
}

function saveNewB2bPartner(event) {
  event.preventDefault();
  const name = document.getElementById('newB2bName').value.trim();
  const tier = document.getElementById('newB2bTier').value;
  const icon = document.getElementById('newB2bIcon').value.trim() || '🤝';
  const contrib = document.getElementById('newB2bContrib').value.trim();
  const desc = document.getElementById('newB2bDesc').value.trim();

  let tierClass = 'tier-gold';
  if (tier.includes('Срібний')) tierClass = 'tier-silver';
  if (tier.includes('Бронзовий')) tierClass = 'tier-bronze';

  const data = FoundationStore.getData();
  if (!data.b2bPartners) data.b2bPartners = [];
  data.b2bPartners.push({
    id: 'b2b_' + Date.now().toString().slice(-4),
    name,
    tier,
    tierClass,
    contribution: contrib,
    icon,
    desc: desc || `Офіційний корпоративний партнер ${name} у програмі підтримки ЗСУ.`
  });

  FoundationStore.saveData(data);
  document.getElementById('b2bPartnerModal').style.display = 'none';
  event.target.reset();
  renderAdminB2b();
  alert('🎉 Нового B2B-Партнера успішно додано до Реєстру Титанів!');
}


// === Section 20: Podcasts & Radio CRM ===
function renderAdminPodcasts() {
  const pBody = document.getElementById('podcastsTableBody');
  const qBody = document.getElementById('podQuestionsTableBody');
  if (!pBody || !qBody || !window.FoundationStore) return;

  const pods = FoundationStore.getPodcasts ? FoundationStore.getPodcasts() : [];
  const quests = FoundationStore.getPodcastQuestions ? FoundationStore.getPodcastQuestions() : [];

  if (pods.length === 0) {
    pBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Епізодів поки немає</td></tr>';
  } else {
    pBody.innerHTML = pods.map(p => `
      <tr>
        <td><strong style="color: var(--accent-gold);">${p.id}</strong><br><small style="color: #888;">${p.date}</small></td>
        <td style="font-weight: 800; color: #ffb703;">${p.episode}</td>
        <td style="font-weight: 700; color: #fff;">${p.title}</td>
        <td style="color: #10b981; font-weight: 600;">🎙️ ${p.guest}</td>
        <td><span style="background: rgba(59,130,246,0.15); color: #60a5fa; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 700;">${p.category}</span></td>
        <td style="color: #ccc;">⏱️ ${p.duration}</td>
        <td>
          <button class="btn-admin btn-del" onclick="deleteAdminPodcast('${p.id}')">🗑️ Видалити</button>
        </td>
      </tr>
    `).join('');
  }

  if (quests.length === 0) {
    qBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Питань від глядачів поки немає</td></tr>';
  } else {
    qBody.innerHTML = quests.map(q => `
      <tr>
        <td><strong style="color: var(--accent-gold);">${q.id}</strong><br><small style="color: #888;">${q.date}</small></td>
        <td style="font-weight: 700; color: #fff;">${q.author}</td>
        <td><span style="color: #60a5fa;">${q.contact}</span></td>
        <td style="font-weight: 600; color: #ffb703;">${q.targetGuest}</td>
        <td style="font-size: 0.9rem; color: #ccc; max-width: 250px;">${q.question}</td>
        <td>
          <span style="background: ${q.status === 'answered' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${q.status === 'answered' ? '#10b981' : '#f59e0b'}; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 700;">${q.statusLabel}</span>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            ${q.status !== 'answered' ? `<button class="btn-admin btn-add" style="padding: 4px 10px; font-size: 0.8rem;" onclick="markPodQuestionAnswered('${q.id}')">🎙️ Озвучити в ефірі</button>` : ''}
            <button class="btn-admin btn-del" style="padding: 4px 8px;" onclick="deleteAdminPodQuestion('${q.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function markPodQuestionAnswered(id) {
  const quests = FoundationStore.getPodcastQuestions();
  const q = quests.find(item => item.id === id);
  if (!q) return;

  q.status = 'answered';
  q.statusLabel = '🟢 Озвучено в ефірі';
  const data = FoundationStore.getData();
  data.podcastQuestions = quests;
  FoundationStore.saveData(data);
  renderAdminPodcasts();
  alert(`🎉 Питання ${id} позначено як озвучене в ефірі!`);
}

function deleteAdminPodcast(id) {
  if (confirm(`Видалити епізод ${id}?`)) {
    FoundationStore.deletePodcast(id);
    renderAdminPodcasts();
  }
}

function deleteAdminPodQuestion(id) {
  if (confirm(`Видалити питання ${id}?`)) {
    FoundationStore.deletePodcastQuestion(id);
    renderAdminPodcasts();
  }
}

function showAddPodcastModal() {
  document.getElementById('addPodcastModal').style.display = 'flex';
}

function saveNewPodcast(event) {
  event.preventDefault();
  const ep = document.getElementById('newPodEp').value.trim();
  const dur = document.getElementById('newPodDur').value.trim();
  const title = document.getElementById('newPodTitle').value.trim();
  const guest = document.getElementById('newPodGuest').value.trim();
  const cat = document.getElementById('newPodCat').value;
  const desc = document.getElementById('newPodDesc').value.trim();

  const data = FoundationStore.getData();
  if (!data.podcasts) data.podcasts = [];
  const today = new Date();
  const dateStr = [today.getDate().toString().padStart(2, '0'), (today.getMonth() + 1).toString().padStart(2, '0'), today.getFullYear()].join('.');

  data.podcasts.unshift({
    id: 'pod_' + Date.now().toString().slice(-4),
    episode: ep,
    title,
    guest,
    category: cat,
    duration: dur,
    date: dateStr,
    listens: '1 050',
    desc
  });

  FoundationStore.saveData(data);
  document.getElementById('addPodcastModal').style.display = 'none';
  event.target.reset();
  renderAdminPodcasts();
  alert('🎉 Новий епізод подкасту успішно опубліковано на Радіо!');
}


// === Section 21: Support Chat CRM ===
function renderAdminSupport() {
  const body = document.getElementById('supportTableBody');
  if (!body || !window.FoundationStore) return;

  const msgs = FoundationStore.getSupportMessages ? FoundationStore.getSupportMessages() : [];

  if (msgs.length === 0) {
    body.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Звернень у підтримку поки немає</td></tr>';
  } else {
    body.innerHTML = msgs.map(m => `
      <tr>
        <td><strong style="color: var(--accent-gold);">${m.id}</strong><br><small style="color: #888;">${m.date}</small></td>
        <td style="font-weight: 700; color: #fff;">${m.author}</td>
        <td><span style="color: #60a5fa;">${m.contact}</span></td>
        <td style="font-weight: 700; color: #ffb703;">${m.subject}</td>
        <td style="font-size: 0.9rem; color: #ccc; max-width: 250px;">${m.text}</td>
        <td>
          <span style="background: ${m.status === 'answered' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${m.status === 'answered' ? '#10b981' : '#f59e0b'}; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 700;">${m.statusLabel}</span>
          ${m.reply ? `<div style="font-size: 0.8rem; color: #10b981; margin-top: 6px; font-style: italic;">«${m.reply}»</div>` : ''}
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn-admin btn-add" style="padding: 4px 10px; font-size: 0.8rem;" onclick="openSupportReplyModal('${m.id}')">💬 Відповісти</button>
            <button class="btn-admin btn-del" style="padding: 4px 8px;" onclick="deleteAdminSupportMsg('${m.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function openSupportReplyModal(id) {
  const msgs = FoundationStore.getSupportMessages();
  const m = msgs.find(item => item.id === id);
  if (!m) return;

  document.getElementById('replySupId').textContent = id;
  document.getElementById('replySupHiddenId').value = id;
  document.getElementById('replySupOriginalText').textContent = `Запит від ${m.author}: «${m.text}»`;
  document.getElementById('replySupportModal').style.display = 'flex';
}

function saveSupportReply(event) {
  event.preventDefault();
  const id = document.getElementById('replySupHiddenId').value;
  const reply = document.getElementById('replySupText').value.trim();
  if (!id || !reply) return;

  FoundationStore.answerSupportMessage(id, reply);
  document.getElementById('replySupportModal').style.display = 'none';
  event.target.reset();
  renderAdminSupport();
  alert(`🎉 Відповідь відправлено на звернення ${id}!`);
}

function deleteAdminSupportMsg(id) {
  if (confirm(`Видалити звернення ${id}?`)) {
    FoundationStore.deleteSupportMessage(id);
    renderAdminSupport();
  }
}

// === Section 23: Drone Hub CRM ===
function renderAdminDroneHub() {
  const body = document.getElementById('droneHubTableBody');
  if (!body || !window.FoundationStore) return;

  const list = FoundationStore.getDroneSubmissions ? FoundationStore.getDroneSubmissions() : [];

  if (list.length === 0) {
    body.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #888;">Зареєстрованих на полігон виробів поки немає</td></tr>';
  } else {
    body.innerHTML = list.map(item => `
      <tr>
        <td><strong style="color: var(--accent-gold);">${item.id}</strong><br><small style="color: #888;">${item.date}</small></td>
        <td style="font-weight: 700; color: #fff;">${item.author}</td>
        <td><span style="color: #60a5fa;">${item.contact}</span></td>
        <td style="font-weight: 700; color: #ffb703;">${item.kitType}</td>
        <td style="font-family: monospace; color: #fff; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px;">${item.serialNum}</td>
        <td style="font-size: 0.9rem; color: #ccc; max-width: 220px;">${item.notes || '—'}</td>
        <td>
          <span style="background: ${item.status === 'approved' ? 'rgba(16,185,129,0.2)' : (item.status === 'testing' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)')}; color: ${item.status === 'approved' ? '#10b981' : (item.status === 'testing' ? '#f59e0b' : '#ef4444')}; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 700;">${item.statusLabel}</span>
        </td>
        <td>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${item.status !== 'approved' ? `<button class="btn-admin btn-add" style="padding: 4px 8px; font-size: 0.75rem;" onclick="updateAdminDroneStatus('${item.id}', 'approved')">🟢 Пройшов</button>` : ''}
            ${item.status !== 'testing' ? `<button class="btn-admin" style="padding: 4px 8px; font-size: 0.75rem; background: rgba(245,158,11,0.2); color: #f59e0b; border: 1px solid #f59e0b;" onclick="updateAdminDroneStatus('${item.id}', 'testing')">🟡 На полігон</button>` : ''}
            ${item.status !== 'rejected' ? `<button class="btn-admin btn-del" style="padding: 4px 8px; font-size: 0.75rem;" onclick="updateAdminDroneStatus('${item.id}', 'rejected')">🔴 Відхилити</button>` : ''}
            <button class="btn-admin btn-del" style="padding: 4px 6px;" onclick="deleteAdminDroneSubmission('${item.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function updateAdminDroneStatus(id, status) {
  if (window.FoundationStore && FoundationStore.updateDroneStatus) {
    FoundationStore.updateDroneStatus(id, status);
    renderAdminDroneHub();
    alert(`🎉 Статус виробу ${id} оновлено!`);
  }
}

function deleteAdminDroneSubmission(id) {
  if (confirm(`Видалити запис про виріб ${id}?`)) {
    if (window.FoundationStore && FoundationStore.deleteDroneSubmission) {
      FoundationStore.deleteDroneSubmission(id);
      renderAdminDroneHub();
    }
  }
}

