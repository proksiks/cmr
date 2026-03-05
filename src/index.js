let currentStep = 1;
const totalSteps = 4;
const quizData = {};

console.log('JavaScript loaded');

// Дополнительная инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  
  // Находим все кнопки Далее и добавляем обработчики
  const btn1 = document.getElementById('btnStep1');
  const btn2 = document.getElementById('btnStep2');
  const btn3 = document.getElementById('btnStep3');
  const btn4 = document.getElementById('btnStep4');
  
  if (btn1) btn1.onclick = function() { nextStep(); };
  if (btn2) btn2.onclick = function() { nextStep(); };
  if (btn3) btn3.onclick = function() { nextStep(); };
  if (btn4) btn4.onclick = function() { submitQuiz(); };
  
  // Находим все кнопки Назад
  const prevButtons = document.querySelectorAll('.step__button_prev');
  prevButtons.forEach(btn => {
    btn.onclick = function() { prevStep(); };
  });
  
  // Находим все чекбоксы и добавляем обработчики
  const checkboxes = document.querySelectorAll('.step__checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', function() {
      const step = parseInt(this.closest('.step').getAttribute('data-step'));
      selectOption(this, step);
    });
  });
  
  console.log('Initialized');
});

// Проверка шага 1 - нужно заполнить страну и выбрать регион
function checkStep1() {
  console.log('checkStep1 called');
  const country = document.getElementById("country");
  const selectedRegion = document.querySelector(
    '.step[data-step="1"] .step__checkbox.selected'
  );
  
  // Убираем/добавляем класс ошибки
  if (!country.value.trim()) {
    country.classList.add('step__input_error');
  } else {
    country.classList.remove('step__input_error');
  }
}

// Выбор опции
function selectOption(element, step) {
  console.log('selectOption called', step, element.dataset.value);
  
  const stepEl = document.querySelector(`.step[data-step="${step}"]`);
  if (!stepEl) return;
  
  stepEl
    .querySelectorAll(".step__checkbox")
    .forEach((opt) => opt.classList.remove("selected"));
  element.classList.add("selected");
  quizData["step" + step] = element.dataset.value;

  if (step === 1) {
    checkStep1();
  }
}

// Форматирование телефона
function formatPhone(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.startsWith("7") || value.startsWith("8"))
    value = value.substring(1);
  let formatted = "+7";
  if (value.length > 0) formatted += " (" + value.substring(0, 3);
  if (value.length >= 3) formatted += ") " + value.substring(3, 6);
  if (value.length >= 6) formatted += "-" + value.substring(6, 8);
  if (value.length >= 8) formatted += "-" + value.substring(8, 10);
  input.value = formatted;
}

// Проверка формы
function checkForm() {
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  
  // Убираем класс ошибки при вводе
  if (name.value.trim()) {
    name.classList.remove('step__input_error');
  }
  if (phone.value.replace(/\D/g, '').length >= 11) {
    phone.classList.remove('step__input_error');
  }
}

// Переход к следующему шагу
function nextStep() {
  // Проверка валидации
  if (currentStep === 1) {
    const country = document.getElementById("country");
    const selectedRegion = document.querySelector('.step[data-step="1"] .step__checkbox.selected');
    
    // Подсвечиваем пустые поля
    if (!country.value.trim()) {
      country.classList.add('step__input_error');
    } else {
      country.classList.remove('step__input_error');
    }
    
    if (!selectedRegion) {
      document.querySelector('.step[data-step="1"] .step__options').classList.add('step__options_error');
    } else {
      document.querySelector('.step[data-step="1"] .step__options').classList.remove('step__options_error');
    }
    
    if (!country.value.trim() || !selectedRegion) {
      return;
    }
    
    const region = quizData["step1"];
    if (region === "Другой регион") {
      showErrorStep("error-step-location");
      return;
    }
  }

  // Проверка шага 2
  if (currentStep === 2) {
    const selectedHuman = document.querySelector('.step[data-step="2"] .step__checkbox.selected');
    
    if (!selectedHuman) {
      document.querySelector('.step[data-step="2"] .step__options').classList.add('step__options_error');
      return;
    } else {
      document.querySelector('.step[data-step="2"] .step__options').classList.remove('step__options_error');
    }
  }

  // Проверка шага 3 - Временная регистрация
  if (currentStep === 3) {
    const selectedDoc = document.querySelector('.step[data-step="3"] .step__checkbox.selected');
    
    if (!selectedDoc) {
      document.querySelector('.step[data-step="3"] .step__grid').classList.add('step__options_error');
      return;
    } else {
      document.querySelector('.step[data-step="3"] .step__grid').classList.remove('step__options_error');
    }
    
    const service = quizData["step3"];
    if (service === "Временная регистрация") {
      showErrorStep("error-step-registration");
      return;
    }
  }

  // Шаг 4 - проверка формы
  if (currentStep === 4) {
    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    
    let hasError = false;
    
    if (!name.value.trim()) {
      name.classList.add('step__input_error');
      hasError = true;
    } else {
      name.classList.remove('step__input_error');
    }
    
    if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 11) {
      phone.classList.add('step__input_error');
      hasError = true;
    } else {
      phone.classList.remove('step__input_error');
    }
    
    if (hasError) return;
  }

  if (currentStep < totalSteps) {
    const currentEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (currentEl) {
      currentEl.classList.remove("active");
    }
    currentStep++;
    const nextEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (nextEl) {
      nextEl.classList.add("active");
    }
  }
}

