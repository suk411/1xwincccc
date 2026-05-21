import { useState } from "react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Button } from "@/components/ui/button";

export function CopyToastExample() {
  const { copyToClipboard } = useCopyToClipboard();
  const [copiedText] = useState("Hello! This text can be copied to clipboard.");

  const handleCopy = () => {
    copyToClipboard(copiedText, "Copied Success");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <h2 className="text-2xl font-bold">Copy to Clipboard Demo</h2>
      
      <div className="w-full max-w-md p-4 bg-white border border-gray-300 rounded-lg">
        <p className="text-center text-gray-700">{copiedText}</p>
      </div>

      <Button
        onClick={handleCopy}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Copy Text
      </Button>
    </div>
  );
}
