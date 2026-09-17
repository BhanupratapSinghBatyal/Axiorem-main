const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Checks whether an authenticated identity already exists.
 */
export const checkIdentityRequest = async (idToken) => {
  if (!idToken) {
    throw new Error(
      'Missing parameter signature: idToken is mandatory.'
    );
  }

  const response = await fetch(
    `${BACKEND_BASE_URL}/api/v1/auth/check-identity`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ idToken }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.details ||
        data.error ||
        'Identity check failure.'
    );
  }

  return data;
};

/**
 * Creates or synchronizes the authenticated user account.
 */
export const registerUserRequest = async (onboardingPayload) => {
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/v1/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(onboardingPayload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.details ||
        data.error ||
        'Registration failure.'
    );
  }

  return data;
};

/**
 * Logs out the currently authenticated user.
 *
 * POST /api/v1/auth/logout
 */
export const logoutRequest = async () => {
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/v1/auth/logout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.details ||
        data.error ||
        'Logout failed.'
    );
  }

  return data;
};

/**
 * Permanently deletes the currently authenticated user's account.
 *
 * DELETE /api/v1/auth/account
 *
 * The backend performs subscription cancellation and external/local
 * data cleanup before deleting the account.
 */
export const deleteAccountRequest = async () => {
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/v1/auth/account`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.details ||
        data.error ||
        'Account deletion failed.'
    );
  }

  return data;
};