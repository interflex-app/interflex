import Image from "next/image";

const CARD_WIDTH = 0.6 * 839;
const CARD_HEIGHT = 0.6 * 461;

const LandingCard: React.FC<{ idx: number }> = ({ idx }) => {
  return (
    <div className="my-4">
      <Image
        className="show-light"
        alt=""
        src={`/assets/cards/card${idx}-light.svg`}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
      />

      <Image
        className="show-dark"
        alt=""
        src={`/assets/cards/card${idx}-dark.svg`}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
      />
    </div>
  );
};

const Showcase: React.FC = () => {
  return (
    <div className="flex lg:flex-row flex-col justify-between my-4 gap-6">
      <div>
        <LandingCard idx={1} />
        <p>1. Create your translations</p>
      </div>

      <div>
        <LandingCard idx={2} />
        <p>2. Synchronize the values</p>
      </div>

      <div>
        <LandingCard idx={3} />
        <p>3. You're good to go!</p>
      </div>
    </div>
  );
};

export default Showcase;
