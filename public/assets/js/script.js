document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  const resultDiv = document.createElement("div");
  form.insertAdjacentElement("afterend", resultDiv);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        resultDiv.textContent = `Ошибка: ${text}`;
        return;
      }

      const { login, password, fullName, email, phone, about, avatarUrl } =
        await response.json();

      resultDiv.innerHTML = `
          <h2>Вы отправили:</h2>
          <ul>
            <li><b>Логин:</b> ${login}</li>
            <li><b>Пароль:</b> ${password}</li>
            <li><b>ФИО:</b> ${fullName}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Телефон:</b> ${phone}</li>
            <li><b>О себе:</b> ${about}</li>
            ${
              avatarUrl
                ? `<li><b>Аватар:</b><br /><img src="${avatarUrl}" width="150" />`
                : `<li><b>Аватар:</b> не загружен</li>`
            }
          </ul>
        `;
    } catch (err) {
      resultDiv.textContent = `Ошибка: ${err}`;
    }
  });
});
