import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, MapPin, Search, Plus, Home, User,
    X, Star, Clock, Trash2, BarChart3, Package, Menu,
    Leaf, ShieldCheck, TrendingUp, History, Info, SlidersHorizontal,
    Recycle, Wallet, Ticket, CreditCard, Heart, Store, Truck, CheckCircle2, RotateCcw,
    Award, Medal, Crown, Zap, Droplets, LogOut, ChevronRight, Settings, Phone, ArrowUp, Smartphone, Percent, Megaphone, ThumbsUp,
    Apple, Coffee, Croissant, Utensils, Download, FileText, Upload, ArrowRightLeft, LineChart, Mail, RefreshCw, CalendarClock, AlarmClock, BookOpen,
    Instagram, Twitter, Linkedin, Youtube, Facebook, Bot, Send, Sparkles, HelpCircle, Eye, EyeOff
} from 'lucide-react';
import './index.css';
import translations from './translations';
import { supabase } from './lib/supabaseClient';

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
        description: "A complete set of fresh vegetables including carrots, potatoes, beans, and celery. Saved from daily surplus.",
        createdAt: Date.now() - 15 * 60 * 1000, // 15 mins ago
        shelfLife: "today"
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
        description: "Freshly baked artisan sourdough. Surplus from today's morning batch.",
        createdAt: Date.now() - 45 * 60 * 1000, // 45 mins ago
        shelfLife: "tomorrow"
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
        description: "Crispy chicken with signature spicy sambal. High quality surplus from a corporate event.",
        createdAt: Date.now() - 3 * 3600 * 1000, // 3 hours ago
        shelfLife: "today"
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
        description: "Sweet and juicy red dragon fruit. Surplus from international export batch.",
        createdAt: Date.now() - 12 * 3600 * 1000, // 12 hours ago
        shelfLife: "7days"
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
        description: "Buttery croissant topped with roasted almonds. Afternoon surplus batch.",
        createdAt: Date.now() - 2 * 24 * 3600 * 1000, // 2 days ago
        shelfLife: "tomorrow"
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
        description: "Imported Sunkist oranges, juicy and vitamin-packed surplus.",
        createdAt: Date.now() - 5 * 24 * 3600 * 1000, // 5 days ago
        shelfLife: "7days"
    }
];

const CATEGORIES = ["Semua", "Sayur", "Buah", "Roti", "Siap Saji"];
const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

const NESTED_REGIONS = {
    "Jawa": {
        "DKI Jakarta": {
            "Jakarta Selatan": ["Cilandak", "Kebayoran Baru", "Kebayoran Lama", "Pasar Minggu", "Tebet", "Setiabudi", "Pancoran", "Jagakarsa", "Mampang Prapatan", "Pesanggrahan"],
            "Jakarta Pusat": ["Menteng", "Tanah Abang", "Gambir", "Senen", "Kemayoran", "Cempaka Putih", "Sawah Besar", "Johar Baru"],
            "Jakarta Barat": ["Kembangan", "Kebon Jeruk", "Palmerah", "Grogol Petamburan", "Cengkareng", "Kalideres", "Tambora", "Taman Sari"],
            "Jakarta Utara": ["Penjaringan", "Tanjung Priok", "Kelapa Gading", "Koja", "Cilincing", "Pademangan"],
            "Jakarta Timur": ["Jatinegara", "Duren Sawit", "Pulogadung", "Cakung", "Kramat Jati", "Makasar", "Ciracas", "Pasar Rebo", "Matraman", "Cipayung"]
        },
        "Jawa Barat": {
            "Bandung": ["Coblong", "Dago", "Sumur Bandung", "Regol", "Astana Anyar", "Cibeunying Kaler", "Cibeunying Kidul", "Lengkong", "Cicendo", "Andir"],
            "Bogor": ["Bogor Timur", "Bogor Barat", "Bogor Tengah", "Bogor Utara", "Bogor Selatan", "Tanah Sareal"],
            "Depok": ["Margonda", "Beji", "Pancoran Mas", "Sukmajaya", "Cimanggis", "Sawangan", "Limo", "Cinere"],
            "Bekasi": ["Bekasi Barat", "Bekasi Timur", "Bekasi Utara", "Bekasi Selatan", "Pondok Gede", "Jatiasih", "Rawalumbu"],
            "Cirebon": ["Kejaksan", "Lemahwungkuk", "Harjamukti", "Pekalipan", "Kesambi"]
        },
        "Jawa Timur": {
            "Surabaya": ["Gubeng", "Tegalsari", "Wonokromo", "Rungkut", "Karangpilang", "Sukolilo", "Semampir", "Kenjeran"],
            "Malang": ["Klojen", "Blimbing", "Lowokwaru", "Sukun", "Kedungkandang"],
            "Kediri": ["Kota", "Mojoroto", "Pesantren"],
            "Batu": ["Batu", "Bumiaji", "Junrejo"]
        },
        "DI Yogyakarta": {
            "Yogyakarta": ["Malioboro", "Danurejan", "Gondomanan", "Kraton", "Mergangsan", "Umbulharjo", "Kotagede", "Tegalrejo"],
            "Sleman": ["Depok", "Kaliurang", "Godean", "Mlati", "Ngaglik"],
            "Bantul": ["Sewon", "Banguntapan", "Kasihan", "Imogiri"]
        }
    },
    "Sumatera": {
        "Lampung": {
            "Bandar Lampung": ["Tanjung Karang Pusat", "Tanjung Karang Timur", "Kedaton", "Rajabasa", "Sukarame", "Teluk Betung Utara"],
            "Metro": ["Metro Pusat", "Metro Utara", "Metro Barat", "Metro Timur", "Metro Selatan"]
        },
        "Sumatera Utara": {
            "Medan": ["Medan Baru", "Medan Selayang", "Medan Sunggal", "Medan Petisah", "Medan Kota", "Medan Area", "Medan Deli"],
            "Binjai": ["Binjai Kota", "Binjai Barat", "Binjai Utara", "Binjai Timur", "Binjai Selatan"]
        },
        "Sumatera Barat": {
            "Padang": ["Padang Barat", "Padang Timur", "Padang Utara", "Padang Selatan", "Koto Tangah", "Nanggalo"],
            "Bukittinggi": ["Guguk Panjang", "Mandiangin Koto Selayan", "Aur Birugo Tigo Baleh"]
        },
        "Sumatera Selatan": {
            "Palembang": ["Ilir Timur I", "Ilir Timur II", "Ilir Barat I", "Ilir Barat II", "Sako", "Sukarami", "Plaju", "Kertapati"]
        }
    },
    "Kalimantan": {
        "Kalimantan Timur": {
            "Balikpapan": ["Balikpapan Kota", "Balikpapan Selatan", "Balikpapan Barat", "Balikpapan Utara", "Balikpapan Timur"],
            "Samarinda": ["Samarinda Kota", "Samarinda Utara", "Samarinda Seberang", "Samarinda Ulu", "Samarinda Ilir"]
        },
        "Kalimantan Barat": {
            "Pontianak": ["Pontianak Kota", "Pontianak Barat", "Pontianak Selatan", "Pontianak Tenggara", "Pontianak Utara", "Pontianak Timur"]
        }
    },
    "Sulawesi": {
        "Sulawesi Selatan": {
            "Makassar": ["Ujung Pandang", "Panakkukang", "Rappocini", "Tamalate", "Biringkanaya", "Manggala", "Tallo"]
        },
        "Sulawesi Utara": {
            "Manado": ["Wenang", "Sario", "Malalayang", "Tikala", "Mapanget", "Tuminting"]
        }
    },
    "Bali & Nusa Tenggara": {
        "Bali": {
            "Denpasar": ["Denpasar Barat", "Denpasar Timur", "Denpasar Selatan", "Denpasar Utara"],
            "Badung": ["Kuta", "Kuta Utara", "Kuta Selatan", "Mengwi", "Abiansemal"]
        },
        "Nusa Tenggara Barat": {
            "Mataram": ["Ampenan", "Mataram", "Cakranegara", "Sekarbela", "Selaparang"]
        }
    }
};

