import {
  useMutation,
} from '@tanstack/react-query';

import {
  useState,
} from 'react';

import {
  useEditorStore,
} from '../../app/project-editor/store/useEditorStore.js';

import {
  serializeEditorDocument,
} from './serializers/documentSerializer.js';

const BACKEND_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8080'
).replace(/\/$/, '');

/**
 * Starts the browser download using the temporary signed URL
 * returned by the export service.
 *
 * @param {string} downloadUrl
 * @param {string} [filename]
 */
const downloadExport = (
  downloadUrl,
  filename
) => {
  if (
    typeof window === 'undefined' ||
    !downloadUrl
  ) {
    return;
  }

  const anchor =
    document.createElement('a');

  anchor.href = downloadUrl;

  if (filename) {
    anchor.download = filename;
  }

  anchor.style.display = 'none';

  document.body.appendChild(anchor);

  anchor.click();

  anchor.remove();
};

/**
 * Parses an SSE event block.
 *
 * Expected format:
 *
 * event: progress
 * data: {"message":"Gathering assets"}
 *
 * @param {string} block
 * @returns {{
 *   event: string,
 *   data: any
 * } | null}
 */
const parseSseEvent = (block) => {
  if (!block?.trim()) {
    return null;
  }

  const lines =
    block.split('\n');

  let event = 'message';
  const dataLines = [];

  for (const line of lines) {
    if (
      line.startsWith('event:')
    ) {
      event =
        line.slice(6).trim();
    }

    if (
      line.startsWith('data:')
    ) {
      dataLines.push(
        line.slice(5).trim()
      );
    }
  }

  if (!dataLines.length) {
    return null;
  }

  const rawData =
    dataLines.join('\n');

  let data = rawData;

  try {
    data = JSON.parse(rawData);
  } catch {
    // Non-JSON SSE payloads remain strings.
  }

  return {
    event,
    data,
  };
};

/**
 * Requests a SCORM export and consumes progress updates
 * through the SSE response stream.
 *
 * @param {Object} params
 * @param {(progress: Object) => void} [params.onProgress]
 *
 * @returns {Promise<Object>}
 */
const dispatchScormExport = async ({
  onProgress,
} = {}) => {
  const stateSnapshot =
    useEditorStore.getState();

  let projectId =
    stateSnapshot.projectId ||
    stateSnapshot.id;

  if (
    !projectId &&
    typeof window !== 'undefined'
  ) {
    projectId =
      new URLSearchParams(
        window.location.search
      ).get('id');

    if (projectId) {
      stateSnapshot.setProjectId(
        projectId
      );
    }
  }

  if (!projectId) {
    throw new Error(
      'Cannot export project: Project ID is missing from editor state.'
    );
  }

  const res = await fetch(
    `${BACKEND_BASE_URL}/api/v1/projects/${encodeURIComponent(
      projectId
    )}/export/scorm`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',

        Accept:
          'text/event-stream',
      },

      credentials: 'include',

      body: JSON.stringify(
        serializeEditorDocument(
          stateSnapshot
        )
      ),
    }
  );

  if (!res.ok) {
    let message =
      'Failed to export project as SCORM package.';

    try {
      const data =
        await res.json();

      message =
        data?.details ||
        data?.error ||
        data?.message ||
        message;
    } catch {
      try {
        const text =
          await res.text();

        if (text) {
          message = text;
        }
      } catch {}
    }

    throw new Error(message);
  }

  if (!res.body) {
    throw new Error(
      'The export server did not provide a response stream.'
    );
  }

  const reader =
    res.body.getReader();

  const decoder =
    new TextDecoder();

  let buffer = '';

  let exportResult = null;

  const handleEvent = (
    parsedEvent
  ) => {
    if (!parsedEvent) {
      return;
    }

    const {
      event,
      data,
    } = parsedEvent;

    /**
     * Progress events update the UI while
     * the export is being generated.
     */
    if (
      event === 'progress' ||
      event === 'message'
    ) {
      if (typeof onProgress === 'function') {
        onProgress({
          type: 'progress',
          message:
            typeof data === 'string'
              ? data
              : data?.message ||
                'Preparing your export...',
          ...(
            data &&
            typeof data === 'object'
              ? data
              : {}
          ),
        });
      }

      return;
    }

    /**
     * Final successful export event.
     */
    if (
      event === 'complete' ||
      event === 'completed' ||
      event === 'success'
    ) {
      exportResult = data;

      return;
    }

    /**
     * Export failure sent through the SSE stream.
     */
    if (
      event === 'error'
    ) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message ||
            data?.error ||
            'Failed to export project as SCORM package.'
      );
    }
  };

  try {
    while (true) {
      const {
        done,
        value,
      } = await reader.read();

      if (done) {
        break;
      }

      buffer +=
        decoder.decode(
          value,
          {
            stream: true,
          }
        );

      /**
       * SSE events are separated by a blank line.
       */
      const events =
        buffer.split(/\r?\n\r?\n/);

      /**
       * Preserve the incomplete trailing event.
       */
      buffer =
        events.pop() || '';

      for (
        const eventBlock of events
      ) {
        const parsedEvent =
          parseSseEvent(
            eventBlock
          );

        handleEvent(
          parsedEvent
        );
      }
    }

    /**
     * Handle any final event remaining in the buffer.
     */
    if (buffer.trim()) {
      const parsedEvent =
        parseSseEvent(buffer);

      handleEvent(
        parsedEvent
      );
    }
  } finally {
    reader.releaseLock();
  }

  if (
    !exportResult ||
    typeof exportResult !== 'object'
  ) {
    throw new Error(
      'The export completed without returning download information.'
    );
  }

  if (
    !exportResult.downloadUrl ||
    typeof exportResult.downloadUrl !== 'string'
  ) {
    throw new Error(
      'The SCORM export did not provide a download URL.'
    );
  }

  return exportResult;
};

export function useScormExport() {
  const [
    progress,
    setProgress,
  ] = useState({
    message: null,
  });

  const exportMutation =
    useMutation({
      mutationFn: () =>
        dispatchScormExport({
          onProgress: (
            progressUpdate
          ) => {
            setProgress(
              progressUpdate
            );
          },
        }),

      onMutate: () => {
        setProgress({
          message:
            'Preparing your export...',
        });
      },

      onSuccess: (
        data
      ) => {
        setProgress({
          message:
            'Your export is ready.',
        });

        downloadExport(
          data.downloadUrl,
          data.export?.filename
        );
      },

      onError: (
        error
      ) => {
        setProgress({
          message: null,
          error:
            error?.message ||
            'Failed to export project.',
        });
      },

      onSettled: () => {
        /*
         * The final success/error state remains
         * available through React Query.
         */
      },
    });

  return {
    exportScorm:
      exportMutation.mutateAsync,

    status:
      exportMutation.isPending
        ? 'exporting'
        : exportMutation.isError
        ? 'error'
        : exportMutation.isSuccess
        ? 'success'
        : 'idle',

    isExporting:
      exportMutation.isPending,

    progressMessage:
      progress.message,

    progress,

    error:
      exportMutation.error?.message ||
      progress.error ||
      null,

    isSuccess:
      exportMutation.isSuccess,

    data:
      exportMutation.data,

    reset: () => {
      exportMutation.reset();

      setProgress({
        message: null,
      });
    },
  };
}