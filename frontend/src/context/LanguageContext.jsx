import { createContext, useContext, useState, useEffect } from 'react';
import { ru } from '../lang/ru';
import { en } from '../lang/en';

const LanguageContext = createContext();

const translations = { ru, en };

export const LanguageProvider = ({ children }) => {
  // Получаем язык из localStorage или используем 'ru' по умолчанию
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'ru';
  });

  // Сохраняем выбор языка в localStorage
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = translations[lang];

  const changeLanguage = (language) => {
    setLang(language);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};