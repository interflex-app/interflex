import { useTheme } from "next-themes";
import Image from "next/image";

const Logo = (
  {
    size,
    type,
    fullWidth,
  }: { size?: number; type?: "small" | "large"; fullWidth?: boolean } = {
    size: 1,
    type: "large",
    fullWidth: false,
  }
) => {
  const { theme, systemTheme } = useTheme();

  const suffix =
    theme === "dark" || (systemTheme === "dark" && theme === "system")
      ? "-light"
      : "";

  if (type === "small") {
    return (
      <Image
        src={`/assets/logo-sm${suffix}.svg`}
        {...(fullWidth
          ? { fill: true, style: { objectFit: "cover" } }
          : { width: 36.65 * (size || 1), height: 36.03 * (size || 1) })}
        alt={"Interflex logo"}
      />
    );
  }

  return (
    <Image
      src={`/assets/logo-lg${suffix}.svg`}
      {...(fullWidth
        ? { fill: true, style: { objectFit: "cover" } }
        : { width: 186 * (size || 1), height: 38 * (size || 1) })}
      alt={"Interflex logo"}
    />
  );
};

export default Logo;
