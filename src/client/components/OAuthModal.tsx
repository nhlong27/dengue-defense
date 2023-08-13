import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/client/components/ui/alert-dialog";
import { Accessibility, Stethoscope } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "./ui/use-toast";
import { RotatingLines } from "react-loader-spinner";

const OAuthModal = ({
  isOAuthUser,
}: {
  isOAuthUser: {
    email: string | null;
} }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [role, setRole] = React.useState<"ADMIN" | "USER" | null>(null);

  const updateRole = api.user.updateRole.useMutation();

  const handleClick = () => {
    if (role) {
      setIsSubmitting(true);
      updateRole.mutate({ email: isOAuthUser.email!, role }, {
        onSuccess: () => {
          toast({
            title: "Registration completed!",
          });
          setIsSubmitting(false);
          setIsOpen(false)
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Registering failed",
            description: "Check console for error message",
            variant: "destructive",
          });
          setIsSubmitting(false);
        },
      });
    }
  }
  return (
    <AlertDialog open={!!isOAuthUser && isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            We noticed that you had registered using OAuth
          </AlertDialogTitle>
          <AlertDialogDescription>
            To continue using our service, please select either a{" "}
            <span className="font-semibold capitalize tracking-wide text-primary">
              doctor
            </span>{" "}
            or{" "}
            <span className="font-semibold capitalize tracking-wide text-primary">
              patient
            </span>{" "}
            role to complete the registration process.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center gap-4 text-lg text-primary-foreground">
          I am a
          <AlertDialogAction
            disabled = {isSubmitting}
            onClick={() => {
              setRole("USER");
              handleClick()
            }}
            className="flex items-center gap-2"
          >
            <Accessibility size={18} />
            Patient {isSubmitting && role==='USER' ? (
                <RotatingLines
                  strokeColor="#422006"
                  strokeWidth="5"
                  width="20"
                />
              ) : null}
          </AlertDialogAction>
          <AlertDialogAction
            disabled = {isSubmitting}
            onClick={() => {
              setRole("ADMIN");
              handleClick()
            }}
            className="flex items-center gap-2"
          >
            <Stethoscope size={18} />
            Doctor {isSubmitting && role==='ADMIN' ? (
                <RotatingLines
                  strokeColor="#422006"
                  strokeWidth="5"
                  width="20"
                />
              ) : null}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OAuthModal;
