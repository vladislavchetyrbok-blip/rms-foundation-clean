// ai_widget.js - Global AI Assistant Widget "Bot Titan 🇺🇦" for RMS Foundation
(function() {
  if (typeof window === 'undefined' || document.getElementById('titanAiWidget')) return;

  // Create styles
  const style = document.createElement('style');
  style.innerHTML = `
    #titanAiButton {
      position: fixed;
      bottom: 24px;
      right: 24px;
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
      z-index: 9999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: titanPulse 3s infinite;
    }
    #titanAiButton:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 12px 40px rgba(245, 158, 11, 0.8);
    }
    @keyframes titanPulse {
      0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
      70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }
    #titanAiWidget {
      position: fixed;
      bottom: 100px;
      right: 24px;
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
      z-index: 10000;
      font-family: 'Inter', sans-serif;
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
      background: rgba(30, 41, 59, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      padding: 12px 16px;
      border-radius: 18px 18px 18px 4px;
      font-size: 0.9rem;
      line-height: 1.4;
      max-width: 85%;
    }
    .titan-msg-user {
      align-self: flex-end;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #000;
      font-weight: 600;
      padding: 12px 16px;
      border-radius: 18px 18px 4px 18px;
      font-size: 0.9rem;
      line-height: 1.4;
      max-width: 85%;
    }
    .titan-quick-btns {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .titan-qbtn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #60a5fa;
      padding: 6px 12px;
      border-radius: 14px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .titan-qbtn:hover {
      background: #60a5fa;
      color: #000;
      font-weight: 700;
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
  `;
  document.head.appendChild(style);

  // Create Button
  const btn = document.createElement('div');
  btn.id = 'titanAiButton';
  btn.title = 'AI-Консультант «Бот Титан 🇺🇦»';
  btn.innerHTML = '🤖';
  document.body.appendChild(btn);

  // Create Widget
  const widget = document.createElement('div');
  widget.id = 'titanAiWidget';
  widget.innerHTML = `
    <div class="titan-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.5rem;">🤖</span>
        <div>
          <strong style="color: #fff; font-size: 1rem; display: block;">Бот Титан AI 🇺🇦</strong>
          <span style="color: #10b981; font-size: 0.75rem;">● Онлайн • 25 модулів у пам'яті</span>
        </div>
      </div>
      <button id="titanCloseBtn" style="background: none; border: none; color: #aaa; font-size: 1.3rem; cursor: pointer;">✕</button>
    </div>
    <div class="titan-body" id="titanBody">
      <div class="titan-msg-bot">
        Вітаю! Я <strong>Бот Титан</strong> — ваш штучний інтелект-провідник по екосистемі благодійного фонду «Разом ми — сила»! Чим можу допомогти сьогодні?
        <div class="titan-quick-btns">
          <button class="titan-qbtn" onclick="titanAsk('Як зібрати дрон?')">🛸 Як зібрати дрон?</button>
          <button class="titan-qbtn" onclick="titanAsk('Де здати кров?')">🩸 Банк Крові</button>
          <button class="titan-qbtn" onclick="titanAsk('Як написати рапорт?')">⚖️ Конструктор рапорту</button>
          <button class="titan-qbtn" onclick="titanAsk('Як отримати сертифікат?')">🏆 Мій сертифікат</button>
          <button class="titan-qbtn" onclick="titanAsk('Як допомогти тваринам?')">🐾 Хвостаті Патрони</button>
        </div>
      </div>
    </div>
    <form class="titan-footer" id="titanForm" onsubmit="titanSubmit(event)">
      <input type="text" id="titanInput" class="titan-input" placeholder="Задайте питання або оберіть тему..." autocomplete="off">
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
      
      let reply = "Дякую за звернення! Наша система містить 25 спеціалізованих модулів. Якщо ви хочете зробити донат — перейдіть на сторінку «🤝 Долучитися». Для зв'язку з живим координатором скористайтеся розділом «💬 Підтримка».";
      const lower = text.toLowerCase();

      if (lower.includes('дрон') || lower.includes('збірк') || lower.includes('інженер') || lower.includes('fpv') || lower.includes('реб')) {
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
      } else if (lower.includes('донат') || lower.includes('рахун') || lower.includes('iban') || lower.includes('paypal') || lower.includes('крипт')) {
        reply = "💰 Всі офіційні реквізити (Гривня, USD, EUR, PayPal, Stripe, Apple Pay, USDT/BTC) знаходяться на сторінці донатів: <br><a href='join.html' style='color: #10b981; font-weight: 700; display: inline-block; margin-top: 6px;'>👉 Перейти до реквізитів</a>";
      }

      bMsg.innerHTML = reply;
      body.appendChild(bMsg);
      body.scrollTop = body.scrollHeight;
    }, 500);
  };
})();
