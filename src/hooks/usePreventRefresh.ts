import { useEffect } from "react";

/**
 * Hook to prevent accidental page refreshes or navigation away
 * during exams, tests, or practice sessions
 *
 * @param isActive Whether the prevention should be active
 * @param message Custom message to display (browser support varies)
 */
export function usePreventRefresh(
  isActive: boolean,
  message = "You have unsaved progress. Are you sure you want to leave this page?"
) {
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      (event as { returnValue: string }).returnValue = message;

      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isActive, message]);
}
