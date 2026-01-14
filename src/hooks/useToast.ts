// src/hooks/useToast.ts
import { useState } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

const toastTimeouts = new Map<string, ReturnType<typeof setInterval>>();

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({
    title,
    description,
    variant = "default",
  }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, title, description, variant };

    setToasts((prev) => [...prev, newToast]);

    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      toastTimeouts.delete(id);
    }, 3000);

    toastTimeouts.set(id, timeout);

    return {
      id,
      dismiss: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        const timeout = toastTimeouts.get(id);
        if (timeout) {
          clearTimeout(timeout);
          toastTimeouts.delete(id);
        }
      },
    };
  };

  return { toasts, toast };
}
