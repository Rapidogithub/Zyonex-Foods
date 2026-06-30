-- Traffic Jam Restaurant SQL Schema
-- Paste this script into your Supabase SQL Editor (https://supabase.com) to initialize your database.

-- 1. Enable UUID generation extension
create extension if not exists "uuid-ossp";

-- 2. Drop existing tables if they exist (for clean setup)
drop table if exists feedback cascade;
drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists foods cascade;
drop table if exists categories cascade;
drop table if exists users cascade;

-- 3. Create Categories table
create table categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    icon text, -- e.g., '🍕', '🍔', '🍜' or ionicon name
    image text,
    created_at timestamptz default now()
);

-- 4. Create Foods table
create table foods (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    price numeric not null check (price >= 0),
    category_id uuid references categories(id) on delete set null,
    image text, -- Image URL
    popular boolean default false,
    special boolean default false,
    recommended boolean default false,
    available boolean default true,
    created_at timestamptz default now()
);

-- 5. Create Orders table
create table orders (
    id uuid primary key default uuid_generate_v4(),
    customer_name text not null,
    phone text,
    table_number text not null,
    order_type text not null default 'dining' check (order_type in ('dining', 'takeaway')),
    status text not null default 'received' check (status in ('received', 'preparing', 'ready', 'delivered', 'cancelled')),
    total numeric not null check (total >= 0),
    special_instructions text,
    created_at timestamptz default now()
);

-- 6. Create Order Items table
create table order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    food_id uuid references foods(id) on delete set null,
    quantity integer not null check (quantity > 0),
    price numeric not null check (price >= 0),
    subtotal numeric not null check (subtotal >= 0)
);

-- 7. Create Feedback table
create table feedback (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    rating integer not null check (rating >= 1 and rating <= 5),
    review text,
    created_at timestamptz default now()
);

-- 8. Create Users table (CRM and Admin details)
create table users (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    phone text,
    role text not null default 'staff' check (role in ('admin', 'staff')),
    created_at timestamptz default now()
);

-- 9. Enable Row Level Security (RLS)
alter table categories enable row level security;
alter table foods enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table feedback enable row level security;
alter table users enable row level security;

-- 10. Create RLS Policies

-- Categories Policies
create policy "Allow public read access to categories" on categories
    for select using (true);

create policy "Allow admin full access to categories" on categories
    using (auth.role() = 'authenticated');

-- Foods Policies
create policy "Allow public read access to foods" on foods
    for select using (true);

create policy "Allow admin full access to foods" on foods
    using (auth.role() = 'authenticated');

-- Orders Policies
create policy "Allow public to insert orders" on orders
    for insert with check (true);

create policy "Allow public to read orders" on orders
    for select using (true); -- Clients track their own orders by ID

create policy "Allow admin full access to orders" on orders
    using (auth.role() = 'authenticated');

-- Order Items Policies
create policy "Allow public to insert order items" on order_items
    for insert with check (true);

create policy "Allow public to read order items" on order_items
    for select using (true);

create policy "Allow admin full access to order items" on order_items
    using (auth.role() = 'authenticated');

-- Feedback Policies
create policy "Allow public to insert feedback" on feedback
    for insert with check (true);

create policy "Allow public to read feedback" on feedback
    for select using (true);

create policy "Allow admin full access to feedback" on feedback
    using (auth.role() = 'authenticated');

-- Users Policies
create policy "Allow admin and staff read access to users" on users
    for select using (auth.role() = 'authenticated');

create policy "Allow admin to update users" on users
    for update using (auth.role() = 'authenticated');

-- 11. Create function to automatically handle new user signup and insert it into public.users table
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, phone, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Staff Member'), new.phone, 'staff');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 12. Enable Supabase Realtime for live order updates
-- Add tables to the supabase_realtime publication
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table feedback;

