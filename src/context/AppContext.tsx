/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { Location, useLocation } from "react-router-dom";

export interface AppContextProps {
  themeMode: "light" | "dark" | string;
  setThemeMode: (mode: "light" | "dark" | string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  setprimaryColor: (color: string) => void; // backward compatibility
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  location: Location<any>;
}

export interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [themeMode, setThemeModeState] = useState<string>(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    return localStorage.getItem("primaryColor") || "#1677ff";
  });

  const [secondaryColor, setSecondaryColorState] = useState<string>(() => {
    return localStorage.getItem("secondaryColor") || "#6366f1";
  });

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Synchronize dark class on documentElement for Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem("primaryColor", primaryColor);
    document.documentElement.style.setProperty("--color-primary", primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem("secondaryColor", secondaryColor);
    document.documentElement.style.setProperty("--color-secondary", secondaryColor);
  }, [secondaryColor]);

  const setThemeMode = useCallback((mode: string) => {
    setThemeModeState(mode);
  }, []);

  const setPrimaryColor = useCallback((color: string) => {
    setPrimaryColorState(color);
  }, []);

  const setSecondaryColor = useCallback((color: string) => {
    setSecondaryColorState(color);
  }, []);

  const values: AppContextProps = {
    themeMode,
    setThemeMode,
    primaryColor,
    setPrimaryColor,
    setprimaryColor: setPrimaryColor, // backward compatibility
    secondaryColor,
    setSecondaryColor,
    collapsed,
    setCollapsed,
    location,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
