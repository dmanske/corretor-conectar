import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light"); // Forçar o tema light

  useEffect(() => {
    // Atualiza o atributo data-theme no elemento html
    document.documentElement.setAttribute("data-theme", theme);
    // Remove a classe 'dark' se estiver presente
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
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