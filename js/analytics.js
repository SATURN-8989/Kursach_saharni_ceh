// Инициализация Google Analytics 4 с твоим реальным ID
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Подключаем конфигурацию потока с флагом отладки по Разделу 4.6 ТЗ
gtag('config', 'G-7R5BK0MY69', { 'debug_mode': true });

document.addEventListener('DOMContentLoaded', () => {
    // Автоматическое отслеживание кликов по элементам с data-event (Раздел 4.3 ТЗ)
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-event]');
        if (!target) return;
        
        const eventName = target.getAttribute('data-event');
        let params = {};
        
        // Собираем все параметры разметки, начинающиеся с data-param-
        for (let attr of target.attributes) {
            if (attr.name.startsWith('data-param-')) {
                const paramName = attr.name.replace('data-param-', '').replace(/-/g, '_');
                params[paramName] = attr.value;
            }
        }
        
        // Отправка кастомного события в GA4
        gtag('event', eventName, params);
    });
});

// Функция для отправки ключевого события generate_lead (Раздел 4.2 и 4.3 ТЗ)
function trackLeadSuccess(cakeType, weight, value) {
    gtag('event', 'generate_lead', {
        'lead_cake_type': cakeType,
        'weight_kg': parseFloat(weight),
        'value': parseFloat(value),
        'currency': 'RUB'
    });
}

// Функция для отправки кастомного события ошибки формы form_error (Раздел 4.2 ТЗ)
function trackFormError(fieldName, errorType) {
    gtag('event', 'form_error', {
        'field_name': fieldName,
        'error_type': errorType
    });
}
