
-- Users Table
-- Links to Supabase Auth and includes the new Email, Role, and Shipping Address fields
CREATE TABLE public.users (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    user_name TEXT,
    email TEXT,
    phone_number TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    shipping_address TEXT,
    created_on TIMESTAMPTZ DEFAULT NOW()
);

-- Items (Dresses) Table
-- Incorporates the stock and image fields, plus the new created_at timestamp
CREATE TABLE public.items (
    item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_name TEXT NOT NULL,
    item_details TEXT,
    itm_type TEXT NOT NULL,
    item_price NUMERIC(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
-- Tracks the macro-level transaction details
CREATE TABLE public.orders (
    order_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Details Table
-- Tracks the specific individual items and quantities within a single macro order
CREATE TABLE public.order_details (
    order_det_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(order_id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(item_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0
);

-- Cart Table
-- Linked to the user to persist shopping sessions
CREATE TABLE public.cart (
    cart_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(item_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1
);

-- Wish List Table
-- Maps saved items to specific users as a relational junction table
CREATE TABLE public.wishlist (
    wishlist_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(item_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);