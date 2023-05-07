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

      <div
        className={`${font.className} ${font.variable} min-h-screen bg-pattern`}
      >
        <SessionProvider session={session}>
          {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
      </div>
    </>
  );
};

export default api.withTRPC(App);
