import { Country, Currency, Language, InternationalLead, InternationalCompany } from "@/types/international";

export const countries: Country[] = [
  { id: "br", name: "Brasil", code: "BR", language: "pt", currency: "BRL", timezone: "America/Sao_Paulo", phonePrefix: "+55", phoneFormat: "(XX) XXXXX-XXXX", taxDocumentType: "CNPJ", taxDocumentLabel: "CNPJ", flag: "🇧🇷" },
  { id: "mx", name: "México", code: "MX", language: "es", currency: "MXN", timezone: "America/Mexico_City", phonePrefix: "+52", phoneFormat: "(XX) XXXX-XXXX", taxDocumentType: "RFC", taxDocumentLabel: "RFC", flag: "🇲🇽" },
  { id: "co", name: "Colombia", code: "CO", language: "es", currency: "COP", timezone: "America/Bogota", phonePrefix: "+57", phoneFormat: "(XXX) XXX-XXXX", taxDocumentType: "NIT", taxDocumentLabel: "NIT", flag: "🇨🇴" },
  { id: "ar", name: "Argentina", code: "AR", language: "es", currency: "ARS", timezone: "America/Argentina/Buenos_Aires", phonePrefix: "+54", phoneFormat: "(XX) XXXX-XXXX", taxDocumentType: "CUIT", taxDocumentLabel: "CUIT", flag: "🇦🇷" },
  { id: "cl", name: "Chile", code: "CL", language: "es", currency: "CLP", timezone: "America/Santiago", phonePrefix: "+56", phoneFormat: "(X) XXXX-XXXX", taxDocumentType: "RUT", taxDocumentLabel: "RUT", flag: "🇨🇱" },
  { id: "pe", name: "Perú", code: "PE", language: "es", currency: "PEN", timezone: "America/Lima", phonePrefix: "+51", phoneFormat: "(XXX) XXX-XXX", taxDocumentType: "RUC", taxDocumentLabel: "RUC", flag: "🇵🇪" },
  { id: "us", name: "United States", code: "US", language: "en", currency: "USD", timezone: "America/New_York", phonePrefix: "+1", phoneFormat: "(XXX) XXX-XXXX", taxDocumentType: "EIN", taxDocumentLabel: "EIN", flag: "🇺🇸" },
];

export const currencies: Currency[] = [
  { code: "BRL", symbol: "R$", name: "Real Brasileiro", exchangeRateToUSD: 0.20 },
  { code: "USD", symbol: "$", name: "US Dollar", exchangeRateToUSD: 1.00 },
  { code: "MXN", symbol: "MX$", name: "Peso Mexicano", exchangeRateToUSD: 0.058 },
  { code: "COP", symbol: "COL$", name: "Peso Colombiano", exchangeRateToUSD: 0.00024 },
  { code: "ARS", symbol: "AR$", name: "Peso Argentino", exchangeRateToUSD: 0.0011 },
  { code: "CLP", symbol: "CL$", name: "Peso Chileno", exchangeRateToUSD: 0.0011 },
  { code: "PEN", symbol: "S/", name: "Sol Peruano", exchangeRateToUSD: 0.27 },
];

export const languages: Language[] = [
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "en", name: "English", nativeName: "English" },
];

