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
import LanguageSwitcher from "@components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const RegistrationForm: FC = () => {
  const { t } = useTranslation();

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
      login: { required: t("loginRequired") },
      email: { required: t("emailRequired"), validate: validateEmail },
      phone: { required: t("phoneRequired"), validate: validatePhone },
      password: { required: t("passwordRequired"), validate: validatePassword },
      fullName: { required: t("fullNameRequired"), validate: validateFullName },
      about: { required: t("aboutRequired") },
      avatar: { required: t("avatarRequired") },
    };

    return register(fieldName, rules[fieldName]);
  };

  const file = watch("avatar")?.[0];

  return (
    <>
      <LanguageSwitcher />
      <ThemeSwitcher setTheme={setTheme} label={label} />

      <h1>{t("welcome")}</h1>
      <p>{t("fillForm")}</p>
      <button type="button" onClick={openDialog} className={styles.openBtn}>
        {t("openRegistrationForm")}
      </button>

      <dialog ref={dialogRef} className={styles.dialog}>
        <button
          type="button"
          aria-label={t("closeForm")}
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
            label={t("login")}
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
            label={t("fullName")}
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <InputField
            id="email"
            label={t("email")}
            type="email"
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <InputField
            id="phone"
            label={t("phone")}
            type="tel"
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
            placeholder="+7 (___) ___-__-__"
          />

          <InputField
            id="about"
            label={t("about")}
            textarea
            rows={3}
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <div className={styles.group}>
            <label htmlFor="avatar" className={styles.label}>
              {t("avatar")}
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
                <p>{t("dragDropFile")}</p>
                <button
                  type="button"
                  className={styles.chooseBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  {t("chooseFile")}
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
                alt={t("avatarPreviewAlt")}
                className={styles.avatarPreview}
              />
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </form>
      </dialog>

      {submitResult && submitResult.success && (
        <SubmitResult submitResult={submitResult} />
      )}

      {submitResult && !submitResult.success && (
        <div className={styles.errorMessage}>
          {submitResult.errors?.global || t("formSubmitError")}
        </div>
      )}
    </>
  );
};

export default RegistrationForm;
