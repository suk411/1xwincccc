const assets = [
  import("@/assets/icons/home-active.png"),
  import("@/assets/icons/home-inactive.png"),
  import("@/assets/icons/earn-active.png"),
  import("@/assets/icons/earn-inactive.png"),
  import("@/assets/icons/bank-active.png"),
  import("@/assets/icons/bank-inactive.png"),
  import("@/assets/icons/events-active.png"),
  import("@/assets/icons/events-inactive.png"),
  import("@/assets/nav-bg.png"),
  import("@/assets/nav-center-platform.png"),
  import("@/assets/gift-box.png"),
];

Promise.allSettled(assets).then((results) => {
  results.forEach((r) => {
    if (r.status === "fulfilled") {
      const img = new Image();
      img.src = r.value.default;
    }
  });
});
