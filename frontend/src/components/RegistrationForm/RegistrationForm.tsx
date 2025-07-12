import { useRef, type FC } from "react";
import styles from "./RegistrationForm.module.css";
import { useRegistrationForm } from "./hooks/useRegistrationForm";
import SubmitResult from "@components/SubmitResult";
import useTheme from "@hooks/useTheme";
import ThemeSwitcher from "@components/ThemeSwitcher";
import InputField from "@components/InputField/InputField";
import PasswordField from "@components/PasswordField/PasswordField";
import type { IFormData } from "@types";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from "@utils/validate";

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
    watch,
  } = useRegistrationForm(dialogRef);

  const openDialog = () => {
    dialogRef.current?.showModal();
    if (submitResult !== null) reset();
  };

  const closeDialog = () => dialogRef.current?.close();

  const { label, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { onChange: rhfOnChange, ...avatarRegister } = register("avatar");

  const passwordValue = watch("password");

  const registerWithValidation = (fieldName: keyof IFormData) => {
    const rules: Record<keyof IFormData, any> = {
      login: { required: "Логин обязателен" },
      email: { required: "Email обязателен", validate: validateEmail },
      phone: { required: "Телефон обязателен", validate: validatePhone },
      password: { required: "Пароль обязателен", validate: validatePassword },
      fullName: { required: "ФИО обязательно", validate: validateFullName },
      about: { required: "О себе обязательно" },
      avatar: { required: "Аватар обязателен" },
    };

    return register(fieldName, rules[fieldName]);
  };

  const file = watch("avatar")?.[0];

  return (
    <>
      <ThemeSwitcher setTheme={setTheme} label={label} />

      <h1>Добро пожаловать на наш сайт</h1>
      <p>Для регистрации, пожалуйста, заполните форму</p>
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
          <InputField
            id="login"
            label="Логин"
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <PasswordField
            register={registerWithValidation}
            errors={errors}
            isSubmitting={isSubmitting}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            passwordValue={passwordValue}
          />

          <InputField
            id="fullName"
            label="Ф.И.О."
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <InputField
            id="email"
            label="E-Mail"
            type="email"
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <InputField
            id="phone"
            label="Телефон"
            type="tel"
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
            placeholder="+7 (___) ___-__-__"
          />

          <InputField
            id="about"
            label="О себе"
            textarea
            rows={3}
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <div className={styles.group}>
            <label htmlFor="avatar" className={styles.label}>
              Аватар
            </label>

            <div
              className={styles.dropzone}
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                inputRef.current?.click()
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  rhfOnChange({ target: { files } });
                  onAvatarChange(files);
                }
              }}
            >
              <div className={styles.dropzoneContent}>
                <p>Перетащите файл сюда или</p>
                <button
                  type="button"
                  className={styles.chooseBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Выбрать файл
                </button>
                {file && <span className={styles.fileName}>{file.name}</span>}
              </div>

              <input
                type="file"
                accept="image/*"
                name="avatar"
                className={styles.hiddenInput}
                ref={(el) => {
                  inputRef.current = el;
                  avatarRegister.ref(el);
                }}
                onBlur={avatarRegister.onBlur}
                onChange={(e) => {
                  rhfOnChange(e);
                  onAvatarChange(e.target.files);
                }}
              />
            </div>

            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Превью аватара"
                className={styles.avatarPreview}
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
