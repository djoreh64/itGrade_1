import * as Form from "@components";
import useTheme from "@hooks/useTheme";
import type { IFormData } from "@types";
import { getValidationRules } from "@utils/validate";
import { t } from "i18next";
import { useMemo, useRef, type FC } from "react";
import styles from "./RegistrationForm.module.css";
import { useRegistrationForm } from "./hooks/useRegistrationForm";

const RegistrationForm: FC = () => {
  const { label, setTheme } = useTheme();
  const validationRules = getValidationRules();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
  } = useRegistrationForm(dialogRef, formRef);

  const openDialog = () => {
    dialogRef.current?.showModal();
    if (submitResult !== null) reset();
  };

  const closeDialog = () => dialogRef.current?.close();
  const { onChange: rhfOnChange, ...avatarRegister } = register("avatar");

  const registerWithValidation = (fieldName: keyof IFormData) =>
    register(fieldName, validationRules[fieldName] as any);

  const file = watch("avatar")?.[0];

  const passwordValue = watch("password");
  const aboutValue = watch("about") || "";

  const maxAboutLength = 500;

  const remainingChars = useMemo(
    () => maxAboutLength - aboutValue.length,
    [aboutValue]
  );
  const aboutPercent = useMemo(
    () => (aboutValue.length / maxAboutLength) * 100,
    [aboutValue]
  );

  return (
    <>
      <Form.LanguageSwitcher />
      <Form.ThemeSwitcher setTheme={setTheme} label={label} />

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
          ref={formRef}
          encType="multipart/form-data"
        >
          <Form.InputField
            id="login"
            label={t("login")}
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <Form.PasswordField
            register={registerWithValidation}
            errors={errors}
            isSubmitting={isSubmitting}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            passwordValue={passwordValue}
          />

          <Form.InputField
            id="fullName"
            label={t("fullName")}
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <Form.InputField
            id="email"
            label={t("email")}
            type="email"
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
          />

          <Form.InputField
            id="phone"
            label={t("phone")}
            type="tel"
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
            placeholder="+7 (___) ___-__-__"
          />

          <Form.InputField
            id="about"
            label={t("about")}
            textarea
            rows={3}
            register={registerWithValidation}
            errors={errors}
            disabled={isSubmitting}
            maxLength={500}
          />

          <div className={styles.aboutProgressWrapper}>
            <div className={styles.aboutProgressBar}>
              <div
                className={styles.aboutProgress}
                style={{ width: `${aboutPercent}%` }}
              />
            </div>
            <p className={styles.aboutCharCount}>
              {t("remainingChars", {
                count: remainingChars > 0 ? remainingChars : 0,
              })}
            </p>
          </div>

          <div className={styles.group}>
            <label htmlFor="avatar" className={styles.label}>
              {t("avatar")}
            </label>

            <Form.Dropzone
              onAvatarChange={onAvatarChange}
              rhfOnChange={rhfOnChange}
              file={file}
              avatarRegister={avatarRegister}
            />
            <Form.AvatarPreview src={avatarPreview} />
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
        <Form.SubmitResult submitResult={submitResult} />
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
