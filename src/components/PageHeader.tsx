import { useTransitionNavigate } from "@/providers/NavigationProvider";
import pageHeaderBg from "@/assets/bank/header-bg.png";
import backArrow from "@/assets/icons/close-icon.png";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backPath?: string;
}

const PageHeader = ({ title, showBack = true, backPath }: PageHeaderProps) => {
  const { navigateWithTransition, goBack } = useTransitionNavigate();

  const handleBack = () => {
    if (backPath) {
      navigateWithTransition(backPath, { direction: "back" });
    } else {
      goBack();
    }
  };

  return (
    <div className="relative w-full h-11 flex items-center justify-center">
      {/* Background image */}
      <img
        src={pageHeaderBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Back button */}
      {showBack && (
        <button
          onClick={handleBack}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-5 h-5 flex items-center  justify-center"
        >
          <img src={backArrow} alt="Back" className="w-6 h-6 object-contain" />
        </button>
      )}

      {/* Title */}
      <h1 className="relative z-10 tracking-wide" style={{
        color: "#FFFFFF",
        textShadow: "rgba(5, 16, 48, 0.7) -1.3px -1.3px 0px, rgba(5, 16, 48, 0.7) 1.3px -1.3px 0px, rgba(5, 16, 48, 0.7) -1.3px 1.3px 0px, rgba(5, 16, 48, 0.7) 1.3px 1.3px 0px",
      }}>
        {title}
      </h1>
    </div>
  );
};

export default PageHeader;
