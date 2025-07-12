import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type Theme = "light" | "dark" | "system";

const getPreferredTheme = (): Theme => {
  return (localStorage.getItem("theme") as Theme) || "system";
};

const getSystemTheme = (): "light" | "dark" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: Theme) => {
  const final = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.setAttribute("data-theme", final);
};

const useTheme = () => {
  const { t } = useTranslation();

  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const themeLabelMap: Record<Theme, string> = {
    light: t("light"),
    dark: t("dark"),
    system: t("system"),
  };

  return {
    theme,
    setTheme,
    label: themeLabelMap[theme],
  };
};

export default useTheme;
