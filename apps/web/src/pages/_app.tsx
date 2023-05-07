import "@interflex-app/ui/globals.css";
import "../styles/globals.css";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import { Montserrat as FontSans } from "next/font/google";
import Head from "next/head";

const font = FontSans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "900"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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
          <Component {...pageProps} />
        </SessionProvider>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
