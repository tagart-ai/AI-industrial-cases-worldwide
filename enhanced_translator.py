#!/usr/bin/env python3
"""
GitHub-совместимая версия системы автоперевода
Работает с файлами ru.json, en.json, zh.json в корне репозитория
"""

import json
import os

class GitHubTranslator:
    """Переводчик для GitHub репозитория"""
    
    def __init__(self):
        # Полные переводы кейсов (сокращенная версия для GitHub)
        self.case_translations = {
            # Основные переводы интерфейса
            "ИИ в промышленности": {
                "en": "AI in Industry",
                "zh": "工业人工智能"
            },
            "Примеры использования искусственного интеллекта в B2B и B2C": {
                "en": "Examples of artificial intelligence use in B2B and B2C",
                "zh": "人工智能在B2B和B2C中的应用示例"
            },
            "Язык:": {
                "en": "Language:",
                "zh": "语言:"
            },
            "Исследование реальных примеров применения искусственного интеллекта (машинное обучение, компьютерное зрение, LLM) в металлургии, сельском хозяйстве, логистике, горнодобывающей промышленности, здравоохранении, текстиле, промышленном производстве и машиностроении.": {
                "en": "Research of real examples of artificial intelligence application (machine learning, computer vision, LLM) in metallurgy, agriculture, logistics, mining, healthcare, textile, manufacturing, and machinery industries.",
                "zh": "研究人工智能（机器学习、计算机视觉、LLM）在冶金、农业、物流、采矿、医疗保健、纺织、制造业和机械制造业的实际应用示例。"
            },
            
            # Фильтры
            "Фильтр по отрасли:": {"en": "Filter by industry:", "zh": "按行业筛选:"},
            "Все отрасли": {"en": "All industries", "zh": "所有行业"},
            "Металлургия": {"en": "Metallurgy", "zh": "冶金"},
            "Сельское хозяйство": {"en": "Agriculture", "zh": "农业"},
            "Логистика": {"en": "Logistics", "zh": "物流"},
            "Горнодобывающая промышленность": {"en": "Mining", "zh": "采矿业"},
            "Здравоохранение": {"en": "Healthcare", "zh": "医疗保健"},
            "Текстиль": {"en": "Textile", "zh": "纺织"},
            "Промышленное производство": {"en": "Manufacturing", "zh": "制造业"},
            "Машиностроение": {"en": "Machinery", "zh": "机械制造"},
            
            "Фильтр по типу ИИ:": {"en": "Filter by AI type:", "zh": "按AI类型筛选:"},
            "Все типы": {"en": "All types", "zh": "所有类型"},
            "Машинное обучение": {"en": "Machine Learning", "zh": "机器学习"},
            "Компьютерное зрение": {"en": "Computer Vision", "zh": "计算机视觉"},
            "Языковые модели": {"en": "Language Models", "zh": "语言模型"},
            
            # Структура кейсов
            "Бизнес-задача:": {"en": "Business task:", "zh": "业务任务:"},
            "Решение:": {"en": "Solution:", "zh": "解决方案:"},
            "Эффект:": {"en": "Effect:", "zh": "效果:"},
            
            # Переводы кейсов
            "Оптимизация производственных процессов и создание первого в сталелитейной отрасли Китая вычислительного центра ИИ": {
                "en": "Optimization of production processes and creation of China's first AI computing center in the steel industry",
                "zh": "优化生产流程并创建中国钢铁行业首个人工智能计算中心"
            },
            "Повышение точности прогнозирования на 5%": {
                "en": "Prediction accuracy increased by 5%",
                "zh": "预测准确率提高5%"
            },
            "Снижение использования гербицидов на 60-70%": {
                "en": "Reduction of herbicide use by 60-70%",
                "zh": "除草剂使用量减少60-70%"
            },
            "Повышение урожайности на 10-15%": {
                "en": "Yield increase by 10-15%",
                "zh": "产量提高10-15%"
            },
            "Существенное снижение уровня бракованной продукции": {
                "en": "Significant reduction in defective product levels",
                "zh": "显著降低次品率"
            },
            "Повышение точности работ и снижение риска ошибок": {
                "en": "Increased work accuracy and reduced risk of errors",
                "zh": "提高工作准确性并降低错误风险"
            },
            "Снижение простоев до 30%": {
                "en": "Downtime reduction up to 30%",
                "zh": "停机时间减少高达30%"
            },
            "Экологически чистое земледелие": {
                "en": "Environmentally friendly farming",
                "zh": "环保农业"
            }
        }
    
    def translate_text(self, text: str, target_lang: str) -> str:
        """Переводит текст"""
        if not text or not text.strip():
            return text
        
        # Проверяем прямые переводы
        if text in self.case_translations:
            return self.case_translations[text].get(target_lang, text)
        
        # Переводим счетчики
        import re
        counter_pattern = r'(\d+)\s*(кейс[а-я]*)\s*из\s*(\d+)\s*(отрасл[а-я]*)'
        counter_match = re.match(counter_pattern, text)
        if counter_match:
            cases_num, _, industries_num, _ = counter_match.groups()
            if target_lang == "en":
                return f"{cases_num} cases from {industries_num} industries"
            elif target_lang == "zh":
                return f"来自{industries_num}个行业的{cases_num}个案例"
        
        return text
    
    def translate_dict(self, data: dict, target_lang: str) -> dict:
        """Рекурсивно переводит словарь"""
        translated = {}
        
        for key, value in data.items():
            if isinstance(value, dict):
                translated[key] = self.translate_dict(value, target_lang)
            elif isinstance(value, list):
                translated[key] = [
                    self.translate_text(item, target_lang) if isinstance(item, str) else item
                    for item in value
                ]
            elif isinstance(value, str):
                translated[key] = self.translate_text(value, target_lang)
            else:
                translated[key] = value
        
        return translated
    
    def create_translation(self, source_file: str, target_lang: str, output_file: str):
        """Создает перевод файла"""
        with open(source_file, 'r', encoding='utf-8') as f:
            source_data = json.load(f)
        
        translated_data = {}
        
        for key, value in source_data.items():
            if isinstance(value, dict):
                translated_data[key] = self.translate_dict(value, target_lang)
            elif isinstance(value, list):
                # Для массива кейсов
                translated_data[key] = []
                for item in value:
                    if isinstance(item, dict):
                        translated_data[key].append(self.translate_dict(item, target_lang))
                    else:
                        translated_data[key].append(item)
            elif isinstance(value, str):
                translated_data[key] = self.translate_text(value, target_lang)
            else:
                translated_data[key] = value
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=2)
        
        return len(translated_data.get('cases', []))

def main():
    """Основная функция для GitHub Action"""
    print("🤖 GitHub Auto-Translator")
    print("=" * 40)
    
    translator = GitHubTranslator()
    
    # Файлы в корне репозитория
    source_file = "ru.json"
    
    if not os.path.exists(source_file):
        print(f"❌ Файл {source_file} не найден")
        return
    
    try:
        # Создаем английский перевод
        en_cases = translator.create_translation(source_file, "en", "en.json")
        print(f"✅ Обновлен en.json ({en_cases} кейсов)")
        
        # Создаем китайский перевод
        zh_cases = translator.create_translation(source_file, "zh", "zh.json")
        print(f"✅ Обновлен zh.json ({zh_cases} кейсов)")
        
        print("🎉 Автоперевод завершен!")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        exit(1)

if __name__ == "__main__":
    main()

