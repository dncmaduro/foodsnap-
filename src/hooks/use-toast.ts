
import { Toast, useToast as useToastInternal } from "@/components/ui/toast"

export type { Toast }
export const useToast = useToastInternal

export type ToastActionElement = React.ReactElement<typeof Toast["Action"]>

