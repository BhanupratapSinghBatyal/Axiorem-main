"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

/**
 * Axiorem SCORM Viewer - Frontend Hook
 *
 * Provides the Next.js frontend with a small API for:
 *
 * - Uploading a SCORM 1.2 ZIP.
 * - Tracking upload progress.
 * - Tracking backend package-processing state.
 * - Resolving a hosted SCORM package.
 * - Fetching player information.
 * - Checking package readiness.
 * - Fetching safe player metadata.
 * - Deleting a hosted package.
 */

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const DEFAULT_API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8080";

const DEFAULT_API_PATH =
  "/api/v1/scorm-viewer";

// -----------------------------------------------------------------------------
// Error
// -----------------------------------------------------------------------------

class ScormViewerClientError extends Error {
  constructor(message, options = {}) {
    super(message);

    this.name =
      "ScormViewerClientError";

    this.code =
      options.code ??
      "SCORM_VIEWER_CLIENT_ERROR";

    this.status =
      options.status ??
      null;

    this.details =
      options.details ??
      null;

    Object.setPrototypeOf(
      this,
      new.target.prototype
    );
  }
}

// -----------------------------------------------------------------------------
// Validation helpers
// -----------------------------------------------------------------------------

const isNonEmptyString = (
  value
) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
};

const assertPublicId = (
  publicId
) => {
  if (
    !isNonEmptyString(
      publicId
    )
  ) {
    throw new ScormViewerClientError(
      "A SCORM package public identifier is required.",
      {
        code:
          "SCORM_PUBLIC_ID_REQUIRED",
      }
    );
  }

  return publicId.trim();
};

// -----------------------------------------------------------------------------
// URL helpers
// -----------------------------------------------------------------------------

const normalizeBaseUrl = (
  value
) => {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .trim()
    .replace(
      /\/+$/,
      ""
    );
};

const normalizeApiPath = (
  value
) => {
  if (
    !isNonEmptyString(
      value
    )
  ) {
    return DEFAULT_API_PATH;
  }

  const normalized =
    value
      .trim()
      .replace(
        /^\/+/,
        ""
      )
      .replace(
        /\/+$/,
        ""
      );

  return `/${normalized}`;
};

const buildApiUrl = (
  apiBaseUrl,
  apiPath,
  suffix = ""
) => {
  const base =
    normalizeBaseUrl(
      apiBaseUrl
    );

  const path =
    normalizeApiPath(
      apiPath
    );

  const normalizedSuffix =
    suffix
      ? `/${String(suffix).replace(
          /^\/+/,
          ""
        )}`
      : "";

  return `${base}${path}${normalizedSuffix}`;
};

// -----------------------------------------------------------------------------
// Response handling
// -----------------------------------------------------------------------------

const parseResponseBody = async (
  response
) => {
  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text =
    await response.text();

  return text
    ? {
        success:
          response.ok,

        data:
          text,
      }
    : null;
};

const createRequestError = (
  response,
  body,
  fallbackMessage
) => {
  const responseError =
    body?.error;

  return new ScormViewerClientError(
    responseError?.message ??
      (typeof responseError === "string" ? responseError : fallbackMessage),
    {
      code:
        responseError?.code ??
        "SCORM_VIEWER_REQUEST_FAILED",

      status:
        response.status,

      details:
        responseError?.details ??
        null,
    }
  );
};

const assertSuccessfulResponse =
  async (
    response,
    fallbackMessage =
      "SCORM viewer request failed."
  ) => {
    const body =
      await parseResponseBody(
        response
      );

    if (
      response.ok
    ) {
      return body;
    }

    throw createRequestError(
      response,
      body,
      fallbackMessage
    );
  };

