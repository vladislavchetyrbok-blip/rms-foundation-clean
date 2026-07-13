/**
 * Разом ми — сила (Together We Are Power)
 * Centralized Data Store (FoundationStore)
 * Синхронізує публічний сайт та Адмін-панель через localStorage.
 */

const STORAGE_KEY = 'rms_foundation_data_monobank_clean_v3';
const ONLINE_BIN_ID = '6a4708aef5f4af5e2957274f';
const ONLINE_API_KEY = '$2a$10$a.w5fqFGgNDtxm.14mCh3us9zVhiSRK7fng26ppAnKWesY1g.noMe';
const ASSET_FALLBACKS = {
  'media__1783040943180.jpg': 'hero.png',
  'media__1783040943183.jpg': 'work_rehab_chairs.jpg',
  'media__1783040943186.jpg': 'work_kids_toys.jpg',
  'media__1783040943196.jpg': 'honor_patron.jpg',
  'media__1783040943246.jpg': 'work_hospital_ward.jpg',
  'media__1783038868575.jpg': 'honor_cargo.jpg',
  'media__1783038868580.jpg': 'honor_logistics.jpg',
  'media__1783038868590.jpg': 'honor_media.jpg',
  'media__1783038868596.jpg': 'honor_driver.jpg',
  'media__1783038868601.jpg': 'logo.png',
  'media__1782942639584.png': 'hero.png',
  'media__1782942624904.png': 'honor_patron.jpg',
  'media__1782942577758.png': 'hero.png'
};

function normalizeAssetPaths(value) {
  if (typeof value === 'string') return ASSET_FALLBACKS[value] || value;
  if (Array.isArray(value)) return value.map(normalizeAssetPaths);
  if (value && typeof value === 'object') {
    Object.keys(value).forEach(key => {
      value[key] = normalizeAssetPaths(value[key]);
    });
  }
  return value;
}

