/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useState } from 'react';
import { Location, useLocation } from 'react-router-dom';

interface AppContextProps { 
    themeMode: 'light' | 'dark' | string;
    setThemeMode: (mode: string) => void;
    primaryColor: string;
    setprimaryColor: (color: string) => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void; 
    location:Location<any>;
}

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

function AppContextProvider({ children }: AppContextProviderProps) {  
    const [themeMode, setThemeMode] = useState(localStorage.getItem('theme')||'light');
    const [primaryColor, setprimaryColor] = useState<string>(localStorage.getItem('primaryColor')||'#722ed1');
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    
    useEffect(() => {
    console.log(location.pathname);
    
    }, [location])
    const values = {
        themeMode,
        setThemeMode,
        primaryColor,
        setprimaryColor,
        collapsed,
        setCollapsed,
        location
      };
    
  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;