
import { toast as sonnerToast, type ToastT } from "sonner"

type ToastProps = ToastT & {
  variant?: "default" | "destructive" | "success"
}

export function toast({ variant = "default", ...props }: ToastProps) {
  const toastFn = variant === "destructive" ? sonnerToast.error : 
                 variant === "success" ? sonnerToast.success : 
                 sonnerToast;

  return toastFn(props.title, {
    description: props.description,
    ...props,
  })
}

// Create a custom hook for toast that doesn't use the Toaster component
export function useToast() {
  return { toast }
}