export default function App() {
    // --- Auth State ---
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
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
        minRating: 0,
        createdTime: 'all'
    });
    const [isLanguageSelected, setIsLanguageSelected] = useState(false);
    const [language, setLanguage] = useState("id");
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isStoreOpen, setIsStoreOpen] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [inputLocation, setInputLocation] = useState("");
    const [selectedRadius, setSelectedRadius] = useState(5);
    const [showMapFiltersModal, setShowMapFiltersModal] = useState(false);
    const [selectedIsland, setSelectedIsland] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [geoSearchQuery, setGeoSearchQuery] = useState("");
    const [activeAlphabet, setActiveAlphabet] = useState("");

    // --- Auth Effects & Handlers ---
    useEffect(() => {
        // Check active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            }
            setAuthLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            } else {
                setUserProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) throw error;
            setUserProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleRegisterMerchant = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const businessName = formData.get('businessName');
        const ownerName = formData.get('ownerName');
        const phone = formData.get('phone');
        const category = formData.get('category');
        const address = formData.get('address');

        if (password !== confirmPassword) {
            showToast('Password tidak cocok!');
            return;
        }

        if (password.length < 8) {
            showToast('Password minimal 8 karakter!');
            return;
        }

        try {
            // Register user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: ownerName,
                        role: 'merchant'
                    }
                }
            });

            if (authError) throw authError;

            // Create profile in database
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        email,
                        full_name: ownerName,
                        role: 'merchant',
                        business_name: businessName,
                        phone,
                        category,
                        address
                    }
                ]);

            if (profileError) throw profileError;

            showToast('Pendaftaran berhasil! Silakan cek email untuk verifikasi.');
            setActiveTab('home');
        } catch (error) {
            console.error('Registration error:', error);
            showToast(error.message || 'Terjadi kesalahan saat mendaftar');
        }
    };

    const handleRegisterPelanggan = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const fullName = formData.get('fullName');
        const username = formData.get('username');
        const phone = formData.get('phone');
        const birthDate = formData.get('birthDate');
        const city = formData.get('city');
        const referralCode = formData.get('referralCode');

        if (password !== confirmPassword) {
            showToast('Password tidak cocok!');
            return;
        }

        if (password.length < 8) {
            showToast('Password minimal 8 karakter!');
            return;
        }

        try {
            // Register user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'customer'
                    }
                }
            });

            if (authError) throw authError;

            // Create profile in database
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        email,
                        full_name: fullName,
                        username,
                        role: 'customer',
                        phone,
                        birth_date: birthDate,
                        city,
                        referral_code: referralCode
                    }
                ]);

            if (profileError) throw profileError;

            showToast('Pendaftaran berhasil! Selamat bergabung 🎉');
            setActiveTab('home');
        } catch (error) {
            console.error('Registration error:', error);
            showToast(error.message || 'Terjadi kesalahan saat mendaftar');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            showToast('Login berhasil! Selamat datang kembali 👋');
            setIsLoginModalOpen(false);
            
            // Redirect based on role
            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();
                
                if (profile?.role === 'merchant') {
                    setActiveTab('merchant');
                    setIsMerchantLoggedIn(true);
                } else {
                    setActiveTab('explore');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast(error.message || 'Email atau password salah');
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            setUser(null);
            setUserProfile(null);
            setIsMerchantLoggedIn(false);
            setActiveTab('home');
            showToast('Logout berhasil. Sampai jumpa! 👋');
        } catch (error) {
            console.error('Logout error:', error);
            showToast('Terjadi kesalahan saat logout');
        }
    };

    // --- Nested Geo Location Helpers ---
    const getGeoSearchResults = (query) => {
        if (!query.trim()) return [];
        const cleanQuery = query.toLowerCase();
        const results = [];

        Object.entries(NESTED_REGIONS).forEach(([island, provinces]) => {
            if (island.toLowerCase().includes(cleanQuery)) {
                results.push({ type: 'pulau', name: island, path: [island] });
            }
            Object.entries(provinces).forEach(([province, cities]) => {
                if (province.toLowerCase().includes(cleanQuery)) {
                    results.push({ type: 'provinsi', name: province, path: [island, province] });
                }
                Object.entries(cities).forEach(([city, districts]) => {
                    if (city.toLowerCase().includes(cleanQuery)) {
                        results.push({ type: 'kota', name: city, path: [island, province, city] });
                    }
                    districts.forEach(district => {
                        if (district.toLowerCase().includes(cleanQuery)) {
                            results.push({ type: 'kecamatan', name: district, path: [island, province, city, district] });
                        }
                    });
                });
            });
        });

        return results.slice(0, 15);
    };

    const handleSelectSearchResult = (result) => {
        const [island, province, city, district] = result.path;
        setSelectedIsland(island || "");
        setSelectedProvince(province || "");
        setSelectedCity(city || "");
        setSelectedDistrict(district || "");
        
        // Update main application location state
        const finalLoc = district ? `${district}, ${city}` : city ? city : province;
        setInputLocation(finalLoc);
        
        // Clear search input inside modal
        setGeoSearchQuery("");
    };

    // --- Chatbot State ---
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Halo! Saya SISAIN AI, asisten virtual pintar Anda. Ada yang bisa saya bantu hari ini mengenai platform SISAIN (penyelamatan makanan surplus)?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    // --- Chatbot Handlers ---
    const handleSendChatMessage = async (customText = '') => {
        const textToSend = customText || chatInput;
        if (!textToSend.trim()) return;

        // Reset input field if typed
        if (!customText) {
            setChatInput('');
        }

        // Add user message to state
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: textToSend,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, userMsg]);
        setIsChatLoading(true);

        // Fetch Gemini response
        const botResponseText = await getGeminiResponse(textToSend);

        // Add bot response to state
        const botMsg = {
            id: Date.now() + 1,
            sender: 'bot',
            text: botResponseText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, botMsg]);
        setIsChatLoading(false);

        // Auto-scroll chat area
        setTimeout(() => {
            const chatArea = document.getElementById('chat-messages-area-id');
            if (chatArea) {
                chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
            }
        }, 100);
    };

    const getGeminiResponse = async (queryText) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        if (!apiKey) {
            return "Maaf, asisten virtual SISAIN AI saat ini sedang tidak dapat dihubungi karena kunci API (API Key) belum dikonfigurasi oleh administrator. Silakan hubungi admin SISAIN untuk mengonfigurasinya.";
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: `Kamu adalah SISAIN AI, asisten virtual pintar untuk platform SISAIN (penyelamatan makanan surplus berkualitas di Indonesia, khususnya di Lampung).
Jawablah pertanyaan pengguna berikut dengan ramah, komunikatif, dan menggunakan bahasa Indonesia yang baik serta terstruktur. Jawablah secara spesifik tentang platform SISAIN berdasarkan data berikut.

Informasi SISAIN:
1. SISAIN (Selamatkan Makanan Surplus) menghubungkan merchant (restoran, cafe, toko roti, dll) yang memiliki stok makanan sisa layak konsumsi dengan pembeli untuk mencegah food waste.
2. Setiap makanan surplus yang dijual dijamin mendapatkan diskon minimal 50% hingga 70% dari harga normal.
3. Kategori makanan yang tersedia: Sayur (misal: Premium Vegetable Box), Buah (misal: buah naga, jeruk sunkish), Roti (misal: Croissant, Sourdough), dan Siap Saji (misal: Ayam Geprek).
4. Fitur Utama Pengguna:
   - Pencarian makanan terdekat dengan filter radius (1km, 5km, 10km).
   - Filter ketahanan/shelf life makanan (Hari Ini, Besok, 7 Hari).
   - Filter waktu buat/upload makanan (1 jam terakhir, 24 jam terakhir, 7 hari terakhir).
   - Pembayaran digital terintegrasi via SISAINPay dan sistem koin reward (Koin SISAIN).
   - Gamifikasi lencana prestasi (Badges) seperti Eco Hero, Perunggu, Perak, Emas, dll.
5. Fitur untuk Merchant (Mitra SISAIN):
   - Portal khusus (SISAIN Mitra) untuk mengunggah produk surplus secara instan.
   - Manajemen Buka/Tutup Toko digital dan jam operasional reguler/spesial.
   - Performa pendapatan harian, statistik total pesanan, dan rating toko secara transparan.
   - Penarikan saldo pendapatan kapan saja tanpa ribet.

Pertanyaan Pengguna: "${queryText}"`
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Gagal terhubung dengan server Gemini.');
            }

            const data = await response.json();
            const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
            return textResult || "Maaf, saya tidak mendapatkan respons yang valid dari AI.";
        } catch (error) {
            console.error("Gemini API error details:", error);
            return `Aduh, terjadi kendala saat memproses jawaban dengan Gemini AI: ${error.message}. Pastikan koneksi internet stabil dan API Key Anda valid.`;
        }
    };

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
            img: newProduct.img || "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=600",
            createdAt: Date.now(),
            shelfLife: "today"
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
        .filter(p => {
            const distNum = parseFloat(p.distance) || 0;
            return distNum <= filters.maxDistance;
        })
        .filter(p => {
            if (filters.shelfLife === 'all') return true;
            return p.shelfLife === filters.shelfLife;
        })
        .filter(p => {
            if (filters.createdTime === 'all') return true;
            const uploadTime = p.createdAt || (Date.now() - 24 * 3600 * 1000); // fallback
            const timeDiff = Date.now() - uploadTime;
            if (filters.createdTime === '1h') return timeDiff <= 3600 * 1000;
            if (filters.createdTime === '24h') return timeDiff <= 24 * 3600 * 1000;
            if (filters.createdTime === '7d') return timeDiff <= 7 * 24 * 3600 * 1000;
            return true;
        })
        .sort((a, b) => {
            if (sortType === "termurah") return a.currentPrice - b.currentPrice;
            if (sortType === "rating") return b.rating - a.rating;
            return 0; // Default: 'terdekat' (using initial order)
        });

    // (JoinModal removed — join section is now inline on the About page)

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
                            <span className="splash-brand-text">SISAIN</span>
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
            {isJoinModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsJoinModalOpen(false)}>
                    <div className="modal-card" style={{ maxWidth: '560px', padding: '40px 35px' }} onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setIsJoinModalOpen(false)}><X size={20} /></button>

                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ width: '60px', height: '60px', background: 'var(--orange)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(238,77,45,0.3)' }}>
                                <Recycle size={30} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>Bergabunglah di Misi Kami</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>Pilih peran Anda dan mulai berdampak nyata bagi lingkungan</p>
                        </div>

                        {/* Two Role Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                            {/* Merchant Card */}
                            <div className="card-neumorph" style={{ padding: '28px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', cursor: 'default' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                    <Store size={28} color="var(--orange)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '4px' }}>Merchant</h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>Bergabunglah sebagai Merchant</p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                                        {['Dapatkan lebih banyak pesanan dan penjualan', 'Bangun reputasi bisnis secara online', 'Dapatkan dukungan logistik pengiriman'].map((perk, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                                <CheckCircle2 size={14} color="var(--orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    className="nav-pill active"
                                    style={{ width: '100%', padding: '12px', fontSize: '0.85rem', border: 'none', marginTop: '4px', cursor: 'pointer' }}
                                    onClick={() => { setIsJoinModalOpen(false); setActiveTab('register-merchant'); }}
                                >
                                    Bergabung sebagai Merchant
                                </button>
                            </div>

                            {/* Pelanggan Card */}
                            <div className="card-neumorph" style={{ padding: '28px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', cursor: 'default' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(238,77,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                    <User size={28} color="var(--orange)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '4px' }}>Pelanggan</h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>Bergabunglah sebagai Pelanggan</p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                                        {['Hemat hingga 70% dari harga normal', 'Nikmati makanan berkualitas terjamin', 'Dukung pengurangan limbah pangan'].map((perk, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                                <CheckCircle2 size={14} color="var(--orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    className="nav-pill active"
                                    style={{ width: '100%', padding: '12px', fontSize: '0.85rem', border: 'none', marginTop: '4px', cursor: 'pointer' }}
                                    onClick={() => { setIsJoinModalOpen(false); setActiveTab('register-pelanggan'); }}
                                >
                                    Bergabung sebagai Pelanggan
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsLoginModalOpen(false)}>
                    <div className="modal-card" style={{ maxWidth: '480px', padding: '40px 35px' }} onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setIsLoginModalOpen(false)}><X size={20} /></button>

                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ width: '60px', height: '60px', background: 'var(--orange)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(238,77,45,0.3)' }}>
                                <User size={30} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>Masuk ke SISAIN</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>Selamat datang kembali! Masukkan kredensial Anda</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Email */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Email *</label>
                                <input 
                                    name="email" 
                                    required 
                                    type="email" 
                                    placeholder="email@kamu.com" 
                                    style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} 
                                />
                            </div>

                            {/* Password */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Password *</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        name="password" 
                                        required 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Masukkan password" 
                                        style={{ padding: '14px 18px', paddingRight: '45px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)', width: '100%' }} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ color: 'var(--orange)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Lupa Password?</span>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="nav-pill active" style={{ width: '100%', padding: '16px', fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '4px' }}>
                                Masuk
                            </button>

                            {/* Register Link */}
                            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                Belum punya akun? <span style={{ color: 'var(--orange)', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setIsLoginModalOpen(false); setIsJoinModalOpen(true); }}>Daftar di sini</span>
                            </p>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <header className="main-header">
                <div className="header-top">
                    <div className="logo-container" onClick={() => setActiveTab('home')}>
                        <div className="logo-icon">
                            <Recycle size={22} strokeWidth={2} color="white" />
                        </div>
                        <span className="logo-text">SISAIN</span>
                    </div>

                    <nav className="desktop-nav">
                        <span onClick={() => setActiveTab('home')} className={`nav-pill ${activeTab === 'home' ? 'active' : ''}`}>{t('navHome')}</span>
                        <span onClick={() => setActiveTab('about')} className={`nav-pill ${activeTab === 'about' ? 'active' : ''}`}>{t('navAbout')}</span>
                        <span onClick={() => setActiveTab('explore')} className={`nav-pill ${activeTab === 'explore' ? 'active' : ''}`}>{t('navExplore')}</span>
                        <span onClick={() => setActiveTab('merchant')} className={`nav-pill ${activeTab === 'merchant' ? 'active' : ''}`}>{t('navMerchant')}</span>
                        <span onClick={() => setActiveTab('help')} className={`nav-pill ${activeTab === 'help' ? 'active' : ''}`}>{t('navHelp')}</span>
                    </nav>

                    <div className="nav-auth-group">
                        {user ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="location-pill" style={{ cursor: 'pointer', background: 'var(--orange-light)' }} onClick={() => setActiveTab('profile')}>
                                        <User size={14} color="var(--orange)" />
                                        <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{userProfile?.full_name || user.email}</span>
                                    </div>
                                    <button 
                                        className="location-pill btn-login-pill" 
                                        style={{ background: 'var(--bg-color)', color: 'var(--text-muted)' }}
                                        onClick={handleLogout}
                                        title="Logout"
                                    >
                                        <LogOut size={14} />
                                        <span>Keluar</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button className="location-pill btn-login-pill" aria-label="Join" title="Bergabunglah di Misi Kami" onClick={() => setIsJoinModalOpen(true)}>
                                <User size={14} />
                                <span>{t('navJoin')}</span>
                            </button>
                        )}
                    </div>

                    <div className="location-pill" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('location')}>
                        <MapPin size={14} color="var(--orange)" />
                        <span>{userLocation || t('navLocation')}</span>
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
                        <span onClick={() => { setActiveTab('help'); setIsMobileMenuOpen(false); }} className={`mobile-nav-item ${activeTab === 'help' ? 'active' : ''}`}>
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
                                            <div className="feature-icon"><Ticket size={40} /></div>
                                            <div className="feature-content">
                                                <h3>{t('featureSave')}</h3>
                                                <p>{t('featureSaveDesc')}</p>
                                            </div>
                                        </div>

                                        <div className="card-neumorph feature-card-icon">
                                            <div className="feature-icon"><Leaf size={40} /></div>
                                            <div className="feature-content">
                                                <h3>{t('featureEarth')}</h3>
                                                <p>{t('featureEarthDesc')}</p>
                                            </div>
                                        </div>

                                        <div className="card-neumorph feature-card-icon">
                                            <div className="feature-icon"><ShieldCheck size={40} /></div>
                                            <div className="feature-content">
                                                <h3>{t('featureQuality')}</h3>
                                                <p>{t('featureQualityDesc')}</p>
                                            </div>
                                        </div>

                                        <div className="card-neumorph feature-card-icon highlight-card">
                                            <div className="feature-icon"><Store size={40} /></div>
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
                                            <div className="discount-ribbon">
                                                <Percent size={12} strokeWidth={3} />
                                                <span>50%</span>
                                            </div>
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
                    <div style={{ animation: 'fadeIn 0.5s ease', paddingBottom: '100px' }}>
                        {/* About Hero Banner */}
                        <section className="hero-banner">
                            <div className="hero-overlay"></div>
                            <img src="/sisain_mission.png" className="hero-bg" alt="SISAIN Mission" />
                            <div className="hero-content-modern">
                                <h1 className="hero-title-main" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                    {t('aboutTitle')}
                                    <Recycle size={40} strokeWidth={2.5} color="white" />
                                </h1>
                                <p className="hero-subtitle-main">
                                    {t('aboutDesc')}
                                </p>
                            </div>
                        </section>

                        {/* Core Values / Pillars */}
                        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                            <div className="features-grid-modern" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                {/* Value 1: Circular Economy */}
                                <div className="card-neumorph feature-card-icon hover-float" style={{ padding: '40px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '25px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                        <TrendingUp size={40} color="var(--orange)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '15px' }}>{t('aboutCircular')}</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>{t('aboutCircularDesc')}</p>
                                </div>

                                {/* Value 2: Quality */}
                                <div className="card-neumorph feature-card-icon hover-float" style={{ padding: '40px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '25px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                        <ShieldCheck size={40} color="var(--orange)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '15px' }}>{t('aboutQuality')}</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>{t('aboutQualityDesc')}</p>
                                </div>

                                {/* Value 3: Eco Impact */}
                                <div className="card-neumorph feature-card-icon hover-float" style={{ padding: '40px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '25px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                        <Recycle size={40} color="var(--orange)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '15px' }}>Zero Food Waste</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>Bersama kita mewujudkan lingkungan yang lebih hijau dengan mencegah pembuangan makanan layak konsumsi.</p>
                                </div>
                            </div>
                        </div>

                        {/* Bergabunglah di Misi Kami - Inline Join Section */}
                        <div style={{ width: '100%', margin: '60px 0 0', padding: '0' }}>
                            <div className="card-neumorph" style={{ padding: '50px 40px' }}>
                                {/* Header */}
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--orange)', marginBottom: '12px' }}>Bergabunglah di Misi Kami</h2>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Pilih peran Anda dan mulai berdampak nyata bagi lingkungan</p>
                                </div>

                                {/* Two Cards: Merchant & Pelanggan */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>

                                    {/* Merchant Card */}
                                    <div className="card-neumorph hover-float" style={{ padding: '35px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '18px' }}>
                                        <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(238,77,45,0.15), rgba(238,77,45,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                            <Store size={36} color="var(--orange)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>Merchant</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>Bergabunglah sebagai Merchant</p>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                                                {['Dapatkan lebih banyak pesanan dan penjualan', 'Bangun reputasi bisnis secara online', 'Dapatkan dukungan logistik pengiriman'].map((perk, i) => (
                                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                                        <CheckCircle2 size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                        {perk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            className="nav-pill active hover-scale"
                                            style={{ width: '100%', padding: '14px', fontSize: '1rem', border: 'none', marginTop: '8px' }}
                                            onClick={() => { setActiveTab('merchant'); showToast('Selamat datang, Mitra SISAIN!'); }}
                                        >
                                            Bergabung sebagai Merchant
                                        </button>
                                    </div>

                                    {/* Pelanggan Card */}
                                    <div className="card-neumorph hover-float" style={{ padding: '35px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '18px' }}>
                                        <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(238,77,45,0.15), rgba(238,77,45,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                            <User size={36} color="var(--orange)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>Pelanggan</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>Bergabunglah sebagai Pelanggan</p>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                                                {['Hemat hingga 70% dari harga normal', 'Nikmati makanan berkualitas terjamin', 'Dukung pengurangan limbah pangan'].map((perk, i) => (
                                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                                        <CheckCircle2 size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                        {perk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            className="nav-pill active hover-scale"
                                            style={{ width: '100%', padding: '14px', fontSize: '1rem', border: 'none', marginTop: '8px' }}
                                            onClick={() => { setActiveTab('explore'); showToast('Selamat berbelanja di SISAIN!'); }}
                                        >
                                            Bergabung sebagai Pelanggan
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'register-merchant' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 25px 120px', animation: 'slideUp 0.4s ease' }}>
                        {/* Back button */}
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', marginBottom: '28px', padding: 0 }}
                        >
                            ← Kembali
                        </button>

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ width: '56px', height: '56px', background: 'var(--orange)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(238,77,45,0.3)', flexShrink: 0 }}>
                                <Store size={28} color="white" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>Daftar sebagai Merchant</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mulai jual surplus makananmu di SISAIN</p>
                            </div>
                        </div>

                        <form
                            className="card-neumorph"
                            style={{ padding: '35px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}
                            onSubmit={handleRegisterMerchant}
                        >
                            {/* Nama Usaha */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Nama Usaha / Toko *</label>
                                <input name="businessName" required placeholder="Contoh: Warung Bu Siti" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                            </div>

                            {/* Nama Pemilik */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Nama Pemilik *</label>
                                <input name="ownerName" required placeholder="Nama lengkap pemilik usaha" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                            </div>

                            {/* Email & No HP */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Email *</label>
                                    <input name="email" required type="email" placeholder="email@usaha.com" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>No. WhatsApp *</label>
                                    <input name="phone" required type="tel" placeholder="08xxxxxxxxxx" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                                </div>
                            </div>

                            {/* Kategori Usaha */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Kategori Usaha *</label>
                                <select name="category" required style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                                    <option value="">Pilih kategori...</option>
                                    <option>Restoran / Warung Makan</option>
                                    <option>Kafe / Coffee Shop</option>
                                    <option>Bakery / Toko Roti</option>
                                    <option>Katering</option>
                                    <option>Toko Buah & Sayur</option>
                                    <option>Minimarket / Supermarket</option>
                                    <option>Lainnya</option>
                                </select>
                            </div>

                            {/* Alamat */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Alamat Usaha *</label>
                                <textarea name="address" required rows={3} placeholder="Jl. Contoh No. 1, Kecamatan, Kota..." style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)', resize: 'vertical', fontFamily: 'inherit' }} />
                            </div>

                            {/* Password */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Password *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input name="password" required type={showPassword ? "text" : "password"} placeholder="Min. 8 karakter" style={{ padding: '14px 18px', paddingRight: '45px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)', width: '100%' }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Konfirmasi Password *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input name="confirmPassword" required type={showConfirmPassword ? "text" : "password"} placeholder="Ulangi password" style={{ padding: '14px 18px', paddingRight: '45px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)', width: '100%' }} />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Syarat */}
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <input required type="checkbox" style={{ marginTop: '3px', accentColor: 'var(--orange)', flexShrink: 0 }} />
                                Saya menyetujui <span style={{ color: 'var(--orange)', fontWeight: 700 }}>&nbsp;Syarat & Ketentuan&nbsp;</span> serta <span style={{ color: 'var(--orange)', fontWeight: 700 }}>&nbsp;Kebijakan Privasi</span> SISAIN
                            </label>

                            <button type="submit" className="nav-pill active" style={{ width: '100%', padding: '16px', fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '4px' }}>
                                Daftar sebagai Merchant
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                Sudah punya akun? <span style={{ color: 'var(--orange)', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setIsLoginModalOpen(true); setActiveTab('home'); }}>Masuk di sini</span>
                            </p>
                        </form>
                    </div>
                )}

                {activeTab === 'register-pelanggan' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 25px 120px', animation: 'slideUp 0.4s ease' }}>
                        {/* Back button */}
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', marginBottom: '28px', padding: 0 }}
                        >
                            ← Kembali
                        </button>

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ width: '56px', height: '56px', background: 'var(--orange)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(238,77,45,0.3)', flexShrink: 0 }}>
                                <User size={28} color="white" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>Daftar sebagai Pelanggan</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hemat hingga 70% dan selamatkan makanan bersama kami</p>
                            </div>
                        </div>

                        <form
                            className="card-neumorph"
                            style={{ padding: '35px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}
                            onSubmit={handleRegisterPelanggan}
                        >
                            {/* Nama Lengkap */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Nama Lengkap *</label>
                                <input name="fullName" required placeholder="Nama lengkap kamu" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                            </div>

                            {/* Username */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Username *</label>
                                <input name="username" required placeholder="@username" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                            </div>

                            {/* Email & No HP */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Email *</label>
                                    <input name="email" required type="email" placeholder="email@kamu.com" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>No. WhatsApp *</label>
                                    <input name="phone" required type="tel" placeholder="08xxxxxxxxxx" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                                </div>
                            </div>

                            {/* Tanggal Lahir */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Tanggal Lahir</label>
                                <input name="birthDate" type="date" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)', cursor: 'pointer' }} />
                            </div>

                            {/* Kota */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Kota / Kabupaten *</label>
                                <input name="city" required placeholder="Contoh: Bandar Lampung" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                            </div>

                            {/* Password */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Password *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input name="password" required type={showPassword ? "text" : "password"} placeholder="Min. 8 karakter" style={{ padding: '14px 18px', paddingRight: '45px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)', width: '100%' }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Konfirmasi Password *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input name="confirmPassword" required type={showConfirmPassword ? "text" : "password"} placeholder="Ulangi password" style={{ padding: '14px 18px', paddingRight: '45px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)', width: '100%' }} />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Referral (opsional) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Kode Referral <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opsional)</span></label>
                                <input name="referralCode" placeholder="Masukkan kode referral jika ada" style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)' }} />
                            </div>

                            {/* Syarat */}
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <input required type="checkbox" style={{ marginTop: '3px', accentColor: 'var(--orange)', flexShrink: 0 }} />
                                Saya menyetujui <span style={{ color: 'var(--orange)', fontWeight: 700 }}>&nbsp;Syarat & Ketentuan&nbsp;</span> serta <span style={{ color: 'var(--orange)', fontWeight: 700 }}>&nbsp;Kebijakan Privasi</span> SISAIN
                            </label>

                            <button type="submit" className="nav-pill active" style={{ width: '100%', padding: '16px', fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '4px' }}>
                                Daftar sebagai Pelanggan
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                Sudah punya akun? <span style={{ color: 'var(--orange)', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setIsLoginModalOpen(true); setActiveTab('home'); }}>Masuk di sini</span>
                            </p>
                        </form>
                    </div>
                )}
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
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>SISAINPay</span>
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
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px', marginBottom: '40px' }}>
                            <div className="merchant-tab-switcher">
                                <button
                                    onClick={() => setMerchantSubTab('pendaftaran')}
                                    className={`merchant-tab-btn${merchantSubTab === 'pendaftaran' ? ' active' : ''}`}
                                >
                                    {t('merchantTabRegistration')}
                                </button>
                                <span className="merchant-tab-divider" />
                                <button
                                    onClick={() => setMerchantSubTab('fitur')}
                                    className={`merchant-tab-btn${merchantSubTab === 'fitur' ? ' active' : ''}`}
                                >
                                    {t('merchantTabFeatures')}
                                </button>
                            </div>
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
                                    <div className="feature-icon"><Smartphone size={40} /></div>
                                    <div className="feature-content">
                                        <h3>{t('merchantBenefit1')}</h3>
                                        <p>{t('merchantBenefit1Desc')}</p>
                                    </div>
                                </div>

                                <div className="card-neumorph feature-card-icon">
                                    <div className="feature-icon"><Wallet size={40} /></div>
                                    <div className="feature-content">
                                        <h3>{t('merchantBenefit2')}</h3>
                                        <p>{t('merchantBenefit2Desc')}</p>
                                    </div>
                                </div>

                                <div className="card-neumorph feature-card-icon">
                                    <div className="feature-icon"><Percent size={40} /></div>
                                    <div className="feature-content">
                                        <h3>{t('merchantBenefit3')}</h3>
                                        <p>{t('merchantBenefit3Desc')}</p>
                                    </div>
                                </div>

                                <div className="card-neumorph feature-card-icon highlight-card">
                                    <div className="feature-icon"><ThumbsUp size={40} /></div>
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
                                        <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                            <Wallet size={36} color="var(--orange)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Aplikasi SISAIN Mitra</h3>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Kelola bisnis secara digital untuk pendapatan maksimal.</p>
                                        </div>
                                    </div>

                                    {/* Feature 2 */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                        <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                            <ArrowRightLeft size={36} color="var(--orange)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Saldo Terintegrasi</h3>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Cek saldo dan pantau riwayat transaksi di satu tempat.</p>
                                        </div>
                                    </div>

                                    {/* Feature 3 */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                        <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                            <LineChart size={36} color="var(--orange)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Dashboard Praktis</h3>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Pantau pendapatan bisnis dan atur menu secara praktis.</p>
                                        </div>
                                    </div>

                                    {/* Feature 4 */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                        <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
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
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', textAlign: 'center', marginBottom: '60px' }}>Fitur SISAIN Mitra</h2>
                                    
                                    <div className="features-grid-modern" style={{ gap: '50px' }}>
                                        {/* Feature 1 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                                <RefreshCw size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Pembaruan Transaksi Instan</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Terima info terkait pesanan, pembayaran, dan pengelolaan Merchant secara mudah.</p>
                                            </div>
                                        </div>

                                        {/* Feature 2 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                                <CalendarClock size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Manajemen Toko yang Fleksibel</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Buka/tutup Merchant kapan saja, sesuaikan dengan kebutuhan Anda.</p>
                                            </div>
                                        </div>

                                        {/* Feature 3 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                                <AlarmClock size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Pengaturan Jam Kerja</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Atur jam operasional reguler/pada hari-hari khusus secara praktis.</p>
                                            </div>
                                        </div>

                                        {/* Feature 4 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                                <BookOpen size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Pengaturan Menu yang Mudah</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Ubah & tambah menu kapan pun untuk menarik lebih banyak Pelanggan.</p>
                                            </div>
                                        </div>

                                        {/* Feature 5 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                                <Wallet size={36} color="var(--orange)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Pembayaran Terintegrasi</h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Pembayaran lancar dan tercatat rapi, Anda bisa fokus menyajikan menu yang lezat.</p>
                                            </div>
                                        </div>

                                        {/* Feature 6 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', textAlign: 'left' }}>
                                            <div style={{ flexShrink: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(238,77,45,0.1), rgba(238,77,45,0.05))', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
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
                                    <div className="card-neumorph" style={{ padding: '50px 40px' }}>
                                        {/* Header */}
                                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--orange)', marginBottom: '12px' }}>Bergabunglah di Misi Kami</h2>
                                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Pilih peran Anda dan mulai berdampak nyata bagi lingkungan</p>
                                        </div>

                                        {/* Two Cards: Merchant & Pelanggan */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>

                                            {/* Merchant Card */}
                                            <div className="card-neumorph hover-float" style={{ padding: '35px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '18px' }}>
                                                <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(238,77,45,0.15), rgba(238,77,45,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                                    <Store size={36} color="var(--orange)" />
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>Merchant</h3>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>Bergabunglah sebagai Merchant</p>
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                                                        {[t('joinMerchantPerk1'), t('joinMerchantPerk2'), t('joinMerchantPerk3')].map((perk, i) => (
                                                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                                                <CheckCircle2 size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                                {perk}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <button
                                                    className="nav-pill active hover-scale"
                                                    style={{ width: '100%', padding: '14px', fontSize: '1rem', border: 'none', marginTop: '8px' }}
                                                    onClick={() => { setActiveTab('merchant'); showToast('Selamat datang, Mitra SISAIN!'); }}
                                                >
                                                    Bergabung sebagai Merchant
                                                </button>
                                            </div>

                                            {/* Pelanggan Card */}
                                            <div className="card-neumorph hover-float" style={{ padding: '35px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '18px' }}>
                                                <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(238,77,45,0.15), rgba(238,77,45,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)' }}>
                                                    <User size={36} color="var(--orange)" />
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>Pelanggan</h3>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>Bergabunglah sebagai Pelanggan</p>
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                                                        {[t('joinCustomerPerk1'), t('joinCustomerPerk2'), t('joinCustomerPerk3')].map((perk, i) => (
                                                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                                                <CheckCircle2 size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                                {perk}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <button
                                                    className="nav-pill active hover-scale"
                                                    style={{ width: '100%', padding: '14px', fontSize: '1rem', border: 'none', marginTop: '8px' }}
                                                    onClick={() => { setActiveTab('explore'); showToast('Selamat berbelanja di SISAIN!'); }}
                                                >
                                                    Bergabung sebagai Pelanggan
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'help' && (
                    <div className="help-page-container">
                        <div className="chatbot-card">
                            {/* Chat Header */}
                            <div className="chatbot-header">
                                <div className="chatbot-header-info">
                                    <div className="chatbot-avatar">
                                        <Bot size={22} color="white" />
                                    </div>
                                    <div className="chatbot-title">
                                        <h3>SISAIN AI Assistant</h3>
                                        <p>Online • Siap membantu</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages scroll area */}
                            <div className="chat-messages-area" id="chat-messages-area-id">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                                        <span className="chat-time">{msg.time}</span>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="chat-bubble bot" style={{ display: 'inline-block', width: 'fit-content' }}>
                                        <div className="typing-indicator">
                                            <span className="typing-dot"></span>
                                            <span className="typing-dot"></span>
                                            <span className="typing-dot"></span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick suggestions area */}
                            <div className="chat-suggestions">
                                {[
                                    "Apa itu SISAIN?",
                                    "Bagaimana cara memesan makanan surplus?",
                                    "Bagaimana cara bergabung sebagai Mitra Merchant?",
                                    "Apa keuntungan menggunakan SISAIN?"
                                ].map((q, idx) => (
                                    <button 
                                        key={idx} 
                                        className="suggestion-chip"
                                        disabled={isChatLoading}
                                        onClick={() => handleSendChatMessage(q)}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>

                            {/* Chat Input area */}
                            <div className="chat-input-area">
                                <div className="chat-input-wrapper">
                                    <input 
                                        type="text" 
                                        className="chat-text-input" 
                                        placeholder="Ketik pertanyaan Anda tentang SISAIN..." 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendChatMessage();
                                            }
                                        }}
                                        disabled={isChatLoading}
                                    />
                                </div>
                                <button 
                                    className="chat-send-btn" 
                                    onClick={() => handleSendChatMessage()}
                                    disabled={isChatLoading || !chatInput.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'location' && (
                    <div style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '20px', textAlign: 'left' }}>
                        {/* Header Title Section */}
                        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ textAlign: 'left' }}>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <MapPin size={36} color="var(--orange)" />
                                    {language === 'id' ? 'Atur Lokasi Anda' : 'Set Your Location'}
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                                    {language === 'id' 
                                        ? 'Tentukan lokasi penyelamatan pangan Anda untuk mencocokkan produk surplus terdekat.' 
                                        : 'Specify your food rescue location to match the nearest surplus products.'}
                                </p>
                            </div>
                        </div>

                        {/* MASTER MAP CARD WITH CONSOLIDATED TOP NAVBAR */}
                        <div className="card-neumorph" style={{ padding: '0', borderRadius: '28px', marginBottom: '35px', overflow: 'hidden' }}>
                            
                            {/* MAP NAVBAR (Di Atas Map - Giant Absolute Edge-to-Edge Search Bar) */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '15px 25px',
                                background: 'var(--bg-color)',
                                borderBottom: '1px solid rgba(0,0,0,0.06)',
                                borderRadius: '28px 28px 0 0',
                                flexWrap: 'nowrap',
                                boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <Search size={22} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                <input
                                    className="search-input"
                                    style={{ 
                                        flex: 1, 
                                        border: 'none', 
                                        background: 'transparent', 
                                        outline: 'none',
                                        fontSize: '1rem',
                                        color: 'var(--text-main)',
                                        padding: '8px 0',
                                        width: '100%'
                                    }}
                                    placeholder={language === 'id' ? 'Masukkan kota atau alamat lengkap...' : 'Enter city or full address...'}
                                    value={inputLocation}
                                    onChange={e => setInputLocation(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            showToast(language === 'id' ? `Mencari lokasi: ${inputLocation}` : `Searching location: ${inputLocation}`);
                                        }
                                    }}
                                />
                                <div className="search-actions" style={{ flexShrink: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 10px', color: 'var(--text-main)' }}>
                                        <Package size={16} color="var(--orange)" />
                                        <span className="action-label" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 700 }}>
                                            {selectedRadius} km ({inputLocation || (language === 'id' ? 'Indonesia' : 'Indonesia')})
                                        </span>
                                    </div>
                                    <div className="action-divider"></div>
                                    <div className="filter-icon-btn" onClick={() => setShowMapFiltersModal(true)} style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-light), var(--shadow-dark)' }}>
                                        <SlidersHorizontal size={18} color="var(--orange)" />
                                    </div>
                                </div>
                            </div>

                            {/* Google Maps Container */}
                            <div style={{ 
                                width: '100%', 
                                height: '560px', 
                                background: 'var(--bg-color)',
                                position: 'relative'
                            }}>
                                <iframe
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(inputLocation || "Jakarta")}&t=&z=${selectedRadius <= 2 ? 15 : selectedRadius <= 5 ? 13 : selectedRadius <= 12 ? 12 : 10}&ie=UTF8&iwloc=&output=embed`}
                                    style={{ width: '100%', height: '100%', border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Google Maps"
                                ></iframe>
                            </div>
                            
                            {/* Real-time Map Info Banner */}
                            <div style={{ 
                                padding: '20px 25px', 
                                background: 'rgba(238, 77, 45, 0.04)', 
                                borderTop: '1px solid rgba(238, 77, 45, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <MapPin size={20} color="var(--orange)" style={{ flexShrink: 0 }} />
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                    {language === 'id' ? (
                                        <>Mencari makanan surplus dalam radius <strong>{selectedRadius} km</strong> dari pusat wilayah <strong>{inputLocation || "Jakarta"}</strong>.</>
                                    ) : (
                                        <>Searching for surplus food within a <strong>{selectedRadius} km</strong> radius from <strong>{inputLocation || "Jakarta"}</strong>.</>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* BOTTOM PANEL: Cancel & Save Action Buttons */}
                        <div className="card-neumorph" style={{ 
                            padding: '25px 30px', 
                            borderRadius: '24px', 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '20px',
                            flexWrap: 'wrap'
                        }}>
                            <div>
                                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                                    {language === 'id' ? 'Konfirmasi Pilihan Lokasi' : 'Confirm Selected Location'}
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {language === 'id' 
                                        ? `Lokasi terpilih: ${inputLocation || 'Jakarta'} | Radius: ${selectedRadius} km`
                                        : `Selected location: ${inputLocation || 'Jakarta'} | Radius: ${selectedRadius} km`}
                                </p>
                            </div>
                            <div style={{ minWidth: '320px', flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    className="nav-pill active"
                                    style={{ padding: '14px 32px', border: 'none', fontSize: '1rem' }}
                                    onClick={() => {
                                        setUserLocation(inputLocation.trim() || null);
                                        setFilters(prev => ({ ...prev, maxDistance: selectedRadius }));
                                        showToast(language === 'id' ? 'Lokasi berhasil disimpan!' : 'Location saved successfully!');
                                        setActiveTab('home');
                                    }}
                                    type="button"
                                >
                                    {t('modalApply')}
                                </button>
                            </div>
                        </div>

                        {/* ADVANCED LOCATION FILTERS MODAL POP-UP */}
                        {showMapFiltersModal && (
                            <div style={{
                                position: 'fixed',
                                top: 0, left: 0,
                                width: '100vw', height: '100vh',
                                background: 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                zIndex: 10000,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                boxSizing: 'border-box',
                                animation: 'fadeIn 0.3s ease'
                            }}>
                                <div className="card-neumorph" style={{
                                    width: '100%',
                                    maxWidth: '560px',
                                    maxHeight: '90vh',
                                    overflowY: 'auto',
                                    borderRadius: '32px',
                                    padding: '26px',
                                    background: 'var(--bg-color)',
                                    animation: 'popupBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards',
                                    boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                    position: 'relative',
                                    boxSizing: 'border-box'
                                }}>
                                    {/* Modal Header */}
                                    <div style={{ marginBottom: '18px', boxSizing: 'border-box' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <SlidersHorizontal size={20} color="var(--orange)" />
                                            {language === 'id' ? 'Pilih Wilayah Penyelamatan' : 'Select Rescue Region'}
                                        </h3>
                                        <button
                                            onClick={() => setShowMapFiltersModal(false)}
                                            style={{
                                                position: 'absolute',
                                                top: '16px',
                                                right: '16px',
                                                border: 'none',
                                                background: 'var(--bg-color)',
                                                cursor: 'pointer',
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                                color: 'var(--text-muted)',
                                                zIndex: 10
                                            }}
                                            type="button"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', textAlign: 'left', boxSizing: 'border-box' }}>
                                        
                                        {/* 1. Radius Filter Section */}
                                        <div style={{ 
                                            padding: '12px 16px', 
                                            borderRadius: '20px', 
                                            background: 'var(--bg-color)', 
                                            boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)',
                                            boxSizing: 'border-box'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                <h4 style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
                                                    {language === 'id' ? 'Radius Penyelamatan' : 'Rescue Radius'}
                                                </h4>
                                                <span style={{ 
                                                    padding: '2px 8px', 
                                                    borderRadius: '20px', 
                                                    background: `rgba(${selectedRadius <= 5 ? '34, 197, 94' : selectedRadius <= 10 ? '234, 179, 8' : selectedRadius <= 20 ? '249, 115, 22' : '239, 68, 68'}, 0.1)`, 
                                                    color: selectedRadius <= 5 ? '#22c55e' : selectedRadius <= 10 ? '#eab308' : selectedRadius <= 20 ? '#f97316' : '#ef4444', 
                                                    fontWeight: 800, 
                                                    fontSize: '0.75rem' 
                                                }}>
                                                    {selectedRadius} km
                                                </span>
                                            </div>
                                            
                                            {/* Range Slider with Markers Below */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', boxSizing: 'border-box', position: 'relative' }}>
                                                <input 
                                                    type="range" 
                                                    min="1" 
                                                    max="30" 
                                                    value={selectedRadius} 
                                                    onChange={e => setSelectedRadius(parseInt(e.target.value))}
                                                    style={{ 
                                                        width: '100%',
                                                        accentColor: selectedRadius <= 5 ? '#22c55e' : selectedRadius <= 10 ? '#eab308' : selectedRadius <= 20 ? '#f97316' : '#ef4444', 
                                                        cursor: 'pointer',
                                                        height: '6px',
                                                        borderRadius: '3px',
                                                        background: 'rgba(0,0,0,0.08)',
                                                        margin: 0
                                                    }} 
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px', marginTop: '4px' }}>
                                                    {[1, 5, 10, 20, 30].map(r => (
                                                        <div key={r} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transform: r === 1 ? 'translateX(-5px)' : r === 30 ? 'translateX(5px)' : 'none' }} onClick={() => setSelectedRadius(r)}>
                                                            <div style={{ 
                                                                height: '6px', 
                                                                width: '2px', 
                                                                background: selectedRadius >= r ? (r <= 5 ? '#22c55e' : r <= 10 ? '#eab308' : r <= 20 ? '#f97316' : '#ef4444') : 'var(--text-muted)', 
                                                                marginBottom: '4px',
                                                                opacity: selectedRadius >= r ? 1 : 0.4,
                                                                transition: 'background 0.3s, opacity 0.3s'
                                                            }}></div>
                                                            <span style={{ 
                                                                fontSize: '0.7rem', 
                                                                fontWeight: selectedRadius === r ? 900 : 700, 
                                                                color: selectedRadius === r ? (r <= 5 ? '#22c55e' : r <= 10 ? '#eab308' : r <= 20 ? '#f97316' : '#ef4444') : 'var(--text-muted)',
                                                                transition: 'color 0.2s',
                                                                opacity: selectedRadius === r ? 1 : 0.6
                                                            }}>
                                                                {r}km
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2. Search & Suggestion Section */}
                                        <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                                            <div className="search-capsule" style={{ width: '100%', marginBottom: '5px', boxSizing: 'border-box' }}>
                                                <Search size={16} color="var(--text-muted)" />
                                                <input
                                                    className="search-input"
                                                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem', color: 'var(--text-main)' }}
                                                    placeholder={language === 'id' ? 'Cari kota, provinsi, atau kecamatan...' : 'Search city, province, or district...'}
                                                    value={geoSearchQuery}
                                                    onChange={e => setGeoSearchQuery(e.target.value)}
                                                />
                                                {geoSearchQuery && (
                                                    <button onClick={() => setGeoSearchQuery("")} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }} type="button">
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            {/* Dropdown suggestions */}
                                            {geoSearchQuery.trim() && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '44px', left: 0, right: 0,
                                                    background: 'var(--bg-color)',
                                                    boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                                    borderRadius: '16px',
                                                    maxHeight: '180px',
                                                    overflowY: 'auto',
                                                    zIndex: 1000,
                                                    padding: '6px',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    boxSizing: 'border-box'
                                                }}>
                                                    {(() => {
                                                        const results = getGeoSearchResults(geoSearchQuery);
                                                        if (results.length === 0) {
                                                            return (
                                                                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                                    {language === 'id' ? 'Tidak ada hasil ditemukan' : 'No results found'}
                                                                </div>
                                                            );
                                                        }
                                                        return results.map((res, i) => (
                                                            <div
                                                                key={i}
                                                                onClick={() => handleSelectSearchResult(res)}
                                                                style={{
                                                                    padding: '8px 12px',
                                                                    borderRadius: '10px',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: '3px',
                                                                    transition: 'background 0.2s',
                                                                    boxSizing: 'border-box'
                                                                }}
                                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(238, 77, 45, 0.08)'}
                                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                            >
                                                                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    {res.name}
                                                                    <span style={{ fontSize: '0.65rem', color: 'var(--orange)', background: 'rgba(238,77,45,0.1)', padding: '1px 6px', borderRadius: '10px' }}>
                                                                        {res.type}
                                                                    </span>
                                                                </div>
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                                    {res.path.join(" ➔ ")}
                                                                </span>
                                                            </div>
                                                        ));
                                                    })()}
                                                </div>
                                            )}
                                        </div>

                                        {/* 3. Interactive Breadcrumbs */}
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '6px', 
                                            flexWrap: 'wrap', 
                                            fontSize: '0.78rem', 
                                            fontWeight: 800,
                                            color: 'var(--text-muted)',
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            background: 'var(--bg-color)',
                                            boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}>
                                            <span 
                                                onClick={() => {
                                                    setSelectedIsland("");
                                                    setSelectedProvince("");
                                                    setSelectedCity("");
                                                    setSelectedDistrict("");
                                                    setActiveAlphabet("");
                                                }} 
                                                style={{ cursor: 'pointer', color: !selectedIsland ? 'var(--orange)' : 'var(--text-main)' }}
                                            >
                                                Indonesia
                                            </span>
                                            {selectedIsland && (
                                                <>
                                                    <span>➔</span>
                                                    <span 
                                                        onClick={() => {
                                                            setSelectedProvince("");
                                                            setSelectedCity("");
                                                            setSelectedDistrict("");
                                                            setActiveAlphabet("");
                                                        }}
                                                        style={{ cursor: 'pointer', color: !selectedProvince ? 'var(--orange)' : 'var(--text-main)' }}
                                                    >
                                                        {selectedIsland}
                                                    </span>
                                                </>
                                            )}
                                            {selectedProvince && (
                                                <>
                                                    <span>➔</span>
                                                    <span 
                                                        onClick={() => {
                                                            setSelectedCity("");
                                                            setSelectedDistrict("");
                                                            setActiveAlphabet("");
                                                        }}
                                                        style={{ cursor: 'pointer', color: !selectedCity ? 'var(--orange)' : 'var(--text-main)' }}
                                                    >
                                                        {selectedProvince}
                                                    </span>
                                                </>
                                            )}
                                            {selectedCity && (
                                                <>
                                                    <span>➔</span>
                                                    <span 
                                                        onClick={() => {
                                                            setSelectedDistrict("");
                                                            setActiveAlphabet("");
                                                        }}
                                                        style={{ cursor: 'pointer', color: !selectedDistrict ? 'var(--orange)' : 'var(--text-main)' }}
                                                    >
                                                        {selectedCity}
                                                    </span>
                                                </>
                                            )}
                                            {selectedDistrict && (
                                                <>
                                                    <span>➔</span>
                                                    <span style={{ color: 'var(--orange)' }}>
                                                        {selectedDistrict}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* 4. Alphabet filter grid scroller */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '4px',
                                            flexWrap: 'wrap',
                                            justifyContent: 'center',
                                            padding: '8px 2px',
                                            width: '100%',
                                            borderBottom: '1px solid rgba(0,0,0,0.06)',
                                            boxSizing: 'border-box'
                                        }}>
                                            {["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"].map(letter => {
                                                const isActive = activeAlphabet === letter;
                                                return (
                                                    <button
                                                        key={letter}
                                                        onClick={() => setActiveAlphabet(isActive ? "" : letter)}
                                                        style={{
                                                            border: 'none',
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                            cursor: 'pointer',
                                                            fontWeight: 800,
                                                            fontSize: '0.7rem',
                                                            background: isActive ? 'var(--orange)' : 'var(--bg-color)',
                                                            color: isActive ? 'white' : 'var(--text-muted)',
                                                            boxShadow: isActive ? '0 3px 6px rgba(238,77,45,0.25)' : 'var(--shadow-light), var(--shadow-dark)',
                                                            transition: 'all 0.2s ease',
                                                            boxSizing: 'border-box'
                                                        }}
                                                        type="button"
                                                    >
                                                        {letter}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* 5. Drilling Grid view */}
                                        <div style={{ width: '100%', boxSizing: 'border-box' }}>
                                            {(() => {
                                                let options = [];
                                                let levelTitle = "";
                                                let onSelect = () => {};

                                                if (!selectedIsland) {
                                                    options = Object.keys(NESTED_REGIONS);
                                                    levelTitle = language === 'id' ? 'Pilih Pulau / Kepulauan' : 'Select Island / Region';
                                                    onSelect = (island) => {
                                                        setSelectedIsland(island);
                                                        setActiveAlphabet("");
                                                    };
                                                } else if (!selectedProvince) {
                                                    options = Object.keys(NESTED_REGIONS[selectedIsland]);
                                                    levelTitle = language === 'id' ? `Pilih Provinsi di ${selectedIsland}` : `Select Province in ${selectedIsland}`;
                                                    onSelect = (prov) => {
                                                        setSelectedProvince(prov);
                                                        setActiveAlphabet("");
                                                    };
                                                } else if (!selectedCity) {
                                                    options = Object.keys(NESTED_REGIONS[selectedIsland][selectedProvince]);
                                                    levelTitle = language === 'id' ? `Pilih Kota/Kabupaten di ${selectedProvince}` : `Select City/Regency in ${selectedProvince}`;
                                                    onSelect = (city) => {
                                                        setSelectedCity(city);
                                                        setInputLocation(city);
                                                        setActiveAlphabet("");
                                                    };
                                                } else if (!selectedDistrict) {
                                                    options = NESTED_REGIONS[selectedIsland][selectedProvince][selectedCity];
                                                    levelTitle = language === 'id' ? `Pilih Kecamatan di ${selectedCity}` : `Select Sub-district in ${selectedCity}`;
                                                    onSelect = (dist) => {
                                                        setSelectedDistrict(dist);
                                                        setInputLocation(`${dist}, ${selectedCity}`);
                                                        setActiveAlphabet("");
                                                    };
                                                }

                                                // Filter by active alphabet scroller
                                                if (activeAlphabet) {
                                                    options = options.filter(opt => opt.toUpperCase().startsWith(activeAlphabet));
                                                }

                                                // If complete
                                                if (selectedDistrict) {
                                                    return (
                                                        <div style={{ 
                                                            textAlign: 'center', 
                                                            padding: '20px 15px', 
                                                            borderRadius: '20px', 
                                                            background: 'rgba(238, 77, 45, 0.03)',
                                                            border: '2px dashed rgba(238, 77, 45, 0.15)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            boxSizing: 'border-box',
                                                            width: '100%'
                                                        }}>
                                                            <div style={{
                                                                width: '46px',
                                                                height: '46px',
                                                                borderRadius: '50%',
                                                                background: 'rgba(238, 77, 45, 0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                                                color: 'var(--orange)'
                                                            }}>
                                                                <MapPin size={22} />
                                                            </div>
                                                            <div>
                                                                <h5 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 3px 0' }}>
                                                                    {language === 'id' ? 'Lokasi Terpilih!' : 'Location Selected!'}
                                                                </h5>
                                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, fontWeight: 700 }}>
                                                                    {selectedDistrict}, {selectedCity}, {selectedProvince}, {selectedIsland}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedDistrict("");
                                                                    setInputLocation(selectedCity);
                                                                }}
                                                                style={{
                                                                    border: 'none',
                                                                    background: 'rgba(238, 77, 45, 0.08)',
                                                                    color: 'var(--orange)',
                                                                    padding: '5px 12px',
                                                                    borderRadius: '20px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 800,
                                                                    cursor: 'pointer'
                                                                }}
                                                                type="button"
                                                            >
                                                                {language === 'id' ? 'Ubah Kecamatan' : 'Change Sub-district'}
                                                            </button>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div style={{ width: '100%', boxSizing: 'border-box' }}>
                                                        <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                                                            {levelTitle} {activeAlphabet && `(Abjad "${activeAlphabet}")`}
                                                        </h4>
                                                        {options.length === 0 ? (
                                                            <div style={{ padding: '25px 15px', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                                                                {language === 'id' ? `Tidak ada lokasi dengan huruf awal "${activeAlphabet}"` : `No locations with starting letter "${activeAlphabet}"`}
                                                            </div>
                                                        ) : (
                                                            <div style={{
                                                                display: 'grid',
                                                                gridTemplateColumns: !selectedIsland ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                                                                gap: '10px',
                                                                maxHeight: '180px',
                                                                overflowY: 'auto',
                                                                padding: '10px 8px',
                                                                borderRadius: '16px',
                                                                background: 'var(--bg-color)',
                                                                boxShadow: 'var(--shadow-inset-light), var(--shadow-inset-dark)',
                                                                width: '100%',
                                                                boxSizing: 'border-box'
                                                            }}>
                                                                {options.map((opt) => {
                                                                    const isIslandLevel = !selectedIsland;
                                                                    const isLastIsland = isIslandLevel && opt === "Bali & Nusa Tenggara";
                                                                    const islandGradients = {
                                                                        "Jawa": 'linear-gradient(135deg, rgba(238,77,45,0.08) 0%, rgba(238,77,45,0.02) 100%)',
                                                                        "Sumatera": 'linear-gradient(135deg, rgba(76,175,80,0.08) 0%, rgba(76,175,80,0.02) 100%)',
                                                                        "Kalimantan": 'linear-gradient(135deg, rgba(33,150,243,0.08) 0%, rgba(33,150,243,0.02) 100%)',
                                                                        "Sulawesi": 'linear-gradient(135deg, rgba(156,39,176,0.08) 0%, rgba(156,39,176,0.02) 100%)',
                                                                        "Bali & Nusa Tenggara": 'linear-gradient(135deg, rgba(255,193,7,0.08) 0%, rgba(255,193,7,0.02) 100%)'
                                                                    };

                                                                    return (
                                                                        <button
                                                                            key={opt}
                                                                            onClick={() => onSelect(opt)}
                                                                            style={{
                                                                                border: 'none',
                                                                                padding: isIslandLevel ? '14px 10px' : '8px 8px',
                                                                                borderRadius: '16px',
                                                                                cursor: 'pointer',
                                                                                fontSize: isIslandLevel ? '0.85rem' : '0.78rem',
                                                                                fontWeight: 800,
                                                                                background: isIslandLevel ? (islandGradients[opt] || 'var(--bg-color)') : 'var(--bg-color)',
                                                                                boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                                                                color: 'var(--text-main)',
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                gap: '4px',
                                                                                transition: 'transform 0.2s',
                                                                                width: '100%',
                                                                                boxSizing: 'border-box',
                                                                                gridColumn: isLastIsland ? 'span 2' : 'auto'
                                                                            }}
                                                                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                                                                            type="button"
                                                                        >
                                                                            {isIslandLevel && (
                                                                                <div style={{
                                                                                    width: '28px', height: '28px', borderRadius: '50%',
                                                                                    background: 'var(--bg-color)', display: 'flex', alignItems: 'center',
                                                                                    justifyContent: 'center', boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                                                                    color: 'var(--orange)', marginBottom: '2px'
                                                                                }}>
                                                                                    <MapPin size={14} />
                                                                                </div>
                                                                            )}
                                                                            <span style={{ textAlign: 'center' }}>{opt}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Modal Footer Actions */}
                                    <div style={{ width: '100%', boxSizing: 'border-box' }}>
                                        <button
                                            className="nav-pill active"
                                            style={{ width: '100%', padding: '18px', border: 'none', fontSize: '1.1rem', marginTop: '10px' }}
                                            onClick={() => {
                                                setShowMapFiltersModal(false);
                                                showToast(language === 'id' ? 'Lokasi berhasil diperbarui!' : 'Location successfully updated!');
                                            }}
                                            type="button"
                                        >
                                            {t('modalApply')}
                                        </button>
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
                            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px' }}>SISAIN</span>
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
                            <li onClick={() => setActiveTab('help')}>{t('footerFaq')}</li>
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
                                Lampung, Indonesia
                            </span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>{t('footerCopy')}</p>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <span className="social-icon" title="Instagram"><Instagram size={18} /></span>
                        <span className="social-icon" title="Facebook"><Facebook size={18} /></span>
                        <span className="social-icon" title="X (Twitter)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </span>
                        <span className="social-icon" title="TikTok">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.17 1.73.28 2.61.3v3.94c-.78-.07-1.57-.27-2.31-.59-.73-.31-1.4-.77-1.95-1.34v7.41c.02 1.4-.33 2.79-1.01 4.02-.68 1.23-1.7 2.21-2.92 2.82-1.22.61-2.6.85-3.96.67-1.35-.17-2.61-.81-3.6-1.81-1.02-1.02-1.66-2.37-1.81-3.79-.15-1.42.14-2.85.83-4.08.68-1.22 1.73-2.18 2.98-2.73 1.24-.56 2.63-.7 3.96-.4v4.06c-.75-.24-1.56-.21-2.3.08-.74.29-1.37.82-1.78 1.5-.41.68-.57 1.48-.46 2.27.11.79.52 1.51 1.14 2.03.62.52 1.41.81 2.23.82.81.01 1.6-.26 2.21-.76.61-.51.98-1.24 1.05-2.02.04-.63.02-1.26.02-1.89V0h.02z"/>
                            </svg>
                        </span>
                        <span className="social-icon" title="YouTube"><Youtube size={18} /></span>
                        <span className="social-icon" title="LinkedIn"><Linkedin size={18} /></span>
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
                                    {cat === "Roti" && <Croissant size={24} />}
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
                            <div className="filter-grid">
                                <div 
                                    className={`sort-item ${filters.shelfLife === 'all' ? 'active' : ''}`} 
                                    onClick={() => setFilters({ ...filters, shelfLife: 'all' })}
                                >
                                    {t('modalAll')}
                                </div>
                                <div 
                                    className={`sort-item ${filters.shelfLife === 'today' ? 'active' : ''}`} 
                                    onClick={() => setFilters({ ...filters, shelfLife: 'today' })}
                                >
                                    {t('modalToday')}
                                </div>
                                <div 
                                    className={`sort-item ${filters.shelfLife === 'tomorrow' ? 'active' : ''}`} 
                                    onClick={() => setFilters({ ...filters, shelfLife: 'tomorrow' })}
                                >
                                    {t('modalTomorrow')}
                                </div>
                                <div 
                                    className={`sort-item ${filters.shelfLife === '7days' ? 'active' : ''}`} 
                                    onClick={() => setFilters({ ...filters, shelfLife: '7days' })}
                                >
                                    {t('modal7Days')}
                                </div>
                            </div>
                        </div>

                        <div className="filter-section-modal" style={{ marginTop: '25px' }}>
                            <h4>{t('modalCreatedTime')}</h4>
                            <div className="filter-grid">
                                <div 
                                    className={`sort-item ${filters.createdTime === 'all' ? 'active' : ''}`} 
                                    onClick={() => setFilters({ ...filters, createdTime: 'all' })}
                                >
                                    {t('modalCreatedAll')}
                                </div>
                                <div 
                                    className={`sort-item ${filters.createdTime === '1h' ? 'active' : ''}`} 
                                    onClick={() => setFilters({ ...filters, createdTime: '1h' })}
                                >
                                    {t('modalCreated1h')}
                                </div>
                                <div 
                                    className={`sort-item ${filters.createdTime === '24h' ? 'active' : ''}`} 
                                    onClick={() => setFilters({ ...filters, createdTime: '24h' })}
                                >
                                    {t('modalCreated24h')}
                                </div>
                                <div 
                                    className={`sort-item ${filters.createdTime === '7d' ? 'active' : ''}`} 
                                    onClick={() => setFilters({ ...filters, createdTime: '7d' })}
                                >
                                    {t('modalCreated7d')}
                                </div>
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

                            {/* Neumorphic Product Details Grid */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(2, 1fr)', 
                                gap: '15px', 
                                marginBottom: '25px',
                                marginTop: '10px'
                            }}>
                                {/* Ketahanan / Expiry Badge */}
                                <div style={{ 
                                    background: 'var(--bg-color)', 
                                    padding: '12px 15px', 
                                    borderRadius: '16px', 
                                    boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px' 
                                }}>
                                    <Clock size={20} color="var(--orange)" />
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                                            {language === 'id' ? 'Ketahanan' : 'Shelf Life'}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                            {selectedProduct.shelfLife === 'today' && t('modalToday')}
                                            {selectedProduct.shelfLife === 'tomorrow' && t('modalTomorrow')}
                                            {selectedProduct.shelfLife === '7days' && t('modal7Days')}
                                            {!['today', 'tomorrow', '7days'].includes(selectedProduct.shelfLife) && (selectedProduct.shelfLife || t('modalToday'))}
                                        </div>
                                    </div>
                                </div>

                                {/* Waktu Unggah / Created Time Badge */}
                                <div style={{ 
                                    background: 'var(--bg-color)', 
                                    padding: '12px 15px', 
                                    borderRadius: '16px', 
                                    boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px' 
                                }}>
                                    <CalendarClock size={20} color="var(--orange)" />
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                                            {language === 'id' ? 'Diunggah' : 'Uploaded'}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                            {(() => {
                                                const diff = Date.now() - (selectedProduct.createdAt || (Date.now() - 3600 * 1000));
                                                const mins = Math.floor(diff / 60000);
                                                const hours = Math.floor(diff / 3600000);
                                                const days = Math.floor(diff / 86400000);
                                                if (language === 'id') {
                                                    if (mins < 60) return `${Math.max(1, mins)} Menit Lalu`;
                                                    if (hours < 24) return `${hours} Jam Lalu`;
                                                    return `${days} Hari Lalu`;
                                                } else {
                                                    if (mins < 60) return `${Math.max(1, mins)} mins ago`;
                                                    if (hours < 24) return `${hours} hrs ago`;
                                                    return `${days} days ago`;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Jarak Badge */}
                                <div style={{ 
                                    background: 'var(--bg-color)', 
                                    padding: '12px 15px', 
                                    borderRadius: '16px', 
                                    boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px' 
                                }}>
                                    <MapPin size={20} color="var(--orange)" />
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                                            {language === 'id' ? 'Jarak' : 'Distance'}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                            {selectedProduct.distance || '0.0 km'}
                                        </div>
                                    </div>
                                </div>

                                {/* Stok Badge */}
                                <div style={{ 
                                    background: 'var(--bg-color)', 
                                    padding: '12px 15px', 
                                    borderRadius: '16px', 
                                    boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px' 
                                }}>
                                    <Package size={20} color="var(--orange)" />
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                                            {language === 'id' ? 'Stok' : 'Stock'}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                            {selectedProduct.stock || 0} porsi
                                        </div>
                                    </div>
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
