import PageHeader from "@/components/PageHeader";

const Events = () => {
  return (
    <main className="relative flex-1 flex flex-col pb-20">
      <PageHeader title="Events" />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-muted-foreground text-center">
          Events page content
        </p>
      </div>
    </main>
  );
};

export default Events;
