import { useQuery } from '@tanstack/react-query';

const EXCHANGE_RATE_API_URL =
  'https://api.frankfurter.app/latest?from=USD';

/**
 * Fetch USD-based exchange rates from api.frankfurter.app.
 *
 * - Rates are cached for 5 minutes (staleTime) and kept for 30 minutes (gcTime).
 * - On fetch failure the query data remains `undefined`; callers should treat
 *   that as "fall back to USD".
 * - Only one request is made regardless of how many components use this hook
 *   (React Query deduplication).
 */
export const useExchangeRates = () => {
  return useQuery<Record<string, number> | null>({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      try {
        const response = await fetch(EXCHANGE_RATE_API_URL);
        if (!response.ok) return null;
        const data = (await response.json()) as {
          rates: Record<string, number>;
        };
        return data.rates;
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
};
