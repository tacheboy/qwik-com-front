import { CartItem, OptimizationSplit, Platform, FREE_DELIVERY_THRESHOLDS, DELIVERY_FEES } from '../data/mockData';

/**
 * Simulates a backend API call to the optimization engine.
 * In a real app, this would be an Axios call to your Spring Boot backend.
 */
export const optimizeCartApi = async (items: CartItem[]): Promise<OptimizationSplit[]> => {
  // Simulate 250ms backend latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (items.length === 0) return [];

  // Mock Greedy Optimization (assign to cheapest available platform)
  const splitsMap: Partial<Record<Platform, CartItem[]>> = {};

  items.forEach((item) => {
    let bestPlatform: Platform | null = null;
    let lowestPrice = Infinity;

    Object.entries(item.product.prices).forEach(([platform, price]) => {
      if (price !== null && price < lowestPrice) {
        lowestPrice = price;
        bestPlatform = platform as Platform;
      }
    });

    if (bestPlatform) {
      if (!splitsMap[bestPlatform]) splitsMap[bestPlatform] = [];
      splitsMap[bestPlatform]!.push(item);
    }
  });

  // Calculate totals and fees
  return Object.entries(splitsMap).map(([p, splitItems]) => {
    const platform = p as Platform;
    const subtotal = splitItems.reduce((acc, item) => acc + (item.product.prices[platform]! * item.quantity), 0);
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLDS[platform] ? 0 : DELIVERY_FEES[platform];
    
    return {
      platform,
      items: splitItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    };
  });
};
