import React, { useState, useEffect } from 'react';
import { 
    ShoppingCart, MapPin, Search, Plus, Home, User, 
    X, Star, Clock, Trash2, BarChart3, Package, 
    Leaf, ShieldCheck, TrendingUp, History, Info, ListFilter,
    Recycle, Wallet, Ticket, CreditCard, Heart, Store, Truck, CheckCircle2, RotateCcw,
    Award, Medal, Crown, Zap, Droplets, LogOut, ChevronRight, Settings, Phone
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
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "", category: "Sayur", currentPrice: "", oldPrice: "", stock: "", description: "", img: ""
    });
    const [filters, setFilters] = useState({
        priceRange: [0, 100000],
        maxDistance: 5,
        shelfLife: 'all',
        minRating: 0
    });
    const [isLanguageSelected, setIsLanguageSelected] = useState(false);
    const [language, setLanguage] = useState("id");
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

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

    const handleAddProduct = (e) => {
        e.preventDefault();
        const product = {
            ...newProduct,
            id: Date.now(),
            currentPrice: parseInt(newProduct.currentPrice),
            oldPrice: parseInt(newProduct.oldPrice),
            stock: parseInt(newProduct.stock),
            merchant: "Warung Bu Siti",
            rating: 5.0,
            distance: "0.0 km",
            img: newProduct.img || "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=600"
        };
        setProducts(prev => [product, ...prev]);
        setIsAddProductOpen(false);
        setNewProduct({ name: "", category: "Sayur", currentPrice: "", oldPrice: "", stock: "", description: "", img: "" });
        showToast("Produk Berhasil Diunggah!");
    };

    const handleDeleteProduct = (productId) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        showToast("Produk Dihapus!");
    };

    // --- Filter Logic ---
    const filteredProducts = products
        .filter(p => (activeCategory === "Semua" || p.category === activeCategory))
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.merchant.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(p => p.currentPrice >= filters.priceRange[0] && p.currentPrice <= filters.priceRange[1])
        .filter(p => p.rating >= filters.minRating)
        .sort((a, b) => {
            if (sortType === "termurah") return a.currentPrice - b.currentPrice;
            if (sortType === "rating") return b.rating - a.rating;
            return 0; // Default: 'terdekat' (using initial order)
        });

    // --- Join Modal Component ---
    const JoinModal = () => (
        <div className="join-modal-overlay" onClick={() => setIsJoinModalOpen(false)}>
            <div className="join-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="join-modal-header">
                    <h3>Bergabung dengan Sisain</h3>
                    <button className="join-modal-close" onClick={() => setIsJoinModalOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="join-modal-body">
                    <div className="join-option-card">
                        <div className="join-option-image">
                            <img src="/img/merchant.JPG" alt="Bergabung sebagai Merchant" />
                        </div>
                        <h4>Bergabunglah sebagai Merchant</h4>
                        <ul className="join-benefits">
                            <li>· Dapatkan lebih banyak pesanan dan penjualan</li>
                            <li>· Bangun reputasi bisnis secara online</li>
                            <li>· Dapatkan dukungan logistik pengiriman</li>
                        </ul>
                        <button className="join-btn-primary">Temukan Lebih Banyak</button>
                    </div>
                    <div className="join-option-card">
                        <div className="join-option-image">
                            <img src="/img/customer.JPG" alt="Bergabung sebagai Pelanggan" />
                        </div>
                        <h4>Bergabunglah sebagai Pelanggan</h4>
                        <ul className="join-benefits">
                            <li>· Hemat hingga 70% dari harga normal</li>
                            <li>· Nikmati makanan berkualitas terjamin</li>
                            <li>· Dukung pengurangan limbah pangan</li>
                        </ul>
                        <button className="join-btn-primary">Temukan Lebih Banyak</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            {/* Language Selection Splash */}
            {!isLanguageSelected && (
                <div className="splash-overlay">
                    <div className="splash-card animate-splash">
                        <div className="splash-ascii-map" aria-hidden="true">
{`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣴⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠿⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⠛⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`}
                        </div>
                        <div className="splash-card-content">
                            <div className="splash-logo-wrap">
                                <Recycle size={36} strokeWidth={1.5} color="white" />
                            </div>
                            <span className="splash-brand-text">Sisain</span>
                            <h2 className="splash-title">Pilih bahasa Anda</h2>
                            <div className="splash-btn-group">
                                <button className="splash-btn" onClick={() => { setLanguage("id"); setIsLanguageSelected(true); }}>
                                    🇮🇩 Bahasa Indonesia
                                </button>
                                <button className="splash-btn" onClick={() => { setLanguage("en"); setIsLanguageSelected(true); }}>
                                    🇺🇸 English
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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

            {/* Join Modal */}
            {isJoinModalOpen && <JoinModal />}

            {/* Header Section */}
            <header className="main-header">
                <div className="header-top">
                    <div className="logo-container" onClick={() => setActiveTab('home')}>
                        <div className="logo-icon">
                            <Recycle size={22} strokeWidth={2} color="white" />
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

                    <div className="nav-auth-group">
                        <button className="location-pill btn-login-pill" aria-label="Join" title="Join" onClick={() => setIsJoinModalOpen(true)}>
                            <User size={14} />
                            <span>Join</span>
                        </button>
                    </div>

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
                                <img src="/sisain_hero.png" className="hero-bg" alt="Hero" />
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
                                <div className="section-header-center">
                                    <h2 className="section-title-center">Kenapa Memilih Sisain?</h2>
                                    <p className="section-subtitle">Solusi cerdas untuk kantong hemat dan bumi yang lebih sehat.</p>
                                </div>
                                <div className="features-grid-modern">
                                    <div className="card-neumorph feature-card-icon">
                                        <div className="feature-icon"><Ticket size={28} /></div>
                                        <div className="feature-content">
                                            <h3>Hemat Hingga 70%</h3>
                                            <p>Nikmati makanan berkualitas dari restoran favorit dengan harga yang jauh lebih terjangkau.</p>
                                        </div>
                                    </div>

                                    <div className="card-neumorph feature-card-icon">
                                        <div className="feature-icon"><Leaf size={28} /></div>
                                        <div className="feature-content">
                                            <h3>Selamatkan Bumi</h3>
                                            <p>Setiap makanan yang Anda beli membantu mengurangi limbah pangan dan emisi karbon.</p>
                                        </div>
                                    </div>

                                    <div className="card-neumorph feature-card-icon">
                                        <div className="feature-icon"><ShieldCheck size={28} /></div>
                                        <div className="feature-content">
                                            <h3>Kualitas Terjamin</h3>
                                            <p>Semua mitra kami telah melalui kurasi ketat untuk memastikan kualitas dan keamanan pangan.</p>
                                        </div>
                                    </div>

                                    <div className="card-neumorph feature-card-icon highlight-card">
                                        <div className="feature-icon"><Store size={28} /></div>
                                        <div className="feature-content">
                                            <h3>Pemberdayaan UMKM</h3>
                                            <p>Mendukung pedagang lokal dan UMKM untuk mengurangi kerugian akibat stok makanan surplus.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="how-to-order-section">
                                <div className="section-header-center">
                                    <h2 className="section-title-center">Cara Pesan di Sisain</h2>
                                    <p className="section-subtitle">Pesan makanan surplus dengan mudah di aplikasi Sisain.</p>
                                </div>
                                <div className="order-full-width-container">
                                    <div className="order-flex-container">
                                        <div className="phone-mockup-placeholder">
                                            <div className="phone-notch"></div>
                                            <div className="phone-inner">
                                            </div>
                                            <div className="phone-home-bar"></div>
                                        </div>
                                        <div className="order-steps-list">
                                            {[
                                                "Buka aplikasi Sisain",
                                                "Pilih Merchant favoritmu",
                                                "Pilih menu yang kamu mau & tambahkan ke keranjangmu",
                                                "Pastikan alamat pengirimanmu",
                                                "Pilih cara pembayaranmu",
                                                "Pesan dan tunggu makananmu dikirimkan!"
                                            ].map((step, idx) => (
                                                <div key={idx} className={`step-item-card ${idx === 5 ? '' : ''}`}>
                                                    <div className="step-count">{idx + 1}</div>
                                                    <p className="step-desc">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="merchants-section">
                                <div className="section-header-center">
                                    <h2 className="section-title-center">Mitra Merchant Pilihan</h2>
                                    <p className="section-subtitle">Telah bergabung bersama kami untuk mengurangi limbah pangan.</p>
                                </div>
                                <div className="merchants-grid-container">
                                    {[
                                        { name: 'Starbucks', logo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg', domain: 'starbucks.com' },
                                        { name: 'KFC', logo: 'https://upload.wikimedia.org/wikipedia/sco/b/bf/KFC_logo.svg', domain: 'kfc.com' },
                                        { name: 'McDonald\'s', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg', domain: 'mcdonalds.com' },
                                        { name: 'Pizza Hut', logo: 'https://upload.wikimedia.org/wikipedia/sco/d/d2/Pizza_Hut_logo.svg', domain: 'pizzahut.com' },
                                        { name: 'Burger King', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Burger_King_logo_%282021%29.svg', domain: 'bk.com' },
                                        { name: 'Domino\'s', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Domino%27s_pizza_logo.svg', domain: 'dominos.com' },
                                        { name: 'Dunkin\'', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Dunkin%27_Donuts_logo.svg/1280px-Dunkin%27_Donuts_logo.svg.png', domain: 'dunkindonuts.com' },
                                        { name: 'Subway', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg', domain: 'subway.com' },
                                        { name: 'Taco Bell', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Taco_Bell_2016.svg', domain: 'tacobell.com' },
                                        { name: 'Wendy\'s', logo: 'https://upload.wikimedia.org/wikipedia/en/3/32/Wendy%27s_full_logo_2012.svg', domain: 'wendys.com' },
                                        { name: 'Baskin-Robbins', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Baskin-Robbins_logo.svg', domain: 'baskinrobbins.com' },
                                        { name: '7-Eleven', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg', domain: '7-eleven.com' },
                                        { name: 'Krispy Kreme', logo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Krispy_Kreme_logo.svg', domain: 'krispykreme.com' },
                                        { name: 'Popeyes', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Popeyes_logo_2020.svg', domain: 'popeyes.com' },
                                        { name: 'A&W', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/A%26W_logo.svg', domain: 'awrestaurants.com' },
                                        { name: 'Dairy Queen', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Dairy_Queen_logo.svg', domain: 'dairyqueen.com' },
                                        { name: 'Carl\'s Jr.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Carl%27s_Jr._Logo.svg', domain: 'carlsjr.com' },
                                        { name: 'Hard Rock Cafe', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Hard_Rock_Cafe_logo.svg', domain: 'hardrock.com' },
                                        { name: 'Costa Coffee', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Costa_Coffee_logo.svg', domain: 'costa.co.uk' },
                                        { name: 'Nando\'s', logo: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Nando%27s_logo.svg', domain: 'nandos.co.uk' },
                                        { name: 'Chipotle', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1280px-Chipotle_Mexican_Grill_logo.svg.png', domain: 'chipotle.com' }
                                    ].map((m, i) => (
                                        <div key={i} className="merchant-logo-card">
                                            <div className="merchant-logo-box">
                                                <img 
                                                    src={m.logo} 
                                                    alt={m.name} 
                                                    className="merchant-logo-img" 
                                                    onError={(e) => {
                                                        if (!e.target.src.includes('google.com')) {
                                                            e.target.src = `https://www.google.com/s2/favicons?domain=${m.domain}&sz=128`;
                                                        } else {
                                                            e.target.style.display = 'none';
                                                            e.target.parentNode.classList.add('fallback-active');
                                                            e.target.parentNode.innerHTML = `<div class="fallback-initial">${m.name[0]}</div>`;
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <span className="merchant-name-label">{m.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            </>
                        )}


                        {activeTab === 'explore' && (
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
                        )}
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
                    <div className="view-container" style={{padding: '20px 20px 120px', animation: 'slideUp 0.5s ease'}}>
                        <h2 style={{fontWeight: 900, fontSize: '1.8rem', marginBottom: '25px', color: 'var(--text-main)', textAlign: 'left'}}>Profil Saya</h2>

                        <div className="bento-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '15px', gridAutoRows: 'minmax(100px, auto)'}}>
                            
                            {/* === 1. HERO PROFILE CARD (Bento Span 12) === */}
                            <div className="card-neumorph bento-item" style={{gridColumn: 'span 12', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'linear-gradient(135deg, var(--bg-color) 0%, rgba(238,77,45,0.05) 100%)'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                                    <div style={{position: 'relative', flexShrink: 0}}>
                                        <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-color)', boxShadow: 'var(--shadow-light), var(--shadow-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition-smooth)'}} className="hover-scale">
                                            <User size={35} color="var(--orange)" />
                                        </div>
                                        <div style={{position: 'absolute', bottom: '0', right: '0', width: '22px', height: '22px', background: 'var(--orange)', borderRadius: '50%', border: '2px solid var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Crown size={12} fill="white" color="white" />
                                        </div>
                                    </div>
                                    <div style={{flex: 1, textAlign: 'left'}}>
                                        <h2 style={{fontWeight: 900, fontSize: '1.2rem', marginBottom: '4px'}}>Hero Penyelamat #042</h2>
                                        <p style={{color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '10px'}}>hero042@sisain.online</p>
                                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                                            <span style={{background: 'var(--orange-light)', color: 'var(--orange)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                <Award size={10} /> Perunggu
                                            </span>
                                            <span style={{background: 'var(--orange-light)', color: 'var(--orange)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                <ShieldCheck size={10} color="var(--orange)" /> Terverifikasi
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-light), var(--shadow-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition-smooth)'}} className="hover-float">
                                        <Settings size={20} color="var(--text-muted)" />
                                    </div>
                                </div>
                            </div>

                            {/* === 2. SISAIN PAY & KOIN (Bento Span 6 each) === */}
                            <div className="card-neumorph bento-item hover-float" style={{gridColumn: 'span 6', padding: '20px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px'}}>
                                    <div style={{width: '36px', height: '36px', background: 'var(--orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(238,77,45,0.3)'}}>
                                        <Wallet size={18} color="white" />
                                    </div>
                                    <span style={{fontSize: '0.8rem', fontWeight: 800}}>SisainPay</span>
                                </div>
                                <div>
                                    <p style={{fontSize: '1.2rem', fontWeight: 900, color: 'var(--orange)'}}>Rp 85.500</p>
                                    <p style={{fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px'}}>Saldo Aktif</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{gridColumn: 'span 6', padding: '20px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px'}}>
                                    <div style={{width: '36px', height: '36px', background: 'var(--orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(238,77,45,0.3)'}}>
                                        <Star size={18} color="white" fill="white" />
                                    </div>
                                    <span style={{fontSize: '0.8rem', fontWeight: 800}}>Koin Sisain</span>
                                </div>
                                <div>
                                    <p style={{fontSize: '1.2rem', fontWeight: 900, color: 'var(--orange)'}}>420</p>
                                    <p style={{fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px'}}>Bisa Dipakai</p>
                                </div>
                            </div>

                            {/* === 3. RIWAYAT PESANAN (Bento Span 12) === */}
                            <div className="card-neumorph bento-item" style={{gridColumn: 'span 12', padding: '25px 30px', textAlign: 'left'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                    <h3 style={{fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <Package size={18} color="var(--orange)" /> Pesanan Saya
                                    </h3>
                                    <span style={{fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center'}}>Lihat Semua <ChevronRight size={14} /></span>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    {[
                                        { icon: <CreditCard size={30} strokeWidth={1.5} />, label: 'Belum Bayar', count: 1 },
                                        { icon: <Package size={30} strokeWidth={1.5} />, label: 'Dikemas', count: 0 },
                                        { icon: <Truck size={30} strokeWidth={1.5} />, label: 'Dikirim', count: 2 },
                                        { icon: <CheckCircle2 size={30} strokeWidth={1.5} />, label: 'Selesai', count: 8 },
                                        { icon: <RotateCcw size={30} strokeWidth={1.5} />, label: 'Retur', count: 0 },
                                    ].map(item => (
                                        <div key={item.label} className="hover-scale" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '20%', position: 'relative'}}>
                                            <div style={{color: 'var(--orange)', transition: 'var(--transition-smooth)'}} className="order-icon-wrapper">
                                                {item.icon}
                                            </div>
                                            <span style={{fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', lineHeight: '1.2', textAlign: 'center'}}>{item.label}</span>
                                            {item.count > 0 && (
                                                <div style={{position: 'absolute', top: '-6px', right: '10px', background: 'var(--orange)', color: 'white', fontSize: '0.55rem', fontWeight: 800, minWidth: '16px', height: '16px', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid var(--bg-color)'}}>
                                                    {item.count}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* === 4. VOUCHER & WISHLIST (Bento Span 6 each) === */}
                            <div className="card-neumorph bento-item hover-float" style={{gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
                                <div style={{width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Ticket size={20} color="var(--orange)" />
                                </div>
                                <div style={{textAlign: 'left'}}>
                                    <p style={{fontWeight: 800, fontSize: '0.8rem'}}>Voucher</p>
                                    <p style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>3 Aktif</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
                                <div style={{width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Heart size={20} color="var(--orange)" />
                                </div>
                                <div style={{textAlign: 'left'}}>
                                    <p style={{fontWeight: 800, fontSize: '0.8rem'}}>Wishlist</p>
                                    <p style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>12 Produk</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
                                <div style={{width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Store size={20} color="var(--orange)" />
                                </div>
                                <div style={{textAlign: 'left'}}>
                                    <p style={{fontWeight: 800, fontSize: '0.8rem'}}>Toko Favorit</p>
                                    <p style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>5 Toko</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
                                <div style={{width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Star size={20} color="var(--orange)" />
                                </div>
                                <div style={{textAlign: 'left'}}>
                                    <p style={{fontWeight: 800, fontSize: '0.8rem'}}>Ulasan Saya</p>
                                    <p style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>6 Belum</p>
                                </div>
                            </div>

                            {/* === 5. DAMPAK LINGKUNGAN (Bento Span 12) === */}
                            <div className="card-neumorph bento-item" style={{gridColumn: 'span 12', padding: '20px', textAlign: 'left', position: 'relative', overflow: 'hidden'}}>
                                {/* Decorative background elements */}
                                <div style={{position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, transform: 'rotate(15deg)', pointerEvents: 'none'}}>
                                    <Leaf size={120} />
                                </div>
                                
                                <h3 style={{fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem'}}>
                                    <TrendingUp size={18} color="var(--orange)" /> Dampak Lingkunganku
                                </h3>
                                
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px'}}>
                                    {[
                                        { icon: <Leaf size={20} color="var(--orange)" />, value: '12.5 kg', label: 'CO₂ Dicegah', bg: 'rgba(238,77,45,0.1)' },
                                        { icon: <Droplets size={20} color="var(--orange)" />, value: '340 L', label: 'Air Dihemat', bg: 'rgba(238,77,45,0.1)' },
                                        { icon: <Package size={20} color="var(--orange)" />, value: '38', label: 'Makanan Selamat', bg: 'rgba(238,77,45,0.1)' },
                                    ].map(stat => (
                                        <div key={stat.label} className="cat-item hover-scale" style={{padding: '12px 8px', borderRadius: '16px'}}>
                                            <div style={{width: '32px', height: '32px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
                                                {stat.icon}
                                            </div>
                                            <p style={{fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-main)'}}>{stat.value}</p>
                                            <p style={{fontSize: '0.55rem', color: 'var(--text-muted)', textAlign: 'center'}}>{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="chart-container" style={{padding: '15px 10px', marginTop: 0}}>
                                    <svg viewBox="0 0 400 100" width="100%" height="80" style={{overflow: 'visible'}}>
                                        <defs>
                                            <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M 0 80 C 50 70, 80 90, 120 55 C 160 20, 200 50, 240 15 C 280 -15, 320 25, 400 5 L 400 100 L 0 100 Z" fill="url(#profileGradient)" />
                                        <path d="M 0 80 C 50 70, 80 90, 120 55 C 160 20, 200 50, 240 15 C 280 -15, 320 25, 400 5" fill="none" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" />
                                        <circle cx="240" cy="15" r="5" fill="var(--white)" stroke="var(--orange)" strokeWidth="3" className="pulse-circle" />
                                    </svg>
                                </div>
                            </div>

                            {/* === 6. BADGE GAMIFIKASI (Bento Span 12) === */}
                            <div className="card-neumorph bento-item" style={{gridColumn: 'span 12', padding: '20px', textAlign: 'left'}}>
                                <h3 style={{fontWeight: 800, marginBottom: '15px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <Medal size={18} color="var(--orange)" /> Koleksi Badge
                                </h3>
                                <div className="badge-scroll-container" style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none'}}>
                                    {[
                                        { icon: <Award size={24} color="var(--orange)" />, label: 'Perunggu', unlocked: true },
                                        { icon: <Leaf size={24} color="var(--orange)" />, label: 'Eco Hero', unlocked: true },
                                        { icon: <Zap size={24} color="var(--orange)" />, label: 'Cepat Beli', unlocked: true },
                                        { icon: <Medal size={24} color="var(--orange)" />, label: 'Perak', unlocked: false },
                                        { icon: <Crown size={24} color="var(--orange)" />, label: 'Emas', unlocked: false },
                                        { icon: <Heart size={24} color="var(--orange)" />, label: 'Setia', unlocked: false },
                                    ].map(badge => (
                                        <div key={badge.label} className="hover-scale" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: badge.unlocked ? 1 : 0.4, minWidth: '65px'}}>
                                            <div style={{width: '50px', height: '50px', borderRadius: '14px', background: 'var(--bg-color)', boxShadow: badge.unlocked ? 'var(--shadow-light), var(--shadow-dark)' : 'var(--shadow-inset-light), var(--shadow-inset-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                {badge.icon}
                                            </div>
                                            <p style={{fontSize: '0.55rem', fontWeight: 800, textAlign: 'center', color: badge.unlocked ? 'var(--text-main)' : 'var(--text-muted)'}}>{badge.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* === 7. LOGOUT (Bento Span 12) === */}
                            <div style={{gridColumn: 'span 12', marginTop: '10px'}}>
                                <button
                                    className="card-neumorph hover-float"
                                    style={{width: '100%', padding: '18px', color: '#ef4444', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                                    onClick={() => showToast('Berhasil Keluar Akun!')}
                                >
                                    <LogOut size={18} /> Keluar Akun
                                </button>
                            </div>

                        </div>
                    </div>
                )}
                {activeTab === 'merchant' && (
                    <div style={{padding: '30px 25px', animation: 'slideUp 0.5s ease'}}>
                        <div className="card-neumorph" style={{padding: '40px 30px', marginBottom: '30px', textAlign: 'left'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                                <div>
                                    <h2 style={{fontWeight: 800, fontSize: '1.8rem'}}>Dashboard Merchant</h2>
                                    <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Kelola surplus pangan Anda dengan bijak.</p>
                                </div>
                                <div className="logo-icon" style={{width: '60px', height: '60px', borderRadius: '18px'}}>
                                    <TrendingUp size={30} color="white" />
                                </div>
                            </div>

                            <div className="cat-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '40px'}}>
                                <div className="cat-item">
                                    <Package size={24} color="var(--orange)" />
                                    <h3 style={{fontSize: '1.4rem', fontWeight: 800}}>
                                        {products.filter(p => p.merchant === "Warung Bu Siti").length}
                                    </h3>
                                    <p style={{fontSize: '0.7rem'}}>Produk Aktif</p>
                                </div>
                                <div className="cat-item">
                                    <BarChart3 size={24} color="var(--orange)" />
                                    <h3 style={{fontSize: '1.4rem', fontWeight: 800}}>Rp 2.4jt</h3>
                                    <p style={{fontSize: '0.7rem'}}>Total Pendapatan</p>
                                </div>
                                <div className="cat-item">
                                    <Recycle size={24} color="var(--orange)" />
                                    <h3 style={{fontSize: '1.4rem', fontWeight: 800}}>45kg</h3>
                                    <p style={{fontSize: '0.7rem'}}>Pangan Terselamatkan</p>
                                </div>
                            </div>

                            <div style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
                                <button 
                                    className="nav-pill active" 
                                    style={{flex: 1, padding: '15px', border: 'none', borderRadius: '15px'}}
                                    onClick={() => setIsAddProductOpen(true)}
                                >
                                    Unggah Produk Baru
                                </button>
                                <button className="nav-pill" style={{flex: 1, padding: '15px', border: 'none', borderRadius: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-light), var(--shadow-dark)'}}>
                                    Statistik Lanjutan
                                </button>
                            </div>
                        </div>

                        <h3 style={{fontWeight: 800, marginBottom: '20px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <ListFilter size={20} color="var(--orange)" /> Daftar Produk Anda
                        </h3>

                        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            {products.filter(p => p.merchant === "Warung Bu Siti").length === 0 ? (
                                <div className="card-neumorph" style={{padding: '50px 20px', textAlign: 'center'}}>
                                    <Package size={48} color="var(--text-muted)" opacity={0.3} style={{marginBottom: '15px'}} />
                                    <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Belum ada produk yang Anda jual.</p>
                                    <button 
                                        className="nav-pill active" 
                                        style={{marginTop: '20px', padding: '10px 25px', fontSize: '0.8rem', border: 'none'}}
                                        onClick={() => setIsAddProductOpen(true)}
                                    >
                                        Mulai Jual Sekarang
                                    </button>
                                </div>
                            ) : (
                                products.filter(p => p.merchant === "Warung Bu Siti").map(p => (
                                    <div key={p.id} className="card-neumorph" style={{flexDirection: 'row', justifyContent: 'space-between', textAlign: 'left', padding: '15px', animation: 'fadeIn 0.5s ease'}}>
                                        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                                            <div style={{position: 'relative'}}>
                                                <img src={p.img} style={{width: '75px', height: '75px', borderRadius: '15px', objectFit: 'cover'}} />
                                                <div style={{position: 'absolute', top: '-5px', right: '-5px', background: 'var(--orange)', color: 'white', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '50px', fontWeight: 800}}>
                                                    {p.category}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 style={{fontWeight: 800, fontSize: '1rem', marginBottom: '4px'}}>{p.name}</h4>
                                                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                                                    <span style={{fontSize: '0.85rem', color: 'var(--orange)', fontWeight: 800}}>{formatIDR(p.currentPrice)}</span>
                                                    <div style={{width: '1px', height: '10px', background: 'var(--text-muted)', opacity: 0.3}}></div>
                                                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Stok: {p.stock}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{display: 'flex', gap: '10px'}}>
                                            <div 
                                                className="filter-icon-btn" 
                                                style={{width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 77, 79, 0.1)', border: 'none'}}
                                                onClick={(e) => { e.stopPropagation(); handleDeleteProduct(p.id); }}
                                            >
                                                <Trash2 size={18} color="#ff4d4f" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* --- PROFESSIONAL FOOTER --- */}
            <footer className="main-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
                            <div className="logo-icon" style={{width: '40px', height: '40px'}}><Recycle size={24} color="white" /></div>
                            <span style={{fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px'}}>Sisain</span>
                        </div>
                        <p style={{fontSize: '0.9rem', lineHeight: '1.7', opacity: 0.8}}>
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
                        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '20px', marginTop: '10px'}}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600}}>
                                <Info size={14} color="var(--orange)" />
                                support@sisain.online
                            </span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600}}>
                                <Phone size={14} color="var(--orange)" />
                                +62 812-3456-7890
                            </span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600}}>
                                <MapPin size={14} color="var(--orange)" />
                                Bandung, Indonesia
                            </span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Sisain.online. Dibuat dengan ❤️ untuk Bumi.</p>
                    <div style={{display: 'flex', gap: '25px', fontSize: '0.8rem', fontWeight: 700}}>
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
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={filters.priceRange[0]}
                                    onChange={e => setFilters({...filters, priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]})}
                                />
                                <span>-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={filters.priceRange[1]}
                                    onChange={e => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value) || 1000000]})}
                                />
                            </div>
                        </div>

                        <div className="filter-section-modal" style={{marginTop: '25px'}}>
                            <h4>Jarak Maksimal (km)</h4>
                            <input 
                                type="range" 
                                min="1" max="10" step="1" 
                                value={filters.maxDistance}
                                onChange={e => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
                                style={{width: '100%', accentColor: 'var(--orange)'}} 
                            />
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '5px'}}>
                                <span>1 km</span>
                                <span>{filters.maxDistance} km</span>
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
            {/* Add Product Modal */}
            {isAddProductOpen && (
                <div className="modal-backdrop" onClick={() => setIsAddProductOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="close-btn" onClick={() => setIsAddProductOpen(false)}><X size={20} /></div>
                        <h2 style={{fontWeight: 800, marginBottom: '25px', textAlign: 'center'}}>Unggah Produk Surplus</h2>
                        <form onSubmit={handleAddProduct} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                            <div className="filter-section-modal">
                                <h4>Nama Produk</h4>
                                <input 
                                    className="search-input" 
                                    style={{width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px'}}
                                    placeholder="Contoh: Sayur Bayam Segar" 
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div style={{display: 'flex', gap: '15px'}}>
                                <div className="filter-section-modal" style={{flex: 1}}>
                                    <h4>Kategori</h4>
                                    <select 
                                        style={{width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-light), var(--shadow-dark)', borderRadius: '12px', border: 'none', fontWeight: 700}}
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                    >
                                        {CATEGORIES.filter(c => c !== "Semua").map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="filter-section-modal" style={{flex: 1}}>
                                    <h4>Stok</h4>
                                    <input 
                                        type="number"
                                        style={{width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px', border: 'none'}}
                                        placeholder="0" 
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '15px'}}>
                                <div className="filter-section-modal" style={{flex: 1}}>
                                    <h4>Harga Normal</h4>
                                    <input 
                                        type="number"
                                        style={{width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px', border: 'none'}}
                                        placeholder="Rp" 
                                        value={newProduct.oldPrice}
                                        onChange={e => setNewProduct({...newProduct, oldPrice: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="filter-section-modal" style={{flex: 1}}>
                                    <h4>Harga Surplus</h4>
                                    <input 
                                        type="number"
                                        style={{width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px', border: 'none'}}
                                        placeholder="Rp" 
                                        value={newProduct.currentPrice}
                                        onChange={e => setNewProduct({...newProduct, currentPrice: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="filter-section-modal">
                                <h4>Deskripsi Produk</h4>
                                <textarea 
                                    style={{width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px', border: 'none', minHeight: '80px'}}
                                    placeholder="Ceritakan tentang kondisi makanan ini..." 
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                    required
                                />
                            </div>
                            <button className="nav-pill active" type="submit" style={{width: '100%', padding: '18px', border: 'none', marginTop: '10px'}}>
                                Publikasikan Produk
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
