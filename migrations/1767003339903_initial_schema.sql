CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'viewer' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  product_name text NOT NULL,
  product_code text NOT NULL UNIQUE,
  product_category text,
  unit text NOT NULL,
  critical_stock_level numeric NOT NULL,
  brand text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products (product_code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (product_category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products (created_by);

CREATE TABLE IF NOT EXISTS product_costs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  product_id uuid NOT NULL,
  month date NOT NULL,
  unit_cost numeric NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_product_costs_product_id ON product_costs (product_id);
CREATE INDEX IF NOT EXISTS idx_product_costs_month ON product_costs (month);
CREATE INDEX IF NOT EXISTS idx_product_costs_product_month ON product_costs (product_id, month);
CREATE INDEX IF NOT EXISTS idx_product_costs_created_by ON product_costs (created_by);

CREATE TABLE IF NOT EXISTS customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  customer_name text NOT NULL,
  customer_code text NOT NULL UNIQUE,
  address text,
  city_or_district text,
  sales_rep text,
  country text,
  region_or_state text,
  telephone_number text NOT NULL,
  email text,
  contact_person text,
  payment_terms_limit integer NOT NULL,
  balance_risk_limit numeric NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_customers_customer_code ON customers (customer_code);
CREATE INDEX IF NOT EXISTS idx_customers_sales_rep ON customers (sales_rep);
CREATE INDEX IF NOT EXISTS idx_customers_country ON customers (country);
CREATE INDEX IF NOT EXISTS idx_customers_region_or_state ON customers (region_or_state);
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON customers (created_by);