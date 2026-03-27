import { Select } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import { useCurrency } from '@client/hooks/ui/useCurrency';
import { SUPPORTED_CURRENCIES, type Currency } from '@client/lib/currency';
import * as styles from './currency-switcher.css';

/**
 * Compact currency selector that persists the user's choice to localStorage.
 * Intended to be placed in the Observability page header.
 */
export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select.Root
      value={currency}
      onValueChange={(value) => setCurrency(value as Currency)}
    >
      <Select.Trigger className={styles.trigger}>
        <span className={styles.triggerLabel}>{currency}</span>
        <Select.Icon className={styles.icon}>
          <ChevronDown size={12} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className={styles.positioner} sideOffset={4}>
          <Select.Popup className={styles.popup}>
            {SUPPORTED_CURRENCIES.map((c) => (
              <Select.Item
                key={c.code}
                value={c.code}
                className={styles.option}
              >
                <Select.ItemIndicator className={styles.itemIndicator}>
                  <Check size={14} />
                </Select.ItemIndicator>
                <Select.ItemText>
                  {c.code} — {c.name}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
