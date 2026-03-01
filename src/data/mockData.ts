export type Platform = 'Blinkit' | 'Zepto' | 'Instamart' | 'BigBasket';

export interface Product {
  id: string;
  name: string;
  brand: string;
  size: string;
  category: string;
  subCategory?: string;
  image: string;
  prices: Record<Platform, number | null>;
  mrp: number;
  discount?: string;
  deliveryTime?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OptimizationSplit {
  platform: Platform;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export const PLATFORMS: Platform[] = ['Blinkit', 'Zepto', 'Instamart', 'BigBasket'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Watermelon Kiran(Tarbooj)',
    brand: 'Fresh',
    size: '1 pc',
    category: 'Fruits & Vegetables',
    subCategory: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1582281268143-0349f7475ad6?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 109, Zepto: 109, Instamart: 115, BigBasket: 105 },
    mrp: 158,
    discount: '₹49 OFF',
    deliveryTime: '6 mins'
  },
  {
    id: 'p2',
    name: 'Banana Robusta',
    brand: 'Fresh',
    size: '4 pcs',
    category: 'Fruits & Vegetables',
    subCategory: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1571501478200-85ba816c9a5e?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 28, Zepto: 28, Instamart: 30, BigBasket: 25 },
    mrp: 46,
    discount: '₹18 OFF',
    deliveryTime: '6 mins'
  },
  {
    id: 'p3',
    name: 'Papaya Cut',
    brand: 'Fresh',
    size: '200 g',
    category: 'Fruits & Vegetables',
    subCategory: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 55, Zepto: 55, Instamart: 60, BigBasket: 50 },
    mrp: 73,
    discount: '₹18 OFF',
    deliveryTime: '6 mins'
  },
  {
    id: 'p4',
    name: 'Guava Thai',
    brand: 'Fresh',
    size: '1 pc',
    category: 'Fruits & Vegetables',
    subCategory: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 44, Zepto: 44, Instamart: 48, BigBasket: 40 },
    mrp: 79,
    discount: '₹35 OFF',
    deliveryTime: '6 mins'
  },
  {
    id: 'p5',
    name: 'Baby Orange (Mandarin)',
    brand: 'Fresh',
    size: '3 pcs',
    category: 'Fruits & Vegetables',
    subCategory: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 46, Zepto: 46, Instamart: 50, BigBasket: 45 },
    mrp: 68,
    discount: '₹22 OFF',
    deliveryTime: '6 mins'
  },
  {
    id: 'p6',
    name: 'Mushroom Button',
    brand: 'Fresh',
    size: '200 g',
    category: 'Fruits & Vegetables',
    subCategory: 'Exotics & Premium',
    image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 57, Zepto: 57, Instamart: 60, BigBasket: 55 },
    mrp: 85,
    discount: '₹28 OFF',
    deliveryTime: '6 mins'
  },
  {
    id: 'p7',
    name: 'Broccoli',
    brand: 'Fresh',
    size: '1 pc',
    category: 'Fruits & Vegetables',
    subCategory: 'Exotics & Premium',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 37, Zepto: 37, Instamart: 40, BigBasket: 35 },
    mrp: 55,
    discount: '₹18 OFF',
    deliveryTime: '6 mins'
  },
  {
    id: 'p8',
    name: 'Onion',
    brand: 'Fresh',
    size: '1 Pack / 900 -1000 gm',
    category: 'Fruits & Vegetables',
    subCategory: 'Fresh Vegetables',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 24, Zepto: 24, Instamart: 28, BigBasket: 22 },
    mrp: 46,
    discount: '₹22 OFF',
    deliveryTime: '6 mins'
  },
  {
    id: 'p9',
    name: 'Coriander Leaves',
    brand: 'Fresh',
    size: '1 pack (100 g)',
    category: 'Fruits & Vegetables',
    subCategory: 'Leafy, Herbs & Seasonings',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 8, Zepto: 8, Instamart: 10, BigBasket: 7 },
    mrp: 13,
    discount: '₹5 OFF',
    deliveryTime: '6 mins'
  },
  {
    id: 'p10',
    name: 'Amul Taaza Toned Fresh Milk',
    brand: 'Amul',
    size: '1 pack (500 ml)',
    category: 'Dairy & Breakfast',
    subCategory: 'Milk',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 28, Zepto: 28, Instamart: 28, BigBasket: 28 },
    mrp: 28,
    deliveryTime: '6 mins'
  },
  {
    id: 'p11',
    name: 'Bingo! Tedhe Medhe | Crunchy Snack',
    brand: 'Bingo',
    size: '1 pack (75 g or 80 g)',
    category: 'Snacks',
    subCategory: 'Chips & Crisps',
    image: 'https://images.unsplash.com/photo-1566478989037-e98748d1d92a?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 15, Zepto: 15, Instamart: 15, BigBasket: 15 },
    mrp: 20,
    discount: '₹5 OFF',
    deliveryTime: '7 mins'
  },
  {
    id: 'p12',
    name: 'Go Zero Death By Chocolate | Ice Cream Cone',
    brand: 'Go Zero',
    size: '1 pc (120 ml)',
    category: 'Sweet Cravings',
    subCategory: 'Ice Cream',
    image: 'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 76, Zepto: 76, Instamart: 80, BigBasket: 75 },
    mrp: 110,
    discount: '₹34 OFF',
    deliveryTime: '7 mins'
  },
  {
    id: 'p13',
    name: 'Havmor Mahabaleshwar Strawberry Ice Cream Tub',
    brand: 'Havmor',
    size: '1 pack (500 ml)',
    category: 'Sweet Cravings',
    subCategory: 'Ice Cream',
    image: 'https://images.unsplash.com/photo-1570197781417-0a5237600537?auto=format&fit=crop&q=80&w=200',
    prices: { Blinkit: 159, Zepto: 159, Instamart: 165, BigBasket: 150 },
    mrp: 200,
    discount: '₹41 OFF',
    deliveryTime: '7 mins'
  }
];

export const DELIVERY_FEES: Record<Platform, number> = {
  Blinkit: 15,
  Zepto: 9,
  Instamart: 25,
  BigBasket: 50,
};

export const FREE_DELIVERY_THRESHOLDS: Record<Platform, number> = {
  Blinkit: 199,
  Zepto: 149,
  Instamart: 299,
  BigBasket: 500,
};
