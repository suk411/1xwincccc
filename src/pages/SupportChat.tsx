import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";

const SupportChat = () => {
  const [loading, setLoading] = useState(true);
  const supportUrl = "https://tawk.to/chat/69ba6f55bb7f0b1c337b2956/1jk045qmh";

  return (
    <main className="relative flex-1 flex flex-col w-full h-screen bg-white overflow-hidden">
      <PageHeader title="Support Chat" />
      {loading && <Loader label="Connecting to Support..." />}
      <iframe
        src={supportUrl}
        className="flex-1 w-full border-0"
        style={{ display: loading ? "none" : "block" }}
        onLoad={() => setLoading(false)}
        allow="camera; microphone; autoplay; clipboard-read; clipboard-write; fullscreen; display-capture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      />
    </main>
  );
};

export default SupportChat;
