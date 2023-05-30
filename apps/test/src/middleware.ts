import { NextMiddleware, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "../i18n/interflex";

export const middleware: NextMiddleware = (request) => {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = LOCALES.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = DEFAULT_LOCALE;

    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }
};

export const config = {
  matcher: ["/((?!_next).*)"],
};
