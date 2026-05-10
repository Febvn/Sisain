import React, { useState, useEffect } from 'react';
import { 
    ShoppingCart, MapPin, Search, Plus, Home, User, 
    X, Star, Clock, Trash2, BarChart3, Package, 
    Leaf, ShieldCheck, TrendingUp, History, Info, ListFilter,
    Recycle
} from 'lucide-react';
import './index.css';

// --- Senior Architect's Product Data ---
const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "Premium Vegetable Box",
        category: "Sayur",
        currentPrice: 5000,
        oldPrice: 15000,
        distance: "0.8 km",
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
        merchant: "Warung Bu Siti",
        rating: 4.8,
        stock: 5,
        description: "A complete set of fresh vegetables including carrots, potatoes, beans, and celery. Saved from daily surplus."
    },
    {
        id: 2,
        name: "Whole Wheat Sourdough",
        category: "Roti",
        currentPrice: 8500,
        oldPrice: 25000,
        distance: "1.2 km",
        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600",
        merchant: "Artisan Bakery",
        rating: 4.9,
        stock: 2,
        description: "Freshly baked artisan sourdough. Surplus from today's morning batch."
    },
    {
        id: 3,
        name: "Ayam Geprek Special",
        category: "Siap Saji",
        currentPrice: 12000,
        oldPrice: 30000,
        distance: "0.5 km",
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
        merchant: "Geprek Universe",
        rating: 4.7,
        stock: 10,
        description: "Crispy chicken with signature spicy sambal. High quality surplus from a corporate event."
    },
    {
        id: 4,
        name: "Red Dragon Fruit (1kg)",
        category: "Buah",
        currentPrice: 15000,
        oldPrice: 40000,
        distance: "2.1 km",
        img: "https://images.unsplash.com/photo-1527324688151-0e627063f2b1?auto=format&fit=crop&q=80&w=600",
        merchant: "Fresh Orchards",
        rating: 4.6,
        stock: 3,
        description: "Sweet and juicy red dragon fruit. Surplus from international export batch."
    },
    {
        id: 5,
        name: "Golden Almond Croissant",
        category: "Roti",
        currentPrice: 15000,
        oldPrice: 38000,
        distance: "1.5 km",
        img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600",
        merchant: "La Petite Boulangerie",
        rating: 4.9,
        stock: 4,
        description: "Buttery croissant topped with roasted almonds. Afternoon surplus batch."
    },
    {
        id: 6,
        name: "Sweet Sunkist Oranges",
        category: "Buah",
        currentPrice: 20000,
        oldPrice: 50000,
        distance: "3.2 km",
        img: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&q=80&w=600",
        merchant: "Tropical Harvest",
        rating: 4.5,
        stock: 8,
        description: "Imported Sunkist oranges, juicy and vitamin-packed surplus."
    }
];

const CATEGORIES = ["Semua", "Sayur", "Buah", "Roti", "Siap Saji"];
const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

