
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { STORE_ITEMS } from '../constants';
import { StoreItem, CartItem } from '../types';
import { getCurrencyConfig, formatPrice, CurrencyConfig } from '../utils/currency';

const StorePage: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<StoreItem[]>(STORE_ITEMS);
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('1234567890');
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig());
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [gpayLoaded, setGpayLoaded] = useState(false);

  const gpayCartRef = useRef<HTMLDivElement>(null);
  const gpayProductRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const savedNumber = localStorage.getItem('ambs_tattva_wa_number');
    if (savedNumber) setWhatsappNumber(savedNumber);
  }, []);

  // --- Google Pay Integration ---
  const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
  };

  const allowedPaymentMethods = [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA'],
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'example',
          gatewayMerchantId: 'exampleGatewayMerchantId',
        },
      },
    },
  ];

  const getGooglePaymentsClient = () => {
    return new (window as any).google.payments.api.PaymentsClient({
      environment: 'TEST',
    });
  };

  const checkGpayReady = () => {
    if (!(window as any).google) return;
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay({ ...baseRequest, allowedPaymentMethods })
      .then((response: any) => {
        if (response.result) {
          setGpayLoaded(true);
        }
      })
      .catch((err: any) => console.error("GPay Ready Error:", err));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if ((window as any).google) {
        checkGpayReady();
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const onPaymentAuthorized = (paymentData: any) => {
    return new Promise((resolve) => {
      console.log('Payment Authorized:', paymentData);
      setTimeout(() => {
        setIsPaymentSuccess(true);
        setCart([]);
        setIsCartOpen(false);
        setSelectedProduct(null);
        setTimeout(() => setIsPaymentSuccess(false), 5000);
        resolve({ transactionState: 'SUCCESS' });
      }, 1500);
    });
  };

  const renderGPayButton = (container: HTMLDivElement | null, amount: number) => {
    if (!container || !gpayLoaded) return;

    const paymentsClient = getGooglePaymentsClient();
    const button = paymentsClient.createButton({
      buttonColor: 'black',
      buttonType: 'buy',
      buttonSizeMode: 'fill',
      onClick: () => {
        const paymentDataRequest = {
          ...baseRequest,
          allowedPaymentMethods,
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: (amount * currency.rate).toFixed(2),
            currencyCode: currency.code,
            countryCode: currency.code === 'INR' ? 'IN' : 'US',
          },
          merchantInfo: {
            merchantName: 'Ambs Tattva Store',
          },
          callbackIntents: ['PAYMENT_AUTHORIZATION'],
        };

        paymentsClient.loadPaymentData(paymentDataRequest)
          .then((paymentData: any) => onPaymentAuthorized(paymentData))
          .catch((err: any) => console.error('GPay Error:', err));
      },
    });

    container.innerHTML = '';
    container.appendChild(button);
  };

  useEffect(() => {
    if (gpayLoaded) {
      if (isCartOpen && cart.length > 0) {
        renderGPayButton(gpayCartRef.current, cartTotal);
      }
    }
  }, [isCartOpen, cart, gpayLoaded]);

  useEffect(() => {
    if (gpayLoaded && selectedProduct) {
      renderGPayButton(gpayProductRef.current, selectedProduct.price);
    }
  }, [selectedProduct, gpayLoaded]);

  // --- Categories & Filtering ---
  const categories = ['All', 'Handmade', 'Homemade'];

  const filteredItems = useMemo(() => {
    return products.filter(item => {
      const matchesFilter = filter === 'All' || item.category === filter;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, filter, search]);

  const addToCart = (product: StoreItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleWhatsAppCheckout = () => {
    const itemsList = cart.map(i => `${i.name} (x${i.quantity}) - ${formatPrice(i.price * i.quantity, currency)}`).join('\n');
    const message = encodeURIComponent(`Hi Ambs! I'd like to order from Tattva Store:\n\n${itemsList}\n\nTotal: ${formatPrice(cartTotal, currency)}`);
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      {/* Success Toast */}
      {isPaymentSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold">Payment Successful!</p>
            <p className="text-xs opacity-90">Thank you for your artisanal purchase.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 serif">Ambs Store</h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg italic italic">"Artisanal creations, synchronized with the elements."</p>
            <div className="mt-4 flex justify-center gap-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-100">
                Region: {currency.code}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">
                GPay Enabled (TEST)
              </span>
            </div>
          </header>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="relative w-full md:max-w-sm">
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-full">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    filter === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors group"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div 
                className="h-72 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedProduct(item)}
              >
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-widest shadow-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setSelectedProduct(item)}>{item.name}</h3>
                  <span className="text-lg font-bold text-slate-900">{formatPrice(item.price, currency)}</span>
                </div>
                <p className="text-slate-500 text-sm mb-6 flex-grow italic line-clamp-2">{item.description}</p>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all font-bold text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 relative">
                <img src={selectedProduct.image} className="w-full h-full object-cover h-[300px] md:h-full" alt={selectedProduct.name} />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col relative">
                <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 serif">{selectedProduct.name}</h2>
                <div className="text-2xl font-bold text-indigo-600 mb-6">{formatPrice(selectedProduct.price, currency)}</div>
                <p className="text-slate-600 mb-8 leading-relaxed">{selectedProduct.longDescription || selectedProduct.description}</p>
                
                <div className="mt-auto space-y-4">
                  <button 
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all"
                  >
                    Add to Cart
                  </button>
                  {/* Quick GPay Buy */}
                  {gpayLoaded && (
                    <div className="space-y-2">
                       <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">— OR QUICK BUY —</p>
                       <div ref={gpayProductRef} className="w-full flex justify-center h-12"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]" onClick={() => setIsCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[120] shadow-2xl animate-slide-left flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-slate-400">Your basket is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500">×</button>
                      </div>
                      <div className="text-sm text-slate-500">{item.quantity} × {formatPrice(item.price, currency)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500 font-medium">Total Payable</span>
                  <span className="text-2xl font-bold text-slate-900">{formatPrice(cartTotal, currency)}</span>
                </div>
                
                {/* GPay Button */}
                <div className="space-y-3">
                  <div ref={gpayCartRef} className="w-full flex justify-center h-12"></div>
                  <button 
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all text-sm"
                  >
                    Checkout via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slide-left { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-up { animation: scale-up 0.3s ease-out; }
        .animate-slide-left { animation: slide-left 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default StorePage;
