import re

# Read the file
with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove supabase import
content = re.sub(r"import \{ supabase \} from './lib/supabaseClient';?\n?", '', content)

# Replace auth loading state
content = content.replace('const [authLoading, setAuthLoading] = useState(true);', 
                         'const [authLoading, setAuthLoading] = useState(false);')

# Create simple hardcoded auth functions
auth_functions = '''
    // --- Auth Effects & Handlers (Hardcoded - No Backend) ---
    useEffect(() => {
        // No backend check needed
        setAuthLoading(false);
    }, []);

    const handleRegisterMerchant = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const ownerName = formData.get('ownerName');

        if (password !== confirmPassword) {
            showToast('Password tidak cocok!');
            return;
        }

        if (password.length < 8) {
            showToast('Password minimal 8 karakter!');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            email,
            full_name: ownerName,
            role: 'merchant',
            business_name: ownerName + "'s Business",
            phone: '',
            category: 'Lainnya',
            address: ''
        };

        setUser(newUser);
        setUserProfile(newUser);
        showToast('Pendaftaran berhasil! Selamat bergabung sebagai merchant 🎉');
        setIsRegisterModalOpen(false);
        setActiveTab('merchant');
        setIsMerchantLoggedIn(true);
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

        const newUser = {
            id: Date.now().toString(),
            email,
            full_name: fullName,
            username,
            role: 'customer',
            phone,
            birth_date: birthDate,
            city,
            referral_code: referralCode
        };

        setUser(newUser);
        setUserProfile(newUser);
        showToast('Pendaftaran berhasil! Selamat bergabung 🎉');
        setIsRegisterModalOpen(false);
        setActiveTab('explore');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        if (email.includes('merchant')) {
            const merchantUser = {
                id: 'merchant-demo',
                email,
                full_name: 'Demo Merchant',
                role: 'merchant',
                business_name: 'Warung Demo',
                phone: '081234567890',
                category: 'Siap Saji',
                address: 'Jl. Demo No. 123'
            };
            setUser(merchantUser);
            setUserProfile(merchantUser);
            setIsMerchantLoggedIn(true);
            setActiveTab('merchant');
            showToast('Login berhasil! Selamat datang kembali 👋');
        } else {
            const customerUser = {
                id: 'customer-demo',
                email,
                full_name: 'Demo Customer',
                username: 'democustomer',
                role: 'customer',
                phone: '081234567890',
                city: 'Bandar Lampung'
            };
            setUser(customerUser);
            setUserProfile(customerUser);
            setActiveTab('explore');
            showToast('Login berhasil! Selamat datang kembali 👋');
        }
        
        setIsLoginModalOpen(false);
    };

    const handleLogout = async () => {
        setUser(null);
        setUserProfile(null);
        setIsMerchantLoggedIn(false);
        setActiveTab('home');
        showToast('Logout berhasil. Sampai jumpa! 👋');
    };

    const handleGoogleLogin = async (type) => {
        showToast('Login dengan Google (Demo Mode)');
        
        if (type === 'merchant') {
            const merchantUser = {
                id: 'google-merchant-demo',
                email: 'merchant@gmail.com',
                full_name: 'Google Merchant Demo',
                role: 'merchant',
                business_name: 'Google Warung',
                phone: '081234567890',
                category: 'Siap Saji',
                address: 'Jl. Google No. 123'
            };
            setUser(merchantUser);
            setUserProfile(merchantUser);
            setIsMerchantLoggedIn(true);
            setActiveTab('merchant');
        } else {
            const customerUser = {
                id: 'google-customer-demo',
                email: 'customer@gmail.com',
                full_name: 'Google Customer Demo',
                username: 'googlecustomer',
                role: 'customer',
                phone: '081234567890',
                city: 'Bandar Lampung'
            };
            setUser(customerUser);
            setUserProfile(customerUser);
            setActiveTab('explore');
        }
        
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(false);
    };

    const handleCompleteProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (completeProfileType === 'merchant') {
            const businessName = formData.get('businessName');
            const category = formData.get('category');
            const address = formData.get('address');
            const phone = formData.get('phone');

            setUserProfile({
                ...userProfile,
                business_name: businessName,
                category,
                address,
                phone,
                role: 'merchant'
            });

            showToast('Profil merchant berhasil dilengkapi!');
            setIsCompleteProfileModalOpen(false);
            setActiveTab('merchant');
        } else {
            const username = formData.get('username');
            const birthDate = formData.get('birthDate');
            const city = formData.get('city');
            const phone = formData.get('phone');

            setUserProfile({
                ...userProfile,
                username,
                birth_date: birthDate,
                city,
                phone,
                role: 'customer'
            });

            showToast('Profil pelanggan berhasil dilengkapi!');
            setIsCompleteProfileModalOpen(false);
            setActiveTab('explore');
        }
    };
'''

# Find and replace the auth section
# Pattern to match from "// --- Auth Effects" to the end of handleCompleteProfile
pattern = r'// --- Auth Effects & Handlers ---.*?const handleCompleteProfile = async \(e\) => \{.*?\n    \};'
content = re.sub(pattern, auth_functions.strip(), content, flags=re.DOTALL)

# Write back
with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Supabase references removed successfully!")
print("✅ Hardcoded auth functions added!")
