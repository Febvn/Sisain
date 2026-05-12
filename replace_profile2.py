with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "                {activeTab === 'profile'"
end_marker = "                {activeTab === 'merchant'"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print('MARKERS NOT FOUND')
else:
    new_profile = """                {activeTab === 'profile' && (
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
                                            <span style={{background: 'rgba(0,200,100,0.1)', color: '#00c864', padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                <ShieldCheck size={10} /> Terverifikasi
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
                                    <div style={{width: '36px', height: '36px', background: '#ffc107', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,193,7,0.3)'}}>
                                        <Star size={18} color="white" fill="white" />
                                    </div>
                                    <span style={{fontSize: '0.8rem', fontWeight: 800}}>Koin Sisain</span>
                                </div>
                                <div>
                                    <p style={{fontSize: '1.2rem', fontWeight: 900, color: '#ffc107'}}>420</p>
                                    <p style={{fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px'}}>Bisa Dipakai</p>
                                </div>
                            </div>

                            {/* === 3. RIWAYAT PESANAN (Bento Span 12) === */}
                            <div className="card-neumorph bento-item" style={{gridColumn: 'span 12', padding: '20px', textAlign: 'left'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                    <h3 style={{fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <Package size={18} color="var(--orange)" /> Pesanan Saya
                                    </h3>
                                    <span style={{fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center'}}>Lihat Semua <ChevronRight size={14} /></span>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    {[
                                        { icon: <CreditCard size={22} strokeWidth={1.5} />, label: 'Belum Bayar', count: 1 },
                                        { icon: <Package size={22} strokeWidth={1.5} />, label: 'Dikemas', count: 0 },
                                        { icon: <Truck size={22} strokeWidth={1.5} />, label: 'Dikirim', count: 2 },
                                        { icon: <CheckCircle2 size={22} strokeWidth={1.5} />, label: 'Selesai', count: 8 },
                                        { icon: <RotateCcw size={22} strokeWidth={1.5} />, label: 'Retur', count: 0 },
                                    ].map(item => (
                                        <div key={item.label} className="hover-scale" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '20%', position: 'relative'}}>
                                            <div style={{color: 'var(--text-main)', transition: 'var(--transition-smooth)'}} className="order-icon-wrapper">
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
                                <div style={{width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Heart size={20} color="#ec4899" />
                                </div>
                                <div style={{textAlign: 'left'}}>
                                    <p style={{fontWeight: 800, fontSize: '0.8rem'}}>Wishlist</p>
                                    <p style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>12 Produk</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
                                <div style={{width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Store size={20} color="#3b82f6" />
                                </div>
                                <div style={{textAlign: 'left'}}>
                                    <p style={{fontWeight: 800, fontSize: '0.8rem'}}>Toko Favorit</p>
                                    <p style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>5 Toko</p>
                                </div>
                            </div>

                            <div className="card-neumorph bento-item hover-float" style={{gridColumn: 'span 6', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
                                <div style={{width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Star size={20} color="#10b981" />
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
                                        { icon: <Leaf size={20} color="#10b981" />, value: '12.5 kg', label: 'CO\u2082 Dicegah', bg: 'rgba(16,185,129,0.1)' },
                                        { icon: <Droplets size={20} color="#3b82f6" />, value: '340 L', label: 'Air Dihemat', bg: 'rgba(59,130,246,0.1)' },
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
                                        { icon: <Award size={24} color="#cd7f32" />, label: 'Perunggu', unlocked: true },
                                        { icon: <Leaf size={24} color="#10b981" />, label: 'Eco Hero', unlocked: true },
                                        { icon: <Zap size={24} color="#ffc107" />, label: 'Cepat Beli', unlocked: true },
                                        { icon: <Medal size={24} color="#94a3b8" />, label: 'Perak', unlocked: false },
                                        { icon: <Crown size={24} color="#fbbf24" />, label: 'Emas', unlocked: false },
                                        { icon: <Heart size={24} color="#ec4899" />, label: 'Setia', unlocked: false },
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
"""
    
    new_content = content[:start_idx] + new_profile + content[end_idx:]
    with open('src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS')
