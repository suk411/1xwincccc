import { useNavigate } from "react-router-dom";
import pageHeaderBg from "@/assets/page-header-bg.png";
import backArrow from "@/assets/icons/close-icon.png";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader = ({ title, showBack = true }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-12 flex items-center justify-center">
      {/* Background image */}
      <img
        src={pageHeaderBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Back button */}
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center  justify-center"
        >
          <img src={backArrow} alt="Back" className="w-6 h-6 object-contain" />
        </button>
      )}

      {/* Title */}
      <h1 className="relative z-10 text-white font-semibold text-lg tracking-wide">
        {title}
      </h1>
    </div>
  );
};

export default PageHeader;
