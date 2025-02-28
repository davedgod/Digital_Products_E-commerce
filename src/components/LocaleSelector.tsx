import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "react-i18next";

export default function LocaleSelector() {
  const { t } = useTranslation();
  const {
    currentLanguage,
    setCurrentLanguage,
    currentCurrency,
    setCurrentCurrency,
    languages,
    currencies
  } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="absolute -bottom-1 -right-1 text-xs">
            {currentLanguage.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setCurrentLanguage(language)}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
            {currentLanguage.code === language.code && (
              <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>{t('common.currency')}</DropdownMenuLabel>
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setCurrentCurrency(currency)}
          >
            <span className="mr-2">{currency.symbol}</span>
            {currency.name}
            {currentCurrency.code === currency.code && (
              <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}