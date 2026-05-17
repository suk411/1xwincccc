import { useToast } from "./use-toast";

export function useCopyToClipboard() {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, successMessage = "Copied to clipboard!") => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: successMessage,
        duration: 2000,
      });
    } catch (err) {
      console.error("Error copying text:", err);
      toast({
        description: "Failed to copy",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return { copyToClipboard };
}
