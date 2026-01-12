
import { StoreItem, BlogPost, Project, SaaSProduct } from './types';

export const STORE_ITEMS: StoreItem[] = [
  { 
    id: '1', 
    name: 'Hand-stitched Silk Scarf', 
    price: 3500, 
    description: 'Artisanal silk scarf with unique traditional patterns.', 
    longDescription: 'Each scarf is individually hand-stitched over 12 hours using 100% pure mulberry silk. The patterns are inspired by ancient Tattva symbols of harmony and balance. Measures 180x50cm.',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800', 
    category: 'Handmade',
    stock: 5
  },
  { 
    id: '2', 
    name: 'Ceramic Tea Set', 
    price: 8200, 
    description: 'Hand-thrown clay tea set with reactive glaze.', 
    longDescription: 'A complete 5-piece set including a teapot and four cups. Crafted from high-fire stoneware clay and finished with a custom-mixed "Tattva Blue" reactive glaze that varies slightly with every firing.',
    image: 'https://images.unsplash.com/photo-1576020488411-291983719908?auto=format&fit=crop&q=80&w=800', 
    category: 'Handmade',
    stock: 2
  },
  { 
    id: '3', 
    name: 'Organic Lavender Oil', 
    price: 1200, 
    description: 'Home-distilled lavender oil from my own garden.', 
    longDescription: 'Pure, undiluted essential oil distilled in small batches using a traditional copper alembic. The lavender is grown without pesticides in my own backyard garden. 15ml bottle.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800', 
    category: 'Homemade',
    stock: 12
  },
  { 
    id: '4', 
    name: 'Handmade Soy Candle', 
    price: 850, 
    description: 'Scented with sandalwood and meditation herbs.', 
    longDescription: 'Poured by hand using 100% natural soy wax and wood wicks for a clean, crackling burn. Scented with premium essential oils to help ground your space during meditation.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800', 
    category: 'Homemade',
    stock: 20
  },
];

export const BLOG_POSTS: BlogPost[] = [
  { id: '1', title: 'The Philosophy of Tattva', excerpt: 'Exploring the core elements of creation and self.', content: 'Full content about philosophy...', date: 'Oct 12, 2023', image: 'https://picsum.photos/seed/phil/600/400' },
  { id: '2', title: 'Scaling SaaS as a Solopreneur', excerpt: 'My journey building scalable apps alone.', content: 'Full content about SaaS...', date: 'Nov 05, 2023', image: 'https://picsum.photos/seed/saas/600/400' },
];

export const PROJECTS: Project[] = [
  { id: '1', title: 'AgriTech Dashboard', description: 'Real-time monitoring for small farms.', tags: ['React', 'D3.js', 'IoT'], image: 'https://picsum.photos/seed/agri/400/300' },
  { id: '2', title: 'Zen Meditation App', description: 'A minimalist approach to mindfulness.', tags: ['Mobile', 'Flutter', 'UI/UX'], image: 'https://picsum.photos/seed/zen/400/300' },
];

export const SAAS_PRODUCTS: SaaSProduct[] = [
  { id: '1', name: 'AutoContent AI', description: 'Automate your blog SEO and drafting.', price: '₹1,500/mo', features: ['AI Drafting', 'SEO Audit', 'Bulk Export'] },
  { id: '2', name: 'TrackMyFreelance', description: 'Simplified billing for creative individuals.', price: '₹800/mo', features: ['Invoice Gen', 'Time Tracking', 'Tax Reports'] },
];
