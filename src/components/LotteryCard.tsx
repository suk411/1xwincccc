import "./LotteryCard.css";

interface LotteryCardProps {
  icon?: string;
  name?: string;
  hint?: string;
  tag?: string;
  onClick?: () => void;
  rightIcon?: string;
}

const LotteryCard: React.FC<LotteryCardProps> = ({
  icon = "https://www.rajaluck.com/assets/png/WinGo-b9c59235.png",
  name = "Win Go",
  hint = "Guess the number",
  tag = "HOT",
  onClick,
  rightIcon,
}) => {
  return (
    <div
      className="tab-Lottery is-wingo"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="wg-border"></div>
      <div className="wg-flame wg-flame--1"></div>
      <div className="wg-flame wg-flame--2"></div>

      {/* Embers / Particles */}
      <div className="wg-ember ember-1"></div>
      <div className="wg-ember ember-2"></div>
      <div className="wg-ember ember-3"></div>

      <div className="wg-shine"></div>

      <div className="wg-tag">{tag}</div>

      <div className="tab-Lottery__icon">
        <img src={icon} alt={name} />
      </div>

      <div className="flex flex-col justify-center flex-1">
        <p className="tab-Lottery__name">{name}</p>
        <p className="tab-Lottery__hint">{hint}</p>
      </div>
      {rightIcon && (
        <div style={{ position: "relative", left: "-40px", flexShrink: 0, zIndex: 3 }}>
          <img src={rightIcon} alt="" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
        </div>
      )}
    </div>
  );
};

export default LotteryCard;
