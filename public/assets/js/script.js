const clearErrors = () => {
  document
    .querySelectorAll(".form__error-message")
    .forEach((el) => el.remove());
  document
    .querySelectorAll(".form__input--error")
    .forEach((el) => el.classList.remove("form__input--error"));
};

const showError = (input, message) => {
  if (!input) return;

  input.classList.add("form__input--error");

  const fieldContainer = input.closest(".form__group, .form__field");
  if (!fieldContainer) return;

  const oldError = fieldContainer.querySelector(".form__error-message");
  if (oldError) oldError.remove();

  const errorEl = document.createElement("div");
  errorEl.className = "form__error-message";
  errorEl.textContent = message;

  fieldContainer.appendChild(errorEl);
};

const removeError = (input) => {
  input.classList.remove("form__input--error");
  const fieldContainer = input.closest(".form__group, .form__field");
  if (!fieldContainer) return;
  const errMsg = fieldContainer.querySelector(".form__error-message");
  if (errMsg) errMsg.remove();
};

const safeParseJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const renderResult = (data) => {
  const box = document.getElementById("result");
  if (!box) return;

  box.innerHTML = `
    <h2>Данные успешно отправлены:</h2>
    <ul>
      <li><b>Логин:</b> ${data.login}</li>
      <li><b>Пароль:</b> ${data.password}</li>
      <li><b>ФИО:</b> ${data.fullName}</li>
      <li><b>Email:</b> ${data.email}</li>
      <li><b>Телефон:</b> ${data.phone}</li>
      <li><b>О себе:</b> ${data.about}</li>
      ${
        data.avatarUrl
          ? `<li><b>Аватар:</b><br><img src="${data.avatarUrl}" width="150"></li>`
          : "<li><b>Аватар:</b> не загружен</li>"
      }
    </ul>`;
};

const validators = {
  login: (v) => /^[a-zA-Z0-9]{3,}$/.test(v),
  password: (v) => v.trim().length > 0,
  fullName: (v) => /^[А-Яа-яЁё\s\-]+$/.test(v.trim()),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v) => /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(v),
  about: (v) => v.trim().length > 0,
};

const errorMessages = {
  login: "Логин должен содержать минимум 3 латинские буквы или цифры",
  password: "Пароль обязателен",
  fullName: "ФИО должно содержать только кириллицу, пробелы и дефисы",
  email: "Введите корректный email",
  phone: "Введите телефон в формате +7 (XXX) XXX-XX-XX",
  about: "Поле 'О себе' обязательно",
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const submitBtn = form.querySelector(".form__submit"); // класс БЭМ кнопки

  const isFormValid = () =>
    Object.entries(validators).every(([name, test]) => {
      const input = form.querySelector(`[name="${name}"]`);
      return input && test(input.value);
    });

  const toggleSubmit = () => {
    submitBtn.disabled = !isFormValid();
  };

  const validateField = (input) => {
    const name = input.name;
    const validator = validators[name];
    if (!validator) return;

    if (validator(input.value)) {
      removeError(input);
    } else {
      showError(input, errorMessages[name]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    clearErrors();

    const fd = new FormData(form);
    let data;

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: fd,
      });

      data = await safeParseJson(res);

      if (res.ok) {
        renderResult(data);
        form.reset();
        toggleSubmit();
        return;
      }
    } catch (err) {
      console.error(err);
    }

    if (data?.errors) {
      Object.entries(data.errors).forEach(([field, msg]) => {
        const input = form.querySelector(`[name="${field}"]`);
        showError(input, msg);
      });
    } else {
      console.error("Ошибка при отправке формы");
    }
  };

  Object.keys(validators).forEach((field) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (!input) return;

    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      validateField(input);
      toggleSubmit();
    });
  });

  form.addEventListener("submit", onSubmit);
  toggleSubmit();

  const passwordInput = document.getElementById("password");
  const toggleBtn = document.querySelector(".form__toggle-password");

  toggleBtn.addEventListener("click", () => {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    toggleBtn.textContent = isVisible ? "👁" : "🙈";
    toggleBtn.setAttribute(
      "aria-label",
      isVisible ? "Показать пароль" : "Скрыть пароль"
    );

    validateField(passwordInput);
  });
});

const phoneInput = document.getElementById("phone");

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const parts = [
    "+7",
    digits.slice(1, 4),
    digits.slice(4, 7),
    digits.slice(7, 9),
    digits.slice(9, 11),
  ];

  let result = parts[0];
  if (parts[1]) result += ` (${parts[1]}`;
  if (parts[1] && parts[1].length === 3) result += `)`;
  if (parts[2]) result += ` ${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;
  if (parts[4]) result += `-${parts[4]}`;

  return result;
};

phoneInput.addEventListener("input", (e) => {
  const cursor = phoneInput.selectionStart;
  const oldLength = phoneInput.value.length;

  phoneInput.value = formatPhone(phoneInput.value);

  const newLength = phoneInput.value.length;
  phoneInput.setSelectionRange(
    cursor + (newLength - oldLength),
    cursor + (newLength - oldLength)
  );
});

phoneInput.addEventListener("focus", () => {
  if (phoneInput.value.trim() === "") phoneInput.value = "+7 ";
});

phoneInput.addEventListener("blur", () => {
  if (phoneInput.value.replace(/\D/g, "").length < 11) phoneInput.value = "";
});
