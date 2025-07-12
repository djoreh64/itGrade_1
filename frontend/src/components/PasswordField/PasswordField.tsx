import type { FC } from "react";
import styles from "../RegistrationForm/RegistrationForm.module.css";
import { usePasswordStrength } from "@hooks/usePasswordStrength";
import { validatePassword } from "@utils/validate";

interface Props {
  register: any;
  errors: any;
  isSubmitting: boolean;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
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
  const { checks, strength } = usePasswordStrength(passwordValue);

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "#4caf50";
    if (strength >= 50) return "#f0a500";
    return "#e55353";
  };
  const strengthColor = getStrengthColor(strength);

  return (
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
          {strength >= 80 ? "Сильный" : strength >= 50 ? "Средний" : "Слабый"}
        </div>

        <ul className={styles.passwordChecklist}>
          <li className={checks.length ? styles.valid : ""}>
            Не менее 8 символов
          </li>
          <li className={checks.lower ? styles.valid : ""}>Строчная буква</li>
          <li className={checks.upper ? styles.valid : ""}>Заглавная буква</li>
          <li className={checks.digit ? styles.valid : ""}>Цифра</li>
          <li className={checks.special ? styles.valid : ""}>Спецсимвол</li>
        </ul>
      </div>

      {errors.password && (
        <div className={styles.errorMessage}>{errors.password.message}</div>
      )}
    </div>
  );
};

export default PasswordField;
