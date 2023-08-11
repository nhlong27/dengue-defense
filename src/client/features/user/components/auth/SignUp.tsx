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
import { Label } from "@/client/components/ui/label";
import { Switch } from "@/client/components/ui/switch";

const SignUp = () => {
  const [shouldSignUpAsDoctor, setShouldSignUpAsDoctor] = React.useState(false);

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
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">
            {shouldSignUpAsDoctor ? "Doctor Name" : "Name"}
          </Label>
          <Input id="name" placeholder="Long" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">
            {shouldSignUpAsDoctor ? "Doctor Email" : "Email"}
          </Label>
          <Input id="email" placeholder="nhlong2706@gmail.com" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">
            {shouldSignUpAsDoctor ? "Doctor Password" : "Password"}
          </Label>
          <Input id="password" type="password" placeholder="*****" />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit">Sign up</Button>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
