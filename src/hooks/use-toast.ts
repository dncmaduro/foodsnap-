
import { toast as sonnerToast, type ToastT } from "sonner";
import { useState, useEffect } from "react";

type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  action?: React.ReactNode;
  id?: string;
};

type Toast = {
  id: string;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant: "default" | "destructive";
  duration: number;
};

let toastCount = 0;

export function toast({
  title,
  description,
  variant = "default",
  duration = 3000,
  action,
}: ToastProps) {
  const id = String(toastCount++);
  return sonnerToast(title, {
    id,
    description,
    duration,
    action,
    className: variant === "destructive" ? "destructive" : undefined,
  });
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      }
    },
  };
};
