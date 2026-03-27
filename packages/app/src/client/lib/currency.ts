/**
 * Supported display currencies for cost formatting.
 * Costs are always stored as USD micro-dollars; conversion is client-side only.
 */
export type Currency =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'CHF';

export interface CurrencyConfig {
  code: Currency;
  /** Display symbol prefix (e.g. "$", "€", "₹") */
  symbol: string;
  name: string;
  /**
   * Default number of decimal places for typical amounts.
   * Adaptive logic may increase this for very small amounts.
   */
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 6 },
  { code: 'EUR', symbol: '€', name: 'Euro', decimals: 6 },
  { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 6 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 4 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 2 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimals: 6 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 6 },
  { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc', decimals: 6 },
];

export function getCurrencyConfig(code: Currency): CurrencyConfig {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code) ?? SUPPORTED_CURRENCIES[0];
}

/**
 * Convert USD micro-dollars to a target currency and format as a display string.
 *
 * Falls back to USD formatting when:
 * - `currency` is `'USD'`
 * - `rates` is `null` or `undefined` (e.g. exchange-rate API failed)
 * - The requested currency is missing from the rates map
 *
 * Decimal places are adaptive:
 * - For very small converted amounts (< 0.001) we use at least 6 dp.
 * - For large amounts (>= 1 000) we cap at 2 dp.
 * - Otherwise the per-currency default is used.
 */
export function formatMicroDollarsWithCurrency(
  microDollars: number,
  currency: Currency,
  rates: Record<string, number> | null | undefined,
): string {
  const usdAmount = microDollars / 1_000_000;

  // USD or no rates available → plain dollar formatting
  if (currency === 'USD' || !rates?.[currency]) {
    if (usdAmount === 0) return '$0.000000';
    return `$${usdAmount.toFixed(6)}`;
  }

  const config = getCurrencyConfig(currency);
  const rate = rates[currency];
  const amount = usdAmount * rate;

  // Adaptive decimal places
  let decimals = config.decimals;
  if (amount > 0 && amount < 0.001) {
    decimals = Math.max(decimals, 6);
  } else if (amount >= 1_000) {
    decimals = Math.min(decimals, 2);
  }

  return `${config.symbol}${amount.toFixed(decimals)}`;
}
