import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

const PageLayout = ({ children, title }: PageLayoutProps) => {
  return (
    <main className="relative flex-1 flex flex-col pb-20 px-4 pt-4 max-w-screen-lg mx-auto w-full">
      {title && (
        <h1 className="text-2xl font-bold text-foreground mb-4 text-glow">
          {title}
        </h1>
      )}
      {children}
    </main>
  );
};

export default PageLayout;
