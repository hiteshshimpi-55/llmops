# Multi-Currency Support
## Problem
All costs are currently stored as USD micro-dollars and displayed with hard-coded `$` formatting scattered across three UI components. There is no way for users to view costs in their preferred currency.
## Current State
* Costs stored in DB as `integer` micro-dollars (USD base) — no schema change needed
* Three client-side display sites: `costs.tsx`, `requests.tsx`, `quick-stats.tsx`
* Server pre-formats strings (e.g. `totalCostFormatted: "$0.007500"`) — raw numeric values are also returned and can be used for conversion
* `useTheme` hook in `hooks/ui/useTheme.ts` is the existing pattern for localStorage-persisted preferences
* `@base-ui/react/select` `Select.Root` pattern (used in `costs.tsx`) is the existing dropdown pattern
## Approach
All conversion happens client-side. Costs remain stored as USD micro-dollars. Exchange rates are fetched from [api.frankfurter.app](https://api.frankfurter.app/latest?from=USD) (free, no API key). Rates are cached via React Query (5-min stale time). Selected currency is persisted to `localStorage`.
## Files to Create
**`packages/app/src/client/lib/currency.ts`**
* `Currency` type union: `'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD' | 'AUD' | 'CHF'`
* `SUPPORTED_CURRENCIES` array with `{ code, symbol, name, decimals }`
* `formatMicroDollarsWithCurrency(microDollars, currency, rates)` — converts USD micro-dollars to the target currency using the provided exchange rates, applies currency-appropriate decimal places; falls back to USD formatting if `rates` is `null`/`undefined` or currency is not in rates
**`packages/app/src/client/hooks/ui/useCurrency.ts`**
* Mirrors `useTheme.ts` pattern exactly
* Reads/writes `llmops-currency` in localStorage
* Returns `{ currency, setCurrency }`
**`packages/app/src/client/hooks/queries/useExchangeRates.ts`**
* React Query hook, `queryKey: ['exchange-rates']`
* Fetches `https://api.frankfurter.app/latest?from=USD`
* `staleTime: 5 * 60 * 1000`, `gcTime: 30 * 60 * 1000`, `retry: 1`
* Returns `data: Record<string, number> | null` (null on fetch failure — caller falls back to USD)
**`packages/app/src/client/components/currency-switcher/currency-switcher.tsx`**
* Uses `Select.Root` from `@base-ui/react/select` — same component used in `costs.tsx`
* Shows current currency code as trigger label
* Dropdown lists all `SUPPORTED_CURRENCIES` with `code — name` format
* Calls `setCurrency` from `useCurrency` on selection change
**`packages/app/src/client/components/currency-switcher/currency-switcher.css.ts`**
* Styles reusing existing `costBreakdownSelect` / `costBreakdownSelectPopup` patterns from `observability.css.ts`
**`packages/app/src/client/components/currency-switcher/index.ts`**
* Re-exports `CurrencySwitcher`
## Files to Modify
**`packages/app/src/client/routes/(app)/observability/_observability.tsx`**
* Import `CurrencySwitcher` and add it to the right `headerGroup` (after `<ObservabilityFilters />`, before `<DateRangePicker />`)
**`packages/app/src/client/routes/(app)/observability/_observability/costs.tsx`**
* Add `useCurrency()` and `useExchangeRates()` calls at the top of `RouteComponent` (before existing early returns, to respect hooks rules)
* Replace all uses of `totalCost?.totalCostFormatted`, `totalCost?.totalInputCostFormatted`, `totalCost?.totalOutputCostFormatted`, `totalCost?.totalCacheSavingsFormatted` with `formatMicroDollarsWithCurrency(Number(totalCost.totalCost), currency, rates)` etc.
* Replace local `formatCost(seg.cost)` calls in segments legend with `formatMicroDollarsWithCurrency`
* Remove local `formatCost` helper (no longer needed)
**`packages/app/src/client/routes/(app)/observability/_observability/requests.tsx`**
* Add `useCurrency()` and `useExchangeRates()` at top of `RouteComponent`
* Replace local `formatCost` / `formatCostFull` helpers with calls to `formatMicroDollarsWithCurrency`
**`packages/app/src/client/routes/(app)/-components/quick-stats.tsx`**
* Add `useCurrency()` and `useExchangeRates()`
* Replace `costs?.totalCostFormatted` with `formatMicroDollarsWithCurrency(Number(costs?.totalCost ?? 0), currency, rates)`
## Edge Cases
* Exchange rate fetch failure → `rates` is `undefined`/`null` → `formatMicroDollarsWithCurrency` falls back to USD formatting
* Currency not in rates response (shouldn't happen for major currencies) → same USD fallback
* Zero amounts: formatted as `$0.000000` in USD, or `€0.000000` etc.
* JPY uses 2 decimal places; INR uses 4; most others use 6 (adaptive: more decimals for very small amounts, fewer for large)
* No backend changes required
