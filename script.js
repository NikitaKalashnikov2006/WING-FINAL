// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
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
  
  // Обработчик для кнопки "Подписаться" в заданиях
  const subscribeBtn = document.querySelector('.task-action-btn');
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
      const channelUrl = 'https://t.me/whitebirdio';
      if (tg?.openTelegramLink) {
        tg.openTelegramLink(channelUrl);
      } else {
        window.open(channelUrl, '_blank');
      }
    });
  }
  
  // Показываем начальную страницу из hash или home
  const hash = window.location.hash.substring(1) || 'home';
  showPage(hash);
});

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
}

// Функция для отображения урока
function showLesson(lessonId) {
  // Скрываем список уроков
  document.querySelector('.lessons-list').classList.add('hidden-page');
  
  // Показываем контейнер с контентом урока
  const lessonContent = document.getElementById('lesson-content-container');
  lessonContent.classList.remove('hidden-page');
  
  // Загружаем контент урока
  loadLessonContent(lessonId);
}

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
  navDiv.appendChild(backBtn);
  lessonContainer.appendChild(navDiv);
}

// Функция для отправки приглашения
function sendInvite() {
  try {
    const botUsername = 'Business_shop_bot';
    const appName = 'WING';
    const refLink = `https://t.me/${botUsername}/${appName}`;
    const shareText = `🚀 Присоединяйся к проекту WING!`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(shareText)}`;
    
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert(`Скопируйте ссылку вручную:\nhttps://t.me/Business_shop_bot/wing`);
  }
  
  // Закрываем модальное окно
  const modal = document.getElementById('inviteModal');
  if (modal) modal.style.display = 'none';
}

// Функция для копирования ссылки приглашения
function copyInviteLink() {
  const botUsername = 'Business_shop_bot';
  const appName = 'wing';
  const refLink = `https://t.me/${botUsername}/${appName}`;
  
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
let tonConnectUI = null;
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
