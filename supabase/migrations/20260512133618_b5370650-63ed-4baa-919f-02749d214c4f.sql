
-- Enums
CREATE TYPE public.app_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE public.request_status AS ENUM ('open', 'awarded', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.bid_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE public.job_status AS ENUM ('confirmed', 'on_the_way', 'started', 'completed', 'cancelled');
CREATE TYPE public.provider_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Roles (separate table — security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Services catalog
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Providers
CREATE TABLE public.providers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  service_area TEXT,
  status provider_status NOT NULL DEFAULT 'pending',
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  jobs_completed INTEGER NOT NULL DEFAULT 0,
  wallet_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Provider <-> Services
CREATE TABLE public.provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  base_price NUMERIC(10,2),
  UNIQUE (provider_id, service_id)
);

-- Requests
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_size TEXT,
  rooms INTEGER,
  location TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  status request_status NOT NULL DEFAULT 'open',
  total_amount NUMERIC(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.request_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  awarded_bid_id UUID,
  job_status job_status,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.request_services(request_id);
CREATE INDEX ON public.request_services(service_id);

-- Bids
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_service_id UUID NOT NULL REFERENCES public.request_services(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  eta_hours INTEGER,
  notes TEXT,
  status bid_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (request_service_id, provider_id)
);
CREATE INDEX ON public.bids(request_service_id);
CREATE INDEX ON public.bids(provider_id);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.messages(request_id);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_service_id UUID NOT NULL REFERENCES public.request_services(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  quality INTEGER NOT NULL CHECK (quality BETWEEN 1 AND 5),
  timeliness INTEGER NOT NULL CHECK (timeliness BETWEEN 1 AND 5),
  professionalism INTEGER NOT NULL CHECK (professionalism BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (request_service_id, customer_id)
);

-- Disputes
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles: owners read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles: anyone read minimal" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: owners update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles: owners insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles
CREATE POLICY "Roles: self read" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Roles: self insert customer/provider" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id AND role IN ('customer','provider'));
CREATE POLICY "Roles: admin manage" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Services (public catalog)
CREATE POLICY "Services: public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Services: admin write" ON public.services FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Providers
CREATE POLICY "Providers: public read approved" ON public.providers FOR SELECT USING (status = 'approved' OR auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Providers: self insert" ON public.providers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Providers: self update" ON public.providers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Providers: admin update" ON public.providers FOR UPDATE USING (public.has_role(auth.uid(),'admin'));

-- Provider services
CREATE POLICY "ProviderServices: public read" ON public.provider_services FOR SELECT USING (true);
CREATE POLICY "ProviderServices: self manage" ON public.provider_services FOR ALL USING (auth.uid() = provider_id) WITH CHECK (auth.uid() = provider_id);

-- Requests
CREATE POLICY "Requests: customer read own" ON public.requests FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Requests: providers read open" ON public.requests FOR SELECT USING (public.has_role(auth.uid(),'provider'));
CREATE POLICY "Requests: admin read" ON public.requests FOR SELECT USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Requests: customer insert" ON public.requests FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Requests: customer update own" ON public.requests FOR UPDATE USING (auth.uid() = customer_id);

-- Request services
CREATE POLICY "ReqServices: customer read own" ON public.request_services FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.requests r WHERE r.id = request_id AND r.customer_id = auth.uid())
);
CREATE POLICY "ReqServices: providers read" ON public.request_services FOR SELECT USING (public.has_role(auth.uid(),'provider'));
CREATE POLICY "ReqServices: admin read" ON public.request_services FOR SELECT USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "ReqServices: customer insert" ON public.request_services FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.requests r WHERE r.id = request_id AND r.customer_id = auth.uid())
);
CREATE POLICY "ReqServices: customer update own" ON public.request_services FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.requests r WHERE r.id = request_id AND r.customer_id = auth.uid())
);
CREATE POLICY "ReqServices: provider update job" ON public.request_services FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.bids b WHERE b.id = awarded_bid_id AND b.provider_id = auth.uid()
  )
);

-- Bids
CREATE POLICY "Bids: customer read for own request" ON public.bids FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.request_services rs
    JOIN public.requests r ON r.id = rs.request_id
    WHERE rs.id = request_service_id AND r.customer_id = auth.uid()
  )
);
CREATE POLICY "Bids: provider read own" ON public.bids FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Bids: admin read" ON public.bids FOR SELECT USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Bids: provider insert" ON public.bids FOR INSERT WITH CHECK (auth.uid() = provider_id AND public.has_role(auth.uid(),'provider'));
CREATE POLICY "Bids: provider update own" ON public.bids FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Bids: customer update (accept/reject)" ON public.bids FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.request_services rs
    JOIN public.requests r ON r.id = rs.request_id
    WHERE rs.id = request_service_id AND r.customer_id = auth.uid()
  )
);

-- Messages
CREATE POLICY "Messages: read own" ON public.messages FOR SELECT USING (auth.uid() IN (sender_id, recipient_id));
CREATE POLICY "Messages: send" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews
CREATE POLICY "Reviews: public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews: customer insert own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Disputes
CREATE POLICY "Disputes: customer read own" ON public.disputes FOR SELECT USING (auth.uid() = customer_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Disputes: customer insert" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Disputes: admin update" ON public.disputes FOR UPDATE USING (public.has_role(auth.uid(),'admin'));

-- Auto-profile trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone');
  -- Default role: customer (unless provider/admin role added later)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'customer'))
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_providers_updated BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_requests_updated BEFORE UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_bids_updated BEFORE UPDATE ON public.bids FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_disputes_updated BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.request_services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Seed services
INSERT INTO public.services (name, description, icon) VALUES
  ('Painting', 'Wall painting, touch-ups, full repaints', 'paintbrush'),
  ('Deep Cleaning', 'Move-out deep clean of entire property', 'sparkles'),
  ('Handyman', 'Minor repairs, fixtures, small jobs', 'wrench'),
  ('Packing & Moving', 'Pack belongings and move them', 'package'),
  ('AC Servicing', 'AC cleaning and maintenance', 'wind'),
  ('Plumbing', 'Pipe, faucet, drain repairs', 'droplet'),
  ('Electrical', 'Wiring, fixtures, electrical repairs', 'zap'),
  ('Pest Control', 'Pest inspection and treatment', 'bug');
