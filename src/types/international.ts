export interface Country {
  id: string;
  name: string;
  code: string;
  language: string;
  currency: CurrencyCode;
  timezone: string;
  phonePrefix: string;
  phoneFormat: string;
  taxDocumentType: string;
  taxDocumentLabel: string;
  flag: string;
}

export type CurrencyCode = "BRL" | "USD" | "MXN" | "COP" | "ARS" | "CLP" | "PEN";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRateToUSD: number;
}

export type LanguageCode = "pt" | "es" | "en";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export interface InternationalLead {
  id: string;
  countryId: string;
  businessName: string;
  taxDocument: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  industry: string;
  potentialValue: number;
  currency: CurrencyCode;
  status: "new" | "contacted" | "qualified" | "negotiation" | "closed" | "lost";
  createdAt: string;
}

export interface InternationalCompany {
  id: string;
  countryId: string;
  businessName: string;
  tradeName?: string;
  taxDocument: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  city: string;
  industry: string;
  createdAt: string;
}
