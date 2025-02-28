import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" }
];

const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "KRW", symbol: "₩", name: "Korean Won" }
];

interface LocaleContextType {
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  currentCurrency: Currency;
  setCurrentCurrency: (currency: Currency) => void;
  languages: Language[];
  currencies: Currency[];
  formatPrice: (price: number) => string;
}

const LocaleContext = createContext<LocaleContextType>({} as LocaleContextType);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferredLanguage');
    return saved ? JSON.parse(saved) : languages[0];
  });

  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('preferredCurrency');
    return saved ? JSON.parse(saved) : currencies[0];
  });

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  useEffect(() => {
    localStorage.setItem('preferredLanguage', JSON.stringify(currentLanguage));
    i18n.changeLanguage(currentLanguage.code);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('preferredCurrency', JSON.stringify(currentCurrency));
  }, [currentCurrency]);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    }
  };

  const formatPrice = (price: number) => {
    const rate = exchangeRates[currentCurrency.code] || 1;
    const convertedPrice = price * rate;
    return new Intl.NumberFormat(currentLanguage.code, {
      style: 'currency',
      currency: currentCurrency.code
    }).format(convertedPrice);
  };

  return (
    <LocaleContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage,
        currentCurrency,
        setCurrentCurrency,
        languages,
        currencies,
        formatPrice
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);