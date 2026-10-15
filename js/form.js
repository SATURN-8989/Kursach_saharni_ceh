// Генерация уникального request_id по Разделу 6.1 ТЗ (вид REQ- + UUID)
function generateRequestId() {
    return 'REQ-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Перехват и сохранение UTM-меток из URL в sessionStorage (Раздел 6.3 ТЗ)
function captureUtmTags() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmTags = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
    
    utmTags.forEach(tag => {
        if (urlParams.has(tag)) {
            sessionStorage.setItem(tag, urlParams.get(tag));
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    captureUtmTags(); // Ловим UTM-метки сразу при загрузке страницы

    const orderForm = document.getElementById('orderForm');
    if (!orderForm) return;

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = orderForm.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Блокируем кнопку на время отправки заказа

        // Собираем все данные из формы и памяти браузера строго по ТЗ
        const formData = {
            request_id: generateRequestId(),
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value || "",
            cake_type: document.getElementById('cake_type').value,
            weight_kg: parseFloat(document.getElementById('weight_kg').value),
            event_date: document.getElementById('event_date').value,
            // Достаем скрытые UTM из sessionStorage (если их нет, ставим дефолт по ТЗ)
            utm_source: sessionStorage.getItem('utm_source') || 'direct',
            utm_medium: sessionStorage.getItem('utm_medium') || 'none',
            utm_campaign: sessionStorage.getItem('utm_campaign') || 'not_set',
            utm_content: sessionStorage.getItem('utm_content') || 'not_set'
        };

        // Сюда мы вставим ссылку, которую получим из Google Таблицы чуть позже
        const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbzalSLpm1hMLCop7zjp16IsCUJOanOeAFxGmtSzGXIL8WjEgs66Kl7kWEbQCThM9NYx5Q/exec';


        try {
            await fetch(googleScriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Специфика работы с Google Apps Script
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // Запускаем отправку успешного события generate_lead в GA4
            if (typeof trackLeadSuccess === 'function') {
                trackLeadSuccess(formData.cake_type, formData.weight_kg, 0); 
            }

            // Перенаправляем клиента на страницу «Спасибо»
            window.location.href = `thanks.html?req_id=${formData.request_id}`;

        } catch (error) {
            console.error('Ошибка отправки на сервер:', error);
            submitButton.disabled = false; // Разблокируем кнопку при ошибке
            
            // Отправляем событие ошибки в аналитику
            if (typeof trackFormError === 'function') {
                trackFormError('server', 'server_error');
            }
            alert('Не удалось отправить заказ. Пожалуйста, попробуйте еще раз.');
        }
    });
});
