import { type FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.css";

const LanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("ru") ? "ru" : "en";

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return (
    <div className={styles.tabs}>
      <button
        type="button"
        className={`${styles.tab} ${currentLang === "ru" ? styles.active : ""}`}
        onClick={() => changeLanguage("ru")}
      >
        Русский
      </button>
      <button
        type="button"
        className={`${styles.tab} ${currentLang === "en" ? styles.active : ""}`}
        onClick={() => changeLanguage("en")}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
