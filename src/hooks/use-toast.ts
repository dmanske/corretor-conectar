
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  variant?: "default" | "destructive" | "success";
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

// We need to properly map our custom ToastProps to what sonner expects
export function toast(props: ToastProps) {
  const { title, description, variant, action, ...rest } = props;
  
  // Call sonner toast with the correct parameters format
  return sonnerToast(title as string, {
    description,
    action,
    ...rest,
    // Map our variants to sonner's styling if needed
    className: variant === "destructive" ? "destructive" : 
              variant === "success" ? "success" : ""
  });
}

export const useToast = () => {
  return {
    toast
  };
};
