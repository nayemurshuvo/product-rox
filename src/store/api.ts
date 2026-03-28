import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, { limit?: number; skip?: number }>({
      query: ({ limit = 10, skip = 0 }) => `/products?limit=${limit}&skip=${skip}`,
    }),
    searchProducts: builder.query<ProductsResponse, { q: string; limit?: number; skip?: number }>({
      query: ({ q, limit = 10, skip = 0 }) => `/products/search?q=${q}&limit=${limit}&skip=${skip}`,
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/products/categories',
    }),
    getProductById: builder.query<Product, number>({
      query: (id: number) => `/products/${id}`,
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useSearchProductsQuery, 
  useGetCategoriesQuery,
  useGetProductByIdQuery 
} = productApi;
