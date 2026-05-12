import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom';
import { 
    ShoppingCart, MapPin, Search, Plus, Home, User, 
    ChevronRight, X, Star, Clock, Trash2, CheckCircle, 
    ArrowLeft, Camera, Package, BarChart3
} from 'lucide-react';
import './style.css';

// --- Dummy Data ---
const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "Paket Sayur Sop",
        category: "Sayur",
        currentPrice: 5000,
        oldPrice: 15000,
        distance: "0.8 km",
        img: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400",
        merchant: "Warung Bu Siti",
        rating: 4.8,
        stock: 5,
        description: "Paket lengkap sayur sop segar isi wortel, kentang, buncis, dan seledri. Masih sangat layak konsumsi."
    },
    {
        id: 2,
        name: "Roti Tawar Gandum",
        category: "Roti",
        currentPrice: 8000,
        oldPrice: 22000,
        distance: "1.2 km",
        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
        merchant: "Bakery Jaya",
        rating: 4.9,
        stock: 2,
        description: "Roti tawar gandum premium. Sisa stok hari ini, tekstur masih lembut. Best before besok pagi."
    },
    {
        id: 3,
        name: "Jeruk Sunkist 'Ugly'",
        category: "Buah",
        currentPrice: 12000,
        oldPrice: 35000,
        distance: "2.5 km",
        img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400",
        merchant: "Pasar Segar",
        rating: 4.5,
        stock: 10,
        description: "Jeruk sunkist dengan kulit sedikit kusam namun rasa sangat manis dan juicy. Kaya vitamin C!"
    }
];

const CATEGORIES = ["Semua", "Sayur", "Buah", "Roti", "Siap Saji"];

// --- Helper Functions ---
const formatIDR = (val) => "Rp" + val.toLocaleString('id-ID');

// --- Components ---

const ProductCard = ({ product, onClick }) => (
    <div className="product-card" onClick={() => onClick(product)}>
        <div className="card-image-wrapper">
            <img src={product.img} alt={product.name} className="product-img" />
            <div className="rating-badge"><Star size={10} fill="currentColor" /> {product.rating}</div>
        </div>
        <div className="product-info">
            <h3>{product.name}</h3>
            <p className="merchant-name">{product.merchant}</p>
            <div className="price-tag">
                <span className="price-current">{formatIDR(product.currentPrice)}</span>
                <span className="price-old">{formatIDR(product.oldPrice)}</span>
            </div>
            <div className="card-footer">
                <div className="distance-tag"><MapPin size={12} /> {product.distance}</div>
                <div className="stock-tag">{product.stock} sisa</div>
            </div>
        </div>
    </div>
);

