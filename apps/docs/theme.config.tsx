import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <span className="flex items-center gap-4">
      <div>
        <img alt="logo" src="/assets/interflex-full.svg" width="25px" />
      </div>

      <b>Interflex</b>
    </span>
  ),
  project: {
    link: "https://interflex.dev",
    icon: (
      <div>
        <img
          className="show-light"
          alt="logo"
          src="/assets/logo-sm.svg"
          width="25px"
        />
        <img
          className="show-dark"
          alt="logo"
          src="/assets/logo-sm-light.svg"
          width="25px"
        />
      </div>
    ),
  },
  docsRepositoryBase:
    "https://github.com/interflex-app/interflex/tree/main/apps/docs",
  footer: {
    text: <span>Copyright © {new Date().getFullYear()} Interflex.</span>,
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Interflex Docs",
    };
  },
};

export default config;
