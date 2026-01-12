
export enum Page {
  Home = 'home',
  About = 'about',
  Portfolio = 'portfolio',
  Blog = 'blog',
  Store = 'store',
  Tuition = 'tuition',
  Courses = 'courses',
  SaaS = 'saas',
  Admin = 'admin'
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Handmade' | 'Homemade';
  stock: number;
  longDescription?: string;
}

export interface CartItem extends StoreItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

export interface SaaSProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}
