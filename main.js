// main.js
// Скрипт для интеграции переводов с основным контентом сайта

document.addEventListener('DOMContentLoaded', function() {
  // Загружаем переводы
  window.i18n.loadTranslations().then(() => {
    // Создаем переключатель языков
    window.i18n.createLanguageSwitcher('language-switcher-container');
    
    // Обновляем все переводы на странице
    updatePageContent();
    
    // Слушаем изменения языка
    document.addEventListener('languageChanged', () => {
      updatePageContent();
    });
  });
  
  // Функция для обновления контента страницы в соответствии с выбранным языком
  function updatePageContent() {
    // Обновляем все элементы с атрибутом data-i18n
    window.i18n.updateTranslations();
    
    // Создаем карточки кейсов
    createCaseCards();
    
    // Обновляем обработчики событий для фильтров
    setupFilters();
  }
  
  // Функция для создания карточек кейсов
  function createCaseCards() {
    const casesContainer = document.getElementById('cases-container');
    if (!casesContainer) return;
    
    // Очищаем контейнер
    casesContainer.innerHTML = '';
    
    // Получаем данные кейсов из текущего языка
    const cases = window.i18n.t('cases');
    if (!Array.isArray(cases)) return;
    
    // Создаем карточки для каждого кейса
    cases.forEach((caseData, index) => {
      const card = document.createElement('div');
      card.className = 'case-card';
      card.setAttribute('data-industry', caseData.industry.toLowerCase());
      card.setAttribute('data-ai-types', caseData.ai_types.map(t => t.toLowerCase().replace(' ', '_')).join(','));
      
      // Информация о компании
      const companyInfo = document.createElement('div');
      companyInfo.className = 'company-info';
      
      const companyName = document.createElement('div');
      companyName.className = 'company-name';
      companyName.textContent = window.i18n.getCurrentLanguage() === 'zh' ? caseData.company.name_cn : caseData.company.name_en;
      companyInfo.appendChild(companyName);
      
      const companyTags = document.createElement('div');
      companyTags.className = 'company-tags';
      
      const industryTag = document.createElement('div');
      industryTag.className = 'tag';
      industryTag.textContent = window.i18n.t(`filters.industry.${caseData.industry.toLowerCase()}`);
      companyTags.appendChild(industryTag);
      
      caseData.ai_types.forEach(type => {
        const aiTypeTag = document.createElement('div');
        aiTypeTag.className = 'tag';
        aiTypeTag.textContent = window.i18n.t(`filters.ai_type.${type.toLowerCase().replace(' ', '_')}`);
        companyTags.appendChild(aiTypeTag);
      });
      
      companyInfo.appendChild(companyTags);
      card.appendChild(companyInfo);
      
      // Содержимое кейса
      const caseContent = document.createElement('div');
      caseContent.className = 'case-content';
      
      // Бизнес-задача
      const businessTask = document.createElement('div');
      businessTask.className = 'case-section';
      
      const businessTaskLabel = document.createElement('div');
      businessTaskLabel.className = 'section-label';
      businessTaskLabel.textContent = window.i18n.t('case_structure.business_task');
      businessTask.appendChild(businessTaskLabel);
      
      const businessTaskText = document.createElement('div');
      businessTaskText.textContent = caseData.business_task;
      businessTask.appendChild(businessTaskText);
      
      caseContent.appendChild(businessTask);
      
      // Решение
      const solution = document.createElement('div');
      solution.className = 'case-section';
      
      const solutionLabel = document.createElement('div');
      solutionLabel.className = 'section-label';
      solutionLabel.textContent = window.i18n.t('case_structure.solution');
      solution.appendChild(solutionLabel);
      
      const solutionText = document.createElement('div');
      solutionText.textContent = caseData.solution;
      solution.appendChild(solutionText);
      
      caseContent.appendChild(solution);
      
      // Эффект
      const effect = document.createElement('div');
      effect.className = 'case-section';
      
      const effectLabel = document.createElement('div');
      effectLabel.className = 'section-label';
      effectLabel.textContent = window.i18n.t('case_structure.effect');
      effect.appendChild(effectLabel);
      
      const effectsList = document.createElement('ul');
      effectsList.className = 'effects-list';
      
      caseData.effects.forEach(effectItem => {
        const effectListItem = document.createElement('li');
        effectListItem.textContent = effectItem;
        effectsList.appendChild(effectListItem);
      });
      
      effect.appendChild(effectsList);
      caseContent.appendChild(effect);
      
      card.appendChild(caseContent);
      casesContainer.appendChild(card);
    });
  }
  
  // Функция для настройки фильтров
  function setupFilters() {
    // Фильтр по отрасли
    const industryButtons = document.querySelectorAll('.industry-button');
    industryButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Удаляем активный класс у всех кнопок
        industryButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем активный класс текущей кнопке
        this.classList.add('active');
        
        // Применяем фильтр
        applyFilters();
      });
    });
    
    // Фильтр по типу ИИ
    const aiTypeButtons = document.querySelectorAll('.ai-type-button');
    aiTypeButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Удаляем активный класс у всех кнопок
        aiTypeButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем активный класс текущей кнопке
        this.classList.add('active');
        
        // Применяем фильтр
        applyFilters();
      });
    });
  }
  
  // Функция для применения фильтров
  function applyFilters() {
    const selectedIndustry = document.querySelector('.industry-button.active').getAttribute('data-industry');
    const selectedAiType = document.querySelector('.ai-type-button.active').getAttribute('data-ai-type');
    
    const cards = document.querySelectorAll('.case-card');
    cards.forEach(card => {
      const cardIndustry = card.getAttribute('data-industry');
      const cardAiTypes = card.getAttribute('data-ai-types').split(',');
      
      const industryMatch = selectedIndustry === 'all' || cardIndustry === selectedIndustry;
      const aiTypeMatch = selectedAiType === 'all' || cardAiTypes.includes(selectedAiType);
      
      if (industryMatch && aiTypeMatch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
});

