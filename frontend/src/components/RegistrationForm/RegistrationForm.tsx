import AvatarPreview from "@components/AvatarPreview";
import InputField from "@components/InputField/InputField";
import LanguageSwitcher from "@components/LanguageSwitcher";
import PasswordField from "@components/PasswordField/PasswordField";
import SubmitResult from "@components/SubmitResult";
import ThemeSwitcher from "@components/ThemeSwitcher";
import { VALIDATION_RULES } from "@constants";
import useTheme from "@hooks/useTheme";
import type { IFormData } from "@types";
import { t } from "i18next";
import { useRef, type FC } from "react";
import styles from "./RegistrationForm.module.css";
import { useRegistrationForm } from "./hooks/useRegistrationForm";

const RegistrationForm: FC = () => {
  const { label, setTheme } = useTheme();
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
    uploadProgress,
  } = useRegistrationForm(dialogRef);

  const openDialog = () => {
    dialogRef.current?.showModal();
    if (submitResult !== null) reset();
  };

  const closeDialog = () => dialogRef.current?.close();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      rhfOnChange({ target: { files } });
      onAvatarChange(files);
    }
  };

  const handleDropzoneClick = () => inputRef.current?.click();

  const handleDropzoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      inputRef.current?.click();
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { onChange: rhfOnChange, ...avatarRegister } = register("avatar");

  const registerWithValidation = (fieldName: keyof IFormData) =>
    register(fieldName, VALIDATION_RULES[fieldName]);

  const file = watch("avatar")?.[0];
  const passwordValue = watch("password");
  const aboutValue = watch("about") || "";

  const maxAboutLength = 500;
  const remainingChars = maxAboutLength - aboutValue.length;
  const aboutPercent = (aboutValue.length / maxAboutLength) * 100;

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

            <div
              role="button"
              className={styles.dropzone}
              tabIndex={0}
              onClick={handleDropzoneClick}
              onKeyDown={handleDropzoneKeyDown}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
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

              {uploadProgress > 0 && uploadProgress < 100 && (
                <progress value={uploadProgress} max={100}>
                  {Math.round(uploadProgress)}%
                </progress>
              )}
            </div>

            <AvatarPreview src={avatarPreview} />
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
