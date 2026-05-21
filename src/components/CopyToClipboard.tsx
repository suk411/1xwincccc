import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyToClipboardProps {
  text: string;
  label?: string;
  className?: string;
  successMessage?: string;
}

export function CopyToClipboard({
  text,
  label = "Copy",
  className = "text-blue-600 cursor-pointer hover:text-blue-800 transition-colors",
  successMessage = "Copied Success",
}: CopyToClipboardProps) {
  const { copyToClipboard } = useCopyToClipboard();

  const handleClick = () => {
    copyToClipboard(text, successMessage);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
      aria-label={`Copy ${label}`}
    >
      {label}
    </button>
  );
}