const Navbar = ({ activeTab, setActiveTab, cartCount }) => (
    <nav className="bottom-bar">
        <button className={`tab-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Home size={24} />
        </button>
        <button className={`tab-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            <MapPin size={24} />
        </button>
        <button className={`tab-item add-btn ${activeTab === 'merchant' ? 'active' : ''}`} onClick={() => setActiveTab('merchant')}>
            <Plus size={28} />
        </button>
        <button className={`tab-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <button className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={24} />
        </button>
    </nav>
);

// --- Pages ---

const FeaturesSection = () => (
    <section className="features-grid">
        <div className="feature-card">
            <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="12" rx="2" stroke="#000000" strokeWidth="2"/>
                    <path d="M12 9V15M9 12H15" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="1" fill="#FFFFFF"/>
                </svg>
            </div>
            <h3>Hemat Hingga 70%</h3>
            <p>Nikmati makanan berkualitas dari restoran favorit dengan harga yang jauh lebih terjangkau.</p>
        </div>
        <div className="feature-card">
            <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#000000" strokeWidth="2"/>
                    <path d="M12 7V17M7 12H17" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 3C12 3 15 7 15 12C15 17 12 21 12 21" stroke="#000000" strokeWidth="1"/>
                    <path d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21" stroke="#000000" strokeWidth="1"/>
                </svg>
            </div>
            <h3>Selamatkan Bumi</h3>
            <p>Setiap makanan yang Anda beli membantu mengurangi limbah pangan dan emisi karbon.</p>
        </div>
        <div className="feature-card">
            <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 5V11C4 16.5 12 21 12 21C12 21 20 16.5 20 11V5L12 2Z" fill="#000000"/>
                    <path d="M9 12L11 14L15 10" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2"/>
                </svg>
            </div>
            <h3>Kualitas Terjamin</h3>
            <p>Semua mitra kami telah melalui kurasi ketat untuk memastikan kualitas dan keamanan pangan.</p>
        </div>
        <div className="feature-card">
            <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5 21V10L12 3L19 10V21" stroke="#000000" strokeWidth="2"/>
                    <path d="M9 21V14H15V21" stroke="#FF8C00" strokeWidth="2"/>
                    <rect x="7" y="10" width="10" height="2" fill="#FF8C00"/>
                </svg>
            </div>
            <h3>Pemberdayaan UMKM</h3>
            <p>Mendukung pedagang lokal dan UMKM untuk mengurangi kerugian akibat stok makanan surplus.</p>
        </div>
    </section>
);

const HomeView = ({ products, onSelectProduct, activeCategory, setActiveCategory, searchQuery, setSearchQuery }) => (
    <div className="view-container">
        <section className="hero">
            <h1>Selamatkan <span className="highlight">Makanan</span></h1>
            <div className="search-container">
                <Search size={20} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Cari makanan di sekitarmu..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </section>

        <FeaturesSection />

        <section className="categories-header">
            <h3>Kategori Penyelamatan</h3>
        </section>
        <section className="categories">
            {CATEGORIES.map(cat => (
                <div 
                    key={cat}
                    className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                >
                    {cat}
                </div>
            ))}
        </section>

        <section className="marketplace-header">
            <h3>Pilihan Hari Ini</h3>
        </section>
        <section className="marketplace">
            {products.map(p => (
                <ProductCard key={p.id} product={p} onClick={onSelectProduct} />
            ))}
        </section>
    </div>
);

const MerchantView = ({ onAddProduct }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [desc, setDesc] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProd = {
            id: Date.now(),
            name,
            currentPrice: parseInt(price),
            oldPrice: parseInt(price) * 2,
            category: "Siap Saji",
            distance: "0.1 km",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
            merchant: "Toko Saya",
            rating: 5.0,
            stock: 5,
            description: desc
        };
        onAddProduct(newProd);
        setName(""); setPrice(""); setDesc("");
        alert("Produk berhasil ditambahkan ke pasar!");
    };

    return (
        <div className="view-container">
            <h2 className="view-title">Dashboard Merchant</h2>
            <div className="merchant-stats">
                <div className="stat-card">
                    <BarChart3 size={20} />
                    <span>Omzet Sisa</span>
                    <h4>{formatIDR(1250000)}</h4>
                </div>
                <div className="stat-card">
                    <Package size={20} />
                    <span>Food Saved</span>
                    <h4>42 kg</h4>
                </div>
            </div>

            <form className="neumorph-form" onSubmit={handleSubmit}>
                <h3>Input Produk Surplus</h3>
                <div className="input-group">
                    <label>Nama Produk</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Misal: Nasi Goreng Sisa Katering" required />
                </div>
                <div className="input-group">
                    <label>Harga Penyelamatan (Rp)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Misal: 10000" required />
                </div>
                <div className="input-group">
                    <label>Deskripsi & Kondisi</label>
                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Jelaskan kondisi makanan..." required />
                </div>
                <button type="submit" className="capsule-btn-primary">Publikasikan Sekarang</button>
            </form>
        </div>
    );
};

const ProfileView = () => (
    <div className="view-container profile-view">
        <div className="profile-header">
            <div className="avatar-capsule">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
            <h2>Fauzan Ramadhan</h2>
            <p className="badge-text">Pahlawan Pangan Bronze</p>
        </div>

        <div className="impact-grid">
            <div className="impact-card">
                <h3>12</h3>
                <p>Makanan Diselamatkan</p>
            </div>
            <div className="impact-card">
                <h3>Rp450k</h3>
                <p>Uang Dihemat</p>
            </div>
            <div className="impact-card">
                <h3>8.5 kg</h3>
                <p>CO2 Dikurangi</p>
            </div>
        </div>

        <div className="menu-list">
            <div className="menu-item"><span>Alamat Saya</span> <ChevronRight size={18} /></div>
            <div className="menu-item"><span>Metode Pembayaran</span> <ChevronRight size={18} /></div>
            <div className="menu-item"><span>Riwayat Pesanan</span> <ChevronRight size={18} /></div>
            <div className="menu-item"><span>Pusat Bantuan</span> <ChevronRight size={18} /></div>
        </div>
    </div>
);

// --- Main App ---

const App = () => {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [filteredProducts, setFilteredProducts] = useState(INITIAL_PRODUCTS);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeTab, setActiveTab] = useState("home");
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);

    useEffect(() => {
        let result = products;
        if (activeCategory !== "Semua") {
            result = result.filter(p => p.category === activeCategory);
        }
        if (searchQuery) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.merchant.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredProducts(result);
    }, [activeCategory, searchQuery, products]);

    const addToCart = (product) => {
        setCart([...cart, product]);
        setSelectedProduct(null);
        alert("Berhasil ditambahkan ke keranjang!");
    };

    const addProductAsMerchant = (newProd) => {
        setProducts([newProd, ...products]);
        setActiveTab("home");
    };

    return (
        <div id="app">
            <header className="main-header">
                <div className="logo-capsule">
                    <span className="logo-text">Sisain<span className="dot">.</span></span>
                </div>
            </header>

            <main className="content-area">
                {activeTab === 'home' && (
                    <HomeView 
                        products={filteredProducts} 
                        onSelectProduct={setSelectedProduct}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                )}

                {activeTab === 'merchant' && (
                    <MerchantView onAddProduct={addProductAsMerchant} />
                )}

                {activeTab === 'profile' && (
                    <ProfileView />
                )}

                {activeTab === 'orders' && (
                    <div className="view-container">
                        <h2 className="view-title">Keranjang Penyelamatan</h2>
                        {cart.length === 0 ? (
                            <div className="empty-state">
                                <ShoppingCart size={64} opacity={0.2} />
                                <p>Belum ada makanan yang diselamatkan.</p>
                                <button className="capsule-btn-primary" onClick={() => setActiveTab('home')}>Cari Makanan</button>
                            </div>
                        ) : (
                            <div className="cart-list">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="cart-item-new">
                                        <img src={item.img} />
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            <p>{item.merchant}</p>
                                            <span className="price">{formatIDR(item.currentPrice)}</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => {
                                            const newCart = [...cart];
                                            newCart.splice(idx, 1);
                                            setCart(newCart);
                                        }}><Trash2 size={18} /></button>
                                    </div>
                                ))}
                                <div className="checkout-footer">
                                    <div className="total-line">
                                        <span>Total</span>
                                        <h3>{formatIDR(cart.reduce((s, i) => s + i.currentPrice, 0))}</h3>
                                    </div>
                                    <button className="capsule-btn-primary" onClick={() => {
                                        alert("Pesanan Berhasil! Terima kasih pahlawan.");
                                        setCart([]);
                                        setActiveTab('home');
                                    }}>Bayar Sekarang</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'map' && (
                    <div className="view-container map-placeholder">
                        <div className="map-ui">
                            <div className="map-pin-user"><div className="ping"></div></div>
                            {products.map(p => (
                                <div key={p.id} className="map-pin-merchant" style={{top: `${Math.random()*60+20}%`, left: `${Math.random()*60+20}%`}}>
                                    <div className="pin-content">🍃</div>
                                </div>
                            ))}
                            <div className="map-overlay-info">
                                <p>Ada {products.length} penyelamatan tersedia di sekitarmu.</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cart.length} />

            {selectedProduct && (
                <div className="modal-overlay" style={{ display: 'flex' }} onClick={() => setSelectedProduct(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedProduct(null)}><X size={24} /></button>
                        <img src={selectedProduct.img} className="modal-img" />
                        <div className="modal-header">
                            <div>
                                <h2>{selectedProduct.name}</h2>
                                <p className="highlight-text">{selectedProduct.merchant}</p>
                            </div>
                            <div className="rating-row"><Star size={14} fill="#FF8C00" color="#FF8C00" /> {selectedProduct.rating}</div>
                        </div>
                        <p className="modal-desc">{selectedProduct.description}</p>
                        <div className="modal-info-row">
                            <div className="info-pill"><Clock size={14} /> Sisa 2 Jam</div>
                            <div className="info-pill"><MapPin size={14} /> {selectedProduct.distance}</div>
                        </div>
                        <div className="modal-price-row">
                            <div className="price-stack">
                                <span className="old-price">{formatIDR(selectedProduct.oldPrice)}</span>
                                <span className="new-price">{formatIDR(selectedProduct.currentPrice)}</span>
                            </div>
                            <button className="capsule-btn-primary" onClick={() => addToCart(selectedProduct)}>
                                Rescue Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
