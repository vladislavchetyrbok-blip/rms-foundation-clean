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

  renderAllAdmin();
}

function renderAllAdmin() {
  renderAdminStats();
  renderAdminCampaigns();
  renderAdminGallery();
  renderAdminHonor();
  renderAdminApps();
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
      <td><strong>${item.title}</strong></td>
      <td><span style="background: rgba(30,96,242,0.15); color: #60a5fa; padding: 4px 8px; border-radius: 8px; font-size: 0.8rem;">${item.category || ''}</span></td>
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
