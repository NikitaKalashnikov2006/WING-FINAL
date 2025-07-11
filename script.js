// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
 tg.ready();


  
 const availableScreenWidth = window.screen.availWidth;
 const availableScreenHeight = window.screen.availHeight;
 if (availableScreenWidth < 1440 && availableScreenHeight < 3220){
tg.requestFullscreen();
 }
let tonConnectUI = null;

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
  // Развертываем WebApp на весь экран
  tg.expand();
  
  // Устанавливаем данные пользователя
  setUserData();
  
  // Инициализация TON Connect (только когда нужен)
  initTonConnect();
  
  // Обработчики для кнопок навигации
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      showPage(page);
    });
  });
  
  // Обработчик для кнопки "Симулятор биржи"
  const exchangeSimulatorBtn = document.getElementById('exchangeSimulator');
  if (exchangeSimulatorBtn) {
    exchangeSimulatorBtn.addEventListener('click', () => {
      showPage('lessons');
    });
  }
  
  // Обработчик для кнопки "Пригласить друга"
  const inviteFriendBtn = document.getElementById('inviteFriend');
  if (inviteFriendBtn) {
    inviteFriendBtn.addEventListener('click', () => {
      const modal = document.getElementById('inviteModal');
      if (modal) modal.style.display = 'flex';
    });
  }
  
  // Обработчики для модального окна приглашения
  const sendInviteBtn = document.getElementById('sendInviteBtn');
  if (sendInviteBtn) {
    sendInviteBtn.addEventListener('click', sendInvite);
  }
  
  const copyInviteBtn = document.getElementById('copyInviteBtn');
  if (copyInviteBtn) {
    copyInviteBtn.addEventListener('click', copyInviteLink);
  }
  
  // Закрытие модального окна при клике вне его
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('inviteModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Обработчики для кнопок уроков
  document.querySelectorAll('.lesson-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lessonId = e.currentTarget.dataset.lesson;
      showLesson(lessonId);
    });
  });
  
  // Показываем начальную страницу из hash или home
  const hash = window.location.hash.substring(1) || 'home';
  showPage(hash);

  // Обработчик для кнопки "Подписаться" в заданиях
  const subscribeBtn = document.querySelector('.task-action-btn');
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
      const channelUsername = 'whitebirdio'; // Замените на username вашего канала
      const channelUrl = `https://t.me/${channelUsername}`;
      
      try {
        tg.openTelegramLink(channelUrl);
      } catch (error) {
        console.error('Ошибка при открытии канала:', error);
        // Fallback для случаев, когда openTelegramLink не работает
        window.open(channelUrl, '_blank');
      }
    });
  }
});

// Функция для установки данных пользователя
function setUserData() {
  const user = tg.initDataUnsafe.user;
  if (user) {
    // Устанавливаем аватар
    const avatarContainer = document.querySelector('.user-avatar');
    if (user.photo_url) {
      avatarContainer.src = user.photo_url;
    } else {
      avatarContainer.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    }
    
    // Устанавливаем имя пользователя
    const userNameElement = document.querySelector('.userName');
    if (user.username) {
      userNameElement.textContent = `@${user.username}`;
    } else if (user.first_name || user.last_name) {
      userNameElement.textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    } else {
      userNameElement.textContent = 'Пользователь';
    }
  }
}

// Функция показа страницы
function showPage(page) {
  // Скрываем все страницы
  document.querySelectorAll('.page').forEach(p => {
    p.classList.add('hidden-page');
    p.classList.remove('active-page');
  });
  
  // Показываем выбранную страницу
  const activePage = document.getElementById(`${page}-page`);
  if (activePage) {
    activePage.classList.remove('hidden-page');
    activePage.classList.add('active-page');
  } else {
    // Если страница не найдена, показываем home
    document.getElementById('home-page').classList.remove('hidden-page');
    document.getElementById('home-page').classList.add('active-page');
    page = 'home';
  }
  
  // Обновляем активную кнопку в навигации
  updateActiveButton(page);
  
  // Обновляем URL
  history.pushState({ page }, "", `#${page}`);
  
  // Если показываем кошелёк, инициализируем TON Connect
  if (page === 'wallet') {
    initTonConnect();
  }
  
  // Загружаем список рефералов для страницы друзей
  if (page === 'friends') {
    loadReferralsList();
  }
}

