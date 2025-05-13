
import { toast as sonnerToast, type Toast } from "sonner"

type ToastProps = Toast & {
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

export { useToast } from "sonner"
