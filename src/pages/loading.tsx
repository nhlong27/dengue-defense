import React from "react";
import { Oval } from "react-loader-spinner";

const LoadingPage = () => {
  return (
    <div className="min-h-dynamic-screen flex w-full items-center justify-center">
      <Oval color="#facc15" secondaryColor="#422006" />
    </div>
  );
};

export default LoadingPage;

{/* <Button type="submit" disabled={isSubmitting} className="flex gap-2">
  Sign in
  {isSubmitting && (
    <RotatingLines strokeColor="#422006" strokeWidth="5" width="20" />
  )}
</Button>; */}