const INITIAL_DATA = {
  stats: {
    totalCollected: 14850000, // в гривнях
    dronesAndVehicles: 342,
    familiesSupported: 12500,
    volunteersCount: 480
  },
  campaigns: [
    {
      id: 'fuel_monobank_1',
      title: {
        uk: '⛽ Офіційний збір на паливо для евакуаційних та гуманітарних місій (Monobank)',
        en: '⛽ Official Monobank Fundraiser for Fuel: Evacuation & Humanitarian Missions',
        pl: '⛽ Oficjalna zbiórka Monobank na paliwo do misji ewakuacyjnych i humanitarnych',
        ro: '⛽ Colectare oficială Monobank pentru combustibil: Misiuni de evacuare și umanitare',
        it: '⛽ Raccolta ufficiale Monobank per carburante: Missioni di evacuazione e logistica',
        de: '⛽ Offizielle Monobank-Spendenaktion für Treibstoff: Evakuierungs- und humanitäre Fahrten'
      },
      desc: {
        uk: 'Офіційна монобанка фонду для безперебійного забезпечення паливом. Щодня наші волонтерські екіпажі здійснюють виїзди у прифронтові зони: евакуюють поранених та цивільних, доставляють ліки, продуктові набори й засоби життєзабезпечення у шпиталі. Кожна ваша гривня безпосередньо перетворюється на кілометри врятованих життів!',
        en: 'Official Monobank jar for fuel supply. Every day our volunteer transport crews conduct missions to frontline zones: evacuating civilians and wounded, delivering medicine, food, and vital supplies to hospitals. Every contribution directly fuels lifesaving logistics!',
        pl: 'Oficjalna skarbonka Monobank na paliwo. Codziennie wolontariusze docierają do stref przyfrontowych, ewakuując rannych i dostarczając leki do szpitali.',
        ro: 'Cont oficial Monobank pentru combustibil. Zilnic, echipajele noastre voluntare efectuează misiuni în zonele din linia întâi pentru evacuarea răniților și livrarea de medicamente.',
        it: 'Raccolta ufficiale Monobank per il carburante. Ogni giorno i nostri equipaggi volontari effettuano missioni nelle zone di prima linea per evacuare i feriti e consegnare medicine.',
        de: 'Offizielle Monobank-Spendenaktion für Treibstoff zur Unterstützung täglicher Evakuierungs- und humanitärer Logistikmissionen an der Front.'
      },
      target: null,
      collected: null,
      hideProgress: true,
      category: 'auto',
      icon: '⛽',
      jarUrl: 'https://send.monobank.ua/jar/6iL3oH5Vde',
      wayforpayUrl: 'https://secure.wayforpay.com/donate',
      cardNum: '4874 1000 3862 9211',
      urgent: true,
      image: 'drone.png'
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
      category: 'volunteer',
      badge: 'Гордість нації',
      badgeClass: 'badge-purple',
      icon: '🚙',
      image: 'honor_driver.jpg',
      desc: 'Особисто доставляє дрони, системи РЕБ та медицину підрозділам у найгарячіших точках фронту.'
    },
    {
      id: 'hb_defender',
      name: 'Володимир «Херсон»',
      role: 'Командир підрозділу, Захисник України',
      category: 'volunteer',
      badge: 'Герой передової',
      badgeClass: 'badge-gold',
      icon: '🔱',
      image: 'honor_defender.jpg',
      desc: 'Захищає країну на передовій та координує пряме постачання дронів і тактичної медицини бійцям.'
    },
    {
      id: 'hb_coordinator',
      name: 'Олександр Мельник',
      role: 'Стратегічний партнер та меценат',
      category: 'donor',
      badge: 'Почесний меценат',
      badgeClass: 'badge-blue',
      icon: '🤝',
      image: 'honor_coordinator.jpg',
      desc: 'Системно підтримує фонд, закриває ключові збори на нічну розвідку та забезпечує міжнародну логістику.'
    },
    {
      id: 'hb_media',
      name: 'Олена Коваленко',
      role: 'Керівниця складу та фоторепортерка',
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
      category: 'volunteer',
      badge: 'Герой тилу',
      badgeClass: 'badge-blue',
      icon: '🤝',
      image: 'honor_logistics.jpg',
      desc: 'Забезпечує формування та видачу пакунків допомоги вимушеним переселенцям та родинам захисників.'
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
  megaGoal: {
    title: {
      uk: '🎯 МЕГА-ЦІЛЬ МІСЯЦЯ: ОПЕРАЦІЯ «НЕБЕСНИЙ ЩИТ»',
      en: '🎯 MONTHLY MEGA-GOAL: OPERATION "SKY SHIELD"',
      pl: '🎯 MEGA-CEL MIESIĄCA: OPERACJA "NIEBIESKA TARCZA"',
      ro: '🎯 MEGA-OBIECTIVUL LUNII: OPERAȚIUNEA "SCUTUL CERULUI"',
      it: '🎯 MEGA-OBIETTIVO DEL MESE: OPERAZIONE "SCUDO CELESTE"',
      de: '🎯 MONATS-MEGA-ZIEL: OPERATION "HIMMELSSCHILD"'
    },
    subtitle: {
      uk: 'Комплексне забезпечення 5 прифронтових бригад нічною розвідкою, системами РЕБ та евакуаційним транспортом.',
      en: 'Comprehensive equipping of 5 frontline brigades with night recon, EW systems, and evacuation transport.',
      pl: 'Kompleksowe wyposażenie 5 brygade w zwiad nocny, systemy WRE i transport ewakuacyjny.',
      ro: 'Echipare completă a 5 brigăzi din linia întâi cu recunoaștere pe timp de noapte, sisteme EW și transport.',
      it: 'Equipaggiamento completo di 5 brigate in prima linea con ricognizione notturna, sistemi EW e trasporto.',
      de: 'Umfassende Ausstattung von 5 Fronteinheiten mit Nachtaufklärung, EloKa-Systemen und Evakuierungsfahrzeugen.'
    },
    target: 5000000,
    collected: 3450000,
    milestones: [
      { pct: 25, title: { uk: '10 нічних Mavic 3T', en: '10 Night Mavic 3T', pl: '10 nocnych Mavic 3T', ro: '10 Mavic 3T nocturne', it: '10 Mavic 3T notturni', de: '10 Nacht-Mavic 3T' }, desc: { uk: 'Розвідка 24/7 для артилерії', en: '24/7 recon for artillery', pl: 'Zwiad 24/7 dla artylerii', ro: 'Recunoaștere 24/7', it: 'Ricognizione 24/7', de: '24/7 Aufklärung' }, unlocked: true, icon: '🛸' },
      { pct: 50, title: { uk: '5 куполів окопного РЕБ', en: '5 Trench EW Domes', pl: '5 kopuł WRE', ro: '5 sisteme EW', it: '5 cupole EW', de: '5 Graben-EloKa' }, desc: { uk: 'Захист піхоти від ворожих FPV', en: 'Infantry protection vs FPV', pl: 'Ochrona piechoty', ro: 'Protecția infanteriei', it: 'Protezione fanteria', de: 'Infanterieschutz' }, unlocked: true, icon: '🛡️' },
      { pct: 75, title: { uk: '3 евакуаційні пікапи 4x4', en: '3 Medevac Pickups 4x4', pl: '3 pikapy ewakuacyjne 4x4', ro: '3 camionete de evacuare 4x4', it: '3 pick-up evacuazione 4x4', de: '3 Medevac Pickups 4x4' }, desc: { uk: 'Вивіз поранених з нуля', en: 'Wounded evac from zero line', pl: 'Ewakuacja rannych', ro: 'Evacuarea răniților', it: 'Evacuazione feriti', de: 'Verwundeten-Evakuierung' }, unlocked: false, icon: '🚗' },
      { pct: 100, title: { uk: 'Мобільна зенітна турель', en: 'Mobile AA Turret System', pl: 'Mobilna wieżyczka plot', ro: 'Turelă antiaeriană mobilă', it: 'Torretta contraerea mobile', de: 'Mobiles Flak-Turmsystem' }, desc: { uk: 'Знищення ворожих безпілотників', en: 'Destroying enemy drones', pl: 'Niszczenie dronów', ro: 'Distrugerea dronelor', it: 'Distruzione droni', de: 'Drohnenabwehr' }, unlocked: false, icon: '⚡' }
    ]
  },
  impactMap: [
    { id: 'donetsk', name: { uk: 'Донеччина', en: 'Donetsk Region', pl: 'Obwód doniecki', ro: 'Regiunea Donețk', it: 'Regione di Donetsk', de: 'Region Donezk' }, icon: '📍', status: 'hot', drones: '420 шт', med: '4 500 аптечок', auto: '18 авто', desc: { uk: 'Найгарячіший напрямок: Покровськ, Часів Яр, Курахове. Системне постачання розвідки та тактичної медицини.', en: 'Hottest direction: Pokrovsk, Chasiv Yar, Kurakhove. Systematic supply of recon and tactical medicine.', pl: 'Najgorętszy kierunek: Pokrowsk, Czasiw Jar. Systematyczne dostawy.', ro: 'Cea mai fierbinte direcție: Pokrovsk, Ceasiv Iar. Aprovizionare continuă.', it: 'Direzione più calda: Pokrovsk, Chasiv Yar. Forniture continue.', de: 'Heißester Abschnitt: Pokrowsk, Tschasiw Jar. Systematische Versorgung.' } },
    { id: 'kharkiv', name: { uk: 'Харківщина', en: 'Kharkiv Region', pl: 'Obwód charkowski', ro: 'Regiunea Harkov', it: 'Regione di Kharkiv', de: 'Region Charkiw' }, icon: '📍', status: 'hot', drones: '310 шт', med: '3 200 аптечок', auto: '14 авто', desc: { uk: 'Оборона Куп\'янська, Вовчанська та Липців. Підтримка підрозділів ППО та стабілізаційних пунктів.', en: 'Defense of Kupyansk, Vovchansk, and Lyptsi. Support for air defense and stabilization points.', pl: 'Obrona Kupiańska i Wołczańska. Wsparcie punktów medycznych.', ro: 'Apărarea Kupyansk și Vovchansk. Sprijin pentru punctele medicale.', it: 'Difesa di Kupyansk e Vovchansk. Supporto ai punti medici.', de: 'Verteidigung von Kupjansk und Wowtschansk. Unterstützung von Med-Punkten.' } },
    { id: 'kherson', name: { uk: 'Херсонщина', en: 'Kherson Region', pl: 'Obwód chersoński', ro: 'Regiunea Herson', it: 'Regione di Kherson', de: 'Region Cherson' }, icon: '📍', status: 'active', drones: '180 шт', med: '2 100 аптечок', auto: '9 човнів/авто', desc: { uk: 'Прибережна зона та острови Дніпра. Постачання човнів, РЕБ та генераторів для місцевих лікарень.', en: 'Dnipro river coastal zone and islands. Supplying boats, EW, and hospital generators.', pl: 'Strefa przybrzeżna Dniepru. Dostawy łodzi i generatorów.', ro: 'Zona de coastă a Niprului. Livrare de bărci și generatoare.', it: 'Zona costiera del Dnipro. Fornitura di barche e generatori.', de: 'Uferzone des Dnipro. Lieferung von Booten und Generatoren.' } },
    { id: 'zaporizhzhia', name: { uk: 'Запоріжжя', en: 'Zaporizhzhia Region', pl: 'Obwód zaporoski', ro: 'Regiunea Zaporojie', it: 'Regione di Zaporizhzhia', de: 'Region Saporischschja' }, icon: '📍', status: 'active', drones: '240 шт', med: '2 800 аптечок', auto: '12 авто', desc: { uk: 'Робота на Оріхівському та Гуляйпільському напрямках. Допомога шпиталям та ДСНС.', en: 'Orikhiv and Huliaipole sectors. Aid to hospitals and emergency responders.', pl: 'Odcinek Orichowski i Hulajpole. Pomoc dla szpitali.', ro: 'Sectoarele Orihiv și Huliaipole. Ajutor pentru spitale.', it: 'Settori di Orikhiv e Huliaipole. Aiuti agli ospedali.', de: 'Abschnitt Orichiw und Huljajpole. Hilfe für Krankenhäuser.' } },
    { id: 'sumy', name: { uk: 'Сумщина', en: 'Sumy Region', pl: 'Obwód sumski', ro: 'Regiunea Sumî', it: 'Regione di Sumy', de: 'Region Sumy' }, icon: '📍', status: 'active', drones: '150 шт', med: '1 600 аптечок', auto: '8 авто', desc: { uk: 'Захист північного прикордоння. Забезпечення прикордонників та підрозділів ТрО нічним баченням.', en: 'Northern border defense. Providing border guards and TDF with night vision.', pl: 'Obrona północnej granicy. Zaopatrzenie w noktowizję.', ro: 'Apărarea frontierei de nord. Furnizare de echipamente de vedere nocturnă.', it: 'Difesa del confine nord. Fornitura di visione notturna.', de: 'Verteidigung der Nordgrenze. Versorgung mit Nachtsichttechnik.' } },
    { id: 'kyiv', name: { uk: 'Київщина та Центр', en: 'Kyiv & Central Region', pl: 'Kijowszczyzna i Centrum', ro: 'Kiev și Centru', it: 'Kyiv e Centro', de: 'Kiew & Zentralregion' }, icon: '📍', status: 'logistics', drones: 'Логістика', med: '6 шпиталів', auto: 'Склад фонду', desc: { uk: 'Головний логістичний хаб фонду, реабілітаційні центри для поранених та забезпечення мобільних вогневих груп ППО.', en: 'Main foundation logistics hub, rehab centers for wounded, and air defense mobile groups.', pl: 'Główny hub logistyczny, centra rehabilitacji i grupy plot.', ro: 'Centrul logistic principal, spitale de reabilitare și apărare antiaeriană.', it: 'Hub logistico principale, centri di riabilitazione e difesa aerea.', de: 'Haupt-Logistikhub, Reha-Zentren und mobile Flak-Gruppen.' } }
  ],
  frontlineRadar: [
    { id: 'req_1', brigade: { uk: '3-тя Окрема Штурмова Бригада (3 ОШБр)', en: '3rd Separate Assault Brigade (3 OSHBr)', pl: '3. Samodzielna Brygada Szturmowa', ro: 'Brigada 3 de Asalt', it: '3ª Brigata di Assalto', de: '3. Separate Sturmbrigade' }, need: { uk: '3 нічні дрони Mavic 3T Thermal', en: '3 Night Mavic 3T Thermal Drones', pl: '3 drony termowizyjne Mavic 3T', ro: '3 drone termice Mavic 3T', it: '3 droni termici Mavic 3T', de: '3 Wärmebilddrohnen Mavic 3T' }, target: 360000, collected: 295000, status: 'urgent', badge: { uk: '🔥 Збираємо зараз', en: '🔥 Active Fundraiser', pl: '🔥 Aktywna zbiórka', ro: '🔥 Strângere activă', it: '🔥 Raccolta attiva', de: '🔥 Aktive Spendenaktion' } },
    { id: 'req_2', brigade: { uk: '93-тя ОМБр «Холодний Яр»', en: '93rd Mechanized Brigade "Kholodnyi Yar"', pl: '93. Brygada Zmechanizowana', ro: 'Brigada 93 Mecanizată', it: '93ª Brigata Meccanizzata', de: '93. Mechanisierte Brigade' }, need: { uk: '2 мобільні комплекси РЕБ «Синиця»', en: '2 Mobile EW Systems "Synytsia"', pl: '2 mobilne systemy WRE', ro: '2 sisteme EW mobile', it: '2 sistemi EW mobili', de: '2 mobile EloKa-Systeme' }, target: 180000, collected: 180000, status: 'completed', badge: { uk: '✅ Збір закрито! В дорозі', en: '✅ Completed! On the way', pl: '✅ Zakończono! W drodze', ro: '✅ Finalizat! În drum', it: '✅ Completato! In viaggio', de: '✅ Abgeschlossen! Unterwegs' } },
    { id: 'req_3', brigade: { uk: '128-ма ОГШБр (Закарпатський легіон)', en: '128th Mountain Assault Brigade', pl: '128. Brygada Górsko-Szturmowa', ro: 'Brigada 128 de Asalt Montan', it: '128ª Brigata di Assalto Montano', de: '128. Gebirgs-Sturmbrigade' }, need: { uk: 'Капітальний ремонт евакуаційного пікапа', en: 'Overhaul of Medevac Pickup Truck', pl: 'Remont pikapa ewakuacyjnego', ro: 'Reparație camionetă de evacuare', it: 'Riparazione pick-up evacuazione', de: 'Überholung von Medevac-Pickup' }, target: 95000, collected: 42000, status: 'urgent', badge: { uk: '⚡ Терміновий запит', en: '⚡ Urgent Request', pl: '⚡ Pilny wniosek', ro: '⚡ Cerere urgentă', it: '⚡ Richiesta urgente', de: '⚡ Dringende Anfrage' } },
    { id: 'req_4', brigade: { uk: 'Мобільний шпиталь прифронтової зони', en: 'Frontline Mobile Hospital Unit', pl: 'Mobilny szpital przyfrontowy', ro: 'Spital mobil din linia întâi', it: 'Ospedale mobile in prima linea', de: 'Mobiles Frontkrankenhaus' }, need: { uk: '50 наборів для переливання крові та підігрівачі', en: '50 Blood Transfusion Kits & Fluid Warmers', pl: '50 zestawów do transfuzji krwi', ro: '50 kituri de transfuzie a sângelui', it: '50 kit per trasfusione di sangue', de: '50 Bluttransfusions-Sets & Wärmer' }, target: 140000, collected: 112000, status: 'urgent', badge: { uk: '🏥 Медичний пріоритет', en: '🏥 Medical Priority', pl: '🏥 Priorytet medyczny', ro: '🏥 Prioritate medicală', it: '🏥 Priorità medica', de: '🏥 Medizinscher Priorität' } }
  ],
  patronTiers: [
    { id: 'silver', title: { uk: '🥉 Срібний Щит', en: '🥉 Silver Shield', pl: '🥉 Srebrna Tarcza', ro: '🥉 Scutul de Argint', it: '🥉 Scudo d\'Argento', de: '🥉 Silberschild' }, amount: '200 ₴', period: { uk: '/ місяць', en: '/ month', pl: '/ miesiąc', ro: '/ lună', it: '/ mese', de: '/ Monat' }, desc: { uk: 'Забезпечує 2 аптечки IFAK або 10 хімічних грілок щомісяця.', en: 'Provides 2 IFAK kits or 10 warmers monthly.', pl: 'Zapewnia 2 apteczki IFAK co miesiąc.', ro: 'Asigură 2 truse IFAK lunar.', it: 'Fornisce 2 kit IFAK mensili.', de: 'Finanziert monatlich 2 IFAK-Kits.' }, perks: [{ uk: '🎉 Цифровий бедж мецената', en: '🎉 Digital Patron Badge', pl: '🎉 Cyfrowa odznaka', ro: '🎉 Insignă digitală', it: '🎉 Badge digitale', de: '🎉 Digitales Abzeichen' }, { uk: '📧 Щомісячний ексклюзивний звіт', en: '📧 Monthly Exclusive Report', pl: '📧 Miesięczny raport', ro: '📧 Raport lunar exclusiv', it: '📧 Report mensile esclusivo', de: '📧 Exklusiver Monatsbericht' }], popular: false },
    { id: 'gold', title: { uk: '🥇 Золотий Щит', en: '🥇 Gold Shield', pl: '🥇 Złota Tarcza', ro: '🥇 Scutul de Aur', it: '🥇 Scudo d\'Oro', de: '🥇 Goldschild' }, amount: '500 ₴', period: { uk: '/ місяць', en: '/ month', pl: '/ miesiąc', ro: '/ lună', it: '/ mese', de: '/ Monat' }, desc: { uk: 'Регулярний внесок на FPV-дрони та системи зв\'язку для розвідки.', en: 'Regular support for FPV drones and recon comms.', pl: 'Regularne wsparcie na drony FPV.', ro: 'Sprijin regulat pentru drone FPV.', it: 'Supporto regolare per droni FPV.', de: 'Regelmäßige Unterstützung für FPV-Drohnen.' }, perks: [{ uk: '🌟 Персональне ім\'я на VIP Дошці пошани', en: '🌟 Name on VIP Honor Board', pl: '🌟 Imię na tablicy VIP', ro: '🌟 Nume pe panoul VIP', it: '🌟 Nome nella bacheca VIP', de: '🌟 Name auf VIP-Ehrentafel' }, { uk: '💬 Доступ до закритого чату благодійників', en: '💬 Access to private patrons chat', pl: '💬 Dostęp do czatu patronów', ro: '💬 Acces la chat privat', it: '💬 Accesso alla chat privata', de: '💬 Zugang zum Patron-Chat' }, { uk: '🎁 Фірмовий пісчаний піксельний патч фонду', en: '🎁 Official Foundation Tactical Patch', pl: '🎁 Naszywka taktyczna', ro: '🎁 Patch tactic oficial', it: '🎁 Patch tattica ufficiale', de: '🎁 Offizielles Taktik-Patch' }], popular: true },
    { id: 'platinum', title: { uk: '💎 Корпоративний Меценат', en: '💎 Corporate / VIP Patron', pl: '💎 Patron Korporacyjny', ro: '💎 Patron Corporativ', it: '💎 Mecenate Aziendale', de: '💎 Unternehmens-Patron' }, amount: '5 000 ₴', period: { uk: '/ місяць', en: '/ month', pl: '/ miesiąc', ro: '/ lună', it: '/ mese', de: '/ Monat' }, desc: { uk: 'Системне партнерство для бізнесу та лідерів думок. Закриття стратегічних зборів.', en: 'Systemic partnership for businesses and leaders. Closing strategic campaigns.', pl: 'Partnerstwo dla biznesu. Zamykanie zbiórek.', ro: 'Parteneriat sistemic pentru companii.', it: 'Partnership sistemica per aziende.', de: 'Systemische Partnerschaft für Unternehmen.' }, perks: [{ uk: '🏢 Логотип компанії на головній сторінці', en: '🏢 Company logo on homepage', pl: '🏢 Logo na stronie głównej', ro: '🏢 Logo pe pagina principală', it: '🏢 Logo in home page', de: '🏢 Firmenlogo auf Startseite' }, { uk: '📜 Офіційна подяка-відзнака від командування', en: '📜 Official Award from Military Command', pl: '📜 Oficjalne podziękowanie od dowództwa', ro: '📜 Distincție oficială', it: '📜 Encomio ufficiale', de: '📜 Offizielle Auszeichnung' }, { uk: '📸 Повний медіа-супровід та PR-звітвість', en: '📸 Full media & PR reporting coverage', pl: '📸 Pełny raport PR i media', ro: '📸 Acoperire media completă', it: '📸 Copertura media completa', de: '📸 Komplette PR- & Medienbegleitung' }], popular: false }
  ],
  applications: [],
  militaryRequests: [
    {
      id: 'REQ-8492',
      unit: '3-тя Окрема Штурмова Бригада (3 ОШБр)',
      contact: 'мжр. Богдан В., техзабезпечення',
      category: '🛸 Дрони / РЕБ',
      items: '5 шт. DJI Mavic 3T Thermal + 10 додаткових акумуляторів',
      priority: '🔥 Високий (Штурмові дії)',
      status: 'purchased',
      statusLabel: '🟢 Закуплено — у дорозі на фронт',
      date: '04.07.2026'
    },
    {
      id: 'REQ-8491',
      unit: '93-тя ОМБр «Холодний Яр»',
      contact: 'кап. Олена К., начмед',
      category: '🏥 Тактична медицина',
      items: '300 шт. Аптечки IFAK з кровоспинними турнікетами CAT Gen7',
      priority: '⚡ Терміново (Евакуація)',
      status: 'delivered',
      statusLabel: '✅ Доставлено — Акт підписано',
      date: '28.06.2026'
    },
    {
      id: 'REQ-8490',
      unit: '128-ма ОГШБр (Запоріжжя)',
      contact: 'ст. лейт. Ігор М.',
      category: '🚗 Автотранспорт / Шини',
      items: 'Комплект болотної гуми МТ (4 шт.) для евакуаційного пікапа L200',
      priority: '🟡 Середній (Логістика)',
      status: 'fundraising',
      statusLabel: '🟡 Відкрито збір — Зібрано 65%',
      date: '01.07.2026'
    },
    {
      id: 'REQ-8489',
      unit: 'ППО Київщини (Мобільна вогнева група)',
      contact: 'серж. Олександр П.',
      category: '⚡ Живлення та Зв\'язок',
      items: '2 шт. Зарядні станції EcoFlow Delta 2 + Starlink Gen3',
      priority: '🔥 Високий (Захист неба)',
      status: 'review',
      statusLabel: '🔍 Верифікація безпеки та документів',
      date: '05.07.2026'
    }
  ],
  honorWallBricks: [
    { id: 'br_1', name: 'Олександр та родина', amount: '50 000 ₴', message: 'За наше чисте небо та спокійний сон дітей! Слава Україні! 🇺🇦', country: 'uk', date: '05.07.2026' },
    { id: 'br_2', name: 'James & Sarah Wilson', amount: '$500', message: 'Standing firmly with Ukraine until total victory! Love from Texas 🇺🇸', country: 'us', date: '04.07.2026' },
    { id: 'br_3', name: 'IT-Компанія «TechDev»', amount: '150 000 ₴', message: 'На нічні пташки для 3-ї ОШБр від нашої команди розробників! 🚀', country: 'uk', date: '03.07.2026' },
    { id: 'br_4', name: 'Krzysztof Kowalski', amount: '1 000 PLN', message: 'Za wolność naszą i waszą! Bracia Ukraińcy, jesteśmy z Wami! 🇵🇱', country: 'pl', date: '02.07.2026' },
    { id: 'br_5', name: 'Олена (волонтер з Києва)', amount: '5 000 ₴', message: 'Нехай наші захисники повертаються додому живими та здоровими! ❤️', country: 'uk', date: '01.07.2026' },
    { id: 'br_6', name: 'Hans Müller & Familie', amount: '300 EUR', message: 'Für Frieden und Freiheit in Europa. Grüße aus München! 🇩🇪', country: 'de', date: '30.06.2026' },
    { id: 'br_7', name: 'David Smith', amount: '£250', message: 'Support from London! Keep fighting the good fight! 🇬🇧', country: 'gb', date: '29.06.2026' },
    { id: 'br_8', name: 'Анонімний Благодійник', amount: '25 000 ₴', message: 'На РЕБ для хлопців на Донбасі. Разом ми — сила!', country: 'uk', date: '28.06.2026' }
  ],
  shopItems: [
    { id: 'sh_1', title: 'Розписана гільза 155-мм від артилерії', category: '🏆 Артефакти з фронту', price: '10 000 ₴', desc: 'Аутентична гільза від гаубиці М777, привезена з Бахмутського напрямку. Художній петриківський розпис від волонтерів.', image: 'honor_cargo.jpg', inStock: true },
    { id: 'sh_2', title: 'Тубус від гранатомета NLAW / Javelin', category: '🏆 Артефакти з фронту', price: '25 000 ₴', desc: 'Відстріляний тубус з підписами командирів штурмових батальйонів. Легендарний трофей для офісу чи колекції.', image: 'honor_logistics.jpg', inStock: true },
    { id: 'sh_3', title: 'Тактичне худі «Разом ми — сила» (Олива)', category: '👕 Одяг та Мерч', price: '2 500 ₴', desc: 'Преміальна щільна бавовна 350г/м², велкро-панелі для шевронів на рукавах. 100% прибутку йде на дрони.', image: 'honor_media.jpg', inStock: true },
    { id: 'sh_4', title: 'Бойовий прапор з підписами бійців ППО', category: '🏆 Артефакти з фронту', price: '15 000 ₴', desc: 'Оригінальний державний прапор України (150х90 см) з автографами та побажаннями від мобільних вогневих груп Київщини.', image: 'honor_driver.jpg', inStock: true },
    { id: 'sh_5', title: 'Фірмовий тактичний 3D патч (Шеврон)', category: '🛡️ Шеврони та Сувеніри', price: '500 ₴', desc: 'Високоякісний ПВХ шеврон на липучці (велкро) з символікою фонду. Вологостійкий та довговічний.', image: 'logo.png', inStock: true },
    { id: 'sh_6', title: 'Термокухоль «Небесний Щит» (500 мл)', category: '🛡️ Шеврони та Сувеніри', price: '1 200 ₴', desc: 'Матовий чорний термокухоль з лазерним гравіюванням нашої головної операції. Тримає тепло до 12 годин.', image: 'hero.png', inStock: true }
  ],
  shopOrders: [
    { id: 'ORD-5012', item: 'Тактичне худі «Разом ми — сила» (Олива)', customer: 'Ігор Бондаренко', phone: '+380971234567', address: 'м. Київ, Нова Пошта №45', date: '05.07.2026', status: 'new', statusLabel: '🟡 Очікує відправки' },
    { id: 'ORD-5011', item: 'Фірмовий тактичний 3D патч (Шеврон)', customer: 'Олена Василенко', phone: '+380509876543', address: 'м. Львів, Нова Пошта №12', date: '04.07.2026', status: 'sent', statusLabel: '🟢 Відправлено Новою Поштою' },
    { id: 'ORD-5010', item: 'Розписана гільза 155-мм від артилерії', customer: 'Michael Smith (USA)', phone: '+14155552671', address: 'DHL Express, New York, USA', date: '01.07.2026', status: 'delivered', statusLabel: '✅ Доставлено меценату' }
  ],
  trainingCourses: [
    { id: 'tr_1', title: '🛸 Керування БПЛА та FPV-дронами', category: 'БПЛА та Розвідка', date: '12 липня 2026', city: 'м. Київ (Полігон)', instructor: 'інстр. «Маестро» (ветеран 3 ОШБр)', seatsTotal: 20, seatsTaken: 16, desc: 'Інтенсивний 3-денний курс: аеродинаміка, симулятори Liftoff/Velocidrone, робота під дією ворожого РЕБ, польоти на полігоні.', icon: '🛸' },
    { id: 'tr_2', title: '🏥 Тактична медицина за протоколом TCCC / MARCH', category: 'Тактична медицина', date: '15 липня 2026', city: 'м. Львів (Хаб фонду)', instructor: 'начмед. Олена (Госпітальєри)', seatsTotal: 25, seatsTaken: 25, desc: 'Практичний тренінг: накладання турнікетів CAT, тампонада вузлових кровотеч, пневмоторакси, евакуація під вогнем.', icon: '🏥' },
    { id: 'tr_3', title: '💣 Мінно-вибухова безпека (EORE / EOD)', category: 'Мінна безпека', date: '19 липня 2026', city: 'м. Дніпро', instructor: 'сапер «Грім» (ДСНС / ЗСУ)', seatsTotal: 30, seatsTaken: 12, desc: 'Розпізнавання вибухонебезпечних предметів, розтяжок, мін ПФМ-1 «Пелюстка», правила поведінки на деокупованих територіях.', icon: '💣' },
    { id: 'tr_4', title: "📻 Польовий зв'язок, РЕБ та Кібербезпека", category: "Зв'язок та РЕБ", date: '23 липня 2026', city: 'м. Київ (Офіс)', instructor: "інстр. «Радіст» (Зв'язок ППО)", seatsTotal: 15, seatsTaken: 8, desc: 'Прошивка та шифрування радіостанцій Motorola/Hytera, налаштування та маскування Starlink, цифрова гігієна на фронті.', icon: '📻' }
  ],
  trainingRegistrations: [
    { id: 'REG-901', courseTitle: '🛸 Керування БПЛА та FPV-дронами', name: 'Андрій Мельник', phone: '+380631112233', role: 'Військовий (ТрО)', date: '05.07.2026', status: 'approved', statusLabel: '🟢 Підтверджено' },
    { id: 'REG-902', courseTitle: '🏥 Тактична медицина за протоколом TCCC', name: 'Катерина Коваль', phone: '+380954445566', role: 'Волонтер', date: '04.07.2026', status: 'approved', statusLabel: '🟢 Підтверджено' },
    { id: 'REG-903', courseTitle: '💣 Мінно-вибухова безпека (EORE / EOD)', name: 'Віталій Сидоренко', phone: '+380678889900', role: 'Цивільний', date: '03.07.2026', status: 'pending', statusLabel: '🟡 В обробці' }
  ],
  rehabVeterans: [
    { id: 'rh_1', name: 'Олександр «Молот»', callsign: '3-тя ОШБр', injury: 'Втрата правої кінцівки внаслідок мінно-вибухової травми під Бахмутом', treatment: 'Виготовлення біонічного протезу кінцівки Esper Hand та курс реабілітації', clinic: 'Клініка Superhumans / Нове Життя (Львів)', status: 'funded', statusLabel: '🟢 Протез встановлено, проходить адаптацію', story: 'Після тяжкого поранення у траншеї Олександр не здався. Завдяки донорам фонду він отримав сучасний біонічний протез і зараз викладає пілотування FPV-дронів у нашій Академії.', image: 'work_rehab_chairs.jpg', needAmount: 850000, collectedAmount: 850000 },
    { id: 'rh_2', name: 'Дмитро «Сокіл»', callsign: '80-та ОДШБр', injury: 'Ампутація гомілки та контузія під Кліщіївкою', treatment: 'Спортивний біговий протез Ottobock та курс психологічної декомпресії', clinic: 'Центр Нескорені / Unbroken (Київ)', status: 'active', statusLabel: '🟡 Триває збір на спортивний протез', story: 'Дмитро мріє повернутися до активного спорту та взяти участь у «Іграх Нескорених». Зібрано вже 70% суми на спеціальний біговий протез з карбонового волокна.', image: 'work_medical_aid.jpg', needAmount: 620000, collectedAmount: 435000 },
    { id: 'rh_3', name: 'Максим «Волиняк»', callsign: '24-та ОМБр', injury: 'Осколкове поранення спини та тяжкий ПТСР', treatment: 'Інтенсивний 3-місячний курс нейрорегабілітації та арт-терапії в Карпатах', clinic: 'Ветеранський хаб «Відродження» (Івано-Франківськ)', status: 'active', statusLabel: '🟡 Триває збір на курс реабілітації', story: 'Максим провів 8 місяців на нулі. Зараз він потребує якісного психологічного розвантаження та нейростимуляції для відновлення сну та координації.', image: 'work_hospital_ward.jpg', needAmount: 180000, collectedAmount: 142000 }
  ],
  rehabApplications: [
    { id: 'RH-401', name: 'Віктор Петренко (ветеран 95 ОДШБр)', phone: '+380671122334', type: '🦿 Біонічне протезування', details: 'Ампутація лівої руки нижче ліктя, потребую біонічного протезу', date: '05.07.2026', status: 'review', statusLabel: '🟡 Медична перевірка' },
    { id: 'RH-402', name: 'Ірина (дружина бійця 59 ОМПБр)', phone: '+380509988776', type: '🧠 Психологічна реабілітація (ПТСР)', details: 'Чоловік повернувся з полону, потрібна комплексна психологічна та фізична допомога', date: '04.07.2026', status: 'active', statusLabel: '🟢 В роботі клініки' },
    { id: 'RH-403', name: 'Сергій «Козак» (демобілізований)', phone: '+380635554433', type: '💼 Перекваліфікація та IT-курси', details: 'Бажаю пройти курс оператора цивільних БПЛА для роботи в агросекторі', date: '02.07.2026', status: 'done', statusLabel: '✅ Курс розпочато' }
  ],
  internationalDonors: [
    { id: 'INT-801', donor: 'John & Mary Henderson', country: 'us', countryName: 'USA 🇺🇸', currency: 'USD', amount: '$5,000', method: '501(c)(3) Wire Transfer', date: '05.07.2026', msg: 'Dedicated to the brave defenders of Bakhmut. Stay strong!' },
    { id: 'INT-802', donor: 'British Aid for Ukraine Group', country: 'gb', countryName: 'UK 🇬🇧', currency: 'GBP', amount: '£3,500', method: 'UK Gift Aid (+25% Bonus)', date: '04.07.2026', msg: 'From London with solidarity! We stand with you until victory.' },
    { id: 'INT-803', donor: 'Anonymous Crypto Whale', country: 'global', countryName: 'Global Web3 🌐', currency: 'USDT', amount: '10,000 USDT', method: 'Crypto TRC20 Wallet', date: '03.07.2026', msg: 'For night reconnaissance drones and EW systems.' },
    { id: 'INT-804', donor: 'Stefan & Claudia Weber', country: 'de', countryName: 'Germany 🇩🇪', currency: 'EUR', amount: '1,500 EUR', method: 'SEPA Direct IBAN', date: '02.07.2026', msg: 'Für Frieden und Freiheit in Europa! Slava Ukraini!' }
  ],
  memorialHeroes: [
    { id: 'mem_1', name: 'Майоренко Олексій «Орел»', rank: 'капітан, командир роти БПЛА', brigade: '72-га ОМБр ім. Чорних Запорожців', awards: 'Герой України (посмертно), Орден «За мужність» І ст.', date: '14 жовтня 2025', place: 'Вугледарський напрямок', story: 'Олексій особисто знищив 14 бронемашин ворога та врятував оточену групу побратимів, прикриваючи їхній відхід вогнем свого розрахунку. Вічна слава та пам\'ять Герою!', image: 'honor_cargo.jpg', candlesCount: 1420 },
    { id: 'mem_2', name: 'Коваленко Сергій «Скеля»', rank: 'старший сержант, штурмовик', brigade: '3-тя Окрема Штурмова Бригада', awards: 'Орден «За мужність» ІІ та ІІІ ст.', date: '22 серпня 2025', place: 'околиці Бахмута', story: 'Сергій пройшов найгарячіші точки фронту від Києва до Донбасу. Загинув від ворожого скиду під час евакуації пораненого бійця зі свого взводу. Незламний воїн і вірний друг.', image: 'honor_driver.jpg', candlesCount: 980 },
    { id: 'mem_3', name: 'Веремієнко Андрій «Студент»', rank: 'солдат, бойовий медик', brigade: '82-га ОДШБр', awards: 'Орден «За мужність» ІІІ ст.', date: '10 листопада 2025', place: 'Роботине (Запоріжжя)', story: 'Андрій, студент 4-го курсу медуніверситету, пішов добровольцем у перші дні. Врятував життя понад 40 побратимам під ворожим артобстрілом. Вічна подяка від врятованих бійців.', image: 'honor_media.jpg', candlesCount: 1850 }
  ],
  memorialApplications: [
    { id: 'MEM-501', name: 'Олена Майоренко (дружина)', phone: '+380671112233', heroName: 'Майоренко Олексій «Орел»', brigade: '72 ОМБр', details: 'Бажаю додати історію чоловіка на Стіну Пам\'яті та долучитися до програми підтримки родин', date: '05.07.2026', status: 'approved', statusLabel: '🟢 Додано в Пантеон' },
    { id: 'MEM-502', name: 'Дмитро (побратим)', phone: '+380509988771', heroName: 'Ткаченко Микола «Батько»', brigade: '93 ОМБр «Холодний Яр»', details: 'Загинув під Кліщіївкою, маємо фото та виписку нагород', date: '04.07.2026', status: 'review', statusLabel: '🟡 Перевірка документів' }
  ],
  auctionLots: [
    { id: 'auc_1', title: '🇺🇦 Бойовий Прапор з особистим підписом Кирила Буданова', type: 'raffle', typeLabel: '🎟️ Благодійна Лотерея', desc: 'Ексклюзивний прапор України з автографом начальника ГУР МО Кирила Буданова. Всі кошти йдуть на нічні дрони з тепловізорами для розвідників!', image: 'hero.png', ticketPrice: 200, currentBid: 0, targetAmount: 500000, collectedAmount: 410000, totalTickets: 2050, topBidder: '-', endTime: '15 липня 2026', status: 'active' },
    { id: 'auc_2', title: '🥊 Боксерська рукавичка з автографом Олександра Усика', type: 'raffle', typeLabel: '🎟️ Благодійна Лотерея', desc: 'Оригінальна боксерська рукавичка Абсолютного чемпіона світу Олександра Усика. 1 білет = 300 грн. Більше донат = більше шансів!', image: 'honor_patron.jpg', ticketPrice: 300, currentBid: 0, targetAmount: 300000, collectedAmount: 240000, totalTickets: 800, topBidder: '-', endTime: '20 липня 2026', status: 'active' },
    { id: 'auc_3', title: '🚀 Відстріляний тубус від NLAW з розписом бійців 3 ОШБр', type: 'auction', typeLabel: '🔨 Відкритий Аукціон', desc: 'Легендарний трофей з-під Бахмута, перетворений на арт-об\'єкт військовими художниками. Перемагає найвища ставка!', image: 'honor_logistics.jpg', ticketPrice: 0, currentBid: 45000, targetAmount: 100000, collectedAmount: 45000, totalTickets: 0, topBidder: 'Меценат Alex_K', endTime: '18 липня 2026', status: 'active' }
  ],
  auctionTransactions: [
    { id: 'TRX-701', lotId: 'auc_1', lotTitle: '🇺🇦 Прапор від Кирила Буданова', participant: 'Марина Бондаренко', phone: '+380631122334', amount: '2 000 ₴', ticketsCount: '10 білетів', date: '05.07.2026', type: '🎟️ Лотерея' },
    { id: 'TRX-702', lotId: 'auc_3', lotTitle: '🚀 Тубус NLAW 3 ОШБр', participant: 'Alex_K (IT-компанія)', phone: '+380678899000', amount: '45 000 ₴', ticketsCount: 'Ставка', date: '04.07.2026', type: '🔨 Аукціон' },
    { id: 'TRX-703', lotId: 'auc_2', lotTitle: '🥊 Рукавичка Олександра Усика', participant: 'Ігор Власенко', phone: '+380504433221', amount: '1 500 ₴', ticketsCount: '5 білетів', date: '03.07.2026', type: '🎟️ Лотерея' }
  ]
,
  battles: [
    { id: 'bat_1', name: 'Sigma Software Titan Team', category: '🏢 IT-Корпорація', targetAmount: 1500000, collectedAmount: 1420000, supportersCount: 380, rank: 1, rankBadge: '🥇 1 місце', icon: '💻', desc: 'Команда інженерів та розробників Sigma Software, які збирають на нічні розвідувальні крила для 3-ї ОШБр.' },
    { id: 'bat_2', name: 'SoftServe United Force', category: '🏢 IT-Корпорація', targetAmount: 1500000, collectedAmount: 1250000, supportersCount: 410, rank: 2, rankBadge: '🥈 2 місце', icon: '🚀', desc: 'Обєднана команда фахівців SoftServe зі Львова, Харкова та Києва в гонці за покупку комплексу Валькірія.' },
    { id: 'bat_3', name: 'Монобанк / Коти Підтримки', category: '🏦 Банк та Фінтех', targetAmount: 1500000, collectedAmount: 1100000, supportersCount: 890, rank: 3, rankBadge: '🥉 3 місце', icon: '🐱', desc: 'Спільнота клієнтів та співробітників Monobank, що донатять за кешбек та розбивають банки на ЗСУ.' },
    { id: 'bat_4', name: 'КПІ ім. Сікорського (Студентський фронт)', category: '🎓 Університет', targetAmount: 1000000, collectedAmount: 780000, supportersCount: 1240, rank: 4, rankBadge: '🎖️ 4 місце', icon: '🎓', desc: 'Студенти, викладачі та випускники Київського політехнічного інституту в батлі за технологічну перевагу.' }
  ],
  battleApplications: [
    { id: 'BAT-101', teamName: 'EPAM Ukraine Titans', category: '🏢 IT-Корпорація', captainName: 'Максим Сидоренко', phone: '+380671112233', goal: '1 000 000 ₴', details: 'Готові долучитися до турніру, маємо 500+ активних фахівців у внутрішньому чаті', date: '05.07.2026', status: 'approved', statusLabel: '🟢 Прийнято в турнір' },
    { id: 'BAT-102', teamName: 'КНУ ім. Шевченка (Юрфак)', category: '🎓 Університет', captainName: 'Олена Ковальчук', phone: '+380509988771', goal: '500 000 ₴', details: 'Кидаємо виклик КПІ! Хочемо зібрати на 3 нічні дрони Mavic 3T', date: '04.07.2026', status: 'review', statusLabel: '🟡 Модерація заявки' }
  ]
,
  b2bPartners: [
    { id: 'b2b_1', name: 'Sigma Software', tier: '🥇 Золотий Титан', tierClass: 'tier-gold', contribution: '1 500 000 ₴ / міс', icon: '💻', desc: 'Системне шефство над батальйоном БПЛА 3-ї ОШБр. Фінансування нічної оптики та старлінків.' },
    { id: 'b2b_2', name: 'SoftServe Ukraine', tier: '🥇 Золотий Титан', tierClass: 'tier-gold', contribution: '1 200 000 ₴ / міс', icon: '🚀', desc: 'Забезпечення мобільних вогневих груп ППО Київщини прожекторами та автономними зарядними станціями.' },
    { id: 'b2b_3', name: 'Monobank (Фінтех)', tier: '🥈 Срібний Партнер', tierClass: 'tier-silver', contribution: '800 000 ₴ / міс', icon: '🐱', desc: 'Регулярні спільні збори, розіграші благодійних банок та покриття витрат на тактичну медицину.' },
    { id: 'b2b_4', name: 'Нова Пошта (Логістика)', tier: '🥈 Срібний Партнер', tierClass: 'tier-silver', contribution: '500 000 ₴ / міс', icon: '📦', desc: 'Безкоштовне логістичне партнерство та щомісячне закупівля гуманітарних наборів для деокупованих територій.' },
    { id: 'b2b_5', name: 'Ajax Systems', tier: '🥉 Бронзовий Партнер', tierClass: 'tier-bronze', contribution: '250 000 ₴ / міс', icon: '🛡️', desc: 'Технологічна підтримка та оснащення ветеранських реабілітаційних хабів системами безпеки.' }
  ],
  b2bApplications: [
    { id: 'B2B-901', company: 'Grammarly Ukraine', contactName: 'Ігор Власенко (CSR Lead)', phone: '+380671122334', email: 'csr@grammarly.com', tier: '🥇 Золотий Титан (500к+ ₴)', details: 'Бажаємо взяти шефство над підрозділом розвідки та провести благодійний хакатон для співробітників', date: '05.07.2026', status: 'approved', statusLabel: '🟢 Договір підписано' },
    { id: 'B2B-902', company: 'MacPaw', contactName: 'Олена Сидоренко', phone: '+380509988771', email: 'social@macpaw.com', tier: '🥈 Срібний Партнер (200к+ ₴)', details: 'Цікавить брендування 5 FPV-дронів та лекція від ветерана для команди в Києві', date: '04.07.2026', status: 'review', statusLabel: '🟡 Перемовини' }
  ]
,
  podcasts: [
    { id: 'pod_1', episode: 'Епізод #42', title: 'Еволюція нічних дронів: від Mavic до Валькірії', guest: 'Командир роти БПЛА «Птахи Мадяра»', category: '🛰️ Технології війни', duration: '48 хв', date: '05.07.2026', listens: '14 200', desc: 'Ексклюзивна розмова про те, як штучний інтелект та тепловізійна оптика змінюють правила нічного полювання на фронті.' },
    { id: 'pod_2', episode: 'Епізод #41', title: 'Життя після поранення: як біонічні протези повертають свободу', guest: 'Ветеран Олексій «Молот» та лікар-протезист', category: '🦿 Реабілітація', duration: '55 хв', date: '28.06.2026', listens: '18 900', desc: 'Відверта історія відновлення, психологічної адаптації та запуску ветеранського бізнесу в Києві.' },
    { id: 'pod_3', episode: 'Епізод #40', title: 'Американська зброя та дипломатія: погляд з Вашингтона', guest: 'Представник української діаспори в США', category: '🌍 Міжнародний фронт', duration: '62 хв', date: '21.06.2026', listens: '22 400', desc: 'Аналіз військової допомоги, робота з конгресменами та як кожен українець за кордоном може бути послом перемоги.' },
    { id: 'pod_4', episode: 'Епізод #39', title: 'Тактична медицина 2026: стандарти TCCC в окопах', guest: 'Головний інструктор медбатальйону Госпітальєри', category: '📖 Історії з окопів', duration: '41 хв', date: '14.06.2026', listens: '16 700', desc: 'Що рятує життя в перші 3 хвилини після поранення, розбір помилок та еволюція українських аптечок.' }
  ],
  podcastQuestions: [
    { id: 'Q-801', author: 'Максим (Київ)', contact: '+380631112233', question: 'Питання до пілотів FPV: які РЕБ-системи ворога зараз найнебезпечніші для наших дронів?', targetGuest: 'Ефір #43 (Розвідка)', date: '06.07.2026', status: 'pending', statusLabel: '🟡 Очікує ефіру' },
    { id: 'Q-802', author: 'Олена (Львів)', contact: 'olena@gmail.com', question: 'Як правильно підготувати родину до повернення ветерана з фронту з ПТСР?', targetGuest: 'Психолог Ветеранського хабу', date: '05.07.2026', status: 'answered', statusLabel: '🟢 Озвучено в ефірі #41' }
  ]
,
  supportMessages: [
    { id: 'SUP-501', author: 'Андрій (Волонтер)', contact: '+380671112233', subject: 'Питання щодо передачі дрон-детекторів', text: 'Вітаю! Маємо 3 детектори дронів від партнерів з Польщі. Як передати їх безпосередньо на Бахмутський напрямок через ваш фонд?', date: '06.07.2026', status: 'pending', statusLabel: '🟡 Очікує оператора', reply: '' },
    { id: 'SUP-502', author: 'Марія (HR Tech)', contact: 'maria@company.com', subject: 'Корпоративний збір', text: 'Хочемо відкрити корпоративну банку на 500 тис грн для ППО. Надішліть реквізити та договір.', date: '05.07.2026', status: 'answered', statusLabel: '🟢 Відповіли в чаті', reply: 'Вітаємо, Маріє! Надіслали вам пакет документів для B2B партнерства на пошту.' }
  ],
  supportFaq: [
    { id: 'faq_1', q: '🎯 Як перевірити, куди пішов мій донат?', a: 'Усі надходження та витрати публікуються в реальному часі на сторінці «🛡️ Прозорість та Звіти». Кожна закупівля супроводжується актами приймання-передачі від військових частин та фіскальними чеками.' },
    { id: 'faq_2', q: '⚔️ Як військовослужбовцю подати офіційний запит на дрони або РЕБ?', a: 'Перейдіть у розділ «⚔️ Запити ЗСУ» та заповніть форму. Необхідно вказати номер ВЧ, ПІБ командира, телефон та додати скан-копію офіційного листа-запиту з печаткою.' },
    { id: 'faq_3', q: '🤝 Які податкові пільги отримує бізнес за B2B-партнерство?', a: 'Благодійний фонд «Разом ми — сила» включено до Реєстру неприбуткових організацій (ознака 0036). Юридичні особи можуть включати благодійні внески до витрат згідно з ПКУ.' },
    { id: 'faq_4', q: '🌍 Як зробити внесок з-за кордону у USD або EUR?', a: 'На сторінці «🤝 Долучитися / Донат» доступні міжнародні реквізити IBAN (USD/EUR/GBP), PayPal, Stripe, Apple Pay та криптовалютні гаманці (USDT, BTC, ETH).' }
  ],
  droneSubmissions: [
    { id: 'DRN-101', author: 'Богдан (Інженер-волонтер)', contact: '+380971112233', kitType: '7-дюймовий FPV-камікадзе', serialNum: 'RMS-FPV-7042', status: 'approved', statusLabel: '🟢 Пройшов полігон (Відправлено 93-й ОМБр)', date: '06.07.2026', notes: 'Прошивка Betaflight 4.4, VTX 1.6W, відео чисте' },
    { id: 'DRN-102', author: 'Олександр (Київський Хаб)', contact: 'alex_fpv@gmail.com', kitType: 'Окопний РЕБ "Купол-3"', serialNum: 'RMS-REB-3019', status: 'testing', statusLabel: '🟡 На полігонному тестуванні', date: '05.07.2026', notes: '3 діапазони: 700-1000 МГц, охолодження активне' }
  ],
  droneKits: [
    { id: 'KIT-1', name: '7-дюймовий ударний FPV-камікадзе (Day/Night)', price: 12500, desc: 'Повний комплект деталей для збірки: карбонова рама Mark4, мотори 2806.5, стек F405 55A, камера Caddx Ratel 2, VTX Rush Solo 1.6W, антена Rush Cherry, пропелери.', ordersCount: 420 },
    { id: 'KIT-2', name: '10-дюймовий важкий бомбер-бомбовоз (Під скиди 2.5 кг)', price: 18900, desc: 'Посилена рама 10", мотори 3115 900KV, стек F722 65A, камера Night Eagle 3, далекобійний VTX 2.5W, система кріплення та скиду боєприпасів.', ordersCount: 185 },
    { id: 'KIT-3', name: 'Окопна станція РЕБ "Купол-3" (3 діапазони)', price: 24500, desc: 'Набір для збірки мобільного РЕБ: генератори перешкод (700-860, 860-1020, 2400 МГц), радіатори охолодження, кулери, антени конюшина, захисний кейс, АКБ 24V.', ordersCount: 140 }
  ],
  bloodDonors: [
    { id: 'BLD-101', name: 'Ігор Військовий', city: 'Київ', bloodGroup: 'O(I) Rh+', phone: '+380671112233', status: 'active', date: '06.07.2026', donationsCount: 4 },
    { id: 'BLD-102', name: 'Олена Донор', city: 'Харків', bloodGroup: 'A(II) Rh-', phone: '+380509998877', status: 'urgent_call', date: '05.07.2026', donationsCount: 7 },
    { id: 'BLD-103', name: 'Максим Меценат', city: 'Дніпро', bloodGroup: 'AB(IV) Rh+', phone: '+380634445566', status: 'active', date: '04.07.2026', donationsCount: 2 }
  ],
  animals: [
    { id: 'PET-1', name: 'Патрон (Вівчарка К-9)', type: 'Службовий пес-розшуківець', zone: 'Покровський напрямок', age: '3 роки', desc: 'Евакуйований під обстрілом. Вміє виявляти міни-пелюстки. Потребує тактичних окулярів та розвантажувального жилета.', needAmount: 18500, collected: 14200, status: 'urgent', img: 'hero.png' },
    { id: 'PET-2', name: 'Бахмут (Кіт-талісман)', type: 'Окопний котик-мишолов', zone: 'Часів Яр', age: '1.5 роки', desc: 'Врятований бійцями 93-ї ОМБр з палаючого будинку. Шукає люблячу родину в Києві або Львові!', needAmount: 6500, collected: 6500, status: 'adopted', img: 'work_kids_toys.jpg' },
    { id: 'PET-3', name: 'Рекс (Саперна собака)', type: 'К-9 ДСНС', zone: 'Харківщина', age: '4 роки', desc: 'Отримав легку контузію під час розмінування. Проходить реабілітацію у ветклініці фонду. Потребує лікувального корму.', needAmount: 24000, collected: 9800, status: 'rehab', img: 'work_medical_aid.jpg' }
  ],
  legalRequests: [
    { id: 'LEG-1', soldier: 'Олександр Т.', unit: 'А1302 (93 ОМБр)', category: 'Оформлення УБД', phone: '+380971234567', date: '06.07.2026', status: 'in_progress', statusLabel: '🟡 В роботі адвоката', notes: 'Запит на генерацію рапорту та збір довідок з госпіталю' },
    { id: 'LEG-2', soldier: 'Микола В.', unit: 'А4010', category: 'Виплати за поранення (ВЛК)', phone: '+380507654321', date: '05.07.2026', status: 'resolved', statusLabel: '🟢 Виплату призначено', notes: 'Успішно оскаржено висновок комісії, виплачено 100 тис грн' }
  ],
  userProfile: {
    name: 'Владислав (Головний Меценат)',
    rank: '🌟 Амбасадор Фонду ЗСУ',
    totalDonated: 145000,
    dronesSponsored: 8,
    bloodDonatedLiters: 1.8,
    badges: [
      { id: 'b1', title: '🛸 Крилатий Патрон', desc: 'Профінансовано 5+ ударних FPV-дронів для фронту', icon: '🛸', unlocked: true },
      { id: 'b2', title: '💛 Сталеве Серце', desc: 'Регулярна щомісячна підписка протягом 6 місяців', icon: '💛', unlocked: true },
      { id: 'b3', title: '🩸 Кров\'яна Варта', desc: 'Здано кров для поранених бійців та шпиталів', icon: '🩸', unlocked: true },
      { id: 'b4', title: '🐾 Хвостатий Опікун', desc: 'Взято під опіку врятовану тварину з прифронтової зони', icon: '🐾', unlocked: true },
      { id: 'b5', title: '🛠️ Майстер-Інженер', desc: 'Зібрано та успішно здано на полігон FPV або РЕБ', icon: '🛠️', unlocked: true },
      { id: 'b6', title: '🎟️ Король Аукціонів', desc: 'Виграно ексклюзивний бойовий трофей на аукціоні фонду', icon: '🎟️', unlocked: false },
      { id: 'b7', title: '⚡ Кібер-Волонтер', desc: 'Активна участь у цифровому обороні та поширенні зборів', icon: '⚡', unlocked: true },
      { id: 'b8', title: '🛡️ Тіньовий Патрон', desc: 'Анонімна або значна фінансова підтримка спецпроектів', icon: '🛡️', unlocked: true },
      { id: 'b9', title: '🌟 Легенда Фонду', desc: 'Загальний внесок у перемогу перевищив 100,000 ₴', icon: '🌟', unlocked: true }
    ],
    history: [
      { id: 'H-1', date: '06.07.2026', action: 'Донат на збір «Залізний Кулак»', amount: 25000, status: 'Успішно' },
      { id: 'H-2', date: '02.07.2026', action: 'Оплата кит-комплекту FPV 7" для волонтерів', amount: 12500, status: 'Успішно' },
      { id: 'H-3', date: '25.06.2026', action: 'Придбання Золотої Благодійної Цеглинки', amount: 50000, status: 'Успішно' },
      { id: 'H-4', date: '15.06.2026', action: 'Донат на реабілітацію кіборгів', amount: 57500, status: 'Успішно' }
    ]
  },
  ecoProjects: [
    { id: 'ECO-1', title: 'Роботизований комплекс розмінування "Скіф-М"', region: 'Херсонщина (Аграрний сектор)', needAmount: 450000, collected: 320000, desc: 'Закупівля важкого дрона-міношукача та дистанційної фрези для очищення посівних полів від протипіхотних мін та залишків касетних боєприпасів.', status: 'active', img: 'drone.png' },
    { id: 'ECO-2', title: 'Відродження Серебрянського Лісу (10,000 саджанців)', region: 'Луганщина / Донеччина', needAmount: 150000, collected: 150000, desc: 'Висадка стійких до посухи дубів та сосен на місці випалених бойовими діями лісових масивів. Спільна програма з екологами України.', status: 'completed', img: 'work_baby_food.jpg' },
    { id: 'ECO-3', title: 'Мобільна лабораторія аналізу води та ґрунтів', region: 'Миколаївська область', needAmount: 280000, collected: 95000, desc: 'Експрес-діагностика питної води в прифронтових селах на вміст важких металів та порохових залишків.', status: 'active', img: 'work_medical_aid.jpg' }
  ],
  childrenRequests: [
    { id: 'KID-1', childName: 'Остап (10 років)', parentInfo: 'Син полеглого Героя 93-ї ОМБр', city: 'Бахмут / Київ', requestType: 'Ноутбук для школи', date: '06.07.2026', status: 'in_progress', statusLabel: '🟡 В процесі закупівлі', notes: 'Потрібен ноутбук для дистанційного навчання та курсів програмування' },
    { id: 'KID-2', childName: 'Софія (14 років)', parentInfo: 'Донька ветерана з інвалідністю', city: 'Харків', requestType: 'Путівка в кемп "Горизонт"', date: '05.07.2026', status: 'approved', statusLabel: '🟢 Путівку надано', notes: 'Зміна в Карпатах з 15 по 28 липня, оплачено фондом' }
  ],
  energyProjects: [
    { id: 'ENG-1', title: 'Дизель-генератор 50 кВт для прифронтового шпиталю', region: 'Запорізька область', needAmount: 380000, collected: 290000, desc: 'Забезпечення безперебійного живлення реанімації та операційних під час зимових блекаутів.', status: 'active', img: 'work_hospital_ward.jpg' },
    { id: 'ENG-2', title: '15 терміналів Starlink v3 + авто-адаптери', region: 'Донецький напрямок (Авдіївка/Покровськ)', needAmount: 300000, collected: 300000, desc: 'Супутниковий шифрований зв\'язок для командних пунктів та розрахунків БПЛА.', status: 'completed', img: 'drone.png' },
    { id: 'ENG-3', title: 'Зарядні станції EcoFlow Delta Pro (5 шт)', region: 'Харківщина (Мобільні ППО)', needAmount: 450000, collected: 120000, desc: 'Живлення прожекторів та радіолокаційних планшетів мисливців за шахедами.', status: 'active', img: 'hero.png' }
  ],
  veteranBusinesses: [
    { id: 'VET-1', brand: '☕ "Кава Кіборгів" (Ветеранська Ростерія)', founder: 'Олександр "Титан" (Ветеран 95-ї ОДШБр)', city: 'Житомир', grantAmount: 150000, desc: 'Крафтове обсмажування кави. Частина прибутку йде на дрони для рідної бригади.', category: 'Кава та пекарні', status: 'active', img: 'honor_patron.jpg' },
    { id: 'VET-2', brand: '🍯 "Мед Перемоги" (Пасіка ветерана)', founder: 'Микола Петренко (Ветеран-сапер)', city: 'Полтавщина', grantAmount: 100000, desc: 'Екологічно чистий липовий та гречаний мед з Полтавщини. Подарункові набори.', category: 'Крафтові продукти', status: 'active', img: 'work_baby_food.jpg' },
    { id: 'VET-3', brand: '🛠️ СТО "Бронювання та Ремонт 4x4"', founder: 'Брати Бойко (Ветерани ТрО)', city: 'Дніпро', grantAmount: 250000, desc: 'Ремонт та підготовка пікапів і позашляховиків для фронтових підрозділів.', category: 'Автосервіс та СТО', status: 'completed', img: 'honor_cargo.jpg' }
  ],
  mobileHospitals: [
    { id: 'HOSP-1', title: 'Мобільний стоматологічний кабінет на базі автобуса', region: 'Слов\'янськ / Краматорськ', needAmount: 650000, collected: 480000, desc: 'Повноцінне стоматологічне обладнання, рентген та генератор для лікування бійців на нулі.', status: 'active', img: 'work_hospital_ward.jpg' },
    { id: 'HOSP-2', title: 'Броньований евакуаційний реанімобіль Pinzgauer', region: 'Куп\'янський напрямок', needAmount: 850000, collected: 850000, desc: 'Вивіз важкопоранених бійців під ворожим обстрілом по бездоріжжю з підтримкою ШВЛ.', status: 'completed', img: 'med.png' }
  ]
};
window.FoundationStore = {
  getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveData(normalizeAssetPaths(INITIAL_DATA));
        return normalizeAssetPaths(JSON.parse(JSON.stringify(INITIAL_DATA)));
      }
      return normalizeAssetPaths(JSON.parse(raw));
    } catch (e) {
      return normalizeAssetPaths(JSON.parse(JSON.stringify(INITIAL_DATA)));
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

    getMegaGoal() { return this.getData().megaGoal || INITIAL_DATA.megaGoal; },
  getImpactMap() { return this.getData().impactMap || INITIAL_DATA.impactMap; },
  getFrontlineRadar() { return this.getData().frontlineRadar || INITIAL_DATA.frontlineRadar; },
  getPatronTiers() { return this.getData().patronTiers || INITIAL_DATA.patronTiers; },

  getApplications() { return this.getData().applications || []; },
  addApplication(app) {
    const data = this.getData();
    app.id = 'app_' + Date.now();
    app.date = new Date().toLocaleString('uk-UA');
    app.status = 'new';
    app.role = app.role || app.type || 'Волонтер/Партнер';
    app.notes = app.notes || app.message || '';
    app.message = app.notes;
    if (!data.applications) data.applications = [];
    data.applications.unshift(app);
    this.saveData(data);
    return app;
  },

  getMilitaryRequests() { return this.getData().militaryRequests || INITIAL_DATA.militaryRequests; },
  addMilitaryRequest(req) {
    const data = this.getData();
    if (!data.militaryRequests) data.militaryRequests = [];
    req.id = 'REQ-' + Math.floor(1000 + Math.random() * 9000);
    req.date = new Date().toLocaleDateString('uk-UA');
    req.status = 'review';
    req.statusLabel = '🔍 Верифікація безпеки та документів';
    data.militaryRequests.unshift(req);
    this.saveData(data);
    return req;
  },
  updateMilitaryRequestStatus(id, newStatus, newLabel) {
    const data = this.getData();
    if (!data.militaryRequests) return;
    const idx = data.militaryRequests.findIndex(r => r.id === id);
    if (idx !== -1) {
      data.militaryRequests[idx].status = newStatus;
      data.militaryRequests[idx].statusLabel = newLabel;
      this.saveData(data);
    }
  },
  deleteMilitaryRequest(id) {
    const data = this.getData();
    if (data.militaryRequests) {
      data.militaryRequests = data.militaryRequests.filter(r => r.id !== id);
      this.saveData(data);
    }
  },

  getHonorWallBricks() { return this.getData().honorWallBricks || INITIAL_DATA.honorWallBricks; },
  addHonorWallBrick(brick) {
    const data = this.getData();
    if (!data.honorWallBricks) data.honorWallBricks = [];
    brick.id = 'br_' + Date.now();
    brick.date = new Date().toLocaleDateString('uk-UA');
    data.honorWallBricks.unshift(brick);
    this.saveData(data);
    return brick;
  },
  deleteHonorWallBrick(id) {
    const data = this.getData();
    if (data.honorWallBricks) {
      data.honorWallBricks = data.honorWallBricks.filter(b => b.id !== id);
      this.saveData(data);
    }
  },

  getShopItems() { return this.getData().shopItems || INITIAL_DATA.shopItems; },
  getShopOrders() { return this.getData().shopOrders || INITIAL_DATA.shopOrders; },
  addShopOrder(order) {
    const data = this.getData();
    if (!data.shopOrders) data.shopOrders = [];
    order.id = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    order.date = new Date().toLocaleDateString('uk-UA');
    order.status = 'new';
    order.statusLabel = '🟡 Очікує відправки';
    data.shopOrders.unshift(order);
    this.saveData(data);
    return order;
  },
  updateShopOrderStatus(id, status, label) {
    const data = this.getData();
    if (!data.shopOrders) return;
    const idx = data.shopOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
      data.shopOrders[idx].status = status;
      data.shopOrders[idx].statusLabel = label;
      this.saveData(data);
    }
  },
  deleteShopOrder(id) {
    const data = this.getData();
    if (data.shopOrders) {
      data.shopOrders = data.shopOrders.filter(o => o.id !== id);
      this.saveData(data);
    }
  },

  getTrainingCourses() { return this.getData().trainingCourses || INITIAL_DATA.trainingCourses; },
  updateTrainingCourseSeats(id, taken) {
    const data = this.getData();
    if (!data.trainingCourses) return;
    const idx = data.trainingCourses.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.trainingCourses[idx].seatsTaken = taken;
      this.saveData(data);
    }
  },
  getTrainingRegistrations() { return this.getData().trainingRegistrations || INITIAL_DATA.trainingRegistrations; },
  addTrainingRegistration(reg) {
    const data = this.getData();
    if (!data.trainingRegistrations) data.trainingRegistrations = [];
    reg.id = 'REG-' + Math.floor(100 + Math.random() * 900);
    reg.date = new Date().toLocaleDateString('uk-UA');
    reg.status = 'pending';
    reg.statusLabel = '🟡 В обробці';
    data.trainingRegistrations.unshift(reg);
    
    // Increment seats taken if possible
    if (data.trainingCourses) {
      const cIdx = data.trainingCourses.findIndex(c => c.title === reg.courseTitle);
      if (cIdx !== -1 && data.trainingCourses[cIdx].seatsTaken < data.trainingCourses[cIdx].seatsTotal) {
        data.trainingCourses[cIdx].seatsTaken++;
      }
    }
    
    this.saveData(data);
    return reg;
  },
  updateTrainingRegStatus(id, status, label) {
    const data = this.getData();
    if (!data.trainingRegistrations) return;
    const idx = data.trainingRegistrations.findIndex(r => r.id === id);
    if (idx !== -1) {
      data.trainingRegistrations[idx].status = status;
      data.trainingRegistrations[idx].statusLabel = label;
      this.saveData(data);
    }
  },
  deleteTrainingRegistration(id) {
    const data = this.getData();
    if (data.trainingRegistrations) {
      data.trainingRegistrations = data.trainingRegistrations.filter(r => r.id !== id);
      this.saveData(data);
    }
  },

  getRehabVeterans() { return this.getData().rehabVeterans || INITIAL_DATA.rehabVeterans; },
  getRehabApplications() { return this.getData().rehabApplications || INITIAL_DATA.rehabApplications; },
  addRehabApplication(app) {
    const data = this.getData();
    if (!data.rehabApplications) data.rehabApplications = [];
    app.id = 'RH-' + Math.floor(100 + Math.random() * 900);
    app.date = new Date().toLocaleDateString('uk-UA');
    app.status = 'review';
    app.statusLabel = '🟡 Медична перевірка';
    data.rehabApplications.unshift(app);
    this.saveData(data);
    return app;
  },
  updateRehabAppStatus(id, status, label) {
    const data = this.getData();
    if (!data.rehabApplications) return;
    const idx = data.rehabApplications.findIndex(a => a.id === id);
    if (idx !== -1) {
      data.rehabApplications[idx].status = status;
      data.rehabApplications[idx].statusLabel = label;
      this.saveData(data);
    }
  },
  deleteRehabApplication(id) {
    const data = this.getData();
    if (data.rehabApplications) {
      data.rehabApplications = data.rehabApplications.filter(a => a.id !== id);
      this.saveData(data);
    }
  },

  getInternationalDonors() { return this.getData().internationalDonors || INITIAL_DATA.internationalDonors; },
  addInternationalDonor(donor) {
    const data = this.getData();
    if (!data.internationalDonors) data.internationalDonors = [];
    donor.id = 'INT-' + Math.floor(100 + Math.random() * 900);
    donor.date = new Date().toLocaleDateString('uk-UA');
    data.internationalDonors.unshift(donor);
    this.saveData(data);
    return donor;
  },
  deleteInternationalDonor(id) {
    const data = this.getData();
    if (data.internationalDonors) {
      data.internationalDonors = data.internationalDonors.filter(d => d.id !== id);
      this.saveData(data);
    }
  },

  getMemorialHeroes() { return this.getData().memorialHeroes || INITIAL_DATA.memorialHeroes; },
  lightHeroCandle(id) {
    const data = this.getData();
    if (!data.memorialHeroes) return;
    const idx = data.memorialHeroes.findIndex(h => h.id === id);
    if (idx !== -1) {
      data.memorialHeroes[idx].candlesCount = (data.memorialHeroes[idx].candlesCount || 0) + 1;
      this.saveData(data);
      return data.memorialHeroes[idx].candlesCount;
    }
  },
  getMemorialApplications() { return this.getData().memorialApplications || INITIAL_DATA.memorialApplications; },
  addMemorialApp(app) {
    const data = this.getData();
    if (!data.memorialApplications) data.memorialApplications = [];
    app.id = 'MEM-' + Math.floor(100 + Math.random() * 900);
    app.date = new Date().toLocaleDateString('uk-UA');
    app.status = 'review';
    app.statusLabel = '🟡 Перевірка документів';
    data.memorialApplications.unshift(app);
    this.saveData(data);
    return app;
  },
  deleteMemorialApp(id) {
    const data = this.getData();
    if (data.memorialApplications) {
      data.memorialApplications = data.memorialApplications.filter(a => a.id !== id);
      this.saveData(data);
    }
  },

  getAuctionLots() { return this.getData().auctionLots || INITIAL_DATA.auctionLots; },
  getAuctionTransactions() { return this.getData().auctionTransactions || INITIAL_DATA.auctionTransactions; },
  buyRaffleTickets(lotId, participant, phone, ticketsCount, amount) {
    const data = this.getData();
    if (!data.auctionLots) return;
    const idx = data.auctionLots.findIndex(l => l.id === lotId);
    if (idx !== -1) {
      data.auctionLots[idx].collectedAmount += amount;
      data.auctionLots[idx].totalTickets += ticketsCount;
    }
    if (!data.auctionTransactions) data.auctionTransactions = [];
    const trx = {
      id: 'TRX-' + Math.floor(100 + Math.random() * 900),
      lotId,
      lotTitle: idx !== -1 ? data.auctionLots[idx].title : 'Лотерея',
      participant,
      phone,
      amount: amount.toLocaleString() + ' ₴',
      ticketsCount: ticketsCount + ' білетів',
      date: new Date().toLocaleDateString('uk-UA'),
      type: '🎟️ Лотерея'
    };
    data.auctionTransactions.unshift(trx);
    this.saveData(data);
    return trx;
  },
  placeAuctionBid(lotId, bidder, phone, bidAmount) {
    const data = this.getData();
    if (!data.auctionLots) return false;
    const idx = data.auctionLots.findIndex(l => l.id === lotId);
    if (idx !== -1) {
      if (bidAmount <= data.auctionLots[idx].currentBid) return false;
      data.auctionLots[idx].currentBid = bidAmount;
      data.auctionLots[idx].collectedAmount = bidAmount;
      data.auctionLots[idx].topBidder = bidder;
      
      if (!data.auctionTransactions) data.auctionTransactions = [];
      const trx = {
        id: 'TRX-' + Math.floor(100 + Math.random() * 900),
        lotId,
        lotTitle: data.auctionLots[idx].title,
        participant: bidder,
        phone,
        amount: bidAmount.toLocaleString() + ' ₴',
        ticketsCount: 'Нова Ставка',
        date: new Date().toLocaleDateString('uk-UA'),
        type: '🔨 Аукціон'
      };
      data.auctionTransactions.unshift(trx);
      this.saveData(data);
      return true;
    }
    return false;
  },
  deleteAuctionTransaction(id) {
    const data = this.getData();
    if (data.auctionTransactions) {
      data.auctionTransactions = data.auctionTransactions.filter(t => t.id !== id);
      this.saveData(data);
    }
  },
    getBattles() {
    const list = this.getData().battles || [];
    list.sort((a, b) => b.collectedAmount - a.collectedAmount);
    list.forEach((b, idx) => {
      b.rank = idx + 1;
      if (idx === 0) b.rankBadge = '🥇 1 місце';
      else if (idx === 1) b.rankBadge = '🥈 2 місце';
      else if (idx === 2) b.rankBadge = '🥉 3 місце';
      else b.rankBadge = `🎖️ ${idx + 1} місце`;
    });
    return list;
  },

  getBattleApplications() {
    return this.getData().battleApplications || [];
  },

  addBattleDonation(teamId, donorName, amount) {
    const data = this.getData();
    if (!data.battles) return false;
    const idx = data.battles.findIndex(b => b.id === teamId);
    if (idx === -1) return false;
    data.battles[idx].collectedAmount += amount;
    data.battles[idx].supportersCount += 1;
    this.saveData(data);
    return true;
  },

  registerBattleTeam(teamName, category, captainName, phone, goal, details) {
    const data = this.getData();
    if (!data.battleApplications) data.battleApplications = [];
    const newId = 'BAT-' + (Math.floor(Math.random() * 899) + 100);
    const today = new Date();
    const dateStr = [today.getDate().toString().padStart(2, '0'), (today.getMonth() + 1).toString().padStart(2, '0'), today.getFullYear()].join('.');
    data.battleApplications.unshift({
      id: newId,
      teamName,
      category,
      captainName,
      phone,
      goal,
      details,
      date: dateStr,
      status: 'review',
      statusLabel: '🟡 Модерація заявки'
    });
    this.saveData(data);
    return newId;
  },

  deleteBattleTeam(id) {
    const data = this.getData();
    if (data.battles) {
      data.battles = data.battles.filter(b => b.id !== id);
      this.saveData(data);
    }
  },

  deleteBattleApp(id) {
    const data = this.getData();
    if (data.battleApplications) {
      data.battleApplications = data.battleApplications.filter(a => a.id !== id);
      this.saveData(data);
    }
  },

    getB2bPartners() {
    return this.getData().b2bPartners || [];
  },

  getB2bApplications() {
    return this.getData().b2bApplications || [];
  },

  registerB2bApp(company, contactName, phone, email, tier, details) {
    const data = this.getData();
    if (!data.b2bApplications) data.b2bApplications = [];
    const newId = 'B2B-' + (Math.floor(Math.random() * 899) + 100);
    const today = new Date();
    const dateStr = [today.getDate().toString().padStart(2, '0'), (today.getMonth() + 1).toString().padStart(2, '0'), today.getFullYear()].join('.');
    data.b2bApplications.unshift({
      id: newId,
      company,
      contactName,
      phone,
      email,
      tier,
      details,
      date: dateStr,
      status: 'review',
      statusLabel: '🟡 Перемовини'
    });
    this.saveData(data);
    return newId;
  },

  deleteB2bPartner(id) {
    const data = this.getData();
    if (data.b2bPartners) {
      data.b2bPartners = data.b2bPartners.filter(p => p.id !== id);
      this.saveData(data);
    }
  },

  deleteB2bApp(id) {
    const data = this.getData();
    if (data.b2bApplications) {
      data.b2bApplications = data.b2bApplications.filter(a => a.id !== id);
      this.saveData(data);
    }
  },

    getPodcasts() {
    return this.getData().podcasts || [];
  },

  getPodcastQuestions() {
    return this.getData().podcastQuestions || [];
  },

  addPodcastQuestion(author, contact, question, targetGuest) {
    const data = this.getData();
    if (!data.podcastQuestions) data.podcastQuestions = [];
    const newId = 'Q-' + (Math.floor(Math.random() * 899) + 100);
    const today = new Date();
    const dateStr = [today.getDate().toString().padStart(2, '0'), (today.getMonth() + 1).toString().padStart(2, '0'), today.getFullYear()].join('.');
    data.podcastQuestions.unshift({
      id: newId,
      author,
      contact,
      question,
      targetGuest,
      date: dateStr,
      status: 'pending',
      statusLabel: '🟡 Очікує ефіру'
    });
    this.saveData(data);
    return newId;
  },

  deletePodcast(id) {
    const data = this.getData();
    if (data.podcasts) {
      data.podcasts = data.podcasts.filter(p => p.id !== id);
      this.saveData(data);
    }
  },

  deletePodcastQuestion(id) {
    const data = this.getData();
    if (data.podcastQuestions) {
      data.podcastQuestions = data.podcastQuestions.filter(q => q.id !== id);
      this.saveData(data);
    }
  },

    getSupportMessages() {
    return this.getData().supportMessages || [];
  },

  getSupportFaq() {
    return this.getData().supportFaq || [];
  },

  addSupportMessage(author, contact, subject, text) {
    const data = this.getData();
    if (!data.supportMessages) data.supportMessages = [];
    const newId = 'SUP-' + (Math.floor(Math.random() * 899) + 100);
    const today = new Date();
    const dateStr = [today.getDate().toString().padStart(2, '0'), (today.getMonth() + 1).toString().padStart(2, '0'), today.getFullYear()].join('.');
    data.supportMessages.unshift({
      id: newId,
      author,
      contact,
      subject: subject || 'Питання з Live-чату',
      text,
      date: dateStr,
      status: 'pending',
      statusLabel: '🟡 Очікує оператора',
      reply: ''
    });
    this.saveData(data);
    return newId;
  },

  answerSupportMessage(id, replyText) {
    const data = this.getData();
    if (!data.supportMessages) return;
    const msg = data.supportMessages.find(m => m.id === id);
    if (msg) {
      msg.status = 'answered';
      msg.statusLabel = '🟢 Відповіли в чаті';
      msg.reply = replyText;
      this.saveData(data);
    }
  },

  deleteSupportMessage(id) {
    const data = this.getData();
    if (data.supportMessages) {
      data.supportMessages = data.supportMessages.filter(m => m.id !== id);
      this.saveData(data);
    }
  },

  deleteApplication(id) {
    const data = this.getData();
    data.applications = data.applications?.filter(a => a.id !== id) || [];
    this.saveData(data);
  },

  getDroneSubmissions() {
    return this.getData().droneSubmissions || [];
  },

  getDroneKits() {
    return this.getData().droneKits || [];
  },

  addDroneSubmission(author, contact, kitType, serialNum, notes) {
    const data = this.getData();
    if (!data.droneSubmissions) data.droneSubmissions = [];
    const id = 'DRN-' + Math.floor(100 + Math.random() * 900);
    const today = new Date().toLocaleDateString('uk-UA');
    data.droneSubmissions.unshift({
      id, author, contact, kitType, serialNum: serialNum || ('RMS-DIY-' + Math.floor(1000 + Math.random()*9000)),
      status: 'testing', statusLabel: '🟡 На полігонному тестуванні', date: today, notes
    });
    this.saveData(data);
    return id;
  },

  updateDroneStatus(id, status) {
    const data = this.getData();
    if (!data.droneSubmissions) return;
    const item = data.droneSubmissions.find(d => d.id === id);
    if (item) {
      item.status = status;
      if (status === 'approved') item.statusLabel = '🟢 Пройшов полігон (Відправлено у ВЧ)';
      else if (status === 'testing') item.statusLabel = '🟡 На полігонному тестуванні';
      else if (status === 'rejected') item.statusLabel = '🔴 Не пройшов тест (На доопрацюванні)';
      this.saveData(data);
    }
  },

  deleteDroneSubmission(id) {
    const data = this.getData();
    if (data.droneSubmissions) {
      data.droneSubmissions = data.droneSubmissions.filter(d => d.id !== id);
      this.saveData(data);
    }
  },

  // === Blood Donors Methods ===
  getBloodDonors() {
    return this.getData().bloodDonors || [];
  },
  addBloodDonor(name, city, bloodGroup, phone) {
    const data = this.getData();
    if (!data.bloodDonors) data.bloodDonors = [];
    const id = 'BLD-' + Math.floor(100 + Math.random() * 900);
    data.bloodDonors.unshift({
      id, name, city, bloodGroup, phone, status: 'active', date: new Date().toLocaleDateString('uk-UA'), donationsCount: 1
    });
    this.saveData(data);
    return id;
  },
  deleteBloodDonor(id) {
    const data = this.getData();
    if (data.bloodDonors) {
      data.bloodDonors = data.bloodDonors.filter(d => d.id !== id);
      this.saveData(data);
    }
  },

  // === Rescued Animals Methods ===
  getAnimals() {
    return this.getData().animals || [];
  },
  adoptAnimal(id) {
    const data = this.getData();
    if (!data.animals) return;
    const pet = data.animals.find(a => a.id === id);
    if (pet) {
      pet.status = 'adopted';
      this.saveData(data);
    }
  },
  addPetDonation(id, amount) {
    const data = this.getData();
    if (!data.animals) return;
    const pet = data.animals.find(a => a.id === id);
    if (pet) {
      pet.collected += Number(amount);
      if (pet.collected >= pet.needAmount) pet.status = 'adopted';
      this.saveData(data);
    }
  },
  deleteAnimal(id) {
    const data = this.getData();
    if (data.animals) {
      data.animals = data.animals.filter(a => a.id !== id);
      this.saveData(data);
    }
  },

  // === Legal Aid Methods ===
  getLegalRequests() {
    return this.getData().legalRequests || [];
  },
  addLegalRequest(soldier, unit, category, phone, notes) {
    const data = this.getData();
    if (!data.legalRequests) data.legalRequests = [];
    const id = 'LEG-' + Math.floor(100 + Math.random() * 900);
    data.legalRequests.unshift({
      id, soldier, unit, category, phone, date: new Date().toLocaleDateString('uk-UA'),
      status: 'in_progress', statusLabel: '🟡 В роботі юриста', notes
    });
    this.saveData(data);
    return id;
  },
  updateLegalStatus(id, status) {
    const data = this.getData();
    if (!data.legalRequests) return;
    const item = data.legalRequests.find(l => l.id === id);
    if (item) {
      item.status = status;
      if (status === 'resolved') item.statusLabel = '🟢 Вирішено на користь бійця';
      else if (status === 'in_progress') item.statusLabel = '🟡 В роботі юриста';
      else if (status === 'rejected') item.statusLabel = '🔴 Відхилено / Потребує документів';
      this.saveData(data);
    }
  },
  deleteLegalRequest(id) {
    const data = this.getData();
    if (data.legalRequests) {
      data.legalRequests = data.legalRequests.filter(l => l.id !== id);
      this.saveData(data);
    }
  },

  // === User Profile Methods ===
  getUserProfile() {
    return this.getData().userProfile || INITIAL_DATA.userProfile;
  },
  addProfileDonation(action, amount) {
    const data = this.getData();
    if (!data.userProfile) data.userProfile = JSON.parse(JSON.stringify(INITIAL_DATA.userProfile));
    data.userProfile.totalDonated += Number(amount);
    data.userProfile.history.unshift({
      id: 'H-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toLocaleDateString('uk-UA'),
      action, amount: Number(amount), status: 'Успішно'
    });
    this.saveData(data);
  },

  // === Eco Defense Methods ===
  getEcoProjects() {
    return this.getData().ecoProjects || [];
  },
  addEcoDonation(id, amount) {
    const data = this.getData();
    if (!data.ecoProjects) return;
    const p = data.ecoProjects.find(x => x.id === id);
    if (p) {
      p.collected += Number(amount);
      if (p.collected >= p.needAmount) p.status = 'completed';
      this.saveData(data);
    }
  },
  deleteEcoProject(id) {
    const data = this.getData();
    if (data.ecoProjects) {
      data.ecoProjects = data.ecoProjects.filter(x => x.id !== id);
      this.saveData(data);
    }
  },

  // === Children Future Methods ===
  getChildrenRequests() {
    return this.getData().childrenRequests || [];
  },
  addChildRequest(childName, parentInfo, city, requestType, notes) {
    const data = this.getData();
    if (!data.childrenRequests) data.childrenRequests = [];
    const id = 'KID-' + Math.floor(100 + Math.random() * 900);
    data.childrenRequests.unshift({
      id, childName, parentInfo, city, requestType, date: new Date().toLocaleDateString('uk-UA'),
      status: 'in_progress', statusLabel: '🟡 В обробці координатора', notes
    });
    this.saveData(data);
    return id;
  },
  updateChildStatus(id, status) {
    const data = this.getData();
    if (!data.childrenRequests) return;
    const item = data.childrenRequests.find(c => c.id === id);
    if (item) {
      item.status = status;
      if (status === 'approved') item.statusLabel = '🟢 Запит задоволено (Надано)';
      else if (status === 'in_progress') item.statusLabel = '🟡 В процесі закупівлі';
      else if (status === 'rejected') item.statusLabel = '🔴 Відхилено';
      this.saveData(data);
    }
  },
  deleteChildRequest(id) {
    const data = this.getData();
    if (data.childrenRequests) {
      data.childrenRequests = data.childrenRequests.filter(c => c.id !== id);
      this.saveData(data);
    }
  },

  // === Energy Shield Methods ===
  getEnergyProjects() {
    return this.getData().energyProjects || [];
  },
  addEnergyDonation(id, amount) {
    const data = this.getData();
    if (!data.energyProjects) return;
    const p = data.energyProjects.find(x => x.id === id);
    if (p) {
      p.collected += Number(amount);
      if (p.collected >= p.needAmount) p.status = 'completed';
      this.saveData(data);
    }
  },
  deleteEnergyProject(id) {
    const data = this.getData();
    if (data.energyProjects) {
      data.energyProjects = data.energyProjects.filter(x => x.id !== id);
      this.saveData(data);
    }
  },

  // === Veteran Business Methods ===
  getVeteranBusinesses() {
    return this.getData().veteranBusinesses || [];
  },
  addVeteranBusiness(brand, founder, city, category, desc) {
    const data = this.getData();
    if (!data.veteranBusinesses) data.veteranBusinesses = [];
    const id = 'VET-' + Math.floor(100 + Math.random() * 900);
    data.veteranBusinesses.unshift({
      id, brand, founder, city, grantAmount: 150000, desc, category, status: 'active', img: 'honor_patron.jpg'
    });
    this.saveData(data);
    return id;
  },
  deleteVeteranBusiness(id) {
    const data = this.getData();
    if (data.veteranBusinesses) {
      data.veteranBusinesses = data.veteranBusinesses.filter(x => x.id !== id);
      this.saveData(data);
    }
  },

  // === Mobile Hospitals Methods ===
  getMobileHospitals() {
    return this.getData().mobileHospitals || [];
  },
  addHospitalDonation(id, amount) {
    const data = this.getData();
    if (!data.mobileHospitals) return;
    const h = data.mobileHospitals.find(x => x.id === id);
    if (h) {
      h.collected += Number(amount);
      if (h.collected >= h.needAmount) h.status = 'completed';
      this.saveData(data);
    }
  },
  deleteMobileHospital(id) {
    const data = this.getData();
    if (data.mobileHospitals) {
      data.mobileHospitals = data.mobileHospitals.filter(x => x.id !== id);
      this.saveData(data);
    }
  }
};

// Запуск автоматичної онлайн-синхронізації з хмарою при відкритті сайту
if (typeof window !== 'undefined' && window.FoundationStore) {
  window.FoundationStore.initOnlineSync();
}


// === УНІВЕРСАЛЬНЕ ПОЛІПШЕННЯ UX ДЛЯ ВСІЄЇ ЕКОСИСТЕМИ (ESC & Overlay Click) ===
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('div[id$="Modal"], div[id*="modal"], div[id*="Modal"]').forEach(m => {
        if (window.getComputedStyle(m).position === 'fixed' && (m.style.display === 'flex' || m.style.display === 'block')) {
          m.style.display = 'none';
        }
      });
    }
  });

  window.addEventListener('click', (e) => {
    if (e.target && e.target.id && (e.target.id.endsWith('Modal') || e.target.id.includes('modal') || e.target.id.includes('Modal'))) {
      if (window.getComputedStyle(e.target).position === 'fixed' && (e.target.style.display === 'flex' || e.target.style.display === 'block')) {
        e.target.style.display = 'none';
      }
    }
  });
}



