-- =====================================================
-- SISAIN Database Schema for Supabase
-- =====================================================
-- Jalankan script ini di Supabase SQL Editor
-- untuk membuat tabel profiles dan konfigurasi RLS

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'merchant')),
    phone TEXT,
    
    -- Customer specific fields
    birth_date DATE,
    city TEXT,
    referral_code TEXT,
    
    -- Merchant specific fields
    business_name TEXT,
    category TEXT,
    address TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Anyone can insert their profile (during registration)
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 4. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- =====================================================
-- OPTIONAL: Create products table for merchants
-- =====================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    current_price INTEGER NOT NULL,
    old_price INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    img TEXT,
    shelf_life TEXT CHECK (shelf_life IN ('today', 'tomorrow', '7days')),
    rating DECIMAL(2,1) DEFAULT 5.0,
    distance TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Anyone can view products"
    ON public.products
    FOR SELECT
    USING (true);

CREATE POLICY "Merchants can insert own products"
    ON public.products
    FOR INSERT
    WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own products"
    ON public.products
    FOR UPDATE
    USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can delete own products"
    ON public.products
    FOR DELETE
    USING (auth.uid() = merchant_id);

-- Trigger for products updated_at
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for products
CREATE INDEX IF NOT EXISTS products_merchant_id_idx ON public.products(merchant_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);

-- =====================================================
-- OPTIONAL: Create orders table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
    ON public.orders
    FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items"
    ON public.order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.customer_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own order items"
    ON public.order_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.customer_id = auth.uid()
        )
    );

-- Triggers for orders
CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for orders
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- Schema created successfully!
-- Next steps:
-- 1. Copy your Supabase URL and Anon Key
-- 2. Add them to .env file:
--    VITE_SUPABASE_URL=your-project-url
--    VITE_SUPABASE_ANON_KEY=your-anon-key
-- 3. Test registration and login
