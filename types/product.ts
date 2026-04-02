export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  sku?: string;
  weight?: number;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductCategory = {
  slug: string;
  name: string;
  url: string;
};