-- 11. Seed initial Category Data
insert into categories (name, icon, image) values
('Pizza', '🍕', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60'),
('Burger', '🍔', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60'),
('Chinese', '🍜', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60'),
('Biryani', '🍛', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60'),
('Rolls', '🌯', 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=500&auto=format&fit=crop&q=60'),
('Dessert', '🍰', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60'),
('Cold Drinks', '🥤', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60'),
('Coffee', '☕', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60'),
('Mocktails', '🍸', 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=60');

-- 12. Seed initial Food Data
-- Let's query category IDs and insert corresponding foods
do $$
declare
    cat_pizza_id uuid;
    cat_burger_id uuid;
    cat_chinese_id uuid;
    cat_biryani_id uuid;
    cat_rolls_id uuid;
    cat_dessert_id uuid;
    cat_drinks_id uuid;
    cat_coffee_id uuid;
    cat_mocktail_id uuid;
begin
    select id into cat_pizza_id from categories where name = 'Pizza';
    select id into cat_burger_id from categories where name = 'Burger';
    select id into cat_chinese_id from categories where name = 'Chinese';
    select id into cat_biryani_id from categories where name = 'Biryani';
    select id into cat_rolls_id from categories where name = 'Rolls';
    select id into cat_dessert_id from categories where name = 'Dessert';
    select id into cat_drinks_id from categories where name = 'Cold Drinks';
    select id into cat_coffee_id from categories where name = 'Coffee';
    select id into cat_mocktail_id from categories where name = 'Mocktails';

    -- Pizza
    insert into foods (name, description, price, category_id, image, popular, special, recommended) values
    ('Margherita Pizza', 'Classic tomato sauce, fresh mozzarella cheese, and basil leaves', 249, cat_pizza_id, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60', true, false, true),
    ('Traffic Jam Special Pizza', 'Signature double-crust pizza loaded with olives, jalapenos, mushrooms, double cheese, and spicy paneer/chicken', 399, cat_pizza_id, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60', true, true, true),
    ('Farmhouse Veg Pizza', 'Topped with crunchy onions, green capsicum, juicy tomatoes, and mushrooms', 299, cat_pizza_id, 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?w=500&auto=format&fit=crop&q=60', false, false, false);

    -- Burger
    insert into foods (name, description, price, category_id, image, popular, special, recommended) values
    ('Crispy Veg Burger', 'A crispy veg patty served with fresh lettuce, onions, and creamy mayo', 99, cat_burger_id, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', true, false, false),
    ('Ultimate Cheese Burger', 'Double patty burger stacked with melted cheddar cheese, sliced pickles, and signature house sauce', 189, cat_burger_id, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60', true, true, true);

    -- Chinese
    insert into foods (name, description, price, category_id, image, popular, special, recommended) values
    ('Schezwan Noodles', 'Spicy stir-fried noodles with crisp veggies and hot Schezwan sauce', 149, cat_chinese_id, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60', true, false, false),
    ('Paneer Chilli Dry', 'Crispy cottage cheese cubes tossed in spicy chilli, soy, and garlic sauce', 179, cat_chinese_id, 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&auto=format&fit=crop&q=60', false, false, true),
    ('Chicken Manchurian Gravy', 'Deep fried chicken balls in a rich, tangy Manchurian sauce', 199, cat_chinese_id, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60', false, true, false);

    -- Biryani
    insert into foods (name, description, price, category_id, image, popular, special, recommended) values
    ('Hyderabadi Veg Biryani', 'Aromatic basmati rice cooked with fresh vegetables and secret herbs, served with raita', 199, cat_biryani_id, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', true, false, true),
    ('Traffic Jam Special Chicken Biryani', 'Our flagship aromatic Dum Biryani layered with succulent marinated chicken and hard-boiled eggs', 279, cat_biryani_id, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60', true, true, true);

    -- Rolls
    insert into foods (name, description, price, category_id, image, popular, special, recommended) values
    ('Double Egg Roll', 'Golden wheat wrap lined with double eggs, crunchy onions, and a splash of tangy sauces', 79, cat_rolls_id, 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=500&auto=format&fit=crop&q=60', true, false, false),
    ('Masala Paneer Tikka Roll', 'Smoky grilled paneer cubes wrapped with fresh mint chutney and bell peppers', 129, cat_rolls_id, 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=60', false, false, true);

    -- Dessert
    insert into foods (name, description, price, category_id, image, popular, special, recommended) values
    ('Chocolate Brownie with Ice Cream', 'Warm, fudgy chocolate brownie topped with vanilla ice cream and hot chocolate fudge', 149, cat_dessert_id, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60', true, true, true),
    ('Sizzling Hot Fudge Cake', 'Rich chocolate cake served sizzling with a scoop of vanilla ice cream', 179, cat_dessert_id, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60', false, false, false);

    -- Drinks
    insert into foods (name, description, price, category_id, image, popular, special, recommended) values
    ('Coca Cola (Can)', '330ml chilled can of original Coca Cola', 40, cat_drinks_id, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60', false, false, false),
    ('Red Bull Energy Drink', '250ml can of Red Bull to charge up', 120, cat_drinks_id, 'https://images.unsplash.com/photo-1622543956221-c5210c576316?w=500&auto=format&fit=crop&q=60', true, false, false);

    -- Coffee
    insert into foods (name, description, price, category_id, image, popular, special, recommended) values
    ('Cafe Latte', 'Espresso shot with steamed milk and a light layer of foam', 119, cat_coffee_id, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', false, false, true),
    ('Hazelnut Frappe', 'Ice-cold blended coffee flavored with premium hazelnut syrup and whipped cream', 159, cat_coffee_id, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', true, true, false);

    -- Mocktails
    insert into foods (name, description, price, category_id, image, popular, special, recommended) values
    ('Classic Virgin Mojito', 'Refreshing blend of fresh lime juice, mint leaves, simple syrup, and sparkling soda', 109, cat_mocktail_id, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', true, false, true),
    ('Blue Lagoon Mocktail', 'A vibrant blue curacao syrup mocktail with lemonade and a dash of sprite', 129, cat_mocktail_id, 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=60', true, true, false);

end $$;
