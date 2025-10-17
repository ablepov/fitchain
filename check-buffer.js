// Простая проверка буферного механизма через прямой браузерный доступ
const { chromium } = require('playwright');

async function checkBuffer() {
  console.log('🚀 Открываем браузер...');
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();

  try {
    console.log('🌐 Переходим на приложение...');
    await page.goto('http://localhost:3000');

    console.log('🔍 Проверяем наличие кнопки входа...');
    const loginButton = page.locator('button').filter({ hasText: 'Войти' }).first();
    await loginButton.waitFor({ timeout: 10000 });

    console.log('🔐 Нажимаем кнопку входа...');
    await loginButton.click();
    await page.waitForURL(/.*auth.*/, { timeout: 10000 });

    console.log('📝 Вводим данные для входа...');
    await page.fill('input[type="email"]', 'ablepov@gmail.com');
    await page.fill('input[type="password"]', 'qazZAQ54321!');
    await page.click('button[type="submit"]');

    console.log('⏳ Ждем перенаправления после входа...');
    await page.waitForURL(/.*/, { timeout: 10000 }); // Ждем любой URL после входа

    console.log('🏋️ Проверяем наличие упражнений...');
    const createButton = page.locator('text=Создать базовые (3)');
    await createButton.waitFor({ timeout: 10000 });

    console.log('⚙️ Создаем базовые упражнения...');
    await createButton.click();

    console.log('📋 Ждем появления упражнений...');
    await page.waitForSelector('text=pullups', { timeout: 10000 });

    console.log('🎯 Выбираем упражнение pullups...');
    await page.click('text=pullups');

    console.log('🔍 Анализируем кнопки в упражнении...');
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log(`Найдено ${buttonCount} кнопок`);

    // Показываем информацию о всех кнопках
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      console.log(`Кнопка ${i}: "${text}" (видима: ${isVisible})`);
    }

    // Ищем кнопку с числом
    let targetButton = null;
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();

      if (text && /^\+[0-9]+$/.test(text)) {
        targetButton = button;
        console.log(`🎯 Выбрана кнопка для теста: ${text}`);
        break;
      }
    }

    if (!targetButton) {
      console.log('❌ Не найдена кнопка с числом');
      await page.screenshot({ path: 'no-button.png' });
      return;
    }

    console.log('🧪 Тестируем буферный механизм...');
    await targetButton.click();

    console.log('⏳ Ждем появления буферного интерфейса...');
    await page.waitForTimeout(2000);

    console.log('🔍 Проверяем буферный интерфейс...');
    const bufferElement = page.locator('text=Буфер:');
    const isBufferVisible = await bufferElement.isVisible();

    if (isBufferVisible) {
      console.log('✅ Буферный интерфейс найден!');
      const bufferText = await bufferElement.textContent();
      console.log(`📊 Текст буфера: ${bufferText}`);

      console.log('🔄 Тестируем суммирование...');
      await targetButton.click();

      await page.waitForTimeout(2000);

      const newBufferText = await bufferElement.textContent();
      console.log(`📊 Новый текст буфера: ${newBufferText}`);

      if (newBufferText && bufferText && newBufferText !== bufferText) {
        console.log('✅ Буфер работает правильно!');
        console.log(`Результат: ${bufferText} → ${newBufferText}`);
      } else {
        console.log('❌ Буфер не работает');
        await page.screenshot({ path: 'buffer-problem.png' });
      }

    } else {
      console.log('❌ Буферный интерфейс не появился');
      await page.screenshot({ path: 'no-buffer.png' });
      console.log('Скриншот сохранен в no-buffer.png');
    }

    console.log('🔍 Проверяем кнопку отмены буфера...');
    const cancelButton = page.locator('[aria-label="Отменить буфер"]');
    const hasCancelButton = await cancelButton.isVisible();

    if (hasCancelButton) {
      console.log('✅ Кнопка отмены буфера найдена');
    } else {
      console.log('❌ Кнопка отмены буфера не найдена');
    }

    console.log('⏳ Оставляем браузер открытым для визуальной инспекции...');
    console.log('Закройте браузер вручную когда закончите проверку');

    // Ждем 30 секунд для визуальной инспекции
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Ошибка при тестировании:', error.message);
    await page.screenshot({ path: 'error.png' });
    console.log('Скриншот ошибки сохранен в error.png');
  } finally {
    await browser.close();
  }
}

checkBuffer().catch(console.error);