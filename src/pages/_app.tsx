import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "../../styles/globals.css";
import { ThemeProvider } from "@/client/components/theme-provider";
import Head from "next/head";
import { Toaster } from "@/client/components/ui/toaster";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Head>
          <title>Dengue Defense</title>
          <meta name="description" content="Bootstrapped with create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Toaster />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
