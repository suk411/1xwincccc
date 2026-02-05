import PageLayout from "@/components/PageLayout";

const Promo = () => {
  return (
    <PageLayout title="GET ₹2000">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full promo-gradient flex items-center justify-center"
               style={{ boxShadow: "var(--glow-orange)" }}>
            <span className="text-2xl font-bold text-white">₹2000</span>
          </div>
          <p className="text-muted-foreground">
            Promotional offers coming soon
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Promo;