export default function App() {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState("home");
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortType, setSortType] = useState("terdekat");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [filters, setFilters] = useState({
        priceRange: [0, 100000],
        maxDistance: 5,
        shelfLife: 'all',
        minRating: 0
    });

    // --- UX Handlers ---
    const showToast = (message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const handleAddToCart = (product) => {
        setCart(prev => [...prev, product]);
        setSelectedProduct(null);
        showToast(`Saved ${product.name}!`);
    };

    const handleCheckout = () => {
        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleDateString('id-ID'),
            items: [...cart],
            total: cart.reduce((acc, curr) => acc + curr.currentPrice, 0)
        };
        setOrderHistory(prev => [newOrder, ...prev]);
        setCart([]);
        setActiveTab("profile");
        showToast("Food Rescued Successfully!");
    };

    // --- Filter Logic ---
    const filteredProducts = INITIAL_PRODUCTS
        .filter(p => (activeCategory === "Semua" || p.category === activeCategory))
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.merchant.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortType === "termurah") return a.currentPrice - b.currentPrice;
            if (sortType === "rating") return b.rating - a.rating;
            return 0; // Default: 'terdekat' (using initial order)
        });

    return (
        <div className="app-container">
            {/* Success Notification Popup */}
            {toasts.length > 0 && (
                <div className="toast-overlay-center">
                    {toasts.map(t => (
                        <div key={t.id} className="success-popup-box">
                            <div className="checkmark-circle">
                                <svg className="checkmark-svg" viewBox="0 0 52 52">
                                    <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
                                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                            </div>
                            <p className="success-message">{t.message}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Header Section */}
            <header className="main-header">
                <div className="header-top">
                    <div className="logo-container" onClick={() => setActiveTab('home')}>
                        <div className="logo-icon" style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Recycle size={120} strokeWidth={0.8} color="white" />
                            <span style={{
                                position: 'absolute',
                                fontSize: '10px',
                                fontWeight: '900',
                                color: 'white',
                                marginTop: '3px'
                            }}>S</span>
                        </div>
                        <span className="logo-text">Sisain</span>
                    </div>

                    <nav className="desktop-nav">
                        <span onClick={() => setActiveTab('home')} className={`nav-pill ${activeTab === 'home' ? 'active' : ''}`}>Home</span>
                        <span onClick={() => setActiveTab('about')} className={`nav-pill ${activeTab === 'about' ? 'active' : ''}`}>Misi Kami</span>
                        <span onClick={() => setActiveTab('explore')} className={`nav-pill ${activeTab === 'explore' ? 'active' : ''}`}>Eksplorasi</span>
                        <span onClick={() => setActiveTab('merchant')} className={`nav-pill ${activeTab === 'merchant' ? 'active' : ''}`}>Mitra Merchant</span>
                        <span className="nav-pill">Bantuan</span>
                    </nav>

                    <div className="location-pill">
                        <MapPin size={14} color="var(--orange)" />
                        <span>Jakarta Selatan</span>
                    </div>
                </div>

                <div className="header-bottom-bar">
                    <div className="search-capsule">
                        <Search size={20} color="var(--text-muted)" />
                        <input 
                            className="search-input"
                            placeholder="Cari makanan..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="search-actions">
                            <div className="search-action-btn" onClick={() => setIsCategoryOpen(true)}>
                                <Package size={16} color={activeCategory !== "Semua" ? "var(--orange)" : "var(--text-muted)"} />
                                <span className="action-label">{activeCategory === "Semua" ? "Kategori" : activeCategory}</span>
                            </div>
                            <div className="action-divider"></div>
                            <div className="filter-icon-btn" onClick={() => setIsFilterOpen(true)}>
                                <ListFilter size={18} color="var(--orange)" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{animation: 'fadeIn 0.5s ease'}}>
                {(activeTab === 'home' || activeTab === 'explore') && (
                    <>
                        {activeTab === 'home' && (
                            <>
                            <section className="hero-banner">
                                <div className="hero-overlay"></div>
                                <img src="/sisain_hero_image_1778438586294.png" className="hero-bg" alt="Hero" />
                                <div className="hero-content-modern">
                                    <h1 className="hero-title-main">SELAMAT DATANG DI <span className="highlight-text">SISAIN.ONLINE</span></h1>
                                    <p className="hero-subtitle-main">
                                        Selamatkan makanan berkualitas dari ribuan mitra merchant dengan harga terbaik. 
                                        Mari kurangi limbah pangan bersama!
                                    </p>
                                    <div className="app-download-row">
                                        <div className="download-btn-capsule">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" />
                                        </div>
                                        <div className="download-btn-capsule">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="features-section">
                                <h2 className="section-title-center">Kenapa Memilih Sisain?</h2>
                                <div className="features-grid">
                                    <div className="feature-item-modern">
                                        <div className="feature-icon-wrap-custom">
                                            <svg viewBox="0 0 100 100" width="90" height="90">
                                                <defs>
                                                    <linearGradient id="truckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#ff7337" />
                                                        <stop offset="100%" stopColor="#ee4d2d" />
                                                    </linearGradient>
                                                    <filter id="shadowIcon" x="-20%" y="-20%" width="140%" height="140%">
                                                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                                                        <feOffset dx="2" dy="2" result="offsetblur" />
                                                        <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
                                                        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                                                    </filter>
                                                </defs>
                                                <g filter="url(#shadowIcon)">
                                                    <path d="M15 50 Q15 45 20 45 H65 Q70 45 70 50 V70 H15 Z" fill="url(#truckGrad)" />
                                                    <path d="M70 55 H85 Q90 55 90 60 V70 H70 Z" fill="#ee4d2d" />
                                                    <rect x="72" y="58" width="12" height="8" rx="2" fill="white" opacity="0.3" />
                                                    <circle cx="30" cy="75" r="8" fill="#333" />
                                                    <circle cx="30" cy="75" r="4" fill="#666" />
                                                    <circle cx="75" cy="75" r="8" fill="#333" />
                                                    <circle cx="75" cy="75" r="4" fill="#666" />
                                                    <rect x="35" y="25" width="25" height="25" rx="5" fill="#fff" />
                                                    <path d="M40 32 L55 32 M40 38 L50 38 M40 44 L53 44" stroke="#ee4d2d" strokeWidth="2" strokeLinecap="round" />
                                                </g>
                                            </svg>
                                        </div>
                                        <h3>Hemat Hingga 70%</h3>
                                        <p>Nikmati makanan berkualitas dari restoran favorit dengan harga yang jauh lebih terjangkau.</p>
                                    </div>
                                    <div className="feature-item-modern">
                                        <div className="feature-icon-wrap-custom">
                                            <svg viewBox="0 0 100 100" width="90" height="90">
                                                <defs>
                                                    <linearGradient id="ticketGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#ffda6a" />
                                                        <stop offset="100%" stopColor="#ffc107" />
                                                    </linearGradient>
                                                    <linearGradient id="ticketGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#ff7337" />
                                                        <stop offset="100%" stopColor="#ee4d2d" />
                                                    </linearGradient>
                                                </defs>
                                                <g filter="url(#shadowIcon)">
                                                    <rect x="15" y="35" width="60" height="35" rx="6" fill="url(#ticketGrad1)" transform="rotate(-15 45 52)" />
                                                    <rect x="25" y="38" width="60" height="35" rx="6" fill="url(#ticketGrad2)" />
                                                    <circle cx="38" cy="55" r="10" fill="none" stroke="white" strokeWidth="4" />
                                                    <text x="33" y="59" fill="white" fontSize="14" fontWeight="900" style={{fontFamily: 'Arial'}}>%</text>
                                                    <path d="M70 38 V73" stroke="white" strokeWidth="3" strokeDasharray="5 5" opacity="0.6" />
                                                    <circle cx="70" cy="45" r="3" fill="#ee4d2d" />
                                                    <circle cx="70" cy="65" r="3" fill="#ee4d2d" />
                                                </g>
                                            </svg>
                                        </div>
                                        <h3>Selamatkan Bumi</h3>
                                        <p>Setiap makanan yang Anda beli membantu mengurangi limbah pangan dan emisi karbon.</p>
                                    </div>
                                    <div className="feature-item-modern">
                                        <div className="feature-icon-wrap-custom">
                                            <svg viewBox="0 0 100 100" width="90" height="90">
                                                <defs>
                                                    <linearGradient id="menuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#ff7337" />
                                                        <stop offset="100%" stopColor="#ee4d2d" />
                                                    </linearGradient>
                                                </defs>
                                                <g filter="url(#shadowIcon)">
                                                    <rect x="25" y="15" width="50" height="70" rx="6" fill="url(#menuGrad)" />
                                                    <rect x="25" y="15" width="12" height="70" rx="3" fill="#d32f2f" />
                                                    <path d="M22 25 H33 M22 35 H33 M22 45 H33 M22 55 H33 M22 65 H33 M22 75 H33" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                                                    <circle cx="53" cy="45" r="18" fill="white" opacity="0.15" />
                                                    <path d="M50 35 Q50 55 50 55 M53 35 Q53 55 53 55 M56 35 Q56 55 56 55 M53 55 L53 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                                    <text x="42" y="78" fill="white" fontSize="9" fontWeight="900" style={{fontFamily: 'Arial', letterSpacing: '1px'}}>MENU</text>
                                                </g>
                                            </svg>
                                        </div>
                                        <h3>Kualitas Terjamin</h3>
                                        <p>Semua mitra kami telah melalui kurasi ketat untuk memastikan kualitas dan keamanan pangan.</p>
                                    </div>
                                </div>
                            </section>
                            </>
                        )}


                        <section className="product-grid">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="card-neumorph" onClick={() => setSelectedProduct(p)}>
                                    <div className="card-image-wrapper">
                                        <img src={p.img} alt={p.name} className="card-image" />
                                    </div>
                                    <h3 className="card-title">{p.name}</h3>
                                    <div className="card-merchant">
                                        <ShieldCheck size={14} color="var(--orange)" />
                                        <span>{p.merchant}</span>
                                    </div>
                                    <div className="card-price-stack">
                                        <span className="price-current">{formatIDR(p.currentPrice)}</span>
                                        <span className="price-old">{formatIDR(p.oldPrice)}</span>
                                    </div>
                                    <div style={{marginTop: '15px', display: 'flex', gap: '15px', fontSize: '0.8rem', fontWeight: 700}}>
                                        <span style={{color: '#ffc107', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                            <Star size={14} fill="#ffc107" /> {p.rating}
                                        </span>
                                        <span style={{color: 'var(--text-muted)'}}>{p.distance}</span>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </>
                )}

                {activeTab === 'about' && (
                    <div style={{padding: '50px 25px', textAlign: 'center'}}>
                        <div className="card-neumorph" style={{maxWidth: '800px', margin: '0 auto', padding: '60px 40px'}}>
                            <Leaf size={64} color="var(--orange)" style={{marginBottom: '30px'}} />
                            <h2 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px'}}>Misi Besar Sisain</h2>
                            <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 40px'}}>
                                Kami percaya bahwa tidak ada makanan yang layak dibuang. Sisain hadir untuk menghubungkan kelebihan pangan berkualitas dengan para pahlawan penyelamat seperti Anda.
                            </p>
                            <div className="cat-grid" style={{textAlign: 'left'}}>
                                <div className="cat-item">
                                    <TrendingUp size={32} color="var(--orange)" />
                                    <h4 style={{fontWeight: 800}}>Ekonomi Sirkular</h4>
                                    <p style={{fontSize: '0.8rem', textAlign: 'center'}}>Membantu pedagang mengurangi kerugian surplus.</p>
                                </div>
                                <div className="cat-item">
                                    <ShieldCheck size={32} color="var(--orange)" />
                                    <h4 style={{fontWeight: 800}}>Kualitas Terjamin</h4>
                                    <p style={{fontSize: '0.8rem', textAlign: 'center'}}>Setiap mitra telah melewati kurasi standar keamanan pangan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div style={{padding: '30px 25px'}}>
                        <h2 style={{fontWeight: 800, marginBottom: '30px', fontSize: '1.8rem'}}>Keranjang Penyelamatan</h2>
                        {cart.length === 0 ? (
                            <div className="card-neumorph" style={{padding: '80px 20px'}}>
                                <ShoppingCart size={64} color="var(--text-muted)" opacity={0.3} style={{marginBottom: '20px'}} />
                                <p style={{color: 'var(--text-muted)'}}>Belum ada misi penyelamatan aktif hari ini.</p>
                            </div>
                        ) : (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                                {cart.map((item, idx) => (
                                    <div key={idx} className="card-neumorph" style={{flexDirection: 'row', justifyContent: 'space-between', textAlign: 'left', padding: '20px'}}>
                                        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                                            <img src={item.img} style={{width: '80px', height: '80px', borderRadius: '15px', objectFit: 'cover'}} />
                                            <div>
                                                <h4 style={{fontWeight: 800}}>{item.name}</h4>
                                                <p style={{color: 'var(--orange)', fontWeight: 800}}>{formatIDR(item.currentPrice)}</p>
                                            </div>
                                        </div>
                                        <button 
                                            style={{background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer'}}
                                            onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                ))}
                                <div className="card-neumorph" style={{padding: '30px', marginTop: '20px'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px'}}>
                                        <span style={{fontSize: '1.2rem', fontWeight: 700}}>Total Penyelamatan</span>
                                        <span style={{fontSize: '1.5rem', fontWeight: 800, color: 'var(--orange)'}}>
                                            {formatIDR(cart.reduce((acc, curr) => acc + curr.currentPrice, 0))}
                                        </span>
                                    </div>
                                    <button 
                                        className="nav-pill active" 
                                        style={{width: '100%', padding: '20px', fontSize: '1.1rem', border: 'none'}}
                                        onClick={handleCheckout}
                                    >
                                        Selesaikan Misi Penyelamatan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="view-container" style={{padding: '30px 25px', animation: 'slideUp 0.5s ease'}}>
                        <div className="card-neumorph" style={{padding: '40px 20px', marginBottom: '30px'}}>
                            <div style={{position: 'relative', marginBottom: '20px'}}>
                                <div style={{width: '110px', height: '110px', borderRadius: '50%', background: 'var(--bg-color)', boxShadow: 'var(--shadow-light), var(--shadow-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <User size={54} color="var(--orange)" />
                                </div>
                                <div style={{position: 'absolute', bottom: '0', right: '0', width: '32px', height: '32px', background: 'var(--orange)', borderRadius: '50%', border: '4px solid var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Star size={14} fill="white" color="white" />
                                </div>
                            </div>
                            <h2 style={{fontWeight: 800, fontSize: '1.6rem'}}>Hero Penyelamat #042</h2>
                            <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '5px'}}>Member sejak Mei 2024</p>
                            <span style={{background: 'var(--orange-light)', color: 'var(--orange)', padding: '6px 18px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, marginTop: '15px'}}>Penyelamat Perunggu</span>
                        </div>

                        {/* Impact SVG Dashboard */}
                        <div className="card-neumorph" style={{marginTop: '30px', padding: '30px', textAlign: 'left'}}>
                            <h3 style={{fontWeight: 800, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <TrendingUp size={20} color="var(--orange)" /> Tren Dampak Lingkungan
                            </h3>
                            
                            <div className="chart-container" style={{padding: '20px 10px'}}>
                                <svg viewBox="0 0 400 150" width="100%" height="150" style={{overflow: 'visible'}}>
                                    <defs>
                                        <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M 0 120 C 50 110, 80 140, 120 100 C 160 60, 200 90, 240 40 C 280 -10, 320 50, 400 20 L 400 150 L 0 150 Z" fill="url(#profileGradient)" />
                                    <path d="M 0 120 C 50 110, 80 140, 120 100 C 160 60, 200 90, 240 40 C 280 -10, 320 50, 400 20" fill="none" stroke="var(--orange)" strokeWidth="4" strokeLinecap="round" />
                                    <circle cx="240" cy="40" r="5" fill="var(--white)" stroke="var(--orange)" strokeWidth="3" />
                                </svg>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px', padding: '0 5px'}}>
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'Mei'].map(m => (
                                        <span key={m} style={{fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)'}}>{m}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="cat-grid" style={{marginTop: '30px', marginBottom: '0'}}>
                                <div className="cat-item">
                                    <Leaf size={24} color="green" />
                                    <h3>12.5kg</h3>
                                    <p style={{fontSize: '0.65rem'}}>CO2 Dicegah</p>
                                </div>
                                <div className="cat-item">
                                    <TrendingUp size={24} color="var(--orange)" />
                                    <h3>4.2jt</h3>
                                    <p style={{fontSize: '0.65rem'}}>Total Hemat</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div style={{marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                            <div className="card-neumorph" style={{flexDirection: 'row', justifyContent: 'space-between', padding: '20px'}}>
                                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                                    <div className="logo-icon" style={{width: '40px', height: '40px', background: 'var(--orange-light)'}}><MapPin size={20} color="var(--orange)" /></div>
                                    <span style={{fontWeight: 700}}>Alamat Pengiriman</span>
                                </div>
                                <Plus size={20} color="var(--text-muted)" />
                            </div>
                            <div className="card-neumorph" style={{flexDirection: 'row', justifyContent: 'space-between', padding: '20px'}}>
                                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                                    <div className="logo-icon" style={{width: '40px', height: '40px', background: 'var(--orange-light)'}}><ShoppingCart size={20} color="var(--orange)" /></div>
                                    <span style={{fontWeight: 700}}>Metode Pembayaran</span>
                                </div>
                                <Plus size={20} color="var(--text-muted)" />
                            </div>
                            <button className="card-neumorph" style={{padding: '20px', color: '#ff4d4f', fontWeight: 800, border: 'none', cursor: 'pointer'}}>
                                Keluar Akun
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* --- PROFESSIONAL FOOTER --- */}
            <footer className="main-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <span className="logo-text" style={{fontSize: '2rem'}}>Sisain</span>
                        <p style={{marginTop: '15px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6'}}>
                            Platform marketplace surplus pangan nomor satu di Indonesia. Menyelamatkan makanan, menyelamatkan bumi.
                        </p>
                    </div>
                    <div className="footer-section">
                        <h4>Navigasi</h4>
                        <ul className="footer-links">
                            <li onClick={() => setActiveTab('home')}>Eksplorasi</li>
                            <li onClick={() => setActiveTab('about')}>Misi Kami</li>
                            <li onClick={() => setActiveTab('merchant')}>Mitra Merchant</li>
                            <li>Bantuan & FAQ</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Legalitas</h4>
                        <ul className="footer-links">
                            <li>Syarat & Ketentuan</li>
                            <li>Kebijakan Privasi</li>
                            <li>Aturan Main Merchant</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Hubungi Kami</h4>
                        <ul className="footer-links">
                            <li>support@sisain.online</li>
                            <li>+62 812-3456-7890</li>
                            <li>Bandung, Indonesia</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Sisain.online. Dibuat dengan cinta untuk Bumi.</p>
                    <div style={{display: 'flex', gap: '20px'}}>
                        <span>Instagram</span>
                        <span>Twitter</span>
                        <span>LinkedIn</span>
                    </div>
                </div>
            </footer>

            {/* Bottom Navigation */}
            <nav className="nav-bottom-neumorph">
                <button className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                    <Home size={22} />
                    <span>Home</span>
                </button>
                <button className={`tab-btn ${activeTab === 'merchant' ? 'active' : ''}`} onClick={() => setActiveTab('merchant')}>
                    <Plus size={22} />
                    <span>Jual</span>
                </button>
                <button className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>
                    <Search size={22} />
                    <span>Explore</span>
                </button>
                <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                    <div style={{position: 'relative'}}>
                        <ShoppingCart size={22} />
                        {cart.length > 0 && <span style={{position: 'absolute', top: '-8px', right: '-8px', background: 'var(--orange)', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '50px'}}>{cart.length}</span>}
                    </div>
                    <span>Keranjang</span>
                </button>
                <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                    <User size={22} />
                    <span>Profil</span>
                </button>
            </nav>

            {/* Category Modal */}
            {isCategoryOpen && (
                <div className="modal-backdrop" onClick={() => setIsCategoryOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="close-btn" onClick={() => setIsCategoryOpen(false)}><X size={20} /></div>
                        <h2 style={{fontWeight: 800, marginBottom: '30px', textAlign: 'center'}}>Pilih Kategori</h2>
                        <div className="cat-grid">
                            {CATEGORIES.map(cat => (
                                <div 
                                    key={cat} 
                                    className={`cat-item ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => { setActiveCategory(cat); setIsCategoryOpen(false); }}
                                >
                                    {cat === "Semua" && <Package size={24} />}
                                    {cat === "Sayur" && <Leaf size={24} />}
                                    {cat === "Buah" && <Star size={24} />}
                                    {cat === "Roti" && <Clock size={24} />}
                                    {cat === "Siap Saji" && <History size={24} />}
                                    <span style={{fontWeight: 700, fontSize: '0.9rem'}}>{cat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Filter Modal */}
            {isFilterOpen && (
                <div className="modal-backdrop" onClick={() => setIsFilterOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="close-btn" onClick={() => setIsFilterOpen(false)}><X size={20} /></div>
                        <h2 style={{fontWeight: 800, marginBottom: '30px', textAlign: 'center'}}>Filter Lanjutan</h2>
                        
                        <div className="filter-section-modal">
                            <h4>Range Harga (Rp)</h4>
                            <div className="filter-input-group">
                                <input type="number" placeholder="Min" />
                                <span>-</span>
                                <input type="number" placeholder="Max" />
                            </div>
                        </div>

                        <div className="filter-section-modal" style={{marginTop: '25px'}}>
                            <h4>Jarak Maksimal (km)</h4>
                            <input type="range" min="1" max="10" step="1" style={{width: '100%', accentColor: 'var(--orange)'}} />
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '5px'}}>
                                <span>1 km</span>
                                <span>10 km</span>
                            </div>
                        </div>

                        <div className="filter-section-modal" style={{marginTop: '25px'}}>
                            <h4>Ketahanan / Expired</h4>
                            <div className="cat-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px'}}>
                                <div className="sort-item active" style={{fontSize: '0.7rem', padding: '10px'}}>Hari Ini</div>
                                <div className="sort-item" style={{fontSize: '0.7rem', padding: '10px'}}>Besok</div>
                                <div className="sort-item" style={{fontSize: '0.7rem', padding: '10px'}}>7 Hari</div>
                            </div>
                        </div>

                        <div className="filter-section-modal" style={{marginTop: '25px'}}>
                            <h4>Minimal Rating</h4>
                            <div style={{display: 'flex', gap: '10px', background: 'var(--bg-color)', padding: '15px', borderRadius: '15px', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', justifyContent: 'center'}}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star 
                                        key={star} 
                                        size={28} 
                                        fill={star <= filters.minRating ? "#ffc107" : "none"} 
                                        color={star <= filters.minRating ? "#ffc107" : "var(--text-muted)"}
                                        style={{cursor: 'pointer', transition: 'var(--transition-smooth)'}}
                                        onClick={() => setFilters({...filters, minRating: star})}
                                    />
                                ))}
                            </div>
                            <p style={{textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px'}}>
                                Menampilkan produk dengan rating {filters.minRating}+
                            </p>
                        </div>

                        <button 
                            className="nav-pill active" 
                            style={{width: '100%', padding: '18px', border: 'none', fontSize: '1.1rem', marginTop: '40px'}}
                            onClick={() => setIsFilterOpen(false)}
                        >
                            Terapkan Filter
                        </button>
                    </div>
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
                    <div className="modal-card" style={{padding: 0, overflow: 'hidden'}} onClick={e => e.stopPropagation()}>
                        <div className="close-btn" style={{zIndex: 10}} onClick={() => setSelectedProduct(null)}><X size={20} /></div>
                        <img src={selectedProduct.img} style={{width: '100%', height: '250px', objectFit: 'cover'}} />
                        <div style={{padding: '30px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
                                <div>
                                    <h2 style={{fontWeight: 800, fontSize: '1.5rem'}}>{selectedProduct.name}</h2>
                                    <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px'}}>
                                        <ShieldCheck size={16} color="var(--orange)" /> {selectedProduct.merchant}
                                    </p>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <div style={{color: 'var(--orange)', fontWeight: 800, fontSize: '1.6rem'}}>{formatIDR(selectedProduct.currentPrice)}</div>
                                    <div style={{textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9rem'}}>{formatIDR(selectedProduct.oldPrice)}</div>
                                </div>
                            </div>
                            <p style={{color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '30px'}}>{selectedProduct.description}</p>
                            <button 
                                className="nav-pill active" 
                                style={{width: '100%', padding: '18px', border: 'none', fontSize: '1.1rem'}}
                                onClick={() => handleAddToCart(selectedProduct)}
                            >
                                Tambahkan Ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
