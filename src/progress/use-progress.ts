import { useEffect, useState } from 'react';
import { progressKey, readProgress, type Progress } from './model';

export function useProgress() {
  const [progress, setProgress] = useState(() => readProgress({}));
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const serialized = localStorage.getItem(progressKey);
      if (serialized) setProgress(readProgress(JSON.parse(serialized)));
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || storageError) return;
    try {
      localStorage.setItem(progressKey, JSON.stringify(progress));
    } catch {
      setStorageError(true);
    }
  }, [progress, ready, storageError]);

  function restoreProgress(backup: Progress) {
    setProgress(backup);
    setStorageError(false);
  }

  return { progress, setProgress, restoreProgress, storageError, ready };
}
