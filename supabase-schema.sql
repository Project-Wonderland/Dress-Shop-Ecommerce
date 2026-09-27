-- ==============================================================================
-- MAISON ÉLÉGANCE - LUXURY DRESS E-COMMERCE SUPABASE SCHEMA & POLICIES
-- ==============================================================================

-- 1. EXTENSIONS & CLEANUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLES

-- User Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dresses Catalog Table
CREATE TABLE IF NOT EXISTS public.dresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    dress_id UUID NOT NULL REFERENCES public.dresses(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. HELPER FUNCTIONS & TRIGGERS

-- Function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to automatically insert new auth user into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, role)
    VALUES (new.id, 'user')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger attachment
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR public.users
-- Users can view their own profile, Admins can view all profiles
DROP POLICY IF EXISTS "Users can view own profile or admin views all" ON public.users;
CREATE POLICY "Users can view own profile or admin views all" ON public.users
    FOR SELECT USING (
        auth.uid() = id OR public.is_admin(auth.uid())
    );

-- POLICIES FOR public.dresses
-- Public read access for visitors & authenticated users
DROP POLICY IF EXISTS "Public read access for dresses" ON public.dresses;
CREATE POLICY "Public read access for dresses" ON public.dresses
    FOR SELECT USING (true);

-- Admin insert access
DROP POLICY IF EXISTS "Admins can insert dresses" ON public.dresses;
CREATE POLICY "Admins can insert dresses" ON public.dresses
    FOR INSERT WITH CHECK (
        public.is_admin(auth.uid())
    );

-- Admin update access
DROP POLICY IF EXISTS "Admins can update dresses" ON public.dresses;
CREATE POLICY "Admins can update dresses" ON public.dresses
    FOR UPDATE USING (
        public.is_admin(auth.uid())
    );

-- Admin delete access
DROP POLICY IF EXISTS "Admins can delete dresses" ON public.dresses;
CREATE POLICY "Admins can delete dresses" ON public.dresses
    FOR DELETE USING (
        public.is_admin(auth.uid())
    );

-- POLICIES FOR public.orders
-- Authenticated users can view their own orders; Admins can view all orders
DROP POLICY IF EXISTS "Users can view own orders or admin views all" ON public.orders;
CREATE POLICY "Users can view own orders or admin views all" ON public.orders
    FOR SELECT USING (
        auth.uid() = user_id OR public.is_admin(auth.uid())
    );

-- Authenticated users can insert their own orders
DROP POLICY IF EXISTS "Authenticated users can insert own orders" ON public.orders;
CREATE POLICY "Authenticated users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
    );

-- 5. STORAGE BUCKET CONFIGURATION & POLICIES

-- Create storage bucket 'dress-images' if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('dress-images', 'dress-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public Read Access
DROP POLICY IF EXISTS "Public read access for dress-images" ON storage.objects;
CREATE POLICY "Public read access for dress-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'dress-images');

-- Storage RLS: Admin Upload Access
DROP POLICY IF EXISTS "Admins can upload to dress-images" ON storage.objects;
CREATE POLICY "Admins can upload to dress-images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'dress-images' AND public.is_admin(auth.uid())
    );

-- Storage RLS: Admin Delete Access
DROP POLICY IF EXISTS "Admins can delete from dress-images" ON storage.objects;
CREATE POLICY "Admins can delete from dress-images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'dress-images' AND public.is_admin(auth.uid())
    );

-- 6. SEED DATA FOR HIGH-FASHION DRESS CATALOG

INSERT INTO public.dresses (name, type, price, image_url, stock)
VALUES
    (
        'Aurelia Gold Silk Evening Gown',
        'Haute Couture',
        2450.00,
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000',
        5
    ),
    (
        'Midnight Obsidian Velvet Gown',
        'Evening Gown',
        1890.00,
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
        8
    ),
    (
        'Champagne Satin Bias Cut Slip',
        'Silk Slip',
        780.00,
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000',
        12
    ),
    (
        'Ethereal Ivory Tulle Cocktail Dress',
        'Cocktail',
        1250.00,
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
        4
    ),
    (
        'Scarlet Royal Crepe Column Gown',
        'Evening Gown',
        2100.00,
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000',
        6
    ),
    (
        'Monochrome Sculptural Runway Dress',
        'Runway',
        3200.00,
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
        2
    )
ON CONFLICT DO NOTHING;
