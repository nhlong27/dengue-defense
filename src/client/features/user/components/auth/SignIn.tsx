import React from "react";
import { signIn } from "next-auth/react";
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
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/client/components/ui/form";
import { RotatingLines } from "react-loader-spinner";

import { toast } from "@/client/components/ui/use-toast";
import { useRouter } from "next/router";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email." }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const SignIn = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });
  function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);

    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .then((response) => {
        if (response?.ok) {
          toast({ title: "Sign in successfully" });
          void router.push("/");
        } else {
          console.log(response);
          toast({
            title: "Sign in failed",
            description: "No matching credentials",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Sign in failed",
          description: "No matching credentials",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials or choose a provider above.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nhlong2706@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="*****" />
                  </FormControl>
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
              Sign in
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

export default SignIn;
