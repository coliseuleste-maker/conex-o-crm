import { CurrencyCode } from "@/types/international";
import { currencies } from "@/data/internationalData";

const localeMap: Record<CurrencyCode, string> = {
  BRL: "pt-BR",
  USD: "en-US",
  MXN: "es-MX",
  COP: "es-CO",
  ARS: "es-AR",
  CLP: "es-CL",
  PEN: "es-PE",
};

export const formatInternationalCurrency = (value: number, currencyCode: CurrencyCode) =>
  new Intl.NumberFormat(localeMap[currencyCode], { style: "currency", currency: currencyCode }).format(value);

export const convertToUSD = (value: number, fromCurrency: CurrencyCode): number => {
  const currency = currencies.find((c) => c.code === fromCurrency);
  return currency ? value * currency.exchangeRateToUSD : value;
};

export const convertFromUSD = (valueUSD: number, toCurrency: CurrencyCode): number => {
  const currency = currencies.find((c) => c.code === toCurrency);
  return currency && currency.exchangeRateToUSD > 0 ? valueUSD / currency.exchangeRateToUSD : valueUSD;
};

export const formatCompactCurrency = (value: number, currencyCode: CurrencyCode) =>
  new Intl.NumberFormat(localeMap[currencyCode], {
    style: "currency",
    currency: currencyCode,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
