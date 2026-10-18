window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Подключение нового чистого потока Сахарного Цеха с режимом отладки
gtag('config', 'G-0XKMVETGS2', { 'debug_mode': true });

document.addEventListener('DOMContentLoaded', () => {
    // Отслеживание кликов по элементам с data-event
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-event]');
        if (!target) return;
        
        const eventName = target.getAttribute('data-event');
        let params = {};
        
        for (let attr of target.attributes) {
            if (attr.name.startsWith('data-param-')) {
                const paramName = attr.name.replace('data-param-', '').replace(/-/g, '_');
                params[paramName] = attr.value;
            }
        }
        gtag('event', eventName, params);
    });
});

function trackLeadSuccess(cakeType, weight, value) {
    gtag('event', 'generate_lead', {
        'lead_cake_type': cakeType,
        'weight_kg': parseFloat(weight),
        'value': parseFloat(value),
        'currency': 'RUB'
    });
}

function trackFormError(fieldName, errorType) {
    gtag('event', 'form_error', {
        'field_name': fieldName,
        'error_type': errorType
    });
}