// Показать экран ошибки
function showErrorStep(stepName) {
  const currentEl = document.querySelector(`.step[data-step="${currentStep}"]`);
  if (currentEl) {
    currentEl.classList.remove("active");
  }
  const errorEl = document.querySelector(`.step[data-step="${stepName}"]`);
  if (errorEl) {
    errorEl.classList.add("active");
  }
}

// Перезапуск формы
function restartQuiz() {
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));

  currentStep = 1;
  Object.keys(quizData).forEach((key) => delete quizData[key]);

  document
    .querySelectorAll(".step__checkbox.selected")
    .forEach((opt) => opt.classList.remove("selected"));

  // Очищаем поля и убираем классы ошибок
  const country = document.getElementById("country");
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  
  if (country) {
    country.value = "";
    country.classList.remove('step__input_error');
  }
  if (name) {
    name.value = "";
    name.classList.remove('step__input_error');
  }
  if (phone) {
    phone.value = "";
    phone.classList.remove('step__input_error');
  }
  
  // Убираем классы ошибок с опций
  document.querySelectorAll('.step__options_error').forEach(el => {
    el.classList.remove('step__options_error');
  });

  const firstStep = document.querySelector('.step[data-step="1"]');
  if (firstStep) firstStep.classList.add("active");
}

// Переход к предыдущему шагу
function prevStep() {
  if (currentStep > 1) {
    const currentEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (currentEl) {
      currentEl.classList.remove("active");
    }
    currentStep--;
    const prevEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (prevEl) {
      prevEl.classList.add("active");
    }
  }
}

// Отправка формы
async function submitQuiz() {
  const nameEl = document.getElementById("name");
  const phoneEl = document.getElementById("phone");
  const countryEl = document.getElementById("country");
  
  const name = nameEl ? nameEl.value : '';
  const phone = phoneEl ? phoneEl.value : '';
  const country = countryEl ? countryEl.value : '';
  
  quizData.name = name;
  quizData.phone = phone;
  quizData.country = country;

  const success = await sendToTelegram(quizData);

  if (!success) {
    alert("Ошибка отправки! Пожалуйста, позвоните нам по телефону +7 (000) 123 45 67");
    return;
  }

  const currentEl = document.querySelector(`.step[data-step="${currentStep}"]`);
  if (currentEl) {
    currentEl.classList.remove("active");
  }
  const finalEl = document.querySelector('.step[data-step="final-step"]');
  if (finalEl) {
    finalEl.classList.add("active");
  }

  if (typeof gtag !== "undefined") {
    gtag("event", "conversion", { send_to: "YOUR_CONVERSION_ID" });
  }
}

// Отправка в Telegram
async function sendToTelegram(data) {
  const BOT_TOKEN = "YOUR_BOT_TOKEN";
  const CHAT_ID = "YOUR_CHAT_ID";
  const message = `🆕 <b>Новая заявка с сайта Центр миграционных решений!</b>

👤 <b>Имя:</b> ${data.name}
📞 <b>Телефон:</b> ${data.phone}
🌍 <b>Гражданство:</b> ${data.country || '-'}
📍 <b>Регион:</b> ${data.step1 || '-'}
👨‍👩‍👧 <b>Родственники:</b> ${data.step2 || '-'}
📄 <b>Услуга:</b> ${data.step3 || '-'}

⏱ Перезвонить в течение 30 минут!`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      },
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram API error:", result);
      throw new Error(result.description || "Failed to send message");
    }

    return true;
  } catch (e) {
    console.error("Telegram error:", e);
    return false;
  }
}
