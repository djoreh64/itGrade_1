import styles from "../RegistrationForm/RegistrationForm.module.css";

import type { Dispatch, SetStateAction, FC } from "react";

type Theme = "light" | "dark" | "system";

interface Props {
  setTheme: Dispatch<SetStateAction<Theme>>;
  label: string;
}

const ThemeSwitcher: FC<Props> = ({ setTheme, label }) => (
  <div className={styles.themeSwitcher}>
    <button
      type="button"
      onClick={() => setTheme("light")}
      className={styles.openBtn}
    >
      🌞 Светлая
    </button>
    <button
      type="button"
      onClick={() => setTheme("dark")}
      className={styles.openBtn}
    >
      🌙 Тёмная
    </button>
    <button
      type="button"
      onClick={() => setTheme("system")}
      className={styles.openBtn}
    >
      🖥️ Системная
    </button>
    <p>
      Текущая тема: <strong>{label}</strong>
    </p>
  </div>
);

export default ThemeSwitcher;
