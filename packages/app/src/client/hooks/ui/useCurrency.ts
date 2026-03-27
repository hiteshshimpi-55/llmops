import { useState, useCallback } from 'react';
import type { Currency } from '@client/lib/currency';
import { SUPPORTED_CURRENCIES } from '@client/lib/currency';

const CURRENCY_STORAGE_KEY = 'llmops-currency';

const VALID_CURRENCIES = SUPPORTED_CURRENCIES.map((c) => c.code);

function getStoredCurrency(): Currency {
  if (typeof window === 'undefined') return 'USD';
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (stored && (VALID_CURRENCIES as string[]).includes(stored)) {
    return stored as Currency;
  }
  return 'USD';
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>(() =>
    getStoredCurrency()
  );

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  }, []);

  return { currency, setCurrency };
}
