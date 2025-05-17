import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verifica se existe um tema salvo no localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    // Verifica a preferência do sistema
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return savedTheme || systemTheme;
  });

  useEffect(() => {
    // Atualiza o atributo data-theme no elemento html
    document.documentElement.setAttribute("data-theme", theme);
    // Salva o tema no localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };
} 