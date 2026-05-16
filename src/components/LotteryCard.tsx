import "./LotteryCard.css";

interface LotteryCardProps {
  icon?: string;
  name?: string;
  hint?: string;
  tag?: string;
  onClick?: () => void;
}

const LotteryCard: React.FC<LotteryCardProps> = ({
  icon = "https://www.rajaluck.com/assets/png/WinGo-b9c59235.png",
  name = "Win Go",
  hint = "Guess the number",
  tag = "HOT",
  onClick,
}) => {
  return (
    <div
      className="tab-Lottery is-wingo"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="tab-Lottery__glow"></div>
      <div className="wg-flame wg-flame--1"></div>
      <div className="wg-flame wg-flame--2"></div>
      <div className="wg-flame wg-flame--3"></div>
      <div className="wg-halo"></div>
      <div className="wg-ring wg-ring--1"></div>
      <div className="wg-ring wg-ring--2"></div>

      {/* Sparkles/Embers */}
      <i
        className="wg-ember"
        style={{ left: "40%", animation: "wgRingExpand-7575de35 2s infinite" }}
      ></i>
      <i
        className="wg-ember"
        style={{
          left: "60%",
          animation: "wgRingExpand-7575de35 2.5s infinite",
        }}
      ></i>

      <div className="wg-tag">{tag}</div>

      <div className="tab-Lottery__icon">
        <img src={icon} alt={name} />
      </div>

      <div className="flex flex-col justify-center flex-1">
        <p className="tab-Lottery__name">{name}</p>
        <p className="tab-Lottery__hint">{hint}</p>
      </div>
    </div>
  );
};

export default LotteryCard;