// Функция для отображения урока
// Обновите функцию showLesson
function showLesson(lessonId) {
  // Скрываем список уроков
  document.querySelector('.lessons-list').classList.add('hidden-page');
  
  // Показываем контейнер с контентом урока
  const lessonContent = document.getElementById('lesson-content-container');
  lessonContent.classList.remove('hidden-page');
  
  // Загружаем контент урока
  loadLessonContent(lessonId);
}

// Новая функция для загрузки контента урока
// Обновленная функция для загрузки контента урока
function loadLessonContent(lessonId) {
  const lessonContent = {
    lesson1: {
      title: "Основы криптовалют",
      text: `
        <h3>Что такое криптовалюта?</h3>
        <p>Криптовалюта - это цифровые деньги, которые используют криптографию для защиты транзакций и контроля создания новых единиц.</p>
        
        <h3>Основные преимущества:</h3>
        <ul>
          <li>Децентрализация - нет единого центра управления</li>
          <li>Анонимность - транзакции псевдоанонимны</li>
          <li>Безопасность - защищены криптографией</li>
          <li>Глобальность - доступны по всему миру</li>
        </ul>
        
        <h3>Популярные криптовалюты:</h3>
        <ol>
          <li>Bitcoin (BTC) - первая и самая известная</li>
          <li>Ethereum (ETH) - платформа для смарт-контрактов</li>
          <li>TON - быстрая и масштабируемая блокчейн-платформа</li>
        </ol>
      `
    },
    lesson2: {
      title: "Кошельки и безопасность",
      text: `
        <h3>Виды криптокошельков:</h3>
        <ul>
          <li>Горячие кошельки (онлайн)</li>
          <li>Холодные кошельки (оффлайн)</li>
          <li>Аппаратные кошельки</li>
          <li>Бумажные кошельки</li>
        </ul>
        
        <h3>Как защитить свои активы:</h3>
        <ol>
          <li>Никому не сообщайте seed-фразу</li>
          <li>Используйте двухфакторную аутентификацию</li>
          <li>Проверяйте адреса при переводе</li>
          <li>Храните большую часть средств в холодных кошельках</li>
        </ol>
        
        <p>Помните: в криптомире вы сами отвечаете за свою безопасность!</p>
      `
    },
    lesson3: {
      title: "Торговля на бирже",
      text: `
        <h3>Основы торговли криптовалютами:</h3>
        <p>Криптобиржи - это платформы, где можно покупать и продавать цифровые активы.</p>
        
        <h3>Основные типы ордеров:</h3>
        <ul>
          <li>Рыночный - покупка/продажа по текущей цене</li>
          <li>Лимитный - по указанной цене</li>
          <li>Стоп-лосс - для ограничения убытков</li>
        </ul>
        
        <h3>Советы для начинающих:</h3>
        <ol>
          <li>Начинайте с небольших сумм</li>
          <li>Диверсифицируйте портфель</li>
          <li>Не поддавайтесь FOMO (страху упущенной выгоды)</li>
          <li>Изучайте технический анализ</li>
        </ol>
      `
    },
    // Остальные уроки остаются без изменений
    lesson4: {
      title: "Выбор кошелька",
      text: `
        <p>Создание собственного бизнеса - один из способов достижения финансовой независимости.</p>
        <h3>Этапы создания бизнеса:</h3>
        <ol>
          <li>Идея и анализ рынка</li>
          <li>Бизнес-план</li>
          <li>Регистрация</li>
          <li>Запуск и продвижение</li>
        </ol>
        <p>Важно начинать с малого и масштабироваться постепенно.</p>
      `
    },
    lesson5: {
      title: "Безопасность",
      text: `
        <p>Создание собственного бизнеса - один из способов достижения финансовой независимости.</p>
        <h3>Этапы создания бизнеса:</h3>
        <ol>
          <li>Идея и анализ рынка</li>
          <li>Бизнес-план</li>
          <li>Регистрация</li>
          <li>Запуск и продвижение</li>
        </ol>
        <p>Важно начинать с малого и масштабироваться постепенно.</p>
      `
    }
  };

  // Устанавливаем заголовок и текст урока
  document.getElementById('lesson-title').textContent = lessonContent[lessonId].title;
  document.getElementById('lesson-text').innerHTML = lessonContent[lessonId].text;

  // Создаем кнопки навигации по урокам
  const lessonContainer = document.getElementById('lesson-content-container');
  
  // Удаляем старые кнопки, если они есть
  const oldNav = document.querySelector('.lesson-navigation');
  if (oldNav) oldNav.remove();
  
  // Создаем контейнер для кнопок навигации
  const navDiv = document.createElement('div');
  navDiv.className = 'lesson-navigation';
  
  // Создаем контейнер для кнопок вперед/назад
  const navButtonsDiv = document.createElement('div');
  navButtonsDiv.className = 'nav-buttons-row';
  
  // Кнопка "Предыдущий урок" (если есть предыдущий урок)
  const currentLessonNum = parseInt(lessonId.replace('lesson', ''));
  if (currentLessonNum > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn prev-btn';
    prevBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Предыдущий';
    prevBtn.addEventListener('click', () => {
      showLesson(`lesson${currentLessonNum - 1}`);
    });
    navButtonsDiv.appendChild(prevBtn);
  }
  
  // Кнопка "Следующий урок" (если есть следующий урок)
  if (currentLessonNum < 5) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn next-btn';
    nextBtn.innerHTML = 'Следующий <i class="fas fa-arrow-right"></i>';
    nextBtn.addEventListener('click', () => {
      showLesson(`lesson${currentLessonNum + 1}`);
    });
    navButtonsDiv.appendChild(nextBtn);
  }
  
  // Кнопка "Назад к урокам"
  const backBtn = document.createElement('button');
  backBtn.className = 'nav-btn back-btn';
  backBtn.innerHTML = '<i class="fas fa-list"></i> Вернуться к списку';
  backBtn.addEventListener('click', () => {
    document.querySelector('.lessons-list').classList.remove('hidden-page');
    document.getElementById('lesson-content-container').classList.add('hidden-page');
  });
  
  navDiv.appendChild(navButtonsDiv);
  
  // Добавляем кнопку "Назад" на новую строку
  const backBtnRow = document.createElement('div');
  backBtnRow.className = 'back-btn-row';
  backBtnRow.appendChild(backBtn);
  navDiv.appendChild(backBtnRow);
  
  lessonContainer.appendChild(navDiv);
}

