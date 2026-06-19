export const rupee = (n: number) =>
  "₹" + (Math.round(n * 100) / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });

export const STATUS_LABEL: Record<string, string> = {
  placing: "Placing order",
  confirmed: "Confirmed",
  packing: "Packing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export const STATUS_STEPS = ["placing", "confirmed", "packing", "out_for_delivery", "delivered"];
