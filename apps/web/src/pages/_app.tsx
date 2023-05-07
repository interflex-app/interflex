import "@interflex-app/ui/globals.css";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import { Inter as FontSans } from "next/font/google";

const font = FontSans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${font.style.fontFamily};
          }
        `}
      </style>

      <div className={`${font.className} ${font.variable}`}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
