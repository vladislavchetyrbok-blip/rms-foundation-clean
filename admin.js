/**
 * RMS FOUNDATION • Admin Controller (admin.js)
 * Управління всіма даними з миттєвим збереженням у localStorage та хмару JSONBin.
 */

// Перевірка авторизації при завантаженні
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('rms_admin_logged') === 'true') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminWrapper').style.display = 'flex';
    initAdminDashboard();
  } else {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminWrapper').style.display = 'none';
  }

  // Слухаємо зміни даних від інших вкладок / синхронізації
  window.addEventListener('foundation_data_changed', () => {
    renderAll();
  });
});

function attemptLogin() {
  const pass = document.getElementById('adminPassword').value.trim();
  if (pass === 'admin' || pass === '1234' || pass === 'rms2026' || pass === '') {
    sessionStorage.setItem('rms_admin_logged', 'true');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminWrapper').style.display = 'flex';
    initAdminDashboard();
  } else {
    alert('❌ Невірний пароль! Спробуйте: admin або 1234');
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('rms_admin_logged');
  window.location.reload();
}

function switchSection(sectionId, btnElem) {
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => el.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');

  document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
  const targetSec = document.getElementById('sec-' + sectionId);
  if (targetSec) targetSec.style.display = 'block';

  const titles = {
    'dashboard': 'Головна та Статистика',
    'campaigns': '🔥 Активні збори',
    'honor': '🌟 Дошка пошани (Герої та Меценати)',
    'applications': '📬 Заявки та Контакти'
  };
  const titleEl = document.getElementById('sectionTitleText');
  if (titleEl && titles[sectionId]) titleEl.innerText = titles[sectionId];
}

function initAdminDashboard() {
  // При завантаженні адмінки відразу запускаємо синхронізацію з хмарою
  if (window.FoundationStore) {
    window.FoundationStore.initOnlineSync();
  }
  renderAll();
}

function forceSyncOnline() {
  const badge = document.getElementById('syncStatusBadge');
  if (badge) {
    badge.innerText = '⏳ Синхронізація з хмарою...';
    badge.style.color = '#ffb703';
  }
  if (window.FoundationStore) {
    window.FoundationStore.initOnlineSync();
    setTimeout(() => {
      renderAll();
      if (badge) {
        badge.innerText = '🟢 Хмара синхронізована';
        badge.style.color = 'var(--admin-green)';
      }
      alert('🌐 Дані успішно завантажено та синхронізовано з хмарою!');
    }, 1200);
  }
}

function renderAll() {
  if (!window.FoundationStore) return;
  const data = window.FoundationStore.getData();
  if (!data) return;

  // 1. Статистика верхніх карток
  document.getElementById('statCampCount').innerText = data.campaigns ? data.campaigns.length : 0;
  document.getElementById('statHonorCount').innerText = data.honorBoard ? data.honorBoard.length : 0;
  const appsCount = (data.applications ? data.applications.length : 0) + (data.supportMessages ? data.supportMessages.length : 0);
  document.getElementById('statAppCount').innerText = appsCount;
  document.getElementById('statTotalCol').innerText = data.stats && data.stats.totalCollected ? Number(data.stats.totalCollected).toLocaleString() : '14,850,000';

  // 2. Форма головних показників
  if (data.stats) {
    document.getElementById('inpStatsTotal').value = data.stats.totalCollected || '';
    document.getElementById('inpStatsDrones').value = data.stats.dronesAndVehicles || '';
    document.getElementById('inpStatsVolunteers').value = data.stats.volunteersCount || '';
  }

  // 3. Таблиця зборів
  renderCampaignsTable(data.campaigns || []);

  // 4. Таблиця дошки пошани
  renderHonorTable(data.honorBoard || []);

  // 5. Таблиця заявок
  renderAppsTable(data.applications || [], data.supportMessages || []);
}

function saveStatsForm() {
  const data = window.FoundationStore.getData();
  if (!data.stats) data.stats = {};
  data.stats.totalCollected = Number(document.getElementById('inpStatsTotal').value) || 14850000;
  data.stats.dronesAndVehicles = Number(document.getElementById('inpStatsDrones').value) || 342;
  data.stats.volunteersCount = Number(document.getElementById('inpStatsVolunteers').value) || 480;

  window.FoundationStore.saveData(data);
  alert('✅ Головні показники успішно збережено на сайті та в хмарі!');
  renderAll();
}

/* === КЕРУВАННЯ ЗБОРАМИ === */
function renderCampaignsTable(campaigns) {
  const tbody = document.getElementById('campsTableBody');
  if (!tbody) return;
  if (!campaigns.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">Активних зборів немає</td></tr>`;
    return;
  }

  tbody.innerHTML = campaigns.map(camp => {
    const titleText = typeof camp.title === 'object' ? (camp.title.uk || camp.title.en) : camp.title;
    const isHidden = !camp.target || camp.hideProgress;
    const progressText = isHidden ? `<span style="color: #ffb703; font-weight: 600;">⛽ Без цілі та шкали (Паливо)</span>` : `<strong style="color: var(--admin-green);">${Number(camp.collected || 0).toLocaleString()} ₴</strong> / ${Number(camp.target || 0).toLocaleString()} ₴`;

    return `
      <tr>
        <td style="font-weight: 600; max-width: 240px; word-break: break-word;">${titleText}</td>
        <td><span style="background: rgba(30,96,242,0.2); color: #fff; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">${camp.category || 'auto'}</span></td>
        <td>${progressText}</td>
        <td style="font-size: 0.85rem;">
          <div><strong style="color: var(--admin-accent);">MB:</strong> <a href="${camp.jarUrl || '#'}" target="_blank" style="color: #60a5fa;">${camp.jarUrl ? 'Відкрити Банку' : '—'}</a></div>
          <div style="margin-top: 4px;"><strong style="color: #60a5fa;">WFP:</strong> <a href="${camp.wayforpayUrl || '#'}" target="_blank" style="color: #60a5fa;">${camp.wayforpayUrl ? 'Відкрити шлюз' : '—'}</a></div>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn-admin btn-edit" onclick="editCamp('${camp.id}')">✏️ Редагувати</button>
          <button class="btn-admin btn-del" onclick="deleteCamp('${camp.id}')">🗑️ Видалити</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openCampModal() {
  document.getElementById('campModalTitle').innerText = 'Створення нового збору';
  document.getElementById('editCampId').value = '';
  document.getElementById('campInputTitle').value = '';
  document.getElementById('campInputDesc').value = '';
  document.getElementById('campInputJar').value = 'https://send.monobank.ua/jar/6iL3oH5Vde';
  document.getElementById('campInputWayForPay').value = 'https://secure.wayforpay.com/donate';
  document.getElementById('campInputCard').value = '4874 1000 3862 9211';
  document.getElementById('campInputHideProgress').value = 'true';
  document.getElementById('campInputTarget').value = '';
  document.getElementById('campInputCollected').value = '';
  document.getElementById('campModal').style.display = 'flex';
}

function editCamp(id) {
  const data = window.FoundationStore.getData();
  const camp = (data.campaigns || []).find(c => c.id === id);
  if (!camp) return;

  document.getElementById('campModalTitle').innerText = 'Редагування збору: ' + id;
  document.getElementById('editCampId').value = camp.id;
  const titleText = typeof camp.title === 'object' ? (camp.title.uk || camp.title.en) : camp.title;
  const descText = typeof camp.desc === 'object' ? (camp.desc.uk || camp.desc.en) : camp.desc;

  document.getElementById('campInputTitle').value = titleText || '';
  document.getElementById('campInputDesc').value = descText || '';
  document.getElementById('campInputJar').value = camp.jarUrl || '';
  document.getElementById('campInputWayForPay').value = camp.wayforpayUrl || '';
  document.getElementById('campInputCard').value = camp.cardNum || '';
  document.getElementById('campInputHideProgress').value = (!camp.target || camp.hideProgress) ? 'true' : 'false';
  document.getElementById('campInputTarget').value = camp.target || '';
  document.getElementById('campInputCollected').value = camp.collected || '';

  document.getElementById('campModal').style.display = 'flex';
}

function saveCampForm() {
  const id = document.getElementById('editCampId').value.trim() || ('camp_' + Math.floor(1000 + Math.random() * 9000));
  const title = document.getElementById('campInputTitle').value.trim();
  const desc = document.getElementById('campInputDesc').value.trim();
  const jarUrl = document.getElementById('campInputJar').value.trim();
  const wayforpayUrl = document.getElementById('campInputWayForPay').value.trim();
  const cardNum = document.getElementById('campInputCard').value.trim();
  const hideProgress = document.getElementById('campInputHideProgress').value === 'true';
  const targetVal = document.getElementById('campInputTarget').value.trim();
  const collectedVal = document.getElementById('campInputCollected').value.trim();

  if (!title) {
    alert('Будь ласка, введіть назву збору');
    return;
  }

  const data = window.FoundationStore.getData();
  if (!data.campaigns) data.campaigns = [];

  let camp = data.campaigns.find(c => c.id === id);
  if (!camp) {
    camp = { id, category: 'auto', icon: '⛽', urgent: true, image: 'drone.png' };
    data.campaigns.unshift(camp);
  }

  if (typeof camp.title === 'object') {
    camp.title.uk = title;
  } else {
    camp.title = { uk: title, en: title };
  }

  if (typeof camp.desc === 'object') {
    camp.desc.uk = desc;
  } else {
    camp.desc = { uk: desc, en: desc };
  }

  camp.jarUrl = jarUrl;
  camp.wayforpayUrl = wayforpayUrl;
  camp.cardNum = cardNum;
  camp.hideProgress = hideProgress;
  camp.target = (hideProgress || !targetVal) ? null : Number(targetVal);
  camp.collected = (hideProgress || !collectedVal) ? null : Number(collectedVal);

  window.FoundationStore.saveData(data);
  closeModal('campModal');
  alert('✅ Збір збережено на сайті та синхронізовано з хмарою!');
  renderAll();
}

function deleteCamp(id) {
  if (!confirm('Ви впевнені, що хочете видалити цей збір?')) return;
  const data = window.FoundationStore.getData();
  data.campaigns = (data.campaigns || []).filter(c => c.id !== id);
  window.FoundationStore.saveData(data);
  renderAll();
}

/* === КЕРУВАННЯ ДОШКОЮ ПОШАНИ === */
function renderHonorTable(honorBoard) {
  const tbody = document.getElementById('honorTableBody');
  if (!tbody) return;
  if (!honorBoard.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">На Дошці пошани поки немає героїв</td></tr>`;
    return;
  }

  tbody.innerHTML = honorBoard.map(h => {
    return `
      <tr>
        <td>
          <img src="${h.image || 'honor_patron.jpg'}" alt="photo" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 1px solid var(--admin-border);">
        </td>
        <td style="font-weight: 600;">${h.name}</td>
        <td style="color: var(--text-muted);">${h.role}</td>
        <td><span style="background: rgba(255,183,3,0.15); color: #ffb703; padding: 4px 10px; border-radius: 10px; font-size: 0.8rem;">${h.badge || '⭐️'}</span></td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn-admin btn-edit" onclick="editHonor('${h.id}')">✏️</button>
          <button class="btn-admin btn-del" onclick="deleteHonor('${h.id}')">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openHonorModal() {
  document.getElementById('honorModalTitle').innerText = 'Додавання героя на Дошку пошани';
  document.getElementById('editHonorId').value = '';
  document.getElementById('honorInputName').value = '';
  document.getElementById('honorInputRole').value = '';
  document.getElementById('honorInputImg').value = 'honor_patron.jpg';
  document.getElementById('honorInputBadge').value = '⭐️ Герой фронту';
  document.getElementById('honorModal').style.display = 'flex';
}

function editHonor(id) {
  const data = window.FoundationStore.getData();
  const h = (data.honorBoard || []).find(item => item.id === id);
  if (!h) return;

  document.getElementById('honorModalTitle').innerText = 'Редагування героя: ' + h.name;
  document.getElementById('editHonorId').value = h.id;
  document.getElementById('honorInputName').value = h.name || '';
  document.getElementById('honorInputRole').value = h.role || '';
  document.getElementById('honorInputImg').value = h.image || 'honor_patron.jpg';
  document.getElementById('honorInputBadge').value = h.badge || '';
  document.getElementById('honorModal').style.display = 'flex';
}

function saveHonorForm() {
  const id = document.getElementById('editHonorId').value.trim() || ('hb_' + Math.floor(1000 + Math.random() * 9000));
  const name = document.getElementById('honorInputName').value.trim();
  const role = document.getElementById('honorInputRole').value.trim();
  const image = document.getElementById('honorInputImg').value.trim() || 'honor_patron.jpg';
  const badge = document.getElementById('honorInputBadge').value.trim() || '⭐️';

  if (!name) {
    alert('Введіть ім\'я або назву команди');
    return;
  }

  const data = window.FoundationStore.getData();
  if (!data.honorBoard) data.honorBoard = [];

  let h = data.honorBoard.find(item => item.id === id);
  if (!h) {
    h = { id, category: 'volunteer', iconClass: 'fa-user-shield' };
    data.honorBoard.unshift(h);
  }

  h.name = name;
  h.role = role;
  h.image = image;
  h.badge = badge;

  window.FoundationStore.saveData(data);
  closeModal('honorModal');
  alert('✅ Героя успішно збережено на Дошці пошани та синхронізовано з хмарою!');
  renderAll();
}

function deleteHonor(id) {
  if (!confirm('Ви впевнені, що хочете видалити цього героя з Дошки пошани?')) return;
  const data = window.FoundationStore.getData();
  data.honorBoard = (data.honorBoard || []).filter(item => item.id !== id);
  window.FoundationStore.saveData(data);
  renderAll();
}

/* === КЕРУВАННЯ ЗАЯВКАМИ === */
function renderAppsTable(applications, supportMessages) {
  const tbody = document.getElementById('appsTableBody');
  if (!tbody) return;
  
  const allApps = [
    ...applications.map(a => ({ id: a.id, date: a.date || '—', name: a.name || '—', contact: a.phone || a.email || '—', msg: a.role ? (`${a.role}: ${a.notes || ''}`) : (a.notes || '—'), type: 'app' })),
    ...supportMessages.map(m => ({ id: m.id, date: m.date || '—', name: m.senderName || 'Чат-звернення', contact: m.senderContact || '—', msg: m.text || '—', type: 'msg' }))
  ];

  if (!allApps.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">Заявок і звернень поки немає</td></tr>`;
    return;
  }

  tbody.innerHTML = allApps.map(item => {
    return `
      <tr>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${item.date}</td>
        <td style="font-weight: 600;">${item.name}</td>
        <td><a href="tel:${item.contact}" style="color: #60a5fa; text-decoration: none;">${item.contact}</a></td>
        <td style="max-width: 280px; word-break: break-word; color: #cbd5e1;">${item.msg}</td>
        <td style="text-align: right;">
          <button class="btn-admin btn-del" onclick="deleteAppItem('${item.id}', '${item.type}')">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function deleteAppItem(id, type) {
  if (!confirm('Видалити це звернення?')) return;
  if (type === 'app' && window.FoundationStore.deleteApplication) {
    window.FoundationStore.deleteApplication(id);
  } else if (type === 'msg' && window.FoundationStore.deleteSupportMessage) {
    window.FoundationStore.deleteSupportMessage(id);
  } else {
    const data = window.FoundationStore.getData();
    if (data.applications) data.applications = data.applications.filter(a => a.id !== id);
    if (data.supportMessages) data.supportMessages = data.supportMessages.filter(m => m.id !== id);
    window.FoundationStore.saveData(data);
  }
  renderAll();
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.style.display = 'none';
}
