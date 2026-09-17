import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8080';

const EMPTY_CREDITS = Object.freeze({
  availableCredits: 0,
  reservedCredits: 0,
  totalCredits: 0,
  totalGrantedCredits: null,
  totalConsumedCredits: null,
  overage: 0,
  updatedAt: null,
  customerId: null,
  creditEntitlementId: null,
  provider: 'dodo',
});

const fetchJson = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: 'include',

    headers: {
      Accept: 'application/json',

      ...(options.body
        ? {
            'Content-Type': 'application/json',
          }
        : {}),

      ...(options.headers ?? {}),
    },

    ...options,
  });

  const data =
    await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(
      data?.details ||
      data?.error ||
      'Request failed.'
    );

    error.status =
      res.status;

    error.code =
      data?.code ??
      null;

    error.payload =
      data ??
      null;

    throw error;
  }

  return data;
};

const normalizeNumber = (
  value,
  fallback = 0
) => {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const fetchBillingDetails = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error(
      'Missing workspaceId.'
    );
  }

  const data =
    await fetchJson(
      `${BACKEND_BASE_URL}/api/v1/tenant/workspaces/${workspaceId}/billing-status`
    );

  const billing =
    data?.payload?.billing;

  if (
    !billing ||
    typeof billing !== 'object'
  ) {
    throw new Error(
      'Invalid billing data structure received from server.'
    );
  }

  const credits =
    billing.credits &&
    typeof billing.credits === 'object'
      ? billing.credits
      : EMPTY_CREDITS;

  const availableCredits =
    normalizeNumber(
      credits.availableCredits
    );

  const reservedCredits =
    normalizeNumber(
      credits.reservedCredits
    );

  const reportedTotalCredits =
    Number(
      credits.totalCredits
    );

  const totalCredits =
    Number.isFinite(
      reportedTotalCredits
    )
      ? reportedTotalCredits
      : availableCredits +
        reservedCredits;

  return {
    ...billing,

    credits: {
      availableCredits,
      reservedCredits,
      totalCredits,

      totalGrantedCredits:
        credits.totalGrantedCredits ??
        null,

      totalConsumedCredits:
        credits.totalConsumedCredits ??
        null,

      overage:
        normalizeNumber(
          credits.overage
        ),

      updatedAt:
        credits.updatedAt ??
        null,

      customerId:
        credits.customerId ??
        null,

      creditEntitlementId:
        credits.creditEntitlementId ??
        null,

      provider:
        credits.provider ??
        'dodo',
    },
  };
};

const fetchPaymentMethod = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error(
      'Missing workspaceId.'
    );
  }

  return fetchJson(
    `${BACKEND_BASE_URL}/api/v1/payments/customers/${workspaceId}/payment-method`
  );
};

const fetchInvoices = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error(
      'Missing workspaceId.'
    );
  }

  return fetchJson(
    `${BACKEND_BASE_URL}/api/v1/payments/customers/${workspaceId}/invoices`
  );
};

const fetchCustomerData = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error(
      'Missing workspaceId.'
    );
  }

  const data =
    await fetchJson(
      `${BACKEND_BASE_URL}/api/v1/payments/customers/retrieve`,
      {
        method: 'POST',

        body: JSON.stringify({
          workspaceId,
        }),
      }
    );

  return data?.customer ??
    null;
};

export function useBillingData() {
  const personalWorkspaceId =
    useAuthStore(
      (state) =>
        state.user?.personalWorkspaceId ??
        null
    );

  const billingQuery =
    useQuery({
      queryKey: [
        'workspace',
        'billing',
        personalWorkspaceId,
      ],

      queryFn: () =>
        fetchBillingDetails(
          personalWorkspaceId
        ),

      enabled:
        !!personalWorkspaceId,

      staleTime:
        1000 * 60 * 5,

      gcTime:
        1000 * 60 * 15,
    });

  const paymentMethodQuery =
    useQuery({
      queryKey: [
        'workspace',
        'payment-method',
        personalWorkspaceId,
      ],

      queryFn: () =>
        fetchPaymentMethod(
          personalWorkspaceId
        ),

      enabled:
        !!personalWorkspaceId,

      staleTime:
        1000 * 60 * 5,

      gcTime:
        1000 * 60 * 15,
    });

  const invoicesQuery =
    useQuery({
      queryKey: [
        'workspace',
        'invoices',
        personalWorkspaceId,
      ],

      queryFn: () =>
        fetchInvoices(
          personalWorkspaceId
        ),

      enabled:
        !!personalWorkspaceId,

      staleTime:
        1000 * 60 * 5,

      gcTime:
        1000 * 60 * 15,
    });

  const customerQuery =
    useQuery({
      queryKey: [
        'workspace',
        'customer',
        personalWorkspaceId,
      ],

      queryFn: () =>
        fetchCustomerData(
          personalWorkspaceId
        ),

      enabled:
        !!personalWorkspaceId,

      staleTime:
        1000 * 60 * 5,

      gcTime:
        1000 * 60 * 15,
    });

  const billingDetails =
    billingQuery.data ??
    null;

  const credits =
    billingDetails?.credits ??
    EMPTY_CREDITS;

  return {
    workspaceId:
      personalWorkspaceId,

    billingDetails,

    credits,

    availableCredits:
      credits.availableCredits,

    reservedCredits:
      credits.reservedCredits,

    totalCredits:
      credits.totalCredits,

    paymentMethod:
      paymentMethodQuery.data ??
      null,

    invoices:
      invoicesQuery.data?.invoices ??
      [],

    workspaceName:
      invoicesQuery.data?.workspaceName ??
      null,

    customer:
      customerQuery.data ??
      null,

    /*
     * Initial loading only.
     *
     * This should be used for skeletons or blocking
     * first-load UI.
     *
     * A background refetch does not turn this back on
     * once cached data exists.
     */
    isLoading:
      billingQuery.isLoading,

    /*
     * Background activity.
     *
     * Do not use this to replace existing UI with
     * skeletons. Existing cached data should remain
     * visible while this is true.
     */
    isFetching:
      billingQuery.isFetching ||
      paymentMethodQuery.isFetching ||
      invoicesQuery.isFetching ||
      customerQuery.isFetching,

    isBillingLoading:
      billingQuery.isLoading,

    isPaymentMethodLoading:
      paymentMethodQuery.isLoading,

    isInvoicesLoading:
      invoicesQuery.isLoading,

    isCustomerLoading:
      customerQuery.isLoading,

    isBillingFetching:
      billingQuery.isFetching,

    isPaymentMethodFetching:
      paymentMethodQuery.isFetching,

    isInvoicesFetching:
      invoicesQuery.isFetching,

    isCustomerFetching:
      customerQuery.isFetching,

    isError:
      billingQuery.isError,

    isBillingError:
      billingQuery.isError,

    isPaymentMethodError:
      paymentMethodQuery.isError,

    isInvoicesError:
      invoicesQuery.isError,

    isCustomerError:
      customerQuery.isError,

    error:
      billingQuery.error ??
      null,

    billingError:
      billingQuery.error ??
      null,

    paymentMethodError:
      paymentMethodQuery.error ??
      null,

    invoicesError:
      invoicesQuery.error ??
      null,

    customerError:
      customerQuery.error ??
      null,

    billingQuery,
    paymentMethodQuery,
    invoicesQuery,
    customerQuery,
  };
}