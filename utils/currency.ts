
export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number; // Rate relative to 1 INR
}

const CURRENCY_MAP: Record<string, { code: string; rate: number }> = {
  'INR': { code: 'INR', rate: 1 },
  'USD': { code: 'USD', rate: 0.012 }, // 1/83.5
  'GBP': { code: 'GBP', rate: 0.0095 },
  'JPY': { code: 'JPY', rate: 1.87 },
  'EUR': { code: 'EUR', rate: 0.011 },
  'CNY': { code: 'CNY', rate: 0.087 },
  'BRL': { code: 'BRL', rate: 0.062 },
  'CAD': { code: 'CAD', rate: 0.016 },
  'AUD': { code: 'AUD', rate: 0.018 },
};

// Maps specific regions/locales or timezones to currency codes
const REGION_TO_CURRENCY: Record<string, string> = {
  // Timezones
  'Asia/Kolkata': 'INR',
  'Asia/Calcutta': 'INR',
  'Europe/London': 'GBP',
  'Europe/Paris': 'EUR',
  'Europe/Berlin': 'EUR',
  'Asia/Tokyo': 'JPY',
  'America/New_York': 'USD',
  'America/Los_Angeles': 'USD',
  'America/Chicago': 'USD',
  'America/Toronto': 'CAD',
  'Australia/Sydney': 'AUD',
  'America/Sao_Paulo': 'BRL',
  // Locales
  'en-IN': 'INR',
  'hi-IN': 'INR',
  'en-GB': 'GBP',
  'ja-JP': 'JPY',
  'zh-CN': 'CNY',
  'fr-FR': 'EUR',
  'de-DE': 'EUR',
};

export const getCurrencyConfig = (): CurrencyConfig => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = navigator.language || 'en-IN';
  
  // 1. Try mapping by Timezone (most accurate for location)
  let currencyCode = REGION_TO_CURRENCY[tz];
  
  // 2. Try mapping by exact locale
  if (!currencyCode) {
    currencyCode = REGION_TO_CURRENCY[locale];
  }
  
  // 3. Try mapping by region suffix (e.g., 'IN' from 'en-IN')
  if (!currencyCode && locale.includes('-')) {
    const region = locale.split('-')[1].toUpperCase();
    const regionMap: Record<string, string> = {
      'IN': 'INR',
      'GB': 'GBP',
      'JP': 'JPY',
      'CN': 'CNY',
      'FR': 'EUR',
      'DE': 'EUR',
      'US': 'USD',
      'CA': 'CAD',
      'AU': 'AUD',
      'BR': 'BRL'
    };
    currencyCode = regionMap[region];
  }

  // 4. Default to INR if all else fails (as requested)
  const config = CURRENCY_MAP[currencyCode || 'INR'] || CURRENCY_MAP['INR'];
  
  // Use Intl to get the symbol dynamically based on the detected currency
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: config.code,
  });
  
  const symbol = formatter.formatToParts(0).find(part => part.type === 'currency')?.value || '₹';
  
  return {
    code: config.code,
    symbol,
    rate: config.rate,
  };
};

export const formatPrice = (inrAmount: number, config: CurrencyConfig): string => {
  const localAmount = inrAmount * config.rate;
  return new Intl.NumberFormat(navigator.language || 'en-IN', {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: config.code === 'INR' ? 0 : 2,
  }).format(localAmount);
};
