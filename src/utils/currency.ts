import { useLocale } from "@/contexts/LocaleContext";

export function useFormatPrice() {
  const { currentCurrency } = useLocale();
  
  return (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCurrency.code
    }).format(price);
  };
}