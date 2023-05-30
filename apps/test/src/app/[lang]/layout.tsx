import { PropsWithChildren } from "react";
import { withInterflex } from "../../../i18n/interflex";

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
