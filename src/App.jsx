import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, MapPin, Search, Plus, Home, User,
    X, Star, Clock, Trash2, BarChart3, Package, Menu,
    Leaf, ShieldCheck, TrendingUp, History, Info, SlidersHorizontal,
    Recycle, Wallet, Ticket, CreditCard, Heart, Store, Truck, CheckCircle2, RotateCcw,
    Award, Medal, Crown, Zap, Droplets, LogOut, ChevronRight, Settings, Phone, ArrowUp, Smartphone, Percent, Megaphone, ThumbsUp,
    Apple, Coffee, Utensils, Download, FileText, Upload, ArrowRightLeft, LineChart, Mail, RefreshCw, CalendarClock, AlarmClock, BookOpen
} from 'lucide-react';
import './index.css';
import translations from './translations';

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
    const [activeCategories, setActiveCategories] = useState(["Semua"]);
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
    const [isMerchantLoggedIn, setIsMerchantLoggedIn] = useState(false);
    const [merchantSubTab, setMerchantSubTab] = useState("pendaftaran");
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isStoreOpen, setIsStoreOpen] = useState(true);

    // --- Translation Helper ---
    const t = (key) => translations[language]?.[key] || translations['id'][key] || key;

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

    const toggleCategory = (cat) => {
        if (cat === "Semua") {
            setActiveCategories(["Semua"]);
            return;
        }
        setActiveCategories(prev => {
            const newCats = prev.filter(c => c !== "Semua");
            if (newCats.includes(cat)) {
                const filtered = newCats.filter(c => c !== cat);
                return filtered.length === 0 ? ["Semua"] : filtered;
            } else {
                return [...newCats, cat];
            }
        });
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
        .filter(p => (activeCategories.includes("Semua") || activeCategories.includes(p.category)))
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
                    <h3>{t('joinTitle')}</h3>
                    <button className="join-modal-close" onClick={() => setIsJoinModalOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="join-modal-body">
                    <div className="join-option-card">
                        <div className="join-option-image">
                            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600" alt="Bergabung sebagai Merchant" />
                        </div>
                        <h4>{t('joinMerchantTitle')}</h4>
                        <ul className="join-benefits">
                            <li>· {t('joinMerchantPerk1')}</li>
                            <li>· {t('joinMerchantPerk2')}</li>
                            <li>· {t('joinMerchantPerk3')}</li>
                        </ul>
                        <button className="join-btn-primary">{t('joinNowBtn')}</button>
                    </div>
                    <div className="join-option-card">
                        <div className="join-option-image">
                            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600" alt="Bergabung sebagai Pelanggan" />
                        </div>
                        <h4>{t('joinCustomerTitle')}</h4>
                        <ul className="join-benefits">
                            <li>· {t('joinCustomerPerk1')}</li>
                            <li>· {t('joinCustomerPerk2')}</li>
                            <li>· {t('joinCustomerPerk3')}</li>
                        </ul>
                        <button className="join-btn-primary">{t('joinNowBtn')}</button>
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
                            <h2 className="splash-title">{t('splashTitle')}</h2>
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
                        <span onClick={() => setActiveTab('home')} className={`nav-pill ${activeTab === 'home' ? 'active' : ''}`}>{t('navHome')}</span>
                        <span onClick={() => setActiveTab('about')} className={`nav-pill ${activeTab === 'about' ? 'active' : ''}`}>{t('navAbout')}</span>
                        <span onClick={() => setActiveTab('explore')} className={`nav-pill ${activeTab === 'explore' ? 'active' : ''}`}>{t('navExplore')}</span>
                        <span onClick={() => setActiveTab('merchant')} className={`nav-pill ${activeTab === 'merchant' ? 'active' : ''}`}>{t('navMerchant')}</span>
                        <span className="nav-pill">{t('navHelp')}</span>
                    </nav>

                    <div className="nav-auth-group">
                        <button className="location-pill btn-login-pill" aria-label="Join" title="Join" onClick={() => setIsJoinModalOpen(true)}>
                            <User size={14} />
                            <span>{t('navJoin')}</span>
                        </button>
                    </div>

                    <div className="location-pill">
                        <MapPin size={14} color="var(--orange)" />
                        <span>Jakarta Selatan</span>
                    </div>

                    {/* Hamburger Button - Mobile Only */}
                    <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <nav className="mobile-nav-drawer">
                        <span onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }} className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}>
                            <Home size={18} /> {t('navHome')}
                        </span>
                        <span onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }} className={`mobile-nav-item ${activeTab === 'about' ? 'active' : ''}`}>
                            <Leaf size={18} /> {t('navAbout')}
                        </span>
                        <span onClick={() => { setActiveTab('explore'); setIsMobileMenuOpen(false); }} className={`mobile-nav-item ${activeTab === 'explore' ? 'active' : ''}`}>
                            <Search size={18} /> {t('navExplore')}
                        </span>
                        <span onClick={() => { setActiveTab('merchant'); setIsMobileMenuOpen(false); }} className={`mobile-nav-item ${activeTab === 'merchant' ? 'active' : ''}`}>
                            <Store size={18} /> {t('navMerchant')}
                        </span>
                        <span className="mobile-nav-item">
                            <Info size={18} /> {t('navHelp')}
                        </span>
                    </nav>
                )}

                <div className="header-bottom-bar">
                    <div className="search-capsule">
                        <Search size={20} color="var(--text-muted)" />
                        <input
                            className="search-input"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="search-actions">
                            <div className="search-action-btn" onClick={() => setIsCategoryOpen(true)}>
                                <Package size={16} color={!activeCategories.includes("Semua") ? "var(--orange)" : "var(--text-muted)"} />
                                <span className="action-label" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {activeCategories.includes("Semua") ? t('searchCategory') : activeCategories.join(", ")}
                                </span>
                            </div>
                            <div className="action-divider"></div>
                            <div className="filter-icon-btn" onClick={() => setIsFilterOpen(true)}>
                                <SlidersHorizontal size={18} color="var(--orange)" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ animation: 'fadeIn 0.5s ease' }}>
                {(activeTab === 'home' || activeTab === 'explore') && (
                    <>
                        {activeTab === 'home' && (
                            <>
                                <section className="hero-banner">
                                    <div className="hero-overlay"></div>
                                    <img src="/sisain_hero.png" className="hero-bg" alt="Hero" />
                                    <div className="hero-content-modern">
                                        <h1 className="hero-title-main">{t('heroWelcome')} <span className="highlight-text">SISAIN.ONLINE</span></h1>
                                        <p className="hero-subtitle-main">
                                            {t('heroSubtitle')}
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
                                        <h2 className="section-title-center">{t('whySisainTitle')}</h2>
                                        <p className="section-subtitle">{t('whySisainSubtitle')}</p>
                                    </div>
                                    <div className="features-grid-modern">
                                        <div className="card-neumorph feature-card-icon">
                                            <div className="feature-icon"><Ticket size={28} /></div>
                                            <div className="feature-content">
                                                <h3>{t('featureSave')}</h3>
                                                <p>{t('featureSaveDesc')}</p>
                                            </div>
                                        </div>

                                        <div className="card-neumorph feature-card-icon">
                                            <div className="feature-icon"><Leaf size={28} /></div>
                                            <div className="feature-content">
                                                <h3>{t('featureEarth')}</h3>
                                                <p>{t('featureEarthDesc')}</p>
                                            </div>
                                        </div>

                                        <div className="card-neumorph feature-card-icon">
                                            <div className="feature-icon"><ShieldCheck size={28} /></div>
                                            <div className="feature-content">
                                                <h3>{t('featureQuality')}</h3>
                                                <p>{t('featureQualityDesc')}</p>
                                            </div>
                                        </div>

                                        <div className="card-neumorph feature-card-icon highlight-card">
                                            <div className="feature-icon"><Store size={28} /></div>
                                            <div className="feature-content">
                                                <h3>{t('featureUMKM')}</h3>
                                                <p>{t('featureUMKMDesc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="how-to-order-section">
                                    <div className="section-header-center">
                                        <h2 className="section-title-center">{t('howToOrderTitle')}</h2>
                                        <p className="section-subtitle">{t('howToOrderSubtitle')}</p>
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
                                                    t('orderStep1'),
                                                    t('orderStep2'),
                                                    t('orderStep3'),
                                                    t('orderStep4'),
                                                    t('orderStep5'),
                                                    t('orderStep6')
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
                                        <h2 className="section-title-center">{t('merchantPartnersTitle')}</h2>
                                        <p className="section-subtitle">{t('merchantPartnersSubtitle')}</p>
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
                                        <div style={{ marginTop: '15px', display: 'flex', gap: '15px', fontSize: '0.8rem', fontWeight: 700 }}>
                                            <span style={{ color: '#ffc107', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Star size={14} fill="#ffc107" /> {p.rating}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)' }}>{p.distance}</span>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </>
                )}

                {activeTab === 'about' && (
                    <div style={{ padding: '50px 25px', textAlign: 'center' }}>
                        <div className="card-neumorph" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px' }}>
                            <Leaf size={64} color="var(--orange)" style={{ marginBottom: '30px' }} />
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>{t('aboutTitle')}</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 40px' }}>
                                {t('aboutDesc')}
                            </p>
                            <div className="cat-grid" style={{ textAlign: 'left' }}>
                                <div className="cat-item">
                                    <TrendingUp size={32} color="var(--orange)" />
                                    <h4 style={{ fontWeight: 800 }}>{t('aboutCircular')}</h4>
                                    <p style={{ fontSize: '0.8rem', textAlign: 'center' }}>{t('aboutCircularDesc')}</p>
                                </div>
                                <div className="cat-item">
                                    <ShieldCheck size={32} color="var(--orange)" />
                                    <h4 style={{ fontWeight: 800 }}>{t('aboutQuality')}</h4>
                                    <p style={{ fontSize: '0.8rem', textAlign: 'center' }}>{t('aboutQualityDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div style={{ padding: '30px 25px' }}>
                        <h2 style={{ fontWeight: 800, marginBottom: '30px', fontSize: '1.8rem' }}>{t('cartTitle')}</h2>
                        {cart.length === 0 ? (
                            <div className="card-neumorph" style={{ padding: '80px 20px' }}>
                                <ShoppingCart size={64} color="var(--text-muted)" opacity={0.3} style={{ marginBottom: '20px' }} />
                                <p style={{ color: 'var(--text-muted)' }}>{t('cartEmpty')}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {cart.map((item, idx) => (
                                    <div key={idx} className="card-neumorph" style={{ flexDirection: 'row', justifyContent: 'space-between', textAlign: 'left', padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                            <img src={item.img} style={{ width: '80px', height: '80px', borderRadius: '15px', objectFit: 'cover' }} />
                                            <div>
                                                <h4 style={{ fontWeight: 800 }}>{item.name}</h4>
                                                <p style={{ color: 'var(--orange)', fontWeight: 800 }}>{formatIDR(item.currentPrice)}</p>
                                            </div>
                                        </div>
                                        <button
                                            style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}
                                            onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                ))}
                                <div className="card-neumorph" style={{ padding: '30px', marginTop: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t('cartTotal')}</span>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--orange)' }}>
                                            {formatIDR(cart.reduce((acc, curr) => acc + curr.currentPrice, 0))}
                                        </span>
                                    </div>
                                    <button
                                        className="nav-pill active"
                                        style={{ width: '100%', padding: '20px', fontSize: '1.1rem', border: 'none' }}
                                        onClick={handleCheckout}
                                    >
                                            {t('cartCheckout')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="view-container" style={{ padding: '20px 20px 120px', animation: 'slideUp 0.5s ease' }}>
                        <h2 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: '25px', color: 'var(--text-main)', textAlign: 'left' }}>{t('profileTitle')}</h2>

                        <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '15px', gridAutoRows: 'minmax(100px, auto)' }}>

                            {/* === 1. HERO PROFILE CARD (Bento Span 12) === */}
                            <div className="card-neumorph bento-item" style={{ gridColumn: 'span 12', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'linear-gradient(135deg, var(--bg-color) 0%, rgba(238,77,45,0.05) 100%)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-color)', boxShadow: 'var(--shadow-light), var(--shadow-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition-smooth)' }} className="hover-scale">
                                            <User size={35} color="var(--orange)" />
                                        </div>
                                        <div style={{ position: 'absolute', bottom: '0', right: '0', width: '22px', height: '22px', background: 'var(--orange)', borderRadius: '50%', border: '2px solid var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Crown size={12} fill="white" color="white" />
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'left' }}>
                                        <h2 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '4px' }}>{t('profileHero')}</h2>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '10px' }}>hero042@sisain.online</p>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ background: 'var(--orange-light)', color: 'var(--orange)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Award size={10} /> {t('profileBronze')}
                                            </span>
                                            <span style={{ background: 'var(--orange-light)', color: 'var(--orange)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <ShieldCheck size={10} color="var(--orange)" /> {t('profileVerified')}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-light), var(--shadow-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition-smooth)' }} className="hover-float">
                                        <Settings size={20} color="var(--text-muted)" />
                                    </div>
                                </div>
                            </div>

                            {/* === 2. SISAIN PAY & KOIN (Bento Span 6 each) === */}
                            <div className="card-neumorph bento-item hover-float" style={{ gridColumn: 'span 6', padding: '20px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                    <div style={{ width: '36px', height: '36px', background: 'var(--orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(238,77,45,0.3)' }}>
                                        <Wallet size={18} color="white" />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>SisainPay</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--orange)' }}>Rp 85.500</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>{t('profileBalance')}</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{ gridColumn: 'span 6', padding: '20px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                    <div style={{ width: '36px', height: '36px', background: 'var(--orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(238,77,45,0.3)' }}>
                                        <Star size={18} color="white" fill="white" />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{t('profileCoin')}</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--orange)' }}>420</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>{t('profileCoinUsable')}</p>
                                </div>
                            </div>

                            {/* === 3. RIWAYAT PESANAN (Bento Span 12) === */}
                            <div className="card-neumorph bento-item" style={{ gridColumn: 'span 12', padding: '25px 30px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Package size={18} color="var(--orange)" /> {t('profileOrders')}
                                    </h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>{t('profileViewAll')} <ChevronRight size={14} /></span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    {[
                                        { icon: <CreditCard size={30} strokeWidth={1.5} />, label: t('profileUnpaid'), count: 1 },
                                        { icon: <Package size={30} strokeWidth={1.5} />, label: t('profilePacked'), count: 0 },
                                        { icon: <Truck size={30} strokeWidth={1.5} />, label: t('profileShipped'), count: 2 },
                                        { icon: <CheckCircle2 size={30} strokeWidth={1.5} />, label: t('profileDone'), count: 8 },
                                        { icon: <RotateCcw size={30} strokeWidth={1.5} />, label: t('profileReturn'), count: 0 },
                                    ].map(item => (
                                        <div key={item.label} className="hover-scale" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '20%', position: 'relative' }}>
                                            <div style={{ color: 'var(--orange)', transition: 'var(--transition-smooth)' }} className="order-icon-wrapper">
                                                {item.icon}
                                            </div>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', lineHeight: '1.2', textAlign: 'center' }}>{item.label}</span>
                                            {item.count > 0 && (
                                                <div style={{ position: 'absolute', top: '-6px', right: '10px', background: 'var(--orange)', color: 'white', fontSize: '0.55rem', fontWeight: 800, minWidth: '16px', height: '16px', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid var(--bg-color)' }}>
                                                    {item.count}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* === 4. VOUCHER & WISHLIST (Bento Span 6 each) === */}
                            <div className="card-neumorph bento-item hover-float" style={{ gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Ticket size={20} color="var(--orange)" />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontWeight: 800, fontSize: '0.8rem' }}>{t('profileVoucher')}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('profileVoucherCount')}</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{ gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Heart size={20} color="var(--orange)" />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontWeight: 800, fontSize: '0.8rem' }}>{t('profileWishlist')}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('profileWishlistCount')}</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{ gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Store size={20} color="var(--orange)" />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontWeight: 800, fontSize: '0.8rem' }}>{t('profileFavStore')}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('profileFavStoreCount')}</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{ gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Star size={20} color="var(--orange)" />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontWeight: 800, fontSize: '0.8rem' }}>{t('profileReview')}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('profileReviewCount')}</p>
                                </div>
                            </div>

                            {/* === 5. DAMPAK LINGKUNGAN (Bento Span 12) === */}
                            <div className="card-neumorph bento-item" style={{ gridColumn: 'span 12', padding: '20px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                                {/* Decorative background elements */}
                                <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                                    <Leaf size={120} />
                                </div>

                                <h3 style={{ fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                                    <TrendingUp size={18} color="var(--orange)" /> {t('profileImpact')}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                                    {[
                                        { icon: <Leaf size={20} color="var(--orange)" />, value: '12.5 kg', label: t('profileCO2'), bg: 'rgba(238,77,45,0.1)' },
                                        { icon: <Droplets size={20} color="var(--orange)" />, value: '340 L', label: t('profileWater'), bg: 'rgba(238,77,45,0.1)' },
                                        { icon: <Package size={20} color="var(--orange)" />, value: '38', label: t('profileFoodSaved'), bg: 'rgba(238,77,45,0.1)' },
                                    ].map(stat => (
                                        <div key={stat.label} className="cat-item hover-scale" style={{ padding: '12px 8px', borderRadius: '16px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                                                {stat.icon}
                                            </div>
                                            <p style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-main)' }}>{stat.value}</p>
                                            <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textAlign: 'center' }}>{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="chart-container" style={{ padding: '15px 10px', marginTop: 0 }}>
                                    <svg viewBox="0 0 400 100" width="100%" height="80" style={{ overflow: 'visible' }}>
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
                            <div className="card-neumorph bento-item" style={{ gridColumn: 'span 12', padding: '20px', textAlign: 'left' }}>
                                <h3 style={{ fontWeight: 800, marginBottom: '15px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Medal size={18} color="var(--orange)" /> {t('profileBadge')}
                                </h3>
                                <div className="badge-scroll-container" style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                                    {[
                                        { icon: <Award size={24} color="var(--orange)" />, label: 'Perunggu', unlocked: true },
                                        { icon: <Leaf size={24} color="var(--orange)" />, label: 'Eco Hero', unlocked: true },
                                        { icon: <Zap size={24} color="var(--orange)" />, label: 'Cepat Beli', unlocked: true },
                                        { icon: <Medal size={24} color="var(--orange)" />, label: 'Perak', unlocked: false },
                                        { icon: <Crown size={24} color="var(--orange)" />, label: 'Emas', unlocked: false },
                                        { icon: <Heart size={24} color="var(--orange)" />, label: 'Setia', unlocked: false },
                                    ].map(badge => (
                                        <div key={badge.label} className="hover-scale" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: badge.unlocked ? 1 : 0.4, minWidth: '65px' }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--bg-color)', boxShadow: badge.unlocked ? 'var(--shadow-light), var(--shadow-dark)' : 'var(--shadow-inset-light), var(--shadow-inset-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {badge.icon}
                                            </div>
                                            <p style={{ fontSize: '0.55rem', fontWeight: 800, textAlign: 'center', color: badge.unlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>{badge.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* === 7. LOGOUT (Bento Span 12) === */}
                            <div style={{ gridColumn: 'span 12', marginTop: '10px' }}>
                                <button
                                    className="card-neumorph hover-float"
                                    style={{ width: '100%', padding: '18px', color: '#ef4444', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    onClick={() => showToast(t('profileLogoutToast'))}
                                >
                                    <LogOut size={18} /> {t('profileLogout')}
                                </button>
                            </div>

                        </div>
                    </div>
                )}
                {activeTab === 'merchant' && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        {/* --- Merchant Landing Hero --- */}
                        <section className="hero-banner" style={{ marginBottom: '40px' }}>
                            <div className="hero-overlay"></div>
                            <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1200" className="hero-bg" alt="Merchant Hero" />
                            <div className="hero-content-modern" style={{ maxWidth: '800px' }}>
                                <h1 className="hero-title-main" style={{ fontSize: '2.8rem' }}>{t('merchantHeroTitle1')} <span className="highlight-text">{t('merchantHeroSurplus')}</span> {t('merchantHeroTitle2')} <span className="highlight-text">{t('merchantHeroProfit')}</span></h1>
                                <p className="hero-subtitle-main" style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
                                    {t('merchantHeroSubtitle')}
                                </p>
                                <div className="app-download-row">
                                    <button
                                        className="nav-pill active"
                                        style={{ padding: '15px 40px', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 25px rgba(238,77,45,0.4)' }}
                                        onClick={() => {
                                            setIsMerchantLoggedIn(true);
                                            setMerchantSubTab('pendaftaran');
                                            showToast(t('merchantLoginToast'));
                                            setTimeout(() => {
                                                const element = document.getElementById('merchant-dashboard-section');
                                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                                            }, 100);
                                        }}
                                    >
                                        {t('merchantJoinBtn')}
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* --- Merchant Sub-Navigation Toggle --- */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '0 20px', marginBottom: '40px' }}>
                            <button
                                onClick={() => setMerchantSubTab('pendaftaran')}
                                className="card-neumorph hover-scale"
                                style={{
                                    padding: '12px 30px', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                                    background: merchantSubTab === 'pendaftaran' ? 'var(--orange)' : 'var(--bg-color)',
                                    color: merchantSubTab === 'pendaftaran' ? 'white' : 'var(--text-muted)',
                                    boxShadow: merchantSubTab === 'pendaftaran' ? '0 10px 20px rgba(238,77,45,0.3)' : 'var(--shadow-light), var(--shadow-dark)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {t('merchantTabRegistration')}
                            </button>
                            <button
                                onClick={() => setMerchantSubTab('fitur')}
                                className="card-neumorph hover-scale"
                                style={{
                                    padding: '12px 30px', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                                    background: merchantSubTab === 'fitur' ? 'var(--orange)' : 'var(--bg-color)',
                                    color: merchantSubTab === 'fitur' ? 'white' : 'var(--text-muted)',
                                    boxShadow: merchantSubTab === 'fitur' ? '0 10px 20px rgba(238,77,45,0.3)' : 'var(--shadow-light), var(--shadow-dark)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {t('merchantTabFeatures')}
                            </button>
                        </div>

                        {merchantSubTab === 'pendaftaran' && (
                            <div>
                                {/* --- Merchant Value Proposition --- */}
                                <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '10px' }}>{t('merchantRegTitle')}</h2>
                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '50px' }}>{t('merchantRegSubtitle')}</p>

                            {/* Scrollable Container for Mobile Responsiveness */}
                            <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
                                <div style={{ margin: '15px auto', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '380px', minWidth: '800px', background: 'var(--bg-color)', borderRadius: '30px', boxShadow: 'var(--shadow-light), var(--shadow-dark)', padding: '40px', overflow: 'hidden' }}>

                                    {/* Background Bar Chart effect using CSS */}
                                    <div style={{ position: 'absolute', bottom: '0', display: 'flex', gap: '25px', alignItems: 'flex-end', zIndex: 0, opacity: 0.15 }}>
                                        <div style={{ width: '90px', height: '120px', background: 'var(--orange)', borderRadius: '10px 10px 0 0' }}></div>
                                        <div style={{ width: '90px', height: '200px', background: 'var(--orange)', borderRadius: '10px 10px 0 0' }}></div>
                                        <div style={{ width: '90px', height: '280px', background: 'var(--orange)', borderRadius: '10px 10px 0 0' }}></div>
                                        <div style={{ width: '90px', height: '360px', background: 'var(--orange)', borderRadius: '10px 10px 0 0' }}></div>
                                    </div>

                                    {/* Central Illustration / Icon */}
                                    <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)', boxShadow: '0 15px 35px rgba(238,77,45,0.4)', border: '6px solid var(--bg-color)' }}>
                                            <Store size={60} color="white" />
                                        </div>
                                    </div>

                                    {/* Floating Text 1 */}
                                    <div style={{ position: 'absolute', left: '5%', top: '35%', textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 2 }}>
                                        <div>
                                            <h3 style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{t('merchantCostSave')}</h3>
                                            <h3 style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{t('merchantCostSave2')}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px', maxWidth: '180px' }}>{t('merchantCostSaveDesc')}</p>
                                        </div>
                                        <svg width="45" height="60" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="arrowGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
                                                    <stop offset="0%" stopColor="#ee4d2d" stopOpacity="0" />
                                                    <stop offset="100%" stopColor="#ee4d2d" stopOpacity="0.8" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M 50 0 L 100 50 L 70 50 L 70 120 L 30 120 L 30 50 L 0 50 Z" fill="url(#arrowGrad1)" />
                                        </svg>
                                    </div>

                                    {/* Floating Text 2 */}
                                    <div style={{ position: 'absolute', right: '5%', top: '20%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 2 }}>
                                        <svg width="45" height="60" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="arrowGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
                                                    <stop offset="0%" stopColor="#ee4d2d" stopOpacity="0" />
                                                    <stop offset="100%" stopColor="#ee4d2d" stopOpacity="0.8" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M 50 0 L 100 50 L 70 50 L 70 120 L 30 120 L 30 50 L 0 50 Z" fill="url(#arrowGrad2)" />
                                        </svg>
                                        <div>
                                            <h3 style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{t('merchantNewCust')}</h3>
                                            <h3 style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{t('merchantNewCust2')}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px', maxWidth: '180px' }}>{t('merchantNewCustDesc')}</p>
                                        </div>
                                    </div>

                                    {/* Floating Text 3 */}
                                    <div style={{ position: 'absolute', right: '8%', bottom: '25%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 2 }}>
                                        <svg width="45" height="60" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="arrowGrad3" x1="0%" y1="100%" x2="0%" y2="0%">
                                                    <stop offset="0%" stopColor="#ee4d2d" stopOpacity="0" />
                                                    <stop offset="100%" stopColor="#ee4d2d" stopOpacity="0.8" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M 50 0 L 100 50 L 70 50 L 70 120 L 30 120 L 30 50 L 0 50 Z" fill="url(#arrowGrad3)" />
                                        </svg>
                                        <div>
                                            <h3 style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{t('merchantMoreOrders')}</h3>
                                            <h3 style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{t('merchantMoreOrders2')}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px', maxWidth: '180px' }}>{t('merchantMoreOrdersDesc')}</p>
                                        </div>
                                    </div>

                                    {/* Dotted lines */}
                                    <div style={{ position: 'absolute', top: '25%', left: 0, width: '100%', borderTop: '2px dashed rgba(238,77,45,0.4)', zIndex: 0 }}>
                                        <div style={{ position: 'absolute', top: '-12px', left: '15%', background: 'var(--bg-color)', padding: '0 15px', color: 'var(--orange)', fontSize: '0.85rem', fontWeight: 800 }}>{t('merchantBenefitLabel')}</div>
                                        <div style={{ position: 'absolute', top: '-4px', left: 'calc(15% - 8px)', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)' }}></div>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '25%', left: 0, width: '100%', borderTop: '2px dashed rgba(238,77,45,0.4)', zIndex: 0 }}>
                                        <div style={{ position: 'absolute', top: '-12px', left: '15%', background: 'var(--bg-color)', padding: '0 15px', color: 'var(--orange)', fontSize: '0.85rem', fontWeight: 800 }}>{t('merchantCostLabel')}</div>
                                        <div style={{ position: 'absolute', top: '-4px', left: 'calc(15% - 8px)', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Merchant Benefits Grid --- */}
                        <div className="card-neumorph" style={{ padding: '40px 30px', maxWidth: '1000px', margin: '0 auto 60px' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', textAlign: 'center', marginBottom: '40px' }}>{t('merchantBenefitsTitle')}</h2>
                            <div className="features-grid-modern">
                                <div className="card-neumorph feature-card-icon">
                                    <div className="feature-icon"><Smartphone size={28} /></div>
                                    <div className="feature-content">
                                        <h3>{t('merchantBenefit1')}</h3>
                                        <p>{t('merchantBenefit1Desc')}</p>
                                    </div>
                                </div>

                                <div className="card-neumorph feature-card-icon">
                                    <div className="feature-icon"><Wallet size={28} /></div>
                                    <div className="feature-content">
                                        <h3>{t('merchantBenefit2')}</h3>
                                        <p>{t('merchantBenefit2Desc')}</p>
                                    </div>
                                </div>

                                <div className="card-neumorph feature-card-icon">
                                    <div className="feature-icon"><Percent size={28} /></div>
                                    <div className="feature-content">
                                        <h3>{t('merchantBenefit3')}</h3>
                                        <p>{t('merchantBenefit3Desc')}</p>
                                    </div>
                                </div>

                                <div className="card-neumorph feature-card-icon highlight-card">
                                    <div className="feature-icon"><ThumbsUp size={28} /></div>
                                    <div className="feature-content">
                                        <h3>{t('merchantBenefit4')}</h3>
                                        <p>{t('merchantBenefit4Desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Registration Flow Section --- */}
                        <div className="card-neumorph" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto 60px', textAlign: 'center', overflow: 'hidden' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '60px' }}>{t('merchantRegFlowTitle')}</h2>
                            
                            <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minWidth: '900px', position: 'relative' }}>
                                    
                                    {/* Arrow 1 */}
                                    <div style={{ position: 'absolute', top: '40px', left: '18%', width: '14%', height: '2px', background: 'var(--orange)', zIndex: 0 }}>
                                        <div style={{ position: 'absolute', left: '0', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)' }}></div>
                                        <div style={{ position: 'absolute', right: '0', top: '-4px', width: '10px', height: '10px', borderTop: '2px solid var(--orange)', borderRight: '2px solid var(--orange)', transform: 'rotate(45deg)' }}></div>
                                    </div>

                                    {/* Arrow 2 */}
                                    <div style={{ position: 'absolute', top: '40px', left: '43%', width: '14%', height: '2px', background: 'var(--orange)', zIndex: 0 }}>
                                        <div style={{ position: 'absolute', left: '0', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)' }}></div>
                                        <div style={{ position: 'absolute', right: '0', top: '-4px', width: '10px', height: '10px', borderTop: '2px solid var(--orange)', borderRight: '2px solid var(--orange)', transform: 'rotate(45deg)' }}></div>
                                    </div>

                                    {/* Arrow 3 */}
                                    <div style={{ position: 'absolute', top: '40px', left: '68%', width: '14%', height: '2px', background: 'var(--orange)', zIndex: 0 }}>
                                        <div style={{ position: 'absolute', left: '0', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)' }}></div>
                                        <div style={{ position: 'absolute', right: '0', top: '-4px', width: '10px', height: '10px', borderTop: '2px solid var(--orange)', borderRight: '2px solid var(--orange)', transform: 'rotate(45deg)' }}></div>
                                    </div>

                                    {/* Step 1 */}
                                    <div style={{ flex: '1', padding: '0 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--bg-color)', border: '3px solid var(--text-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '25px' }}>
                                            <Download size={36} color="var(--text-main)" />
                                        </div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '15px', color: 'var(--text-main)' }}>{t('merchantRegStep1')}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{t('merchantRegStep1Desc')}</p>
                                    </div>

                                    {/* Step 2 */}
                                    <div style={{ flex: '1', padding: '0 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                        <div style={{ position: 'relative', marginBottom: '25px' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '15px', background: 'var(--bg-color)', border: '3px solid var(--text-main)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <FileText size={36} color="var(--text-main)" />
                                            </div>
                                            <div style={{ position: 'absolute', bottom: '-5px', right: '-8px', background: 'var(--bg-color)', borderRadius: '50%', padding: '2px' }}>
                                                <Star size={24} fill="var(--orange)" color="var(--orange)" />
                                            </div>
                                        </div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '15px', color: 'var(--text-main)' }}>{t('merchantRegStep2')}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{t('merchantRegStep2Desc')}</p>
                                    </div>

                                    {/* Step 3 */}
                                    <div style={{ flex: '1', padding: '0 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                        <div style={{ position: 'relative', marginBottom: '25px' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '15px', background: 'var(--bg-color)', border: '3px solid var(--text-main)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Upload size={36} color="var(--text-main)" />
                                            </div>
                                            <div style={{ position: 'absolute', bottom: '-6px', left: '15px', width: '20px', height: '4px', background: 'var(--orange)', borderRadius: '2px' }}></div>
                                            <div style={{ position: 'absolute', bottom: '-12px', left: '25px', width: '15px', height: '4px', background: 'var(--orange)', borderRadius: '2px' }}></div>
                                        </div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '15px', color: 'var(--text-main)' }}>{t('merchantRegStep3')}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{t('merchantRegStep3Desc')}</p>
                                    </div>

                                    {/* Step 4 */}
                                    <div style={{ flex: '1', padding: '0 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                        <div style={{ position: 'relative', marginBottom: '25px' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '15px', background: 'var(--bg-color)', border: '3px solid var(--text-main)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Store size={36} color="var(--text-main)" />
                                            </div>
                                            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--bg-color)', borderRadius: '50%', padding: '2px' }}>
                                                <CheckCircle2 size={24} color="var(--orange)" />
                                            </div>
                                        </div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '15px', color: 'var(--text-main)' }}>{t('merchantRegStep4')}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{t('merchantRegStep4Desc')}</p>
                                    </div>

                                </div>
                            </div>
                            
                            <div style={{ marginTop: '30px' }}>
                                <a href="#" style={{ fontSize: '0.95rem', color: 'var(--orange)', textDecoration: 'underline', fontWeight: 700, padding: '10px 20px', borderRadius: '50px', background: 'rgba(238,77,45,0.08)', display: 'inline-block', transition: 'all 0.3s ease' }}>
                                    {t('merchantLearnMore')}
                                </a>
                            </div>
                        </div>

                        {isMerchantLoggedIn && (
                            <div id="merchant-dashboard-section" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                                {/* --- Merchant Header & Status --- */}
                            <div className="card-neumorph" style={{ padding: '25px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div className="logo-icon" style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)' }}>
                                        <Store size={26} color="white" />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <h2 style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--text-main)' }}>Warung Bu Siti</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isStoreOpen ? '#4cd964' : '#ff3b30' }}></div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isStoreOpen ? '#4cd964' : '#ff3b30' }}>
                                                {isStoreOpen ? 'Toko Buka' : 'Toko Tutup'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => setIsStoreOpen(!isStoreOpen)}
                                        className="card-neumorph"
                                        style={{
                                            padding: '10px 20px',
                                            border: 'none',
                                            borderRadius: '30px',
                                            fontSize: '0.85rem',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            background: isStoreOpen ? 'rgba(76, 217, 100, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                                            color: isStoreOpen ? '#28a745' : '#dc3545',
                                            boxShadow: isStoreOpen ? 'var(--shadow-inset-light), var(--shadow-inset-dark)' : 'var(--shadow-light), var(--shadow-dark)'
                                        }}
                                    >
                                        {isStoreOpen ? 'Tutup Toko' : 'Buka Toko'}
                                    </button>
                                </div>
                            </div>

                            {/* --- Order Summary --- */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                                {[
                                    { label: 'Pesanan Baru', count: 3, icon: <Ticket size={18} />, color: '#ee4d2d' },
                                    { label: 'Disiapkan', count: 5, icon: <Clock size={18} />, color: '#ff9500' },
                                    { label: 'Siap', count: 2, icon: <CheckCircle2 size={18} />, color: '#007aff' },
                                    { label: 'Selesai', count: 12, icon: <Award size={18} />, color: '#4cd964' }
                                ].map(box => (
                                    <div key={box.label} className="card-neumorph" style={{ padding: '15px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <span style={{ fontSize: '1.4rem', fontWeight: 950, color: box.color }}>{box.count}</span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>{box.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* --- Statistics Overview --- */}
                            <div className="card-neumorph" style={{ padding: '20px', marginBottom: '25px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Performa Hari Ini</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 800, cursor: 'pointer' }} onClick={() => showToast('Statistik lengkap segera hadir!')}>Lihat Detail</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                    <div style={{ padding: '15px', borderRadius: '18px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Pendapatan</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 900 }}>Rp 450rb</p>
                                        <p style={{ fontSize: '0.6rem', color: '#4cd964', marginTop: '5px' }}>↑ 12% vs Kemarin</p>
                                    </div>
                                    <div style={{ padding: '15px', borderRadius: '18px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Total Pesanan</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 900 }}>24</p>
                                        <p style={{ fontSize: '0.6rem', color: '#4cd964', marginTop: '5px' }}>↑ 5 pesanan</p>
                                    </div>
                                    <div style={{ padding: '15px', borderRadius: '18px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Rating Toko</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            4.9 <Star size={14} fill="#ffc107" color="#ffc107" />
                                        </p>
                                        <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '5px' }}>98% Puas</p>
                                    </div>
                                </div>
                            </div>

                            {/* --- Product Management --- */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Package size={22} color="var(--orange)" /> Produk Saya
                                </h3>
                                <button
                                    className="nav-pill active"
                                    style={{ padding: '10px 20px', border: 'none', borderRadius: '30px', fontSize: '0.85rem' }}
                                    onClick={() => setIsAddProductOpen(true)}
                                >
                                    <Plus size={16} /> Tambah Menu
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {products.filter(p => p.merchant === "Warung Bu Siti").length === 0 ? (
                                    <div className="card-neumorph" style={{ padding: '60px 20px', textAlign: 'center' }}>
                                        <Package size={48} color="var(--text-muted)" opacity={0.3} style={{ marginBottom: '15px' }} />
                                        <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Anda belum mengunggah menu hari ini.</p>
                                    </div>
                                ) : (
                                    products.filter(p => p.merchant === "Warung Bu Siti").map(p => (
                                        <div key={p.id} className="card-neumorph hover-float" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                <div style={{ width: '65px', height: '65px', borderRadius: '15px', overflow: 'hidden', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '4px' }}>{p.name}</h4>
                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--orange)', fontWeight: 800 }}>{formatIDR(p.currentPrice)}</span>
                                                        <div style={{ width: '1px', height: '10px', background: 'var(--text-muted)', opacity: 0.3 }}></div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stok: {p.stock}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <div
                                                    className="filter-icon-btn"
                                                    style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(238, 77, 45, 0.1)', border: 'none' }}
                                                    onClick={() => showToast('Edit fitur segera hadir!')}
                                                >
                                                    <Settings size={18} color="var(--orange)" />
                                                </div>
                                                <div
                                                    className="filter-icon-btn"
                                                    style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 77, 79, 0.1)', border: 'none' }}
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
                            </div>
                        )}

                        {merchantSubTab === 'fitur' && (
                            <div>
                                <div className="card-neumorph" style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto 60px' }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', textAlign: 'center', marginBottom: '60px' }}>Fitur untuk Merchant</h2>
                                
                                <div className="features-grid-modern" style={{ gap: '50px' }}>
                                    {/* Feature 1 */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                        <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                            <Wallet size={36} color="var(--orange)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Aplikasi Sisain Mitra</h3>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Kelola bisnis secara digital untuk pendapatan maksimal.</p>
                                        </div>
                                    </div>

                                    {/* Feature 2 */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                        <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                            <ArrowRightLeft size={36} color="var(--orange)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Saldo Terintegrasi</h3>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Cek saldo dan pantau riwayat transaksi di satu tempat.</p>
                                        </div>
                                    </div>

                                    {/* Feature 3 */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                        <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                            <LineChart size={36} color="var(--orange)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Dashboard Praktis</h3>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Pantau pendapatan bisnis dan atur menu secara praktis.</p>
                                        </div>
                                    </div>

                                    {/* Feature 4 */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                        <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                            <Mail size={36} color="var(--orange)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Notifikasi Instan</h3>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Dapatkan update untuk transaksi baru dan info lainnya.</p>
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                {/* --- Second Grid: Fitur Sisain Mitra --- */}
                                <div className="card-neumorph" style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto 60px' }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', textAlign: 'center', marginBottom: '60px' }}>Fitur Sisain Mitra</h2>
                                    
                                    <div className="features-grid-modern" style={{ gap: '50px' }}>
                                        {/* Feature 1 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                                <RefreshCw size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Pembaruan Transaksi Instan</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Terima info terkait pesanan, pembayaran, dan pengelolaan Merchant secara mudah.</p>
                                            </div>
                                        </div>

                                        {/* Feature 2 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                                <CalendarClock size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Manajemen Toko yang Fleksibel</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Buka/tutup Merchant kapan saja, sesuaikan dengan kebutuhan Anda.</p>
                                            </div>
                                        </div>

                                        {/* Feature 3 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                                <AlarmClock size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Pengaturan Jam Kerja</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Atur jam operasional reguler/pada hari-hari khusus secara praktis.</p>
                                            </div>
                                        </div>

                                        {/* Feature 4 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                                <BookOpen size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Pengaturan Menu yang Mudah</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Ubah & tambah menu kapan pun untuk menarik lebih banyak Pelanggan.</p>
                                            </div>
                                        </div>

                                        {/* Feature 5 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                                <Wallet size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Pembayaran Terintegrasi</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Pembayaran lancar dan tercatat rapi, Anda bisa fokus menyajikan menu yang lezat.</p>
                                            </div>
                                        </div>

                                        {/* Feature 6 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                                <Megaphone size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Promo & Kampanye Spesial</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Akses program promosi khusus untuk mendongkrak penjualan toko Anda.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- Join Sisain Section --- */}
                                <div style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 20px' }}>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', textAlign: 'center', marginBottom: '50px' }}>{t('joinTitle')}</h2>
                                    
                                    <div className="features-grid-modern" style={{ gap: '40px' }}>
                                        {/* Card Merchant */}
                                        <div className="card-neumorph hover-scale" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                                            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600" alt="Merchant" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                                            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
                                                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '25px' }}>{t('joinMerchantTitle')}</h3>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', flex: 1 }}>
                                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px', color: 'var(--text-muted)' }}>
                                                        <CheckCircle2 size={24} color="var(--orange)" style={{ flexShrink: 0 }} /> <span>{t('joinMerchantPerk1')}</span>
                                                    </li>
                                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px', color: 'var(--text-muted)' }}>
                                                        <CheckCircle2 size={24} color="var(--orange)" style={{ flexShrink: 0 }} /> <span>{t('joinMerchantPerk2')}</span>
                                                    </li>
                                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', color: 'var(--text-muted)' }}>
                                                        <CheckCircle2 size={24} color="var(--orange)" style={{ flexShrink: 0 }} /> <span>{t('joinMerchantPerk3')}</span>
                                                    </li>
                                                </ul>
                                                <button className="nav-pill active" style={{ padding: '15px 30px', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', alignSelf: 'flex-start', boxShadow: '0 10px 20px rgba(238,77,45,0.3)' }}>{t('joinNowBtn')}</button>
                                            </div>
                                        </div>

                                        {/* Card Pelanggan */}
                                        <div className="card-neumorph hover-scale" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                                            <img src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=600" alt="Pelanggan" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                                            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
                                                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '25px' }}>{t('joinCustomerTitle')}</h3>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', flex: 1 }}>
                                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px', color: 'var(--text-muted)' }}>
                                                        <CheckCircle2 size={24} color="var(--orange)" style={{ flexShrink: 0 }} /> <span>{t('joinCustomerPerk1')}</span>
                                                    </li>
                                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px', color: 'var(--text-muted)' }}>
                                                        <CheckCircle2 size={24} color="var(--orange)" style={{ flexShrink: 0 }} /> <span>{t('joinCustomerPerk2')}</span>
                                                    </li>
                                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', color: 'var(--text-muted)' }}>
                                                        <CheckCircle2 size={24} color="var(--orange)" style={{ flexShrink: 0 }} /> <span>{t('joinCustomerPerk3')}</span>
                                                    </li>
                                                </ul>
                                                <button className="nav-pill" style={{ padding: '15px 30px', border: '2px solid var(--orange)', color: 'var(--orange)', background: 'transparent', borderRadius: '50px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', alignSelf: 'flex-start' }}>{t('joinNowBtn')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- PROFESSIONAL FOOTER --- */}
            <footer className="main-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div className="logo-icon" style={{ width: '40px', height: '40px' }}><Recycle size={24} color="white" /></div>
                            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px' }}>Sisain</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.7', opacity: 0.8 }}>
                            {t('footerDesc')}
                        </p>
                    </div>
                    <div className="footer-section">
                        <h4>{t('footerNav')}</h4>
                        <ul className="footer-links">
                            <li onClick={() => setActiveTab('home')}>{t('footerExplore')}</li>
                            <li onClick={() => setActiveTab('about')}>{t('footerMission')}</li>
                            <li onClick={() => setActiveTab('merchant')}>{t('footerMerchant')}</li>
                            <li>{t('footerFaq')}</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>{t('footerLegal')}</h4>
                        <ul className="footer-links">
                            <li>{t('footerTerms')}</li>
                            <li>{t('footerPrivacy')}</li>
                            <li>{t('footerMerchantRules')}</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>{t('footerContact')}</h4>
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                <Info size={14} color="var(--orange)" />
                                support@sisain.online
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                <Phone size={14} color="var(--orange)" />
                                +62 812-3456-7890
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                <MapPin size={14} color="var(--orange)" />
                                Bandung, Indonesia
                            </span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>{t('footerCopy')}</p>
                    <div style={{ display: 'flex', gap: '25px', fontSize: '0.8rem', fontWeight: 700 }}>
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
                    <span>{t('navHome')}</span>
                </button>
                <button className={`tab-btn ${activeTab === 'merchant' ? 'active' : ''}`} onClick={() => setActiveTab('merchant')}>
                    <Plus size={22} />
                    <span>{t('navSell')}</span>
                </button>
                <button className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>
                    <Search size={22} />
                    <span>{t('navExploreTab')}</span>
                </button>
                <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                    <div style={{ position: 'relative' }}>
                        <ShoppingCart size={22} />
                        {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--orange)', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '50px' }}>{cart.length}</span>}
                    </div>
                    <span>{t('navCart')}</span>
                </button>
                <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                    <User size={22} />
                    <span>{t('navProfile')}</span>
                </button>
            </nav>

            {/* Category Modal */}
            {isCategoryOpen && (
                <div className="modal-backdrop">
                    <div className="modal-card" style={{ padding: '35px' }} onClick={e => e.stopPropagation()}>
                        <div className="close-btn" onClick={() => setIsCategoryOpen(false)}><X size={20} /></div>
                        <h2 style={{ fontWeight: 800, marginBottom: '30px', textAlign: 'center' }}>{t('modalCategory')}</h2>
                        <div className="cat-grid">
                            {CATEGORIES.map(cat => (
                                <div
                                    key={cat}
                                    className={`cat-item ${activeCategories.includes(cat) ? 'active' : ''}`}
                                    onClick={() => toggleCategory(cat)}
                                    style={cat === "Semua" ? { gridColumn: 'span 2' } : {}}
                                >
                                    {cat === "Semua" && <Package size={24} />}
                                    {cat === "Sayur" && <Leaf size={24} />}
                                    {cat === "Buah" && <Apple size={24} />}
                                    {cat === "Roti" && <Coffee size={24} />}
                                    {cat === "Siap Saji" && <Utensils size={24} />}
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cat}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            className="nav-pill active"
                            style={{ width: '100%', padding: '18px', border: 'none', fontSize: '1.1rem', marginTop: '30px' }}
                            onClick={() => setIsCategoryOpen(false)}
                        >
                            {t('modalApply')}
                        </button>
                    </div>
                </div>
            )}

            {/* Advanced Filter Modal */}
            {isFilterOpen && (
                <div className="modal-backdrop" onClick={() => setIsFilterOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="close-btn" onClick={() => setIsFilterOpen(false)}><X size={20} /></div>
                        <h2 style={{ fontWeight: 800, marginBottom: '30px', textAlign: 'center' }}>{t('modalFilter')}</h2>

                        <div className="filter-section-modal">
                            <h4>{t('modalPriceRange')}</h4>
                            <div className="filter-input-group">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.priceRange[0]}
                                    onChange={e => setFilters({ ...filters, priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]] })}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.priceRange[1]}
                                    onChange={e => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value) || 1000000] })}
                                />
                            </div>
                        </div>

                        <div className="filter-section-modal" style={{ marginTop: '25px' }}>
                            <h4>{t('modalMaxDist')}</h4>
                            <input
                                type="range"
                                min="1" max="10" step="1"
                                value={filters.maxDistance}
                                onChange={e => setFilters({ ...filters, maxDistance: parseInt(e.target.value) })}
                                style={{ width: '100%', accentColor: 'var(--orange)' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '5px' }}>
                                <span>1 km</span>
                                <span>{filters.maxDistance} km</span>
                                <span>10 km</span>
                            </div>
                        </div>

                        <div className="filter-section-modal" style={{ marginTop: '25px' }}>
                            <h4>{t('modalShelfLife')}</h4>
                            <div className="cat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                <div className="sort-item active" style={{ fontSize: '0.7rem', padding: '10px' }}>{t('modalToday')}</div>
                                <div className="sort-item" style={{ fontSize: '0.7rem', padding: '10px' }}>{t('modalTomorrow')}</div>
                                <div className="sort-item" style={{ fontSize: '0.7rem', padding: '10px' }}>{t('modal7Days')}</div>
                            </div>
                        </div>

                        <div className="filter-section-modal" style={{ marginTop: '25px' }}>
                            <h4>{t('modalMinRating')}</h4>
                            <div style={{ display: 'flex', gap: '10px', background: 'var(--bg-color)', padding: '15px', borderRadius: '15px', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', justifyContent: 'center' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={28}
                                        fill={star <= filters.minRating ? "#ffc107" : "none"}
                                        color={star <= filters.minRating ? "#ffc107" : "var(--text-muted)"}
                                        style={{ cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                                        onClick={() => setFilters({ ...filters, minRating: star })}
                                    />
                                ))}
                            </div>
                            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                {t('modalRatingShow')} {filters.minRating}+
                            </p>
                        </div>

                        <button
                            className="nav-pill active"
                            style={{ width: '100%', padding: '18px', border: 'none', fontSize: '1.1rem', marginTop: '40px' }}
                            onClick={() => setIsFilterOpen(false)}
                        >
                            {t('modalApplyFilter')}
                        </button>
                    </div>
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
                    <div className="modal-card" style={{ padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        <div className="close-btn" style={{ zIndex: 10 }} onClick={() => setSelectedProduct(null)}><X size={20} /></div>
                        <img src={selectedProduct.img} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                        <div style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <h2 style={{ fontWeight: 800, fontSize: '1.5rem' }}>{selectedProduct.name}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px' }}>
                                        <ShieldCheck size={16} color="var(--orange)" /> {selectedProduct.merchant}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '1.6rem' }}>{formatIDR(selectedProduct.currentPrice)}</div>
                                    <div style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{formatIDR(selectedProduct.oldPrice)}</div>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '30px' }}>{selectedProduct.description}</p>
                            <button
                                className="nav-pill active"
                                style={{ width: '100%', padding: '18px', border: 'none', fontSize: '1.1rem' }}
                                onClick={() => handleAddToCart(selectedProduct)}
                            >
                                {t('modalAddToCart')}
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
                        <h2 style={{ fontWeight: 800, marginBottom: '25px', textAlign: 'center' }}>{t('addProductTitle')}</h2>
                        <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="filter-section-modal">
                                <h4>{t('addProductName')}</h4>
                                <input
                                    className="search-input"
                                    style={{ width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px' }}
                                    placeholder={t('addProductNamePlaceholder')}
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="filter-section-modal" style={{ flex: 1 }}>
                                    <h4>{t('addProductCategory')}</h4>
                                    <select
                                        style={{ width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-light), var(--shadow-dark)', borderRadius: '12px', border: 'none', fontWeight: 700 }}
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        {CATEGORIES.filter(c => c !== "Semua").map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="filter-section-modal" style={{ flex: 1 }}>
                                    <h4>{t('addProductStock')}</h4>
                                    <input
                                        type="number"
                                        style={{ width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px', border: 'none' }}
                                        placeholder="0"
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="filter-section-modal" style={{ flex: 1 }}>
                                    <h4>{t('addProductNormalPrice')}</h4>
                                    <input
                                        type="number"
                                        style={{ width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px', border: 'none' }}
                                        placeholder="Rp"
                                        value={newProduct.oldPrice}
                                        onChange={e => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="filter-section-modal" style={{ flex: 1 }}>
                                    <h4>{t('addProductSurplusPrice')}</h4>
                                    <input
                                        type="number"
                                        style={{ width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px', border: 'none' }}
                                        placeholder="Rp"
                                        value={newProduct.currentPrice}
                                        onChange={e => setNewProduct({ ...newProduct, currentPrice: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="filter-section-modal">
                                <h4>{t('addProductDesc')}</h4>
                                <textarea
                                    style={{ width: '100%', padding: '15px', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', borderRadius: '12px', border: 'none', minHeight: '80px' }}
                                    placeholder={t('addProductDescPlaceholder')}
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="nav-pill active" type="submit" style={{ width: '100%', padding: '18px', border: 'none', marginTop: '10px' }}>
                                {t('addProductPublish')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
