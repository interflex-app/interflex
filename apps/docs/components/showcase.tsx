const CARD_WIDTH = 0.3 * 839;
const CARD_HEIGHT = 0.3 * 461;

const LandingCard: React.FC<{ idx: number }> = ({ idx }) => {
  return (
    <div className="my-4">
      <img
        className="show-light"
        alt=""
        src={`/assets/cards/card${idx}-light.svg`}
      />

      <img
        className="show-dark"
        alt=""
        src={`/assets/cards/card${idx}-dark.svg`}
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
