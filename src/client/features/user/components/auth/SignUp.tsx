import React from "react";
import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Switch } from "@/client/components/ui/switch";
import { api } from "@/utils/api";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/client/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/client/components/ui/use-toast";
import { RotatingLines } from "react-loader-spinner";
import { useRouter } from "next/router";

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .email()
    .min(2, { message: "Email must be at least 2 characters." }),
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters." }),
  role: z.enum(["USER", "ADMIN"]),
});

const SignUp = ({
  shouldSignUpAsDoctor,
  setShouldSignUpAsDoctor,
}: {
  shouldSignUpAsDoctor: boolean;
  setShouldSignUpAsDoctor: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const createUser = api.user.create.useMutation();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });
  const router = useRouter();

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    createUser.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: shouldSignUpAsDoctor ? "ADMIN" : "USER",
      },
      {
        onSuccess: (response) => {
          toast({
            title: "Sign up successful!",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <p className="text-white">
                  Use email:
                  {response.email} and password: {data.password} to sign in.
                </p>
              </div>
            ),
          });

          void router.push("/");
          setIsSubmitting(false);
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Register failed",
            description: "Credentials already exist.",
            variant: "destructive",
          });
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register a new account</CardTitle>
        <CardDescription>
          Select register as a <span className="bold italic">doctor</span> or{" "}
          <span className="bold italic">patient</span>.
          <div className="mt-4 flex items-center space-x-2">
            <Switch
              id="role"
              onClick={() => setShouldSignUpAsDoctor((prev) => !prev)}
            />
            <Label htmlFor="role">As Doctor</Label>
          </div>
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>
                    {shouldSignUpAsDoctor ? "Doctor Name" : "Name"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={shouldSignUpAsDoctor ? "Doctor <number>" : "Patient <number>"} {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>
                    {shouldSignUpAsDoctor ? "Doctor Email" : "Email"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={shouldSignUpAsDoctor ? "doctor<number>@mail.com" : "patient<number>@mail.com"} {...field} />
                  </FormControl>
                  <FormDescription>Use your unique email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>
                    {shouldSignUpAsDoctor ? "Doctor Password" : "Password"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={shouldSignUpAsDoctor ? "doctor<number>" : "patient<number>"} {...field} />
                  </FormControl>
                  <FormDescription>Choose a secure password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex gap-2"
            >
              Sign up
              {isSubmitting && (
                <RotatingLines
                  strokeColor="#422006"
                  strokeWidth="5"
                  width="20"
                />
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SignUp;
