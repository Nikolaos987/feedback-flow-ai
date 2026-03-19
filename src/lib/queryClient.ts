import { MutationCache, QueryClient, type QueryKey } from "@tanstack/react-query";
// import i18next from "i18next";
// import { toast } from "sonner";

// import { toastStyles } from "@/constants/toast/toastStyles";

// import type { ApiError, ApiResponse } from "@/types/auth";

/**
 * Util to call when we need the queryClient from the tanstack query,
 * also make global changes for the queryClient for all queries or mutations we need.
 *
 * On this file we global handler events on the UI flow.
 */

/** Declare global those meta values. */
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      /**
       * Make all the queries invalidate when we change the language globally.
       */
      queryKeyHashFn: (queryKey) => {
        const keyWithLang = Array.isArray(queryKey)
          ? [...queryKey]
          : [queryKey];

        return JSON.stringify(keyWithLang);
      },
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      // const response = _data // as ApiResponse;

      // const message = mutation.meta?.successMessage || response?.message;
      // toast.success(message, { style: toastStyles.success });
    },
    onError: (_error, _variables, _context, mutation) => {
      // const error = _error // as ApiError;

      /** Flat the validation error message if it's more than 1 */
      // const validationMessage = error?.validationErrors
      //   ? Object.values(error.validationErrors).flat().join(", ")
      //   : error.message;

      /** Show the custom meta errorMessage or the API message */
      // toast.error(mutation.meta?.errorMessage || validationMessage, {
      //   style: toastStyles.error,
      // });
    },
    /** Accept array of queries [] or without if it's only 1 queryKey we want to invalidate.*/
    onSettled: (_data, _error, _variables, _context, mutation) => {
      {
        if (mutation.meta?.invalidatesQuery) {
          const queries = Array.isArray(mutation.meta.invalidatesQuery)
            ? mutation.meta.invalidatesQuery
            : [mutation.meta.invalidatesQuery];

          for (const key of queries) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        }
      }
    },
  }),
});
