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
