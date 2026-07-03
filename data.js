/**
 * Разом ми — сила (Together We Are Power)
 * Centralized Data Store (FoundationStore)
 * Синхронізує публічний сайт та Адмін-панель через localStorage.
 */

const STORAGE_KEY = 'rms_foundation_data_v5';
const ONLINE_BIN_ID = '6a4708aef5f4af5e2957274f';
const ONLINE_API_KEY = '$2a$10$a.w5fqFGgNDtxm.14mCh3us9zVhiSRK7fng26ppAnKWesY1g.noMe';

const INITIAL_DATA = {
  stats: {
    totalCollected: 14850000, // в гривнях
    dronesAndVehicles: 342,
    familiesSupported: 12500,
    volunteersCount: 480
  },
  campaigns: [
    {
      id: 'fuel_camp_1',
      title: {
        uk: 'На паливо для евакуаційних та гуманітарних рейсів',
        en: 'Fuel for evacuation and humanitarian logistics missions',
        pl: 'Na paliwo do misji ewakuacyjnych i humanitarnych',
        ro: 'Combustibil pentru misiuni de evacuare și logistică umanitară',
        it: 'Carburante per missioni di evacuazione e logistica umanitaria',
        de: 'Treibstoff für Evakuierungs- und humanitäre Logistikmissionen'
      },
      desc: {
        uk: 'Терміновий збір на пальне для доставляння ліків, продуктів, реабілітаційного обладнання до шпиталів та евакуації людей з прифронтових зон.',
        en: 'Urgent fundraiser for fuel to deliver medicine, food, and rehabilitation equipment to hospitals and evacuate civilians.',
        pl: 'Pilna zbiórka na paliwo do dostarczania leków, żywności i sprzętu do szpitali oraz ewakuacji ludności.',
        ro: 'Strângere urgentă de fonduri pentru combustibil destinat livrării de medicamente și evacuării civililor.',
        it: 'Raccolta fondi urgente per il carburante per consegnare medicine e attrezzature agli ospedali.',
        de: 'Dringende Spendenaktion für Treibstoff zur Lieferung von Medizin und Ausrüstung an Krankenhäuser.'
      },
      target: 100000,
      collected: 200,
      category: 'military',
      icon: '⛽',
      jarUrl: 'https://send.monobank.ua/jar/6iL3oH5Vde',
      cardNum: '4874 1000 3862 9211',
      urgent: true
    }
  ],
  news: [
    {
      id: 'news_1',
      date: '1 липня 2026',
      title: {
        uk: 'Передача 15 квадрокоптерів та систем РЕБ батальйону аеророзвідки',
        en: 'Delivery of 15 quadcopters and EW systems to aerial reconnaissance battalion',
        pl: 'Przekazanie 15 dornów i systemów WRE dla batalionu zwiadowczego',
        ro: 'Livrarea a 15 drone și sisteme EW către batalionul de recunoaștere',
        it: 'Consegna di 15 droni e sistemi EW al battaglione di ricognizione',
        de: 'Lieferung von 15 Drohnen und EloKa-Systemen an das Aufklärungsbataillon'
      },
      desc: {
        uk: 'Завдяки вашим внескам ми доставили сучасні дрони з нічною оптикою безпосередньо на Донецький напрямок. Дякуємо всім донорам!',
        en: 'Thanks to your support, we delivered advanced night-vision drones directly to the Donetsk direction. Thank you to all benefactors!',
        pl: 'Dzięki waszym wpłatom dostarczyliśmy drony z noktowizją na odcinek doniecki. Dziękujemy!',
        ro: 'Datorită suportului dumneavoastră, am livrat drone avansate pe direcția Donețk. Vă mulțumim!',
        it: 'Grazie al vostro sostegno, abbiamo consegnato droni avanzati in direzione di Donetsk. Grazie!',
        de: 'Dank Ihrer Unterstützung haben wir moderne Nachtsichtdrohnen direkt an die Front geliefert. Danke!'
      },
      badge: '📍 Донеччина',
      image: 'drone.png'
    },
    {
      id: 'news_2',
      date: '24 червня 2026',
      title: {
        uk: 'Оснащення 4 мобільних стабілізаційних медичних пунктів',
        en: 'Equipping 4 mobile medical stabilization units',
        pl: 'Wyposażenie 4 mobilnych punktów stabilizacyjnych medycznych',
        ro: 'Echiparea a 4 puncte medicale mobile de stabilizare',
        it: 'Allestimento di 4 unità mediche mobili di stabilizzazione',
        de: 'Ausstattung von 4 mobilen medizinischen Stabilisierungseinheiten'
      },
      desc: {
        uk: 'Передали 200 аптечок IFAK, операційні лампи та 4 зарядні станції EcoFlow для військових лікарів, які рятують поранених на передовій.',
        en: 'Delivered 200 IFAK kits, surgical lights, and 4 EcoFlow stations to combat medics saving wounded heroes.',
        pl: 'Przekazaliśmy 200 apteczek IFAK i stacje zasilania dla lekarzy wojskowych.',
        ro: 'Am livrat 200 truse IFAK și stații de alimentare medicilor militari.',
        it: 'Consegnati 200 kit IFAK e stazioni di energia ai medici militari.',
        de: 'Lieferung von 200 IFAK-Kits und Energiestationen an Militärärzte.'
      },
      badge: '📍 Харківщина',
      image: 'med.png'
    }
  ],
  honorBoard: [
    {
      id: 'hb_patron',
      name: 'Володимир Петренко',
      role: 'Почесний президент та меценат',
      contribution: '2 500 000 ₴',
      category: 'donor',
      badge: 'Стратегічний партнер',
      badgeClass: 'badge-gold',
      icon: '🎖️',
      image: 'honor_patron.jpg',
      desc: 'Координатор гуманітарних штабів та системний донор програм підтримки військових шпиталів.'
    },
    {
      id: 'hb_driver',
      name: 'Андрій «Скіф» Бондаренко',
      role: 'Волонтер-водій передової логістики',
      contribution: '64 рейси на нуль',
      category: 'volunteer',
      badge: 'Гордість нації',
      badgeClass: 'badge-purple',
      icon: '🚙',
      image: 'honor_driver.jpg',
      desc: 'Особисто доставляє дрони, системи РЕБ та медицину підрозділам у найгарячіших точках фронту.'
    },
    {
      id: 'hb_media',
      name: 'Олена Коваленко',
      role: 'Керівниця складу та фоторепортерка',
      contribution: '15 000+ боксів',
      category: 'volunteer',
      badge: 'Серце фонду',
      badgeClass: 'badge-purple',
      icon: '📸',
      image: 'honor_media.jpg',
      desc: 'Відповідає за приймання міжнародної гуманітарної допомоги, сортування та чесну прозору звітність.'
    },
    {
      id: 'hb_cargo',
      name: 'Максим Ковальчук',
      role: 'Координатор вантажних конвоїв',
      contribution: '180 тонн вантажів',
      category: 'volunteer',
      badge: 'Залізний волонтер',
      badgeClass: 'badge-purple',
      icon: '📦',
      image: 'honor_cargo.jpg',
      desc: 'Організовує розвантаження та складську логістику великогабаритних партій допомоги з Європи.'
    },
    {
      id: 'hb_logistics',
      name: 'Дмитро Ткаченко',
      role: 'Куратор продовольчих програм',
      contribution: '12 000+ наборів',
      category: 'volunteer',
      badge: 'Герой тилу',
      badgeClass: 'badge-blue',
      icon: '🤝',
      image: 'honor_logistics.jpg',
      desc: 'Забезпечує формування та видачу пакунків допомоги вимушеним переселенцям та родинам захисників.'
    },
    {
      id: 'hb_1',
      name: 'NovaTech Solutions',
      role: 'IT-корпорація',
      contribution: '500 000 ₴',
      category: 'corporate',
      badge: 'Корпоративний титан',
      badgeClass: 'badge-gold',
      icon: '🏢',
      desc: 'Системний донор нашого фонду, профінансували 5 розвідувальних дронів та 2 позашляховики.'
    },
    {
      id: 'hb_2',
      name: 'Олександр Кириленко',
      role: 'Приватний меценат',
      contribution: '150 000 ₴',
      category: 'donor',
      badge: 'Золотий благодійник',
      badgeClass: 'badge-gold',
      icon: '🌟',
      desc: 'Закрив збір на тактичну медицину в критичний момент для батальйону на Донеччині.'
    },
    {
      id: 'hb_3',
      name: 'Максим Ткаченко та команда',
      role: 'Координатор логістики',
      contribution: '1200+ годин роботи',
      category: 'volunteer',
      badge: 'Герой волонтерства',
      badgeClass: 'badge-purple',
      icon: '🤝',
      desc: 'Організували безпечну доставку 40+ гуманітарних конвоїв у прифронтові громади Харкова та Сум.'
    },
    {
      id: 'hb_4',
      name: 'Благодійний забіг «Run for Ukraine»',
      role: 'Спільнота спортсменів',
      contribution: '210 000 ₴',
      category: 'corporate',
      badge: 'Партнер року',
      badgeClass: 'badge-blue',
      icon: '🏃',
      desc: 'Зібрали кошти під час благодійного марафону на закупівлю мобільних генераторів EcoFlow.'
    },
    {
      id: 'hb_5',
      name: 'Олена та Марта Бойко',
      role: 'Благодійниці',
      contribution: '85 000 ₴',
      category: 'donor',
      badge: 'Ангели-охоронці',
      badgeClass: 'badge-gold',
      icon: '🕊️',
      desc: 'Постійна щомісячна підтримка програми медичної реабілітації поранених бійців.'
    },
    {
      id: 'hb_6',
      name: 'Дмитро «Волонтер» Коваль',
      role: 'Автомеханік-волонтер',
      contribution: 'Відремонтовано 28 авто',
      category: 'volunteer',
      badge: 'Золоті руки',
      badgeClass: 'badge-purple',
      icon: '🔧',
      desc: 'Безкоштовно ремонтує, бронює та готує пікапи та швидкі допомоги для відправки на нуль.'
    }
  ],
  gallery: [
    {
      id: 'gal_1',
      title: 'Підтримка медичних закладів',
      desc: 'Передача гуманітарних вантажів, медикаментів та засобів догляду (спільно з Nova Ukraine / Sorgesana) для пацієнтів психо-неврологічних диспансерів та лікарень.',
      category: '🏥 Медицина',
      image: 'work_medical_aid.jpg'
    },
    {
      id: 'gal_2',
      title: 'Тонни дитячого харчування',
      desc: 'Сотні палет високоякісного дитячого харчування HiPP та базових продуктів для малюків із сімей внутрішньо переміщених осіб.',
      category: '📦 Логістика',
      image: 'work_baby_food.jpg'
    },
    {
      id: 'gal_3',
      title: 'Засоби пересування та догляду',
      desc: 'Спеціалізовані крісла колісні, ходунки та медичне обладнання для поранених військовослужбовців та пацієнтів реабілітаційних відділень.',
      category: '🦽 Реабілітація',
      image: 'work_rehab_chairs.jpg'
    },
    {
      id: 'gal_4',
      title: 'Оснащення лікарняних палат',
      desc: 'Підтримка належних санітарних та побутових умов у шпиталях для швидкого фізичного та морального відновлення наших Героїв.',
      category: '🛏️ Стаціонари',
      image: 'work_hospital_ward.jpg'
    },
    {
      id: 'gal_5',
      title: 'Турбота про дітей та переселенців',
      desc: 'Іграшки, розвиваючі ігри, подарунки та сувеніри для дітей, чиї родини були змушені покинути свої домівки через військові дії.',
      category: '🧸 Діти та родини',
      image: 'work_kids_toys.jpg'
    }
  ],
  applications: []
};