export const mockInternationalLeads: InternationalLead[] = [
  { id: "il1", countryId: "br", businessName: "TechBrasil LTDA", taxDocument: "12.345.678/0001-90", phone: "+55 (11) 99999-1234", email: "contato@techbrasil.com", state: "SP", city: "São Paulo", industry: "Tecnologia", potentialValue: 150000, currency: "BRL", status: "qualified", createdAt: "2025-12-01" },
  { id: "il2", countryId: "us", businessName: "CloudTech Inc", taxDocument: "12-3456789", phone: "+1 (415) 555-0123", email: "info@cloudtech.com", state: "CA", city: "San Francisco", industry: "Technology", potentialValue: 85000, currency: "USD", status: "negotiation", createdAt: "2025-12-05" },
  { id: "il3", countryId: "mx", businessName: "Digital Solutions SA de CV", taxDocument: "DSO120315AB1", phone: "+52 (55) 1234-5678", email: "ventas@digitalsolutions.mx", state: "CDMX", city: "Ciudad de México", industry: "Marketing Digital", potentialValue: 450000, currency: "MXN", status: "new", createdAt: "2025-12-08" },
  { id: "il4", countryId: "co", businessName: "InnovaColombia SAS", taxDocument: "900.123.456-7", phone: "+57 (301) 234-5678", email: "info@innovacolombia.co", state: "Cundinamarca", city: "Bogotá", industry: "Fintech", potentialValue: 120000000, currency: "COP", status: "contacted", createdAt: "2025-12-10" },
  { id: "il5", countryId: "ar", businessName: "TechArgentina SA", taxDocument: "30-12345678-9", phone: "+54 (11) 4567-8901", email: "contacto@techargentina.ar", state: "Buenos Aires", city: "Buenos Aires", industry: "E-commerce", potentialValue: 5500000, currency: "ARS", status: "qualified", createdAt: "2025-11-28" },
  { id: "il6", countryId: "cl", businessName: "ChileTech SpA", taxDocument: "76.123.456-7", phone: "+56 (2) 2345-6789", email: "contacto@chiletech.cl", state: "RM", city: "Santiago", industry: "SaaS", potentialValue: 28000000, currency: "CLP", status: "closed", createdAt: "2025-11-15" },
  { id: "il7", countryId: "pe", businessName: "PerúDigital SAC", taxDocument: "20123456789", phone: "+51 (1) 234-567", email: "info@perudigital.pe", state: "Lima", city: "Lima", industry: "Educación", potentialValue: 95000, currency: "PEN", status: "new", createdAt: "2025-12-12" },
  { id: "il8", countryId: "us", businessName: "DataDriven LLC", taxDocument: "98-7654321", phone: "+1 (212) 555-0456", email: "hello@datadriven.com", state: "NY", city: "New York", industry: "Analytics", potentialValue: 120000, currency: "USD", status: "closed", createdAt: "2025-10-20" },
  { id: "il9", countryId: "br", businessName: "MarketBR LTDA", taxDocument: "98.765.432/0001-10", phone: "+55 (21) 98888-5678", email: "contato@marketbr.com.br", state: "RJ", city: "Rio de Janeiro", industry: "Marketing", potentialValue: 88000, currency: "BRL", status: "negotiation", createdAt: "2025-12-03" },
  { id: "il10", countryId: "mx", businessName: "LogísticaMX SA de CV", taxDocument: "LMX200101ABC", phone: "+52 (33) 9876-5432", email: "ops@logisticamx.mx", state: "Jalisco", city: "Guadalajara", industry: "Logística", potentialValue: 680000, currency: "MXN", status: "qualified", createdAt: "2025-12-06" },
];

export const mockInternationalCompanies: InternationalCompany[] = [
  { id: "ic1", countryId: "br", businessName: "TechBrasil LTDA", tradeName: "TechBR", taxDocument: "12.345.678/0001-90", phone: "+55 (11) 3333-4444", email: "contato@techbrasil.com", address: "Av. Paulista, 1000", state: "SP", city: "São Paulo", industry: "Tecnologia", createdAt: "2025-10-01" },
  { id: "ic2", countryId: "us", businessName: "CloudTech Inc", taxDocument: "12-3456789", phone: "+1 (415) 555-0123", email: "info@cloudtech.com", address: "100 Market St", state: "CA", city: "San Francisco", industry: "Technology", createdAt: "2025-10-15" },
  { id: "ic3", countryId: "mx", businessName: "Digital Solutions SA de CV", tradeName: "DigiSol", taxDocument: "DSO120315AB1", phone: "+52 (55) 1234-5678", email: "ventas@digitalsolutions.mx", address: "Paseo de la Reforma 250", state: "CDMX", city: "Ciudad de México", industry: "Marketing Digital", createdAt: "2025-11-01" },
  { id: "ic4", countryId: "co", businessName: "InnovaColombia SAS", taxDocument: "900.123.456-7", phone: "+57 (301) 234-5678", email: "info@innovacolombia.co", address: "Cra 7 #71-21", state: "Cundinamarca", city: "Bogotá", industry: "Fintech", createdAt: "2025-11-10" },
];
