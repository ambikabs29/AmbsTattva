
import React, { useState, useEffect } from 'react';
import { generateContentIdeas } from '../services/geminiService';
import { STORE_ITEMS } from '../constants';
import { StoreItem, Order } from '../types';
import { getCurrencyConfig, formatPrice, CurrencyConfig } from '../utils/currency';

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'John Doe', items: ['Hand-stitched Silk Scarf'], total: 3500, status: 'Delivered', date: '2023-10-20' },
  { id: 'ORD-002', customerName: 'Alice Smith', items: ['Ceramic Tea Set', 'Handmade Soy Candle'], total: 9050, status: 'Shipped', date: '2023-10-22' },
  { id: 'ORD-003', customerName: 'Bob Wilson', items: ['Organic Lavender Oil'], total: 1200, status: 'Pending', date: '2023-10-25' },
];

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [storeSubTab, setStoreSubTab] = useState('Products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig());
  
  // Store States
  const [products, setProducts] = useState<StoreItem[]>(STORE_ITEMS);
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreItem | null>(null);
  
  // Blog States
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Settings States
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Persistence: Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('ambs_tattva_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse products from localStorage", e);
      }
    }
    setCurrency(getCurrencyConfig());
  }, []);

  // Persistence: Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ambs_tattva_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const savedNumber = localStorage.getItem('ambs_tattva_wa_number');
    if (savedNumber) setWhatsappNumber(savedNumber);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('ambs_tattva_wa_number', whatsappNumber);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleGenerateIdeas = async () => {
    setLoading(true);
    const ideas = await generateContentIdeas(topic);
    setSuggestions(ideas);
    setLoading(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to remove this item from the store?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleOpenEdit = (product: StoreItem) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProduct: StoreItem = {
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      price: Number(formData.get('price')), // Storing in base INR
      description: formData.get('description') as string,
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&q=80&w=800',
      category: formData.get('category') as any,
      stock: Number(formData.get('stock')),
      longDescription: formData.get('longDescription') as string,
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
    } else {
      setProducts(prev => [updatedProduct, ...prev]);
    }
    setIsProductModalOpen(false);
  };

  const tabs = [
    { id: 'Overview', icon: '📊' },
    { id: 'My Store', icon: '🛍️' },
    { id: 'Course Builder', icon: '🎓' },
    { id: 'SaaS Dashboard', icon: '💻' },
    { id: 'Blog Drafts', icon: '✍️' },
    { id: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 serif">Ambs Dashboard</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operator Active</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.id}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Support & Feedback</p>
            <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-xs font-bold transition-colors">
              Request Feature
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 bg-white border-b border-slate-100 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="ml-4 font-bold text-slate-900 serif">{activeTab}</h2>
        </div>

        <div className="max-w-6xl mx-auto p-4 md:p-8">
          
          {/* Overview Tab */}
          {activeTab === 'Overview' && (
            <div className="space-y-8 animate-fade-in">
              <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Performance Snapshot</h1>
                <p className="text-slate-500 text-sm">Real-time data for your region ({currency.code}).</p>
              </header>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: 'Store Revenue', val: formatPrice(124500, currency), trend: '+12%', color: 'text-emerald-600' },
                  { label: 'Total Orders', val: '154', trend: '+18', color: 'text-indigo-600' },
                  { label: 'Academy MRR', val: formatPrice(32000, currency), trend: '+5%', color: 'text-blue-600' },
                  { label: 'Portfolio Hits', val: '8.4k', trend: '+42%', color: 'text-rose-600' }
                ].map(stat => (
                  <div key={stat.label} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                      <p className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">{stat.val}</p>
                      <span className={`text-[10px] md:text-xs font-bold mt-2 md:mt-0 px-2 py-1 rounded-full bg-slate-50 w-fit ${stat.color}`}>{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">📦</span>
                    Recent Orders
                  </h3>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-2">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                          <p className="text-xs text-slate-500">{order.date}</p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                          <p className="font-bold text-slate-900 text-sm sm:text-base">{formatPrice(order.total, currency)}</p>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ml-4 sm:ml-0 ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">⚠️</span>
                    Low Stock Inventory
                  </h3>
                  <div className="space-y-4">
                    {products.filter(p => p.stock < 5).map(p => (
                      <div key={p.id} className="flex items-center gap-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                        <img src={p.image} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-rose-500 h-full" style={{ width: `${(p.stock / 20) * 100}%` }}></div>
                          </div>
                        </div>
                        <span className="text-xs md:text-sm font-bold text-rose-600 whitespace-nowrap">{p.stock} left</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Store Management Tab */}
          {activeTab === 'My Store' && (
            <div className="animate-fade-in">
              <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Store</h1>
                  <p className="text-slate-500 text-sm">Prices shown in {currency.code}. Stored in base INR.</p>
                </div>
                <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
                  {['Products', 'Orders', 'Inventory'].map(sub => (
                    <button
                      key={sub}
                      onClick={() => setStoreSubTab(sub)}
                      className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                        storeSubTab === sub ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-indigo-600'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </header>

              {storeSubTab === 'Products' && (
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-bold text-slate-900">Product Catalog</h3>
                    <button 
                      onClick={handleOpenAdd}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
                    >
                      + New Product
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                      <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                        <tr>
                          <th className="px-6 md:px-8 py-4">Item Details</th>
                          <th className="px-6 md:px-8 py-4">Category</th>
                          <th className="px-6 md:px-8 py-4">Price</th>
                          <th className="px-6 md:px-8 py-4">Stock</th>
                          <th className="px-6 md:px-8 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {products.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 md:px-8 py-4">
                              <div className="flex items-center gap-4">
                                <img src={item.image} className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover bg-slate-100 shadow-sm" />
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">ID: {item.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 md:px-8 py-4">
                              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 md:px-8 py-4">
                              <span className="font-bold text-slate-900">{formatPrice(item.price, currency)}</span>
                            </td>
                            <td className="px-6 md:px-8 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${item.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <span className={`text-sm font-semibold ${item.stock < 5 ? 'text-rose-600' : 'text-slate-600'}`}>
                                  {item.stock} in stock
                                </span>
                              </div>
                            </td>
                            <td className="px-6 md:px-8 py-4 text-right">
                              <div className="flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleOpenEdit(item)}
                                  className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 rounded-lg hover:shadow-sm"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(item.id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 bg-white border border-slate-100 rounded-lg hover:shadow-sm"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {storeSubTab === 'Orders' && (
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">Recent Customer Orders</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                      <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                        <tr>
                          <th className="px-6 md:px-8 py-4">Order ID</th>
                          <th className="px-6 md:px-8 py-4">Customer</th>
                          <th className="px-6 md:px-8 py-4">Total</th>
                          <th className="px-6 md:px-8 py-4">Status</th>
                          <th className="px-6 md:px-8 py-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 md:px-8 py-4 font-mono text-xs font-bold text-indigo-600">{order.id}</td>
                            <td className="px-6 md:px-8 py-4 text-sm font-bold text-slate-900">{order.customerName}</td>
                            <td className="px-6 md:px-8 py-4 font-bold">{formatPrice(order.total, currency)}</td>
                            <td className="px-6 md:px-8 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                                order.status === 'Shipped' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 md:px-8 py-4 text-sm text-slate-500">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {storeSubTab === 'Inventory' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-6">Inventory Value</h4>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-500 text-sm">Total Retail Value</span>
                        <span className="text-xl font-bold text-indigo-600">
                          {formatPrice(products.reduce((a,b) => a + (b.price * b.stock), 0), currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-sm">Total Unit Count</span>
                        <span className="text-xl font-bold text-slate-900">{products.reduce((a,b) => a + b.stock, 0)} Units</span>
                      </div>
                    </div>
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-6">Popular Categories</h4>
                      <div className="space-y-4">
                        {['Handmade', 'Homemade'].map(cat => (
                          <div key={cat} className="flex items-center justify-between">
                            <span className="text-slate-500 text-sm">{cat}</span>
                            <div className="flex-1 mx-4 bg-slate-100 h-2 rounded-full overflow-hidden">
                               <div className="bg-indigo-600 h-full" style={{ width: cat === 'Handmade' ? '65%' : '35%' }}></div>
                            </div>
                            <span className="text-xs font-bold">{cat === 'Handmade' ? '65%' : '35%'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
              )}
            </div>
          )}

          {/* Blog Drafts Tab */}
          {activeTab === 'Blog Drafts' && (
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl shadow-lg shadow-indigo-100">✨</div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900">AI Content Architect</h3>
                  <p className="text-slate-500 text-xs md:text-sm italic">Harness Gemini 3 Flash for your next masterpiece.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-12">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 'Artisan pottery trends'"
                  className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner text-slate-700 text-sm"
                />
                <button 
                  onClick={handleGenerateIdeas}
                  disabled={loading || !topic}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold disabled:opacity-50 shadow-xl shadow-indigo-100 hover:scale-105 transition-all text-sm whitespace-nowrap"
                >
                  {loading ? 'Consulting...' : 'Generate Concepts'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {suggestions.map((s, i) => (
                  <div key={i} className="p-6 md:p-8 bg-white border border-slate-100 rounded-3xl hover:border-indigo-300 transition-all hover:shadow-2xl hover:-translate-y-1 group">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold mb-6">Concept {i+1}</div>
                    <h4 className="font-bold text-slate-900 text-lg mb-4">{s.title}</h4>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed line-clamp-4">{s.excerpt}</p>
                    <button className="w-full py-3 border-2 border-indigo-100 text-indigo-600 font-bold text-xs rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-indigo-200 uppercase tracking-widest">
                      Initialize Draft
                    </button>
                  </div>
                ))}
                {suggestions.length === 0 && !loading && (
                   <div className="col-span-full py-20 text-center text-slate-300 italic text-sm">
                      "Creativity is the greatest rebellion in existence." — Osho <br/>
                      Enter a topic above to begin.
                   </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'Settings' && (
            <div className="max-w-2xl animate-fade-in mx-auto">
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold mb-8 text-slate-900">Platform Settings</h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                      WhatsApp Dispatch Number
                    </label>
                    <input 
                      type="text" 
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 919876543210"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm"
                    />
                    <p className="mt-4 text-[10px] md:text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-100 pl-4">
                      Direct connection for store orders. Use international format without "+" symbols. 
                      Example: <strong>91</strong> (India) + <strong>9876543210</strong>.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleSaveSettings}
                    className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg text-sm md:text-base ${
                      isSaved ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    {isSaved ? '✓ Configuration Saved' : 'Update Platform Settings'}
                  </button>

                  <div className="pt-8 border-t border-slate-50">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Integrations</h4>
                    <div className="space-y-3">
                      {['Google Classroom', 'Google Meet', 'Gemini AI'].map(tool => (
                        <div key={tool} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-xs md:text-sm font-medium text-slate-700">{tool}</span>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[8px] md:text-[10px] font-bold rounded-md">CONNECTED</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for others */}
          {['Course Builder', 'SaaS Dashboard'].includes(activeTab) && (
             <div className="bg-white py-20 md:py-40 text-center rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center animate-pulse">
                <div className="text-4xl md:text-5xl mb-6 grayscale">🚧</div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{activeTab} In Progress</h3>
                <p className="text-slate-400 max-w-sm px-4 text-sm">
                  We are fine-tuning this module for bespoke operation. <br/>
                  Target Deployment: Q2 2025.
                </p>
             </div>
          )}
        </div>
      </main>

      {/* Product Modal (Add/Edit) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            <header className="px-6 md:px-8 py-4 md:py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 serif">
                {editingProduct ? 'Edit Product' : 'Add New Artisan Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>
            <form onSubmit={handleSaveProduct} className="p-6 md:p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Name</label>
                  <input name="name" defaultValue={editingProduct?.name} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Price (INR)</label>
                  <input type="number" name="price" defaultValue={editingProduct?.price} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                  <p className="text-[9px] text-slate-400">Equivalent: {formatPrice(Number(editingProduct?.price || 0), currency)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select name="category" defaultValue={editingProduct?.category} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option value="Handmade">Handmade</option>
                    <option value="Homemade">Homemade</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Stock</label>
                  <input type="number" name="stock" defaultValue={editingProduct?.stock} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                <input name="image" defaultValue={editingProduct?.image} placeholder="https://..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Short Summary</label>
                <input name="description" defaultValue={editingProduct?.description} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed Description</label>
                <textarea name="longDescription" defaultValue={editingProduct?.longDescription} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm" />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors text-sm"
              >
                {editingProduct ? 'Update Product Details' : 'Publish Product to Store'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-up { animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default AdminPage;
