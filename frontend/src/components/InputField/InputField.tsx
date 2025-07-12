import type { FC } from "react";
import styles from "../RegistrationForm/RegistrationForm.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  id: string;
  label: string;
  register: any;
  errors: any;
  disabled: boolean;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  onChange?: (e: React.ChangeEvent<any>) => void;
}

const InputField: FC<Props> = ({
  id,
  label,
  register,
  errors,
  disabled,
  type = "text",
  placeholder,
  textarea = false,
  rows,
  onChange,
  ...props
}) => {
  const { onChange: rhfOnChange, onBlur: rhfOnBlur, ref, name } = register(id);
  const handleChange = (e: React.ChangeEvent<any>) => {
    rhfOnChange(e);
    if (onChange) onChange(e);
  };

  if (textarea) {
    return (
      <div className={styles.group}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <textarea
          id={id}
          rows={rows || 3}
          name={name}
          onChange={handleChange}
          onBlur={rhfOnBlur}
          ref={ref}
          className={`${styles.input} ${styles.textarea} ${
            errors[id] ? styles.inputError : ""
          }`}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
        {errors[id] && (
          <div className={styles.errorMessage}>{errors[id]?.message}</div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.group}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        onChange={handleChange}
        onBlur={rhfOnBlur}
        ref={ref}
        className={`${styles.input} ${errors[id] ? styles.inputError : ""}`}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={id === "password" ? "new-password" : undefined}
        {...props}
      />
      {errors[id] && (
        <div className={styles.errorMessage}>{errors[id]?.message}</div>
      )}
    </div>
  );
};

export default InputField;
