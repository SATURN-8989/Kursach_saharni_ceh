document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    if (!orderForm) return;

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = true;

        // Поиск элементов на странице с защитой от null
        const nameEl = document.getElementById('name');
        const phoneEl = document.getElementById('phone');
        const emailEl = document.getElementById('email');
        const cakeTypeEl = document.getElementById('cakeType') || document.getElementById('cake_type');
        const cakeWeightEl = document.getElementById('cakeWeight') || document.getElementById('weight');
        const dateEl = document.getElementById('date');

        // Сбор UTM-меток из sessionStorage
        const utmSource = sessionStorage.getItem('utm_source') || 'direct';
        const utmMedium = sessionStorage.getItem('utm_medium') || 'none';
        const utmCampaign = sessionStorage.getItem('utm_campaign') || 'none';

        // Генерация уникального request_id
        const timestamp = Date.now();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const requestId = `REQ-${timestamp}-${randomNum}`;

        // Сбор данных в объект
        const formData = {
            request_id: requestId,
            created_at: new Date().toISOString(),
            name: nameEl ? nameEl.value : 'Не указано',
            phone: phoneEl ? phoneEl.value : 'Не указано',
            email: emailEl ? emailEl.value : 'Не указано',
            cake_type: cakeTypeEl ? cakeTypeEl.value : 'CUSTOM',
            weight_kg: cakeWeightEl ? cakeWeightEl.value : '1.5',
            date: dateEl ? dateEl.value : '',
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            status: 'new'
        };

        // Сохраняем ID заявки, чтобы thanks.html мог его показать
        sessionStorage.setItem('last_request_id', requestId);

        try {
            // URL твоей Google Таблицы из Главы 3
            const webAppUrl = 'https://google.com'; 

            const response = await fetch(webAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Отправляем успешное событие в нашу новую аналитику GA4
            if (typeof trackLeadSuccess === 'function') {
                trackLeadSuccess(formData.cake_type, formData.weight_kg, parseFloat(formData.weight_kg) * 2400);
            }

            // Перенаправление на страницу спасибо по ТЗ
            window.location.href = `thanks.html?req_id=${requestId}`;

        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            if (typeof trackFormError === 'function') {
                trackFormError('server', 'server_error');
            }
            alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже.');
            if (submitBtn) submitBtn.disabled = false;
        }
    });
});
