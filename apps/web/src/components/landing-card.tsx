import { cn } from "@interflex-app/ui";
import { useTheme } from "next-themes";
import Image from "next/image";

const CARD_WIDTH = 0.6 * 839;
const CARD_HEIGHT = 0.6 * 461;

const LandingCard: React.FC<{ idx: number }> = ({ idx }) => {
  const { theme, systemTheme } = useTheme();

  const suffix =
    theme === "dark" || (systemTheme === "dark" && theme === "system")
      ? "-dark"
      : "-light";

  return (
    <div>
      <Image
        alt=""
        src={`/assets/cards/card${idx}${suffix}.svg`}
        className={cn("transition-transform hover:scale-[101%]", {
          "rotate-1 hover:rotate-2": idx === 1,
          "-rotate-2 hover:-rotate-3": idx === 2,
          "rotate-3 hover:rotate-2": idx === 3,
        })}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
      />
    </div>
  );
};

export default LandingCard;