window.FoundationStore = {
  getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveData(INITIAL_DATA);
        return JSON.parse(JSON.stringify(INITIAL_DATA));
      }
      return JSON.parse(raw);
    } catch (e) {
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
  },

  saveData(data, skipCloud = false) {
    try {
      data.lastModified = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('foundation_data_changed'));
    } catch (e) {
      console.error('Помилка збереження в localStorage (перевищено квоту):', e);
    }

    if (!skipCloud && typeof ONLINE_BIN_ID !== 'undefined' && ONLINE_BIN_ID) {
      fetch('https://api.jsonbin.io/v3/b/' + ONLINE_BIN_ID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': ONLINE_API_KEY
        },
        body: JSON.stringify(data)
      }).then(async r => {
        if (!r.ok) {
          const errText = await r.text().catch(() => '');
          console.error('Помилка запису в хмару JSONBin (статус ' + r.status + '):', errText);
        } else {
          console.log('🌐 Дані успішно збережено в онлайн-хмару JSONBin!');
        }
      }).catch(err => console.error('Помилка запису в хмару:', err));
    }
  },

  initOnlineSync() {
    if (typeof ONLINE_BIN_ID === 'undefined' || !ONLINE_BIN_ID) return;
    fetch('https://api.jsonbin.io/v3/b/' + ONLINE_BIN_ID + '/latest', {
      headers: {
        'X-Master-Key': ONLINE_API_KEY
      }
    })
    .then(r => r.json())
    .then(res => {
      if (res && res.record && res.record.stats) {
        const localRaw = localStorage.getItem(STORAGE_KEY);
        let localData = null;
        try { if (localRaw) localData = JSON.parse(localRaw); } catch(e){}

        if (localData && localData.lastModified && (!res.record.lastModified || localData.lastModified > res.record.lastModified)) {
          console.log('⚡ Локальні дані новіші за хмару. Синхронізуємо хмару...');
          this.saveData(localData);
          return;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.record));
        window.dispatchEvent(new CustomEvent('foundation_data_changed'));
        console.log('🌐 Актуальні онлайн-дані успішно завантажено з хмари!');
      }
    })
    .catch(err => console.log('Локальний режим (хмара тимчасово недоступна):', err));
  },

  resetToDefault() {
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  },

  getCampaigns() { return this.getData().campaigns || []; },
  addCampaign(newCamp) {
    const data = this.getData();
    newCamp.id = 'camp_' + Date.now();
    data.campaigns.unshift(newCamp);
    this.saveData(data);
    return newCamp;
  },
  updateCampaignAmount(id, addedAmount) {
    const data = this.getData();
    const camp = data.campaigns.find(c => c.id === id);
    if (camp) {
      camp.collected = Number(camp.collected) + Number(addedAmount);
      data.stats.totalCollected = Number(data.stats.totalCollected) + Number(addedAmount);
      this.saveData(data);
    }
  },
  deleteCampaign(id) {
    const data = this.getData();
    data.campaigns = data.campaigns.filter(c => c.id !== id);
    this.saveData(data);
  },

  getNews() { return this.getData().news || []; },

  getHonorBoard() { return this.getData().honorBoard || []; },
  addHonorItem(item) {
    const data = this.getData();
    item.id = 'hb_' + Date.now();
    data.honorBoard.unshift(item);
    this.saveData(data);
    return item;
  },
  updateHonorItem(updatedItem) {
    const data = this.getData();
    const idx = data.honorBoard.findIndex(h => h.id === updatedItem.id);
    if (idx !== -1) {
      data.honorBoard[idx] = { ...data.honorBoard[idx], ...updatedItem };
      this.saveData(data);
    }
  },
  deleteHonorItem(id) {
    const data = this.getData();
    data.honorBoard = data.honorBoard.filter(h => h.id !== id);
    this.saveData(data);
  },

  getGallery() { return this.getData().gallery || []; },
  addGalleryItem(item) {
    const data = this.getData();
    if (!data.gallery) data.gallery = [];
    item.id = 'gal_' + Date.now();
    data.gallery.unshift(item);
    this.saveData(data);
    return item;
  },
  updateGalleryItem(updatedItem) {
    const data = this.getData();
    if (!data.gallery) data.gallery = [];
    const idx = data.gallery.findIndex(g => g.id === updatedItem.id);
    if (idx !== -1) {
      data.gallery[idx] = { ...data.gallery[idx], ...updatedItem };
      this.saveData(data);
    }
  },
  deleteGalleryItem(id) {
    const data = this.getData();
    if (data.gallery) {
      data.gallery = data.gallery.filter(g => g.id !== id);
      this.saveData(data);
    }
  },

  getStats() { return this.getData().stats; },
  updateStats(newStats) {
    const data = this.getData();
    data.stats = { ...data.stats, ...newStats };
    this.saveData(data);
  },

  getApplications() { return this.getData().applications || []; },
  addApplication(app) {
    const data = this.getData();
    app.id = 'app_' + Date.now();
    app.date = new Date().toLocaleString('uk-UA');
    app.status = 'new';
    if (!data.applications) data.applications = [];
    data.applications.unshift(app);
    this.saveData(data);
    return app;
  },
  deleteApplication(id) {
    const data = this.getData();
    data.applications = data.applications?.filter(a => a.id !== id) || [];
    this.saveData(data);
  }
};

// Запуск автоматичної онлайн-синхронізації з хмарою при відкритті сайту
if (typeof window !== 'undefined' && window.FoundationStore) {
  window.FoundationStore.initOnlineSync();
}
