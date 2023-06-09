import "@interflex-app/ui/globals.css";
import "../styles/globals.css";
import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import { Montserrat as FontSans } from "next/font/google";
import Head from "next/head";
import { type NextPage } from "next";
import { type ReactElement, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { TeamProvider } from "../providers/team-provider";
import { Toaster } from "@interflex-app/ui";

const font = FontSans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "900"],
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<T> = AppProps<T> & {
  Component: NextPageWithLayout;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout<{ session: Session | null }>) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Interflex</title>
        <meta
          name="description"
          content="The easiest way to manage your translations."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx global>
        {`
          :root {
            --font-sans: ${font.style.fontFamily};
          }
        `}
      </style>

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>
          <TeamProvider>
            <div
              className={`${font.className} ${font.variable} min-h-screen bg-pattern dark:bg-pattern-light`}
            >
              {getLayout(<Component {...pageProps} />)}
              <Toaster />
            </div>
          </TeamProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
};

export default api.withTRPC(App);