const unwrapData = (
  body
) => {
  return (
    body?.data ??
    body
  );
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * useScormViewer
 *
 * @param {Object} [options]
 * @param {string} [options.apiBaseUrl]
 * @param {string} [options.apiPath]
 *
 * @returns {Object}
 */
export const useScormViewer = (
  options = {}
) => {
  const {
    apiBaseUrl =
      DEFAULT_API_BASE_URL,

    apiPath =
      DEFAULT_API_PATH,
  } = options;

  const resolvedApiBaseUrl =
    useMemo(
      () =>
        normalizeBaseUrl(
          apiBaseUrl
        ),
      [apiBaseUrl]
    );

  const resolvedApiPath =
    useMemo(
      () =>
        normalizeApiPath(
          apiPath
        ),
      [apiPath]
    );

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState(0);

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    packageData,
    setPackageData,
  ] = useState(null);

  const [
    playerData,
    setPlayerData,
  ] = useState(null);

  const [
    readiness,
    setReadiness,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState(null);

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const clearError =
    useCallback(() => {
      setError(null);
    }, []);

  const reset =
    useCallback(() => {
      setUploading(false);
      setUploadProgress(0);
      setProcessing(false);

      setPackageData(null);
      setPlayerData(null);
      setReadiness(null);

      setError(null);
    }, []);

  // ---------------------------------------------------------------------------
  // Upload
  // ---------------------------------------------------------------------------

  const uploadPackage =
    useCallback(
      (file) => {
        return new Promise(
          (
            resolve,
            reject
          ) => {
            if (
              typeof File ===
                "undefined" ||
              !(file instanceof File)
            ) {
              const uploadError =
                new ScormViewerClientError(
                  "A SCORM package file is required.",
                  {
                    code:
                      "SCORM_FILE_REQUIRED",
                  }
                );

              setError(
                uploadError
              );

              reject(
                uploadError
              );

              return;
            }

            const fileName =
              file.name?.trim() ??
              "";

            if (
              !fileName
                .toLowerCase()
                .endsWith(".zip")
            ) {
              const uploadError =
                new ScormViewerClientError(
                  "The SCORM package must be a ZIP file.",
                  {
                    code:
                      "SCORM_FILE_MUST_BE_ZIP",
                  }
                );

              setError(
                uploadError
              );

              reject(
                uploadError
              );

              return;
            }

            setUploading(true);
            setProcessing(true);
            setUploadProgress(0);
            setError(null);

            const formData =
              new FormData();

            formData.append(
              "file",
              file
            );

            const xhr =
              new XMLHttpRequest();

            xhr.open(
              "POST",
              buildApiUrl(
                resolvedApiBaseUrl,
                resolvedApiPath
              )
            );

            xhr.setRequestHeader(
              "Accept",
              "application/json"
            );

            xhr.upload.onprogress =
              (event) => {
                if (
                  !event.lengthComputable
                ) {
                  return;
                }

                const progress =
                  Math.round(
                    (
                      event.loaded /
                      event.total
                    ) *
                      100
                  );

                setUploadProgress(
                  Math.min(
                    100,
                    Math.max(
                      0,
                      progress
                    )
                  )
                );
              };

            xhr.onerror =
              () => {
                const uploadError =
                  new ScormViewerClientError(
                    "Unable to connect to the SCORM viewer service.",
                    {
                      code:
                        "SCORM_NETWORK_ERROR",
                    }
                  );

                setUploading(false);
                setProcessing(false);
                setError(
                  uploadError
                );

                reject(
                  uploadError
                );
              };

            xhr.onabort =
              () => {
                const uploadError =
                  new ScormViewerClientError(
                    "SCORM package upload was cancelled.",
                    {
                      code:
                        "SCORM_UPLOAD_CANCELLED",
                    }
                  );

                setUploading(false);
                setProcessing(false);
                setError(
                  uploadError
                );

                reject(
                  uploadError
                );
              };

            xhr.onload =
              () => {
                let body = null;

                try {
                  body =
                    xhr.responseText
                      ? JSON.parse(
                          xhr.responseText
                        )
                      : null;
                } catch {
                  body = null;
                }

                if (
                  xhr.status >= 200 &&
                  xhr.status < 300
                ) {
                  const result =
                    unwrapData(
                      body
                    );

                  const returnedPackage =
                    result?.package ??
                    null;

                  const returnedStatus =
                    returnedPackage?.status ??
                    result?.status ??
                    null;

                  const isProcessing =
                    returnedStatus ===
                    "PROCESSING";

                  const isReady =
                    returnedStatus ===
                    "READY" ||
                    result?.ready ===
                      true;

                  setUploading(false);
                  setUploadProgress(100);

                  setProcessing(
                    isProcessing
                  );

                  setPackageData(
                    returnedPackage
                  );

                  setPlayerData(
                    result
                  );

                  setReadiness({
                    ready:
                      isReady,

                    status:
                      returnedStatus,
                  });

                  setError(null);

                  resolve(
                    result
                  );

                  return;
                }

                const responseError =
                  body?.error;

                const uploadError =
                  new ScormViewerClientError(
                    responseError?.message ??
                      (typeof responseError === "string" ? responseError : "SCORM package upload failed."),
                    {
                      code:
                        responseError?.code ??
                        "SCORM_UPLOAD_FAILED",

                      status:
                        xhr.status,

                      details:
                        responseError?.details ??
                        null,
                    }
                  );

                setUploading(false);
                setProcessing(false);
                setError(
                  uploadError
                );

                reject(
                  uploadError
                );
              };

            xhr.send(
              formData
            );
          }
        );
      },
      [
        resolvedApiBaseUrl,
        resolvedApiPath,
      ]
    );

  // ---------------------------------------------------------------------------
  // Fetch package
  // ---------------------------------------------------------------------------

  const getPackage =
    useCallback(
      async (
        publicId
      ) => {
        const normalizedPublicId =
          assertPublicId(
            publicId
          );

        setError(null);

        try {
          const response =
            await fetch(
              buildApiUrl(
                resolvedApiBaseUrl,
                resolvedApiPath,
                encodeURIComponent(
                  normalizedPublicId
                )
              ),
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",
                },

                cache:
                  "no-store",
              }
            );

          const body =
            await assertSuccessfulResponse(
              response,
              "Unable to fetch the SCORM package."
            );

          const result =
            unwrapData(
              body
            );

          setPackageData(
            result
          );

          return result;
        } catch (
          requestError
        ) {
          const normalizedError =
            requestError instanceof
            ScormViewerClientError
              ? requestError
              : new ScormViewerClientError(
                  "Unable to fetch the SCORM package.",
                  {
                    code:
                      "SCORM_NETWORK_ERROR",

                    details:
                      requestError,
                  }
                );

          setError(
            normalizedError
          );

          throw normalizedError;
        }
      },
      [
        resolvedApiBaseUrl,
        resolvedApiPath,
      ]
    );

  // ---------------------------------------------------------------------------
  // Fetch player information
  // ---------------------------------------------------------------------------

  const getPlayer =
    useCallback(
      async (
        publicId
      ) => {
        const normalizedPublicId =
          assertPublicId(
            publicId
          );

        setError(null);

        try {
          const response =
            await fetch(
              buildApiUrl(
                resolvedApiBaseUrl,
                resolvedApiPath,
                `${encodeURIComponent(
                  normalizedPublicId
                )}/player`
              ),
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",
                },

                cache:
                  "no-store",
              }
            );

          const body =
            await assertSuccessfulResponse(
              response,
              "Unable to fetch SCORM player information."
            );

          const result =
            unwrapData(
              body
            );

          setPlayerData(
            result
          );

          return result;
        } catch (
          requestError
        ) {
          const normalizedError =
            requestError instanceof
            ScormViewerClientError
              ? requestError
              : new ScormViewerClientError(
                  "Unable to fetch SCORM player information.",
                  {
                    code:
                      "SCORM_NETWORK_ERROR",

                    details:
                      requestError,
                  }
                );

          setError(
            normalizedError
          );

          throw normalizedError;
        }
      },
      [
        resolvedApiBaseUrl,
        resolvedApiPath,
      ]
    );

  // ---------------------------------------------------------------------------
  // Readiness
  // ---------------------------------------------------------------------------

  const checkReadiness =
    useCallback(
      async (
        publicId
      ) => {
        const normalizedPublicId =
          assertPublicId(
            publicId
          );

        setError(null);

        try {
          const response =
            await fetch(
              buildApiUrl(
                resolvedApiBaseUrl,
                resolvedApiPath,
                `${encodeURIComponent(
                  normalizedPublicId
                )}/readiness`
              ),
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",
                },

                cache:
                  "no-store",
              }
            );

          const body =
            await assertSuccessfulResponse(
              response,
              "Unable to check SCORM package readiness."
            );

          const result =
            unwrapData(
              body
            );

          setReadiness(
            result
          );

          setProcessing(
            result?.status ===
              "PROCESSING"
          );

          return result;
        } catch (
          requestError
        ) {
          const normalizedError =
            requestError instanceof
            ScormViewerClientError
              ? requestError
              : new ScormViewerClientError(
                  "Unable to check SCORM package readiness.",
                  {
                    code:
                      "SCORM_NETWORK_ERROR",

                    details:
                      requestError,
                  }
                );

          setError(
            normalizedError
          );

          throw normalizedError;
        }
      },
      [
        resolvedApiBaseUrl,
        resolvedApiPath,
      ]
    );

  // ---------------------------------------------------------------------------
  // Player metadata
  // ---------------------------------------------------------------------------

  const getPlayerMetadata =
    useCallback(
      async (
        publicId
      ) => {
        const normalizedPublicId =
          assertPublicId(
            publicId
          );

        setError(null);

        try {
          const response =
            await fetch(
              buildApiUrl(
                resolvedApiBaseUrl,
                resolvedApiPath,
                `${encodeURIComponent(
                  normalizedPublicId
                )}/metadata`
              ),
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",
                },

                cache:
                  "no-store",
              }
            );

          const body =
            await assertSuccessfulResponse(
              response,
              "Unable to fetch SCORM player metadata."
            );

          return unwrapData(
            body
          );
        } catch (
          requestError
        ) {
          const normalizedError =
            requestError instanceof
            ScormViewerClientError
              ? requestError
              : new ScormViewerClientError(
                  "Unable to fetch SCORM player metadata.",
                  {
                    code:
                      "SCORM_NETWORK_ERROR",

                    details:
                      requestError,
                  }
                );

          setError(
            normalizedError
          );

          throw normalizedError;
        }
      },
      [
        resolvedApiBaseUrl,
        resolvedApiPath,
      ]
    );

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  const deletePackage =
    useCallback(
      async (
        publicId
      ) => {
        const normalizedPublicId =
          assertPublicId(
            publicId
          );

        setError(null);

        try {
          const response =
            await fetch(
              buildApiUrl(
                resolvedApiBaseUrl,
                resolvedApiPath,
                encodeURIComponent(
                  normalizedPublicId
                )
              ),
              {
                method:
                  "DELETE",

                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          const body =
            await assertSuccessfulResponse(
              response,
              "Unable to delete the SCORM package."
            );

          const result =
            unwrapData(
              body
            );

          setPackageData(
            null
          );

          setPlayerData(
            null
          );

          setReadiness(
            null
          );

          setProcessing(
            false
          );

          return result;
        } catch (
          requestError
        ) {
          const normalizedError =
            requestError instanceof
            ScormViewerClientError
              ? requestError
              : new ScormViewerClientError(
                  "Unable to delete the SCORM package.",
                  {
                    code:
                      "SCORM_NETWORK_ERROR",

                    details:
                      requestError,
                  }
                );

          setError(
            normalizedError
          );

          throw normalizedError;
        }
      },
      [
        resolvedApiBaseUrl,
        resolvedApiPath,
      ]
    );

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  return {
    uploading,
    uploadProgress,
    processing,
    packageData,
    playerData,
    readiness,
    error,

    uploadPackage,
    getPackage,
    getPlayer,
    checkReadiness,
    getPlayerMetadata,
    deletePackage,

    clearError,
    reset,
  };
};

export {
  ScormViewerClientError,
};