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

const fetchCreditDetails = async (
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

  const rawCredits =
    data?.payload?.billing?.credits;

  if (
    !rawCredits ||
    typeof rawCredits !== 'object'
  ) {
    return {
      ...EMPTY_CREDITS,
    };
  }

  const availableCredits =
    normalizeNumber(
      rawCredits.availableCredits
    );

  const reservedCredits =
    normalizeNumber(
      rawCredits.reservedCredits
    );

  const reportedTotalCredits =
    Number(
      rawCredits.totalCredits
    );

  const totalCredits =
    Number.isFinite(
      reportedTotalCredits
    )
      ? reportedTotalCredits
      : availableCredits +
        reservedCredits;

  return {
    availableCredits,

    reservedCredits,

    totalCredits,

    totalGrantedCredits:
      rawCredits.totalGrantedCredits ??
      null,

    totalConsumedCredits:
      rawCredits.totalConsumedCredits ??
      null,

    overage:
      normalizeNumber(
        rawCredits.overage
      ),

    updatedAt:
      rawCredits.updatedAt ??
      null,
  };
};

export function useCreditDetails() {
  const lastAccessedWorkspaceId =
    useAuthStore(
      (state) =>
        state.user?.lastAccessedWorkspaceId ??
        null
    );

  const creditQuery =
    useQuery({
      queryKey: [
        'workspace',
        'credits',
        lastAccessedWorkspaceId,
      ],

      queryFn: () =>
        fetchCreditDetails(
          lastAccessedWorkspaceId
        ),

      enabled:
        !!lastAccessedWorkspaceId,

      staleTime:
        1000 * 60 * 5,

      gcTime:
        1000 * 60 * 15,
    });

  const credits =
    creditQuery.data ??
    EMPTY_CREDITS;

  return {
    workspaceId:
      lastAccessedWorkspaceId,

    credits,

    availableCredits:
      credits.availableCredits,

    reservedCredits:
      credits.reservedCredits,

    totalCredits:
      credits.totalCredits,

    totalGrantedCredits:
      credits.totalGrantedCredits,

    totalConsumedCredits:
      credits.totalConsumedCredits,

    overage:
      credits.overage,

    updatedAt:
      credits.updatedAt,

    isLoading:
      creditQuery.isLoading,

    isFetching:
      creditQuery.isFetching,

    isError:
      creditQuery.isError,

    error:
      creditQuery.error ??
      null,

    refetch:
      creditQuery.refetch,

    creditQuery,
  };
}