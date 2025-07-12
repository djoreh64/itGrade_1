import { useRef, type FC } from "react";
import styles from "./RegistrationForm.module.css";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from "@utils";
import { useRegistrationForm } from "./hooks/useRegistrationForm";
import SubmitResult from "@components/SubmitResult";
import useTheme from "@hooks/useTheme";

const RegistrationForm: FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isValid,
    reset,
    avatarPreview,
    showPassword,
    setShowPassword,
    submitResult,
    onAvatarChange,
    onSubmit,
  } = useRegistrationForm(dialogRef);

  const openDialog = () => {
    dialogRef.current?.showModal();
    if (submitResult !== null) reset();
  };

  const closeDialog = () => dialogRef.current?.close();

  const { toggleTheme } = useTheme();

  return (
    <>
      <button type="button" onClick={toggleTheme} className={styles.openBtn}>
        ☀️
      </button>
      <h1>Добро пожаловать на наш сайт</h1>
      <p>Описание для регистрации, пожалуйста, заполните форму</p>
      <button type="button" onClick={openDialog} className={styles.openBtn}>
        Открыть форму регистрации
      </button>

      <dialog ref={dialogRef} className={styles.dialog}>
        <button
          type="button"
          aria-label="Закрыть форму"
          onClick={closeDialog}
          className={styles.closeBtn}
        >
          &times;
        </button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          noValidate
          encType="multipart/form-data"
        >
          <div className={styles.group}>
            <label htmlFor="login" className={styles.label}>
              Логин
            </label>
            <input
              id="login"
              {...register("login", {
                required: "Логин обязателен",
                pattern: {
                  value: /^[a-zA-Z0-9]{3,}$/,
                  message: "Минимум 3 латинские буквы или цифры",
                },
              })}
              className={`${styles.input} ${
                errors.login ? styles.inputError : ""
              }`}
              disabled={isSubmitting}
              autoComplete="username"
            />
            {errors.login && (
              <div className={styles.errorMessage}>{errors.login.message}</div>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Пароль обязателен",
                  validate: validatePassword,
                })}
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ""
                }`}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                onClick={() => setShowPassword((v) => !v)}
                className={styles.togglePasswordBtn}
                tabIndex={-1}
                disabled={isSubmitting}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && (
              <div className={styles.errorMessage}>
                {errors.password.message}
              </div>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor="fullName" className={styles.label}>
              Ф.И.О.
            </label>
            <input
              id="fullName"
              {...register("fullName", {
                required: "ФИО обязательно",
                validate: validateFullName,
              })}
              className={`${styles.input} ${
                errors.fullName ? styles.inputError : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <div className={styles.errorMessage}>
                {errors.fullName.message}
              </div>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor="email" className={styles.label}>
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email обязателен",
                validate: validateEmail,
              })}
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <div className={styles.errorMessage}>{errors.email.message}</div>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor="phone" className={styles.label}>
              Телефон
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              {...register("phone", {
                required: "Телефон обязателен",
                validate: validatePhone,
              })}
              className={`${styles.input} ${
                errors.phone ? styles.inputError : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <div className={styles.errorMessage}>{errors.phone.message}</div>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor="about" className={styles.label}>
              О себе
            </label>
            <textarea
              id="about"
              rows={3}
              {...register("about", { required: "Поле обязательно" })}
              className={`${styles.input} ${styles.textarea} ${
                errors.about ? styles.inputError : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.about && (
              <div className={styles.errorMessage}>{errors.about.message}</div>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor="avatar" className={styles.label}>
              Аватар
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              {...register("avatar")}
              className={styles.input}
              disabled={isSubmitting}
              onChange={(e) => onAvatarChange(e.target.files)}
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Превью аватара"
                style={{
                  marginTop: 10,
                  maxWidth: 150,
                  maxHeight: 150,
                  borderRadius: 6,
                }}
              />
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Отправка..." : "Отправить"}
          </button>
        </form>
      </dialog>

      {submitResult && submitResult.success && (
        <SubmitResult submitResult={submitResult} />
      )}

      {submitResult && !submitResult.success && (
        <div className={styles.errorMessage}>
          {submitResult.errors?.global || "Произошла ошибка при отправке формы"}
        </div>
      )}
    </>
  );
};

export default RegistrationForm;
