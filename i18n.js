// i18n.js
// Модуль для управления многоязычностью

window.i18n = (function() {
  // Доступные языки
  const AVAILABLE_LANGUAGES = ['ru', 'en', 'zh'];
  
  // Язык по умолчанию
  const DEFAULT_LANGUAGE = 'ru';
  
  // Текущий язык
  let currentLanguage = localStorage.getItem('language') || DEFAULT_LANGUAGE;
  
  // Переводы
  let translations = {};
  
  // Загрузка переводов
  async function loadTranslations() {
    try {
      // Добавляем параметр версии для предотвращения кэширования
      const cacheVersion = new Date().getTime();
      
      // Загружаем переводы для всех языков (файлы в корне репозитория)
      const promises = AVAILABLE_LANGUAGES.map(lang => 
        fetch(`${lang}.json?v=${cacheVersion}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load ${lang} translations`);
            }
            return response.json();
          })
          .then(data => {
            translations[lang] = data;
          })
          .catch(error => {
            console.error(`Error loading ${lang} translations:`, error);
          })
      );
      
      await Promise.all(promises);
      
      // Проверяем, что текущий язык загружен
      if (!translations[currentLanguage]) {
        console.warn(`Translations for ${currentLanguage} not loaded, falling back to ${DEFAULT_LANGUAGE}`);
        currentLanguage = DEFAULT_LANGUAGE;
      }
      
      return true;
    } catch (error) {
      console.error('Error loading translations:', error);
      return false;
    }
  }
  
  // Получение перевода по ключу
  function t(key) {
    // Если ключ не указан, возвращаем пустую строку
    if (!key) return '';
    
    // Если переводы не загружены, возвращаем ключ
    if (!translations[currentLanguage]) return key;
    
    // Разбиваем ключ на части (например, 'header.title' -> ['header', 'title'])
    const parts = key.split('.');
    
    // Ищем перевод в дереве переводов
    let translation = translations[currentLanguage];
    for (const part of parts) {
      if (!translation || !translation[part]) {
        // Если перевод не найден, возвращаем ключ
        return key;
      }
      translation = translation[part];
    }
    
    return translation;
  }
  
  // Обновление переводов на странице
  function updateTranslations() {
    // Обновляем все элементы с атрибутом data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = t(key);
      if (translation) {
        element.textContent = translation;
      }
    });
    
    // Обновляем все элементы с атрибутом data-i18n-placeholder
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = t(key);
      if (translation) {
        element.setAttribute('placeholder', translation);
      }
    });
    
    // Обновляем все элементы с атрибутом data-i18n-title
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = t(key);
      if (translation) {
        element.setAttribute('title', translation);
      }
    });
  }
  
  // Создание переключателя языков
  function createLanguageSwitcher(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Добавляем заголовок
    const title = document.createElement('span');
    title.textContent = t('language_selector.title');
    container.appendChild(title);
    
    // Добавляем кнопки для каждого языка
    AVAILABLE_LANGUAGES.forEach(lang => {
      const button = document.createElement('button');
      button.textContent = t(`language_selector.${lang}`);
      button.className = lang === currentLanguage ? 'active' : '';
      button.addEventListener('click', () => {
        setLanguage(lang);
      });
      container.appendChild(button);
    });
  }
  
  // Установка языка
  function setLanguage(lang) {
    if (!AVAILABLE_LANGUAGES.includes(lang)) {
      console.warn(`Language ${lang} is not available`);
      return;
    }
    
    // Сохраняем выбранный язык
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Обновляем атрибут lang у html
    document.documentElement.lang = lang;
    
    // Обновляем переводы на странице
    updateTranslations();
    
    // Генерируем событие изменения языка
    const event = new CustomEvent('languageChanged', { detail: { language: lang } });
    document.dispatchEvent(event);
  }
  
  // Получение текущего языка
  function getCurrentLanguage() {
    return currentLanguage;
  }
  
  // Публичный API
  return {
    AVAILABLE_LANGUAGES,
    loadTranslations,
    t,
    updateTranslations,
    createLanguageSwitcher,
    setLanguage,
    getCurrentLanguage,
    translations
  };
})();

