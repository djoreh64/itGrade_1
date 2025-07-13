import { type Dispatch, type FC, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import styles from "../RegistrationForm/RegistrationForm.module.css";
import { usePasswordStrength } from "@hooks/usePasswordStrength";
import { validatePassword } from "@utils/validate";

interface Props {
  register: any;
  errors: any;
  isSubmitting: boolean;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  passwordValue: string;
}

const PasswordField: FC<Props> = ({
  register,
  errors,
  isSubmitting,
  showPassword,
  setShowPassword,
  passwordValue,
}) => {
  const { t } = useTranslation();
  const { checks, strength } = usePasswordStrength(passwordValue);

  const getStrengthInfo = (strength: number) => {
    if (strength >= 80) return { label: t("strong"), color: "#4caf50" };
    if (strength >= 50) return { label: t("medium"), color: "#f0a500" };
    return { label: t("weak"), color: "#e55353" };
  };

  const { color: strengthColor, label: strengthLabel } =
    getStrengthInfo(strength);

  return (
    <div className={styles.group}>
      <label htmlFor="password" className={styles.label}>
        {t("password")}
      </label>
      <div className={styles.passwordWrapper}>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          {...register("password", {
            required: t("passwordRequired"),
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
          aria-label={showPassword ? t("hidePassword") : t("showPassword")}
          onClick={() => setShowPassword((v) => !v)}
          className={styles.togglePasswordBtn}
          tabIndex={-1}
          disabled={isSubmitting}
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>

      <div className={styles.passwordStrengthWrapper}>
        <div className={styles.passwordProgressBar}>
          <div
            className={styles.passwordProgress}
            style={{ width: `${strength}%`, backgroundColor: strengthColor }}
          />
        </div>

        <div
          className={styles.passwordStrengthLabel}
          style={{ color: strengthColor }}
        >
          {strengthLabel}
        </div>

        <ul className={styles.passwordChecklist}>
          <li className={checks.length ? styles.valid : ""}>
            {t("min8Chars")}
          </li>
          <li className={checks.lower ? styles.valid : ""}>{t("lowercase")}</li>
          <li className={checks.upper ? styles.valid : ""}>{t("uppercase")}</li>
          <li className={checks.digit ? styles.valid : ""}>{t("digit")}</li>
          <li className={checks.special ? styles.valid : ""}>
            {t("specialChar")}
          </li>
        </ul>
      </div>

      {errors.password && (
        <div className={styles.errorMessage}>{errors.password.message}</div>
      )}
    </div>
  );
};

export default PasswordField;
