import {
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialog as UiAlertDialog,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

interface AlertModalProps {
  action: string;
  open: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  textWarning?: string;
}
function AlertModal({ variant, action, onConfirm, isLoading, open, onClose, textWarning }: AlertModalProps) {
  return (
    <UiAlertDialog open={open}>
      <AlertDialogTrigger className="hidden"></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
          <AlertDialogDescription>
            {(textWarning && <span className="text-red-400">{textWarning}</span>) || "Thao tác này không thể hoàn tác"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({
              variant: variant || "default",
              className: "min-w-19",
            })}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {/* {isLoading ? <LoadingButton /> : action} */}
            {action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </UiAlertDialog>
  );
}

export default AlertModal;
