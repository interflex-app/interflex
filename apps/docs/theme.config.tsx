import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div
        style={{
          border: "1px white solid",
          backgroundColor: "white",
          borderRadius: "9999px",
        }}
      >
        <img alt="logo" src="/assets/logo-sm.svg" width="25px" />
      </div>

      <span>Interflex</span>
    </span>
  ),
  project: {
    link: "https://interflex.dev",
    icon: (
      <div
        style={{
          border: "1px white solid",
          backgroundColor: "white",
          borderRadius: "9999px",
        }}
      >
        <img alt="logo" src="/assets/logo-sm.svg" width="25px" />
      </div>
    ),
  },
  docsRepositoryBase: "https://github.com/interflex-app/interflex",
  footer: {
    text: "Copyright © Interflex.",
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Interflex",
    };
  },
};

export default config;
