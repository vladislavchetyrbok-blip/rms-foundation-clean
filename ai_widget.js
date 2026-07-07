// ai_widget.js - Global AI Assistant Widget "Bot Titan 🇺🇦" for RMS Foundation
(function() {
  if (typeof window === 'undefined' || document.getElementById('titanAiWidget')) return;

  // Create styles
  const style = document.createElement('style');
  style.innerHTML = `
    #titanAiButton {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      box-shadow: 0 8px 32px rgba(245, 158, 11, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      z-index: 900;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: titanPulse 3s infinite;
    }
    #titanAiButton:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 12px 40px rgba(245, 158, 11, 0.8);
    }
    .rms-at-top #titanAiButton {
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px) scale(0.86);
    }
    @keyframes titanPulse {
      0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
      70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }
    #titanAiWidget {
      position: fixed;
      bottom: 105px;
      right: 28px;
      width: 360px;
      max-width: calc(100vw - 48px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: rgba(15, 28, 63, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(245, 158, 11, 0.4);
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 910;
      font-family: 'Inter', sans-serif;
    }
    @media (max-width: 768px) {
      #titanAiButton {
        bottom: 85px !important;
        right: 16px !important;
      }
      #titanAiWidget {
        bottom: 160px !important;
        right: 16px !important;
        width: calc(100vw - 32px) !important;
        max-height: 65vh !important;
      }
      #rmsPwaBanner {
        top: auto !important;
        bottom: 85px !important;
        left: 12px !important;
        right: 12px !important;
        max-width: calc(100vw - 24px) !important;
        padding: 10px 14px !important;
        border-radius: 16px !important;
        z-index: 980 !important;
      }
    }
    .titan-header {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(15, 28, 63, 0.9));
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .titan-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .titan-msg-bot {
      align-self: flex-start;
      background: rgba(30, 41, 59, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      padding: 14px 18px;
      border-radius: 20px 20px 20px 6px;
      font-size: 0.92rem;
      line-height: 1.6;
      max-width: 85%;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .titan-msg-user {
      align-self: flex-end;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #000;
      font-weight: 600;
      padding: 12px 16px;
      border-radius: 18px 18px 4px 18px;
      font-size: 0.9rem;
      line-height: 1.5;
      max-width: 85%;
    }
    .titan-quick-btns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 14px;
      width: 100%;
    }
    .titan-qbtn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #60a5fa;
      padding: 10px 12px;
      border-radius: 16px;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      box-sizing: border-box;
    }
    .titan-qbtn:nth-child(odd) {
      justify-content: flex-start;
      text-align: left;
    }
    .titan-qbtn:nth-child(even) {
      justify-content: flex-end;
      text-align: right;
    }
    .titan-qbtn:hover {
      background: #60a5fa;
      color: #000;
      font-weight: 700;
    }
    @media (max-width: 768px) {
      #titanAiButton {
        bottom: 85px !important;
        right: 16px !important;
        width: 56px !important;
        height: 56px !important;
      }
      #titanAiWidget {
        bottom: 150px !important;
        right: 10px !important;
        left: 10px !important;
        width: auto !important;
      }
    }
    .titan-footer {
      padding: 12px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      gap: 8px;
      background: rgba(0, 0, 0, 0.3);
    }
    .titan-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 14px;
      padding: 10px 14px;
      color: #fff;
      font-size: 0.9rem;
      outline: none;
    }
    .titan-send {
      background: #f59e0b;
      color: #000;
      border: none;
      border-radius: 14px;
      padding: 0 16px;
      font-weight: 800;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .titan-send:hover {
      transform: scale(1.05);
    }
    /* === GLOBAL MEGA-MENU TOP BAR & OVERLAY === */
    #rmsTopBar {
      background: linear-gradient(90deg, #070e1e, #131f42, #070e1e);
      border-bottom: 1px solid rgba(255, 183, 3, 0.28);
      padding: 6px 18px;
      min-height: 42px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      flex-wrap: nowrap;
      font-family: 'Montserrat', 'Inter', sans-serif;
      font-size: 0.78rem;
      color: #cbd5e1;
      position: sticky;
      top: 0;
      z-index: 240;
      box-shadow: 0 3px 18px rgba(0,0,0,0.45);
      backdrop-filter: blur(12px);
    }
    #rmsTopBar > div { min-width: 0; }
    #rmsTopBar > div:first-child {
      flex: 1;
      overflow: hidden;
    }
    #rmsTopBar > div:first-child > span:first-child {
      flex-shrink: 0;
      white-space: nowrap;
    }
    #rmsTopBar .topbar-hide-mob {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #topLangSwitcher {
      display: none !important;
    }
    #rmsMegaMenuBtn {
      background: linear-gradient(135deg, #ffb703, #f59e0b, #d97706);
      color: #000;
      border: 1px solid rgba(255,255,255,0.78);
      padding: 7px 14px;
      min-height: 34px;
      border-radius: 50px;
      font-weight: 900;
      font-size: 0.78rem;
      letter-spacing: 0.2px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 0 16px rgba(255, 183, 3, 0.35);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-transform: uppercase;
      white-space: nowrap;
    }
    #rmsMegaMenuBtn:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 24px rgba(255, 183, 3, 0.55);
      background: linear-gradient(135deg, #fbbf24, #ffb703);
    }
    @keyframes megaBtnPulse {
      0% { box-shadow: 0 0 15px rgba(255, 183, 3, 0.6); }
      50% { box-shadow: 0 0 35px rgba(255, 183, 3, 1), 0 0 50px rgba(245, 158, 11, 0.7); }
      100% { box-shadow: 0 0 15px rgba(255, 183, 3, 0.6); }
    }
    #rmsMegaMenuOverlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(7, 14, 30, 0.92);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      z-index: 1000000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 30px 20px;
      box-sizing: border-box;
      font-family: 'Montserrat', 'Inter', sans-serif;
      animation: megaFadeIn 0.3s ease;
    }
    @keyframes megaFadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
    .mega-modal {
      background: rgba(15, 28, 63, 0.85);
      border: 2px solid var(--accent-gold, #f59e0b);
      border-radius: 28px;
      width: 100%;
      max-width: 1300px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 70px rgba(0,0,0,0.9), 0 0 50px rgba(245,158,11,0.2);
      overflow: hidden;
    }
    .mega-header {
      padding: 25px 30px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: rgba(0,0,0,0.3);
    }
    .mega-search-wrap {
      padding: 15px 30px;
      background: rgba(7, 14, 30, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #megaSearchInput {
      flex: 1;
      background: transparent;
      border: none;
      color: #fff;
      font-size: 1.1rem;
      outline: none;
    }
    #megaSearchInput::placeholder { color: #64748b; }
    .mega-grid {
      padding: 25px 30px;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 25px;
      flex: 1;
    }
    @media (max-width: 1100px) { .mega-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 900px) {
      #rmsTopBar .topbar-hide-mob { display: none !important; }
    }
    @media (max-width: 768px) { 
      .mega-grid { grid-template-columns: 1fr; }
      #rmsTopBar { position: relative !important; padding: 6px 12px; justify-content: center; }
      #rmsTopBar > div:first-child { display: none !important; }
      #rmsMegaMenuBtn { width: 100%; justify-content: center; font-size: 0.78rem; padding: 8px 12px; }
      .topbar-hide-mob { display: none !important; }
      .mega-header { flex-direction: column; gap: 15px; }
    }
    .mega-col {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .mega-col-title {
      font-weight: 900;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
      padding-bottom: 8px;
      border-bottom: 2px solid #fff;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .mega-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      color: #fff;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .mega-link:hover {
      background: rgba(245, 158, 11, 0.15);
      border-color: #f59e0b;
      transform: translateX(4px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }
    .mega-icon {
      font-size: 1.5rem;
      min-width: 32px;
      text-align: center;
    }
    .mega-link strong {
      display: block;
      font-size: 0.9rem;
      color: #f8fafc;
      font-weight: 700;
    }
    .mega-link small {
      display: block;
      font-size: 0.75rem;
      color: #94a3b8;
      line-height: 1.2;
    }
    .mega-footer {
      padding: 15px 30px;
      background: rgba(0,0,0,0.5);
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: #888;
    }
  `;
  document.head.appendChild(style);

  // Create Button
  const btn = document.createElement('button');
  btn.id = 'titanAiButton';
  btn.type = 'button';
  btn.title = 'AI-Консультант «Бот Титан 🇺🇦»';
  btn.setAttribute('aria-label', 'Відкрити AI-консультанта фонду');
  btn.innerHTML = '🤖';
  document.body.appendChild(btn);

  const updateTitanVisibility = () => {
    document.body.classList.toggle('rms-at-top', window.scrollY < 240);
  };
  window.addEventListener('scroll', updateTitanVisibility, { passive: true });
  updateTitanVisibility();

  // Create Widget
  const widget = document.createElement('div');
  widget.id = 'titanAiWidget';
  widget.innerHTML = `
    <div class="titan-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.5rem;">🤖</span>
        <div>
          <strong style="color: #fff; font-size: 1rem; display: block;">Бот Титан AI 🇺🇦</strong>
          <span style="color: #10b981; font-size: 0.78rem; display: flex; align-items: center; gap: 6px;"><span class="live-dot" style="display: inline-block;"></span> Онлайн • 1000 Модулів • Bank-API</span>
        </div>
      </div>
      <button id="titanCloseBtn" style="background: none; border: none; color: #aaa; font-size: 1.3rem; cursor: pointer;">✕</button>
    </div>
    <div class="titan-body" id="titanBody">
      <div class="titan-msg-bot">
        <div>Вітаю! Я <strong>Бот Титан</strong> — ваш штучний інтелект-провідник по екосистемі благодійного фонду «Разом ми — сила»! Чим можу допомогти сьогодні?</div>
        <div class="titan-quick-btns">
          <button class="titan-qbtn" onclick="titanAsk('Як зібрати дрон?')">🛸 Як зібрати дрон?</button>
          <button class="titan-qbtn" onclick="titanAsk('Де здати кров?')">🩸 Банк Крові</button>
          <button class="titan-qbtn" onclick="titanAsk('Генератори та світло')">⚡ Енерго-Щит</button>
          <button class="titan-qbtn" onclick="titanAsk('Ветеранський бізнес')">🚀 Бізнес ветеранів</button>
          <button class="titan-qbtn" onclick="titanAsk('Мобільні шпиталі')">🏥 Шпиталі на колесах</button>
          <button class="titan-qbtn" onclick="titanAsk('Конструктор рапорту')">⚖️ Юридична Опора</button>
        </div>
      </div>
    </div>
    <div class="ai-quick-chips">
      <button class="ai-chip" type="button" onclick="window.location.href='ai_impact_generator.html'" style="color: #ffb703; border-color: rgba(255,183,3,0.5); font-weight: 800;">📊 ШІ-Сертифікат</button>
      <button class="ai-chip" type="button" onclick="titanAsk('Як працює Калькулятор Впливу?')">🧮 Калькулятор</button>
      <button class="ai-chip" type="button" onclick="titanAsk('Які 1000 модулів є у фонді?')">🌐 1000 Модулів</button>
      <button class="ai-chip" type="button" onclick="titanAsk('Як отримати податкову знижку?')">📜 Податкова</button>
      <button class="ai-chip" type="button" onclick="titanAsk('Як долучитися волонтером?')">🤝 Волонтерство</button>
    </div>
    <form class="titan-footer" id="titanForm" onsubmit="titanSubmit(event)" style="display: flex; gap: 6px; align-items: center;">
      <button type="button" id="titanVoiceBtn" class="titan-send" style="background: rgba(56,189,248,0.2); color: #38bdf8; font-size: 1.1rem; padding: 0 10px; border-radius: 12px;" title="Голосовий ввід (Увімкнути мікрофон)" onclick="titanToggleVoice()">🎤</button>
      <button type="button" id="titanSpeakBtn" class="titan-send" style="background: rgba(255,255,255,0.06); color: #94a3b8; font-size: 1.1rem; padding: 0 10px; border-radius: 12px;" title="Озвучування відповідей ШІ" onclick="titanToggleSpeak()">🔇</button>
      <input type="text" id="titanInput" class="titan-input" placeholder="Запитайте або скажіть голосом..." autocomplete="off">
      <button type="submit" class="titan-send">➤</button>
    </form>
  `;
  document.body.appendChild(widget);

  // Event Listeners
  btn.addEventListener('click', () => {
    widget.style.display = widget.style.display === 'flex' ? 'none' : 'flex';
  });
  document.getElementById('titanCloseBtn').addEventListener('click', () => {
    widget.style.display = 'none';
  });

  window.titanAsk = function(text) {
    document.getElementById('titanInput').value = text;
    document.getElementById('titanForm').dispatchEvent(new Event('submit'));
  };

  window.titanSubmit = function(e) {
    e.preventDefault();
    const input = document.getElementById('titanInput');
    const text = input.value.trim();
    if (!text) return;

    const body = document.getElementById('titanBody');
    
    // Add User Message
    const uMsg = document.createElement('div');
    uMsg.className = 'titan-msg-user';
    uMsg.textContent = text;
    body.appendChild(uMsg);
    input.value = '';
    body.scrollTop = body.scrollHeight;

    // Simulate AI Thinking
    setTimeout(() => {
      const bMsg = document.createElement('div');
      bMsg.className = 'titan-msg-bot';
      
      let reply = "Дякую за звернення! Наша система містить 1000 спеціалізованих модулів. Якщо ви хочете зробити донат — перейдіть на сторінку «🤝 Долучитися». Для зв'язку з живим координатором скористайтеся розділом «💬 Підтримка».";
      const lower = text.toLowerCase();

      if (lower.includes('калькулятор') || lower.includes('вплив') || lower.includes('конверт') || lower.includes('сума')) {
        reply = "🧮 <strong>Інтерактивний Калькулятор Впливу:</strong> На головній сторінці фонду ви можете потягнути повзунок і миттєво побачити, у які саме засоби порятунку (аптечки IFAK, турнікети, тепловізори, EcoFlow чи мобільні шпиталі) конвертується ваш донат! <br><a href='index.html#calc' style='color: #00d4ff; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Відкрити Калькулятор Впливу</a>";
      } else if (lower.includes('500') || lower.includes('1000') || lower.includes('модул') || lower.includes('екосистем') || lower.includes('хаб') || lower.includes('кластер')) {
        reply = "🌐 <strong>Екосистема 1000 Модулів:</strong> Наш фонд об'єднує 1000 активних напрямків у 5 кластерах (Оборона, Медицина, Спільнота, Відбудова, Майбутнє/ШІ). Ви можете відфільтрувати та знайти будь-який проєкт за лічені секунди! <br><a href='ecosystem.html' style='color: #ffb703; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Переглянути всі 1000 модулів</a>";
      } else if (lower.includes('податк') || lower.includes('знижк') || lower.includes('finanzamt') || lower.includes('501') || lower.includes('неприбутк') || lower.includes('звіт')) {
        reply = "📜 <strong>Податкові знижки та звітність:</strong> Наш фонд має офіційний неприбутковий статус (ЄДРПОУ 44859201) та партнерство в ЄС і США (501c3). Після донату напишіть на support@razom-sila.org для отримання офіційного документа для Finanzamt чи податкової! <br><a href='transparency.html' style='color: #10b981; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Прозорість і звіти</a>";
      } else if (lower.includes('волонтер') || lower.includes('долуч') || lower.includes('команда') || lower.includes('партнер')) {
        reply = "🤝 <strong>Приєднатися до команди:</strong> Ми завжди шукаємо волонтерів-водіїв, перекладачів, IT-спеціалістів та координаторів! Заповніть коротку анкету або оберіть напрямок допомоги. <br><a href='join.html' style='color: #38bdf8; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Стати волонтером</a>";
      } else if (lower.includes('дрон') || lower.includes('збірк') || lower.includes('інженер') || lower.includes('fpv') || lower.includes('реб')) {
        reply = "🛠️ <strong>Інженерний Хаб «Сталеві Крила»:</strong> Ви можете отримати безкоштовний кит-комплект або інструкцію для збірки FPV та РЕБ вдома! Переходьте: <br><a href='drone_hub.html' style='color: #f59e0b; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Відкрити Інженерний Хаб</a>";
      } else if (lower.includes('кров') || lower.includes('донор') || lower.includes('група')) {
        reply = "🩸 <strong>Банк Крові «Кров'яна Варта»:</strong> У нас працює світлофор потреб та реєстрація донорів для прифронтових шпиталів! 1 донація = 3 врятовані життя. <br><a href='donor_hub.html' style='color: #ef4444; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Переглянути потреби в крові</a>";
      } else if (lower.includes('рапорт') || lower.includes('юрист') || lower.includes('влк') || lower.includes('адвокат') || lower.includes('закон')) {
        reply = "⚖️ <strong>Юридична та Правова Опора:</strong> Ми створили онлайн-конструктор військових рапортів та надаємо безкоштовних адвокатів для бійців та родин! <br><a href='legal_aid.html' style='color: #60a5fa; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Створити юридичний рапорт</a>";
      } else if (lower.includes('твар') || lower.includes('собак') || lower.includes('кот') || lower.includes('патрон') || lower.includes('к-9') || lower.includes('к9')) {
        reply = "🐾 <strong>Зоо-Хаб «Хвостаті Патрони»:</strong> Ми евакуюємо тварин із зони бойових дій та забезпечуємо бронежилетами службових собак саперів К-9! <br><a href='animals_rescue.html' style='color: #10b981; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Допомогти хвостикам</a>";
      } else if (lower.includes('сертифікат') || lower.includes('кабінет') || lower.includes('меценат') || lower.includes('профіл') || lower.includes('бейдж')) {
        reply = "🏆 <strong>Кабінет Мецената:</strong> Тут ви можете переглянути свої бейджі, історію донатів та згенерувати іменний почесний сертифікат з печаткою! <br><a href='profile.html' style='color: #f59e0b; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Відкрити мій Кабінет</a>";
      } else if (lower.includes('еко') || lower.includes('мін') || lower.includes('розмін') || lower.includes('земл') || lower.includes('ліс') || lower.includes('дерев')) {
        reply = "🌱 <strong>Еко-Оборона та Розмінування:</strong> Ми купуємо роботизовані міношукачі «Скіф-М» для полів та висаджуємо 10,000 дерев у Серебрянському лісі! <br><a href='eco_defense.html' style='color: #10b981; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Підтримати очищення землі</a>";
      } else if (lower.includes('діт') || lower.includes('школ') || lower.includes('ноутбук') || lower.includes('табір') || lower.includes('кемп') || lower.includes('стипенд')) {
        reply = "👧👦 <strong>Діти Війни та Освітній Хаб:</strong> Надаємо ноутбуки дітям Героїв, путівки в Карпати та стипендії! <br><a href='children_future.html' style='color: #a855f7; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Допомогти дітям захисників</a>";
      } else if (lower.includes('енерг') || lower.includes('генератор') || lower.includes('світл') || lower.includes('блекаут') || lower.includes('starlink') || lower.includes('старлінк') || lower.includes('ecoflow')) {
        reply = "⚡ <strong>Енергетичний Щит та Зв'язок:</strong> Забезпечуємо шпиталі та передові бліндажі генераторами, зарядними станціями та Starlink! Скористайтеся калькулятором автономності: <br><a href='energy_shield.html' style='color: #f59e0b; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Підтримати Енерго-Щит ЗСУ</a>";
      } else if (lower.includes('ветеран') || lower.includes('бізнес') || lower.includes('грант') || lower.includes('крафт') || lower.includes('кава') || lower.includes('мед')) {
        reply = "🚀 <strong>Ветеранський Бізнес-Інкубатор:</strong> Підтримайте крафтові бренди наших ветеранів або подайте заявку на мікрогрант до 250,000 ₴ для власної справи! <br><a href='veteran_business.html' style='color: #10b981; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Вітрина «Купуй Ветеранське!»</a>";
      } else if (lower.includes('шпитал') || lower.includes('стоматолог') || lower.includes('лікар') || lower.includes('медиц') || lower.includes('евакуац') || lower.includes('реанімобіль')) {
        reply = "🏥 <strong>Мобільні Шпиталі та Стоматології:</strong> Переобладнуємо автобуси на стоматологічні кабінети на колесах та броньовані реанімобілі для передової! <br><a href='mobile_hospitals.html' style='color: #ef4444; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Допомогти мобільній медицині</a>";
      } else if (lower.includes('донат') || lower.includes('рахун') || lower.includes('iban') || lower.includes('paypal') || lower.includes('крипт')) {
        reply = "💰 Всі офіційні реквізити та мультивалютний конвертер (USD, EUR, BTC, USDT) знаходяться на сторінці донатів: <br><a href='join.html' style='color: #10b981; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Перейти до реквізитів</a>";
      }

      bMsg.innerHTML = reply;
      body.appendChild(bMsg);
      body.scrollTop = body.scrollHeight;

      if (window.titanSpeechEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const cleanText = bMsg.textContent || bMsg.innerText || "";
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'uk-UA';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }, 500);
  };

  // --- VOICE & SPEECH SYNTHESIS LOGIC ---
  window.titanSpeechEnabled = false;
  window.titanVoiceActive = false;

  window.titanToggleSpeak = function() {
    window.titanSpeechEnabled = !window.titanSpeechEnabled;
    const btn = document.getElementById('titanSpeakBtn');
    if (btn) {
      btn.textContent = window.titanSpeechEnabled ? '🔊' : '🔇';
      btn.style.background = window.titanSpeechEnabled ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)';
      btn.style.color = window.titanSpeechEnabled ? '#10b981' : '#94a3b8';
    }
    if (window.titanSpeechEnabled && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance("Голосове озвучування увімкнено! Я готовий відповідати.");
      u.lang = 'uk-UA';
      window.speechSynthesis.speak(u);
    } else if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  window.titanToggleVoice = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Ваш браузер не підтримує розпізнавання мови. Спробуйте Google Chrome або Safari.");
      return;
    }
    const btn = document.getElementById('titanVoiceBtn');
    if (window.titanVoiceActive) {
      if (window.titanRecognition) window.titanRecognition.stop();
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'uk-UA';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = function() {
      window.titanVoiceActive = true;
      if (btn) {
        btn.style.background = 'rgba(239, 68, 68, 0.4)';
        btn.style.color = '#ef4444';
      }
      document.getElementById('titanInput').placeholder = "🎤 Слухаю вас...";
    };

    rec.onresult = function(e) {
      const transcript = e.results[0][0].transcript;
      document.getElementById('titanInput').value = transcript;
      window.titanSubmit(new Event('submit'));
    };

    rec.onerror = function() {
      window.titanVoiceActive = false;
      if (btn) {
        btn.style.background = 'rgba(56,189,248,0.2)';
        btn.style.color = '#38bdf8';
      }
      document.getElementById('titanInput').placeholder = "Запитайте або скажіть голосом...";
    };

    rec.onend = function() {
      window.titanVoiceActive = false;
      if (btn) {
        btn.style.background = 'rgba(56,189,248,0.2)';
        btn.style.color = '#38bdf8';
      }
      document.getElementById('titanInput').placeholder = "Запитайте або скажіть голосом...";
    };

    window.titanRecognition = rec;
    rec.start();
  };

  // --- INJECT TOP BAR AND MEGA-MENU OVERLAY ---
  const topBar = document.createElement('div');
  topBar.id = 'rmsTopBar';
  topBar.innerHTML = `
    <div style="display: flex; align-items: center; gap: 15px;">
      <span class="top-status" style="color: #10b981; font-weight: 700; display: flex; align-items: center; gap: 6px;">
        <span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981;"></span>
        ОНЛАЙН ЕКОСИСТЕМА ФОНДУ
      </span>
      <span class="top-info topbar-hide-mob" style="color: #94a3b8;">● 1000 активних напрямків • НБУ та 501(c)(3) верифікація</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <div id="topLangSwitcher" style="display: flex; gap: 4px; background: rgba(0,0,0,0.4); padding: 3px 6px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
        <button class="top-lang-btn" data-lang="uk" title="Українська" style="background: none; border: none; color: #fff; font-size: 0.8rem; cursor: pointer; padding: 2px 6px; border-radius: 12px; font-weight: 700;">🇺🇦 UK</button>
        <button class="top-lang-btn" data-lang="en" title="English" style="background: none; border: none; color: #aaa; font-size: 0.8rem; cursor: pointer; padding: 2px 6px; border-radius: 12px; font-weight: 700;">🇬🇧 EN</button>
        <button class="top-lang-btn" data-lang="pl" title="Polski" style="background: none; border: none; color: #aaa; font-size: 0.8rem; cursor: pointer; padding: 2px 6px; border-radius: 12px; font-weight: 700;">🇵🇱 PL</button>
        <button class="top-lang-btn" data-lang="de" title="Deutsch" style="background: none; border: none; color: #aaa; font-size: 0.8rem; cursor: pointer; padding: 2px 6px; border-radius: 12px; font-weight: 700;">🇩🇪 DE</button>
        <button class="top-lang-btn topbar-hide-mob" data-lang="ro" title="Română" style="background: none; border: none; color: #aaa; font-size: 0.8rem; cursor: pointer; padding: 2px 6px; border-radius: 12px; font-weight: 700;">🇷🇴 RO</button>
        <button class="top-lang-btn topbar-hide-mob" data-lang="it" title="Italiano" style="background: none; border: none; color: #aaa; font-size: 0.8rem; cursor: pointer; padding: 2px 6px; border-radius: 12px; font-weight: 700;">🇮🇹 IT</button>
      </div>
      <button id="rmsMegaMenuBtn">
        <span>🚀 ВСІ КАТЕГОРІЇ ТА МОДУЛІ (1000)</span>
        <span style="background: #000; color: #fff; padding: 2px 8px; border-radius: 50px; font-size: 0.7rem; font-weight: 900;">▼</span>
      </button>
    </div>
  `;
  if (document.body) {
    document.body.insertBefore(topBar, document.body.firstChild);
  }

  const megaOverlay = document.createElement('div');
  megaOverlay.id = 'rmsMegaMenuOverlay';
  megaOverlay.innerHTML = `
    <div class="mega-modal">
      <div class="mega-header">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="font-size: 1.8rem;">🇺🇦</span>
            <span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid #f59e0b; padding: 4px 12px; border-radius: 50px; font-weight: 800; font-size: 0.75rem;">ГЛОБАЛЬНИЙ КАТАЛОГ ЕКОСИСТЕМИ</span>
          </div>
          <h2 style="color: #fff; font-size: 1.8rem; font-weight: 900; margin: 0; font-style: italic;">ВСІ 1000 МОДУЛІВ ТА РОЗДІЛІВ ФОНДУ</h2>
          <p style="color: #cbd5e1; font-size: 0.95rem; margin: 5px 0 0;">Швидкий перехід до будь-якого напрямку, зборів, звітів, інновацій та сервісів БФ «Разом ми — сила».</p>
        </div>
        <button id="megaCloseBtn" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: all 0.2s;">✕ ЗАКРИТИ</button>
      </div>

      <!-- Live Search Filter -->
      <div class="mega-search-wrap">
        <span style="font-size: 1.2rem; color: #aaa;">🔍</span>
        <input type="text" id="megaSearchInput" placeholder="Швидкий пошук по всіх 1000 розділах (напр: дрони, шпиталі, кров, гранти, аукціони, звітність)..." autocomplete="off">
        <button onclick="document.getElementById('megaSearchInput').value=''; window.filterMegaMenu();" style="background: none; border: none; color: #888; cursor: pointer; font-size: 1rem;">✕</button>
      </div>

      <!-- Grid of Categories -->
      <div class="mega-grid" id="megaGrid">
        
        <!-- CAT 1 -->
        <div class="mega-col" data-cat="головна збори донати волонтери підтримка crm радіо">
          <div class="mega-col-title" style="color: #f59e0b; border-bottom-color: #f59e0b;">🔥 ГОЛОВНА ТА ЗБОРИ</div>
          <a href="index.html" class="mega-link"><span class="mega-icon">🏠</span> <div><strong>Головна Сторінка</strong><small>Центральний хаб та місія</small></div></a>
          <a href="index.html#campaigns" class="mega-link"><span class="mega-icon">🎯</span> <div><strong>Активні Збори</strong><small>Термінові потреби фронту</small></div></a>
          <a href="index.html#radar" class="mega-link"><span class="mega-icon">📡</span> <div><strong>Радар Потреб ЗСУ</strong><small>Верифіковані запити бригад</small></div></a>
          <a href="map.html" class="mega-link"><span class="mega-icon">🗺️</span> <div><strong>Карта Допомоги</strong><small>Географія нашої присутності</small></div></a>
          <a href="join.html" class="mega-link"><span class="mega-icon">🤝</span> <div><strong>Долучитися (Волонтери)</strong><small>Анкета та B2B партнерство</small></div></a>
          <a href="join.html#convAmount" class="mega-link"><span class="mega-icon">💱</span> <div><strong>Конвертер Донатів</strong><small>Калькулятор цінності внеску</small></div></a>
          <a href="support.html" class="mega-link"><span class="mega-icon">💬</span> <div><strong>Служба Підтримки</strong><small>24/7 Гаряча лінія та чат</small></div></a>
          <a href="admin.html" class="mega-link"><span class="mega-icon">⚙️</span> <div><strong>CRM-Система</strong><small>Управління базою фонду</small></div></a>
        </div>

        <!-- CAT 2 -->
        <div class="mega-col" data-cat="техніка дрони реб інженерія енергія генератори аукціони батли мерч">
          <div class="mega-col-title" style="color: #ef4444; border-bottom-color: #ef4444;">⚔️ ТЕХНІКА ТА ОБОРОНА</div>
          <a href="drone_hub.html" class="mega-link"><span class="mega-icon">🛠️</span> <div><strong>Інженерний Хаб</strong><small>Дрони, РЕБ та 3D-друк</small></div></a>
          <a href="energy_shield.html" class="mega-link"><span class="mega-icon">⚡</span> <div><strong>Енерго-Щит ЗСУ</strong><small>Генератори, Starlink, EcoFlow</small></div></a>
          <a href="military_request.html" class="mega-link"><span class="mega-icon">⚔️</span> <div><strong>Запити від Військових</strong><small>Подача офіційних рапортів</small></div></a>
          <a href="auctions.html" class="mega-link"><span class="mega-icon">🎟️</span> <div><strong>Аукціони Трофеїв</strong><small>Унікальні артефакти з бою</small></div></a>
          <a href="battles.html" class="mega-link"><span class="mega-icon">🏆</span> <div><strong>Донейт-Батли</strong><small>Змагання волонтерських команд</small></div></a>
          <a href="shop.html" class="mega-link"><span class="mega-icon">🛍️</span> <div><strong>Благодійний Мерч-Шоп</strong><small>100% прибутку на армію</small></div></a>
        </div>

        <!-- CAT 3 -->
        <div class="mega-col" data-cat="медицина шпиталі стоматологія ветерани бізнес гранти реабілітація протези донори кров">
          <div class="mega-col-title" style="color: #10b981; border-bottom-color: #10b981;">🏥 МЕДИЦИНА ТА ВЕТЕРАНИ</div>
          <a href="mobile_hospitals.html" class="mega-link"><span class="mega-icon">🏥</span> <div><strong>Мобільні Шпиталі</strong><small>Стоматології та операційні на колесах</small></div></a>
          <a href="veteran_business.html" class="mega-link"><span class="mega-icon">🚀</span> <div><strong>Ветеранський Бізнес</strong><small>Гранти та вітрина брендів</small></div></a>
          <a href="rehab.html" class="mega-link"><span class="mega-icon">🦿</span> <div><strong>Реабілітація та Протези</strong><small>Біоніка та відновлення</small></div></a>
          <a href="donor_hub.html" class="mega-link"><span class="mega-icon">🩸</span> <div><strong>Банк Крові</strong><small>Світлофор потреб шпиталів</small></div></a>
          <a href="rehab.html#mental" class="mega-link"><span class="mega-icon">🧠</span> <div><strong>Психологічна Опора</strong><small>Терапія та лікування ПТСР</small></div></a>
        </div>

        <!-- CAT 4 -->
        <div class="mega-col" data-cat="екологія розмінування діти школи тварини собаки юристи академія курси">
          <div class="mega-col-title" style="color: #60a5fa; border-bottom-color: #60a5fa;">🌱 СОЦІУМ ТА МАЙБУТНЄ</div>
          <a href="eco_defense.html" class="mega-link"><span class="mega-icon">🌱</span> <div><strong>Еко-Оборона</strong><small>Гуманітарне розмінування землі</small></div></a>
          <a href="children_future.html" class="mega-link"><span class="mega-icon">👧👦</span> <div><strong>Діти Війни</strong><small>Освітній хаб та стипендії</small></div></a>
          <a href="animals_rescue.html" class="mega-link"><span class="mega-icon">🐾</span> <div><strong>Хвостаті Патрони</strong><small>Порятунок тварин та К-9</small></div></a>
          <a href="legal_aid.html" class="mega-link"><span class="mega-icon">⚖️</span> <div><strong>Юридична Опора</strong><small>Безкоштовні адвокати бійцям</small></div></a>
          <a href="training.html" class="mega-link"><span class="mega-icon">🎓</span> <div><strong>Академія ТактМеду</strong><small>Курси першої допомоги та БПЛА</small></div></a>
        </div>

        <!-- CAT 5 -->
        <div class="mega-col" data-cat="global hub іноземці прозорість звітність історії фото галерея подкасти слава пантеон меценат кабінет">
          <div class="mega-col-title" style="color: #a855f7; border-bottom-color: #a855f7;">🌍 СВІТ, ЗВІТИ ТА ПАМ'ЯТЬ</div>
          <a href="international.html" class="mega-link"><span class="mega-icon">🌍</span> <div><strong>Global Hub</strong><small>USA 501c3, UK Gift Aid, Crypto</small></div></a>
          <a href="b2b.html" class="mega-link"><span class="mega-icon">🤝</span> <div><strong>B2B-Партнерство</strong><small>Корпоративні CSR програми</small></div></a>
          <a href="transparency.html" class="mega-link"><span class="mega-icon">🛡️</span> <div><strong>Прозорість та Звіти</strong><small>Офіційні аудити та НБУ</small></div></a>
          <a href="stories.html" class="mega-link"><span class="mega-icon">📖</span> <div><strong>Історії Місій</strong><small>Репортажі врятованих життів</small></div></a>
          <a href="gallery.html" class="mega-link"><span class="mega-icon">📸</span> <div><strong>Архів Справ</strong><small>Фото та відео з передової</small></div></a>
          <a href="podcasts.html" class="mega-link"><span class="mega-icon">🎧</span> <div><strong>Подкасти</strong><small>«Голоси Передової»</small></div></a>
          <a href="honor_wall.html" class="mega-link"><span class="mega-icon">🌟</span> <div><strong>Зала Слави</strong><small>Дошка пошани героїв та патронів</small></div></a>
          <a href="memorial.html" class="mega-link"><span class="mega-icon">🕯️</span> <div><strong>Пантеон Героїв</strong><small>Вічна пам'ять та пошана</small></div></a>
          <a href="profile.html" class="mega-link"><span class="mega-icon">🎮</span> <div><strong>Кабінет Мецената</strong><small>Бейджі, геміфікація, нагороди</small></div></a>
        </div>

      </div>
      <div class="mega-footer">
        <span>💡 <strong>Підказка:</strong> Натисніть <kbd style="background: #333; padding: 2px 6px; border-radius: 4px; border: 1px solid #555;">ESC</kbd> або кнопку закриття, щоб повернутися до перегляду поточної сторінки.</span>
        <span style="color: #10b981;">● 100% модулів онлайн та синхронізовані</span>
      </div>
    </div>
  `;
  if (document.body) {
    document.body.appendChild(megaOverlay);
  }

  const openMega = () => {
    megaOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const searchEl = document.getElementById('megaSearchInput');
      if (searchEl) searchEl.focus();
    }, 100);
  };
  const closeMega = () => {
    megaOverlay.style.display = 'none';
    document.body.style.overflow = '';
  };

  const megaBtnEl = document.getElementById('rmsMegaMenuBtn');
  if (megaBtnEl) megaBtnEl.addEventListener('click', openMega);
  const megaCloseEl = document.getElementById('megaCloseBtn');
  if (megaCloseEl) megaCloseEl.addEventListener('click', closeMega);
  megaOverlay.addEventListener('click', (e) => {
    if (e.target === megaOverlay) closeMega();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && megaOverlay.style.display === 'flex') closeMega();
  });

  // --- UNIVERSAL I18N DICTIONARY FOR WIDGETS ---
  const WIDGET_I18N = {
    uk: {
      top_status: 'ОНЛАЙН ЕКОСИСТЕМА ФОНДУ',
      top_info: '● 1000 активних напрямків • НБУ та 501(c)(3) верифікація',
      mega_btn: '🚀 ВСІ КАТЕГОРІЇ ТА МОДУЛІ (1000)',
      mega_title: 'ВСІ 1000 МОДУЛІВ ТА РОЗДІЛІВ ФОНДУ',
      mega_sub: 'Оберіть будь-який напрямок для перегляду звітів, реквізитів та подачі заявок:',
      search_placeholder: '🔍 Пошук по модулях та програмах (напр: дрон, шпитал, крипта)...',
      titan_title: 'AI-Асистент фонду',
      titan_status: '🟢 Онлайн • Відповідає миттєво',
      titan_welcome: 'Вітаю! Я розумний помічник БФ «Разом ми — сила». Оберіть питання або дізнайтеся більше про нашу роботу:'
    },
    en: {
      top_status: 'ONLINE FOUNDATION ECOSYSTEM',
      top_info: '● 1000 active modules • NBU & 501(c)(3) verified',
      mega_btn: '🚀 ALL CATEGORIES & MODULES (1000)',
      mega_title: 'ALL 1000 MODULES & SECTIONS',
      mega_sub: 'Select any module to view reports, bank details, or submit requests:',
      search_placeholder: '🔍 Search modules & programs (e.g., drone, hospital, crypto)...',
      titan_title: 'Foundation AI Assistant',
      titan_status: '🟢 Online • Instant reply',
      titan_welcome: 'Greetings! I am the smart assistant of RMS Foundation. Choose a question or learn more:'
    },
    pl: {
      top_status: 'EKOSYSTEM ONLINE FUNDACJI',
      top_info: '● 1000 aktywne moduły • Weryfikacja NBU i 501(c)(3)',
      mega_btn: '🚀 WSZYSTKIE KATEGORIE I MODUŁY (1000)',
      mega_title: 'WSZYSTKIE 1000 MODUŁÓW I DZIAŁÓW',
      mega_sub: 'Wybierz dowolny moduł, aby wyświetlić raporty, dane bankowe lub złożyć wniosek:',
      search_placeholder: '🔍 Szukaj modułów i programów (np. dron, szpital, krypto)...',
      titan_title: 'Asystent AI Fundacji',
      titan_status: '🟢 Online • Natychmiastowa odpowiedź',
      titan_welcome: 'Witaj! Jestem inteligentnym asystentem Fundacji RMS. Wybierz pytanie lub dowiedz się więcej:'
    },
    de: {
      top_status: 'ONLINE-STIFTUNGSEKOSYSTEM',
      top_info: '● 1000 aktive Module • NBU- & 501(c)(3)-verifiziert',
      mega_btn: '🚀 ALLE KATEGORIEN & MODULE (1000)',
      mega_title: 'ALLE 1000 MODULE & BEREICHE',
      mega_sub: 'Wählen Sie ein Modul, um Berichte und Bankdaten anzuzeigen oder Anträge einzureichen:',
      search_placeholder: '🔍 Module & Programme suchen (z.B. Drohne, Spital, Krypto)...',
      titan_title: 'Stiftungs-KI-Assistent',
      titan_status: '🟢 Online • Sofortige Antwort',
      titan_welcome: 'Grüß Gott! Ich bin der KI-Assistent der RMS-Stiftung. Wählen Sie eine Frage oder erfahren Sie mehr:'
    },
    ro: {
      top_status: 'ECOSISTEMUL ONLINE AL FUNDAȚIEI',
      top_info: '● 1000 module active • Verificat NBU și 501(c)(3)',
      mega_btn: '🚀 TOATE CATEGORIILE ȘI MODULELE (1000)',
      mega_title: 'TOATE CELE 1000 DE MODULE ȘI SECȚIUNI',
      mega_sub: 'Selectați orice modul pentru a vedea rapoarte, detalii bancare sau pentru a trimite cereri:',
      search_placeholder: '🔍 Căutați module și programe (ex. dronă, spital, cripto)...',
      titan_title: 'Asistentul AI al Fundației',
      titan_status: '🟢 Online • Răspuns instantaneu',
      titan_welcome: 'Salut! Sunt asistentul inteligent al Fundației RMS. Alegeți o întrebare sau aflați mai multe:'
    },
    it: {
      top_status: 'ECOSISTEMA ONLINE DELLA FONDAZIONE',
      top_info: '● 1000 moduli attivi • Verificato NBU e 501(c)(3)',
      mega_btn: '🚀 TUTTE LE CATEGORIE E MODULI (1000)',
      mega_title: 'TUTTI I 1000 MODULI E SEZIONI',
      mega_sub: 'Seleziona qualsiasi modulo per visualizzare report, coordinate bancarie o inviare richieste:',
      search_placeholder: '🔍 Cerca moduli e programmi (es. drone, ospedale, cripto)...',
      titan_title: 'Assistente AI della Fondazione',
      titan_status: '🟢 Online • Risposta istantanea',
      titan_welcome: 'Salve! Sono l\'assistente intelligente della Fondazione RMS. Scegli una domanda o scopri di più:'
    }
  };

  const updateTopLangBtns = (lang) => {
    document.querySelectorAll('.top-lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.style.background = '#f59e0b';
        btn.style.color = '#000';
      } else {
        btn.style.background = 'none';
        btn.style.color = '#aaa';
      }
    });
  };

  const applyWidgetI18n = (lang) => {
    const dict = WIDGET_I18N[lang] || WIDGET_I18N['uk'];
    const topBarEl = document.getElementById('rmsTopBar');
    if (topBarEl) {
      const status = topBarEl.querySelector('.top-status');
      const info = topBarEl.querySelector('.top-info');
      if (status) status.innerHTML = `<span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981;"></span> ${dict.top_status}`;
      if (info) info.textContent = dict.top_info;
    }
    const megaBtn = document.getElementById('rmsMegaMenuBtn');
    if (megaBtn && megaBtn.firstElementChild) megaBtn.firstElementChild.textContent = dict.mega_btn;
    const megaOverlayEl = document.getElementById('rmsMegaMenuOverlay');
    if (megaOverlayEl) {
      const h2 = megaOverlayEl.querySelector('h2');
      if (h2) h2.textContent = dict.mega_title;
      const sub = megaOverlayEl.querySelector('p');
      if (sub) sub.textContent = dict.mega_sub;
      const input = document.getElementById('megaSearchInput');
      if (input) input.placeholder = dict.search_placeholder;
    }
    const titanTitle = document.querySelector('.titan-header div:nth-child(2) div:nth-child(1)');
    if (titanTitle) titanTitle.textContent = dict.titan_title;
    const titanStatus = document.querySelector('.titan-header div:nth-child(2) div:nth-child(2)');
    if (titanStatus) titanStatus.textContent = dict.titan_status;
  };

  // --- I18N AUTO-LOADER & LANGUAGE SWITCHER ---
  const triggerLangSwitch = (lang) => {
    localStorage.setItem('rms_lang', lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    updateTopLangBtns(lang);
    applyWidgetI18n(lang);

    if (window.I18nStore && typeof window.I18nStore.setLanguage === 'function') {
      window.I18nStore.setLanguage(lang);
    } else if (typeof window.setLang === 'function') {
      window.setLang(lang);
    }
    if (typeof window.updateLanguageFlagUI === 'function') {
      window.updateLanguageFlagUI(lang);
    }
    if (typeof window.renderAll === 'function') {
      window.renderAll();
    }
    window.dispatchEvent(new CustomEvent('language_changed', { detail: lang }));
  };

  if (!window.I18nStore && !document.querySelector('script[src*="i18n.js"]')) {
    const i18nScript = document.createElement('script');
    i18nScript.src = 'i18n.js';
    i18nScript.onload = () => {
      if (window.I18nStore) {
        window.I18nStore.init();
        const cur = localStorage.getItem('rms_lang') || localStorage.getItem('lang') || 'uk';
        triggerLangSwitch(cur);
      }
    };
    document.head.appendChild(i18nScript);
  }

  document.querySelectorAll('.top-lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lang = btn.getAttribute('data-lang');
      triggerLangSwitch(lang);
    });
  });

  const curLang = localStorage.getItem('rms_lang') || localStorage.getItem('lang') || 'uk';
  updateTopLangBtns(curLang);
  setTimeout(() => applyWidgetI18n(curLang), 100);

  window.filterMegaMenu = function() {
    const q = document.getElementById('megaSearchInput').value.toLowerCase().trim();
    const links = megaOverlay.querySelectorAll('.mega-link');
    const cols = megaOverlay.querySelectorAll('.mega-col');

    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      if (text.includes(q)) {
        link.style.display = 'flex';
      } else {
        link.style.display = 'none';
      }
    });

    cols.forEach(col => {
      const visibleLinks = col.querySelectorAll('.mega-link[style="display: flex;"], .mega-link:not([style*="display: none"])');
      const hasVisible = Array.from(col.querySelectorAll('.mega-link')).some(l => l.style.display !== 'none');
      col.style.display = hasVisible ? 'flex' : 'none';
    });
  };

  const searchInputEl = document.getElementById('megaSearchInput');
  if (searchInputEl) searchInputEl.addEventListener('input', window.filterMegaMenu);

  // --- PWA SETUP & INSTALL BANNER ---
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'manifest.json';
    document.head.appendChild(manifestLink);
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((reg) => {
        console.log('PWA ServiceWorker registered successfully:', reg.scope);
      }).catch((err) => {
        console.log('PWA ServiceWorker registration failed:', err);
      });
    });
  }

  let deferredPrompt = null;
  const pwaBanner = document.createElement('div');
  pwaBanner.id = 'rmsPwaBanner';
  pwaBanner.style.cssText = `
    position: fixed;
    top: auto;
    bottom: 85px;
    right: 28px;
    background: linear-gradient(135deg, rgba(15, 28, 63, 0.96), rgba(7, 14, 30, 0.96));
    border: 1.5px solid #f59e0b;
    border-radius: 18px;
    padding: 12px 18px;
    color: #fff;
    font-family: 'Montserrat', sans-serif;
    box-shadow: 0 15px 40px rgba(0,0,0,0.85), 0 0 25px rgba(245,158,11,0.3);
    z-index: 980;
    display: none;
    align-items: center;
    gap: 12px;
    max-width: 360px;
    width: auto;
    backdrop-filter: blur(20px);
    animation: pwaSlideUp 0.5s ease;
  `;
  pwaBanner.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
        <span style="font-size: 1.5rem; flex-shrink: 0;">📱</span>
        <div style="min-width: 0;">
          <strong style="color: #f59e0b; font-size: 0.88rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Додаток Фонду 🇺🇦</strong>
          <span style="font-size: 0.74rem; color: #cbd5e1; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Швидкий доступ та офлайн-режим</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
        <button id="pwaInstallBtn" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; padding: 6px 14px; border-radius: 10px; font-weight: 800; font-size: 0.78rem; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 10px rgba(245,158,11,0.3); transition: transform 0.2s;">ВСТАНОВИТИ</button>
        <button id="pwaCloseBtn" style="background: rgba(255,255,255,0.1); border: none; color: #94a3b8; width: 26px; height: 26px; border-radius: 50%; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Закрити">✕</button>
      </div>
    </div>
  `;
  if (document.body) {
    document.body.appendChild(pwaBanner);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
      if (pwaBanner && !localStorage.getItem('pwaDismissed')) {
        pwaBanner.style.display = 'flex';
      }
    }, 3000);
  });

  const installBtnEl = document.getElementById('pwaInstallBtn');
  if (installBtnEl) {
    installBtnEl.addEventListener('click', () => {
      pwaBanner.style.display = 'none';
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the PWA prompt');
          }
          deferredPrompt = null;
        });
      }
    });
  }
  const closePwaBtnEl = document.getElementById('pwaCloseBtn');
  if (closePwaBtnEl) {
    closePwaBtnEl.addEventListener('click', () => {
      pwaBanner.style.display = 'none';
      localStorage.setItem('pwaDismissed', 'true');
    });
  }

  // --- GLOBAL LIVE IMPACT & DONATION TICKER ---
  let tickerEl = document.getElementById('liveTicker');
  if (!tickerEl) {
    tickerEl = document.createElement('div');
    tickerEl.id = 'liveTicker';
    tickerEl.className = 'live-ticker';
    if (document.body) document.body.appendChild(tickerEl);
  }

  const GLOBAL_TICKER_EVENTS = [
    { name: 'Олена, м. Львів', amount: '2 500 ₴', camp: 'на FPV-дрони Сталеві Крила', icon: '🛸' },
    { name: 'Michael, Berlin', amount: '150 EUR', camp: 'на Енерго-Щит шпиталю', icon: '⚡' },
    { name: 'Ігор, м. Київ', amount: '5 000 ₴', camp: 'на тактичну аптечку NATO IFAK', icon: '🏥' },
    { name: 'David, London', amount: '100 GBP', camp: 'на мобільний стоматологічний каб.', icon: '🦷' },
    { name: 'Андрій, м. Харків', amount: '1 000 ₴', camp: 'на бронежилети для собак К-9', icon: '🐾' },
    { name: 'Компанія "Техно-Вектор"', amount: '10 000 ₴', camp: 'на Окопний РЕБ та зв\'язок', icon: '🛡️' },
    { name: 'Ольга, м. Одеса', amount: '3 000 ₴', camp: 'на підтримку родин ВПО', icon: '📦' },
    { name: 'Tomasz, Warszawa', amount: '200 PLN', camp: 'на міношукач Скіф-М', icon: '🌱' }
  ];

  let evIdx = 0;
  const showGlobalTicker = () => {
    if (!tickerEl || document.hidden) return;
    const ev = GLOBAL_TICKER_EVENTS[evIdx];
    evIdx = (evIdx + 1) % GLOBAL_TICKER_EVENTS.length;
    
    tickerEl.innerHTML = `
      <div style="font-size: 1.6rem; filter: drop-shadow(0 0 8px rgba(255,183,3,0.4));">${ev.icon}</div>
      <div>
        <div style="color: #cbd5e1; font-size: 0.78rem;">${ev.name} • <span style="color: #ffb703; font-weight: 700;">+${ev.amount}</span></div>
        <div style="color: #fff; font-size: 0.88rem; font-weight: 600;">${ev.camp}</div>
      </div>
    `;
    tickerEl.classList.add('show');
    setTimeout(() => {
      if (tickerEl) tickerEl.classList.remove('show');
    }, 5500);
  };

  setTimeout(() => {
    showGlobalTicker();
    setInterval(showGlobalTicker, 14000);
  }, 4500);

})();