// Добавьте обработчик для кнопки "Назад" в DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // ... существующий код ...

  // Обработчик для кнопки "Назад" в уроках
  const backToLessonsBtn = document.getElementById('back-to-lessons');
  if (backToLessonsBtn) {
    backToLessonsBtn.addEventListener('click', () => {
      document.querySelector('.lessons-list').classList.remove('hidden-page');
      document.getElementById('lesson-content-container').classList.add('hidden-page');
    });
  }
});

// Функция для отправки приглашения
function sendInvite() {
    try {
  const userId = tg.initDataUnsafe.user?.id || '0';
    const botUsername = 'Business_shop_bot';
    const appName = 'WHITE_WING';
    
    const refLink = `https://t.me/${botUsername}/${appName}`;
    const shareText = `🚀 Присоединяйся к проекту WING!`;
    
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(shareText)}`;
    
    console.log('Отправляем ссылку:', shareUrl);
    
    tg.openTelegramLink(shareUrl);
    
  } catch (error) {
    console.error('Ошибка:', error);
    tg.showAlert(`Скопируйте ссылку вручную:\nhttps://t.me/${botUsername}/${appName}`);
  }}

  // Закрываем модальное окно
  const modal = document.getElementById('inviteModal');
  if (modal) modal.style.display = 'none';

// Функция для копирования ссылки приглашения
function copyInviteLink() {
  const userId = tg.initDataUnsafe.user?.id || '0';
  const botUsername = 'Business_shop_bot';
  const appName = 'WHITE_WING';
  const refLink = `https://t.me/${botUsername}/${appName}?startapp=ref_${userId}`;
  
  navigator.clipboard.writeText(refLink).then(() => {
    showCopiedNotification();
  }).catch(err => {
    console.error('Не удалось скопировать ссылку:', err);
    // Fallback для старых браузеров
    const textarea = document.createElement('textarea');
    textarea.value = refLink;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopiedNotification();
  });
  
  // Закрываем модальное окно
  const modal = document.getElementById('inviteModal');
  if (modal) modal.style.display = 'none';
}

// Функция для показа уведомления "Скопировано!"
function showCopiedNotification() {
  const notification = document.createElement('div');
  notification.className = 'copied-notification';
  notification.textContent = 'Скопировано!';
  document.body.appendChild(notification);
  
  // Удаляем уведомление через 2 секунды
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 2000);
}

