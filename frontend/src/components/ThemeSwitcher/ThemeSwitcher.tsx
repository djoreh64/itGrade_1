import styles from "../RegistrationForm/RegistrationForm.module.css";
import { useTranslation } from "react-i18next";
import type { Dispatch, SetStateAction, FC } from "react";

type Theme = "light" | "dark" | "system";

interface Props {
  setTheme: Dispatch<SetStateAction<Theme>>;
  label: string;
}

const ThemeSwitcher: FC<Props> = ({ setTheme, label }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.themeSwitcher}>
      <div role="tablist" aria-label={t("themeSwitcher")}>
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={styles.openBtn}
          role="tab"
          aria-selected={label === t("light")}
          tabIndex={label === t("light") ? 0 : -1}
        >
          🌞 {t("light")}
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={styles.openBtn}
          role="tab"
          aria-selected={label === t("dark")}
          tabIndex={label === t("dark") ? 0 : -1}
        >
          🌙 {t("dark")}
        </button>
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={styles.openBtn}
          role="tab"
          aria-selected={label === t("system")}
          tabIndex={label === t("system") ? 0 : -1}
        >
          🖥️ {t("system")}
        </button>
      </div>

      <p>
        {t("currentTheme")}: <strong>{label}</strong>
      </p>
    </div>
  );
};

export default ThemeSwitcher;
