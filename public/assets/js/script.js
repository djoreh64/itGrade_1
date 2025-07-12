const clearErrors = () => {
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));
};

const showError = (input, message) => {
  if (!input) return;

  input.classList.add("error");

  const err = document.createElement("div");
  err.className = "error-message";
  err.textContent = message;

  input.parentNode.appendChild(err);
};

const removeError = (input) => {
  input.classList.remove("error");
  const errMsg = input.parentNode.querySelector(".error-message");
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
  const submitBtn = form.querySelector("button");

  const isFormValid = () =>
    Object.entries(validators).every(([name, test]) => {
      const input = form.querySelector(`[name="${name}"]`);
      return input && test(input.value);
    });

  const toggleSubmit = () => (submitBtn.disabled = !isFormValid());

  const validateField = (input) => {
    const name = input.name;
    const validator = validators[name];
    if (!validator) return;

    removeError(input);

    if (!validator(input.value)) showError(input, errorMessages[name]);
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
});