// Функция для загрузки списка рефералов
function loadReferralsList() {
  const referralsContainer = document.getElementById('referralsContainer');
  if (!referralsContainer) return;

  // Здесь должен быть запрос к вашему бэкенду
  // Для демонстрации используем пустой список
  const referrals = [
    { username: 'user1', profit: 15.50 },
    { username: 'user2', profit: 8.20 },
    { username: 'user3', profit: 3.75 },
    { username: 'user4', profit: 3.75 },
    { username: 'user5', profit: 3.75 },
    { username: 'user6', profit: 3.75 },
    { username: 'user7', profit: 3.75 },
    { username: 'user8', profit: 3.75 },
    { username: 'user9', profit: 3.75 },
    { username: 'user9', profit: 3.75 }
  ];
  
  // Очищаем контейнер
  referralsContainer.innerHTML = '';
  
  if (referrals.length === 0) {
    referralsContainer.innerHTML = '<div class="empty-list">Пока нет приглашённых друзей</div>';
    return;
  }
  
  // Добавляем рефералов в список
  referrals.forEach(ref => {
    const referralItem = document.createElement('div');
    referralItem.className = 'referral-item';
    referralItem.innerHTML = `
      <span class="referral-username">@${ref.username}</span>
      <span class="referral-profit">+${ref.profit.toFixed(2)}</span>
    `;
    referralsContainer.appendChild(referralItem);
  });
  
  // Обновляем статистику
  updateReferralStats(referrals);
}

// Функция для обновления статистики рефералов
function updateReferralStats(referrals) {
  const totalReferrals = referrals.length;
  const totalProfit = referrals.reduce((sum, ref) => sum + ref.profit, 0);
  
  const statItems = document.querySelectorAll('.stat-item .stat-value');
  if (statItems.length >= 2) {
    statItems[0].textContent = totalReferrals;
    statItems[1].textContent = totalProfit.toFixed(2);
  }
}

// Функция для обновления активной кнопки
function updateActiveButton(page) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Инициализация TON Connect
function initTonConnect() {
  if (!tonConnectUI && document.getElementById('ton-connect')) {
    tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: 'https://nikitakalashnikov2006.github.io/shop/manifest-tonconnect.json',
      buttonRootId: 'ton-connect',
      uiOptions: {
        twaReturnUrl: 'https://t.me/Business_shop_bot/wing'
      }
    });

    const sendBtn = document.getElementById('send-btn');
    const amountInput = document.getElementById('amount');
    const amountError = document.getElementById('amount-error');

    function isValidNumber(value) {
      if (value === '' || value === '.') return false;
      const num = parseFloat(value);
      return !isNaN(num) && isFinite(num) && num > 0;
    }

    function updateButtonState() {
      const isConnected = tonConnectUI && tonConnectUI.wallet;
      const isValid = isValidNumber(amountInput.value);
      sendBtn.disabled = !isConnected || !isValid;
    }

    amountInput.addEventListener('input', function(e) {
      let value = e.target.value;
      value = value
        .replace(/[^0-9.,]/g, '')
        .replace(/,/g, '.');
      
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      
      e.target.value = value;
      
      if (isValidNumber(value)) {
        amountInput.classList.remove('error');
        amountError.style.display = 'none';
      } else {
        amountInput.classList.add('error');
        amountError.style.display = 'block';
      }
      
      updateButtonState();
    });

    if (tonConnectUI) {
      tonConnectUI.onStatusChange((wallet) => {
        updateButtonState();
      });
    }

    sendBtn.addEventListener('click', async () => {
      const amount = parseFloat(amountInput.value);
      
      if (!isValidNumber(amountInput.value)) {
        amountInput.classList.add('error');
        amountError.style.display = 'block';
        return;
      }

      const nanotons = Math.round(amount * 1000000000).toString();

      try {
        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 300,
          messages: [
            {
              address: "0QD0LFy2lUH2LXI6y9-Xl9Ao6ZkEdgwpd-91V828VVFGrCzG",
              amount: nanotons
            }
          ]
        };

        await tonConnectUI.sendTransaction(transaction);
      } catch (error) {
        console.error('Transaction error:', error);
      }
    });

    updateButtonState();
    amountInput.dispatchEvent(new Event('input'));
  }
}

// Обработка кнопки "Назад"
window.addEventListener("popstate", (e) => {
  if (e.state?.page) {
    showPage(e.state.page);
  }
});
