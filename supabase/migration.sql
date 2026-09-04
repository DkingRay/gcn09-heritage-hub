-- ============================================================
-- GCN 09 Heritage Hub — Full Database Setup
-- Run this in your Supabase SQL Editor (SQL > New query)
-- ============================================================

-- 1. ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'member');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE membership_status AS ENUM ('pending', 'active', 'suspended', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. TABLES
-- ============================================================

-- Members (core table — profile + membership data)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  gender TEXT,
  date_of_birth DATE,
  photo_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Nigeria',
  set_year TEXT DEFAULT '2009',
  house TEXT,
  class_department TEXT,
  year_joined TEXT,
  graduation_year TEXT,
  student_id TEXT,
  school_notes TEXT,
  employment_type TEXT DEFAULT 'Other',
  profession TEXT,
  job_title TEXT,
  organisation TEXT,
  industry TEXT,
  business_name TEXT,
  business_website TEXT,
  linkedin TEXT,
  professional_location TEXT,
  emergency_contact_name TEXT,
  emergency_contact_relationship TEXT,
  emergency_contact_phone TEXT,
  interests TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  other_interest TEXT,
  status membership_status DEFAULT 'pending',
  is_spotlight BOOLEAN DEFAULT false,
  show_in_directory BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT false,
  show_phone BOOLEAN DEFAULT false,
  show_organisation BOOLEAN DEFAULT false,
  spotlight_bio TEXT,
  spotlight_achievement TEXT,
  spotlight_contribution TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Alumni Reunion',
  event_date DATE,
  event_time TEXT,
  venue TEXT,
  description TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  registration_open BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  attended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- News posts
CREATE TABLE IF NOT EXISTS news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Alumni News',
  author TEXT,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  published_at DATE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Education',
  status TEXT DEFAULT 'Upcoming',
  location TEXT,
  summary TEXT,
  description TEXT,
  beneficiaries TEXT,
  impact TEXT,
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  project_date DATE,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Impact stats
CREATE TABLE IF NOT EXISTS impact_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  prefix TEXT,
  suffix TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Support pledges
CREATE TABLE IF NOT EXISTS support_pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  cause TEXT DEFAULT 'Education',
  amount NUMERIC,
  currency TEXT DEFAULT 'NGN',
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Volunteer applications
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest_area TEXT,
  skills TEXT,
  availability TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery albums
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES gallery_albums(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site content (key-value store)
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. HELPER FUNCTION — has_role
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 4. AUTO-GENERATE MEMBERSHIP_ID
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_membership_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.membership_id = '' OR NEW.membership_id IS NULL THEN
    NEW.membership_id := 'GCN09-' || UPPER(SUBSTRING(NEW.first_name FROM 1 FOR 1))
      || UPPER(SUBSTRING(NEW.last_name FROM 1 FOR 3)) || '-'
      || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_generate_membership_id
  BEFORE INSERT ON members
  FOR EACH ROW EXECUTE FUNCTION public.generate_membership_id();

-- 5. UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_members_updated BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_news_updated BEFORE UPDATE ON news_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_announcements_updated BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_impact_stats_updated BEFORE UPDATE ON impact_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- MEMBERS policies
CREATE POLICY "Public can read active spotlights"
  ON members FOR SELECT
  USING (is_spotlight = true AND status = 'active');

CREATE POLICY "Members can read their own profile"
  ON members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Members can update their own profile"
  ON members FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert members (registration)"
  ON members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all members"
  ON members FOR SELECT
  USING (public.has_role('admin', auth.uid()));

CREATE POLICY "Admins can update all members"
  ON members FOR UPDATE
  USING (public.has_role('admin', auth.uid()));

CREATE POLICY "Admins can delete members"
  ON members FOR DELETE
  USING (public.has_role('admin', auth.uid()));

-- USER_ROLES policies
CREATE POLICY "Admins can manage roles"
  ON user_roles FOR ALL
  USING (public.has_role('admin', auth.uid()));

CREATE POLICY "Users can read their own roles"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- EVENTS policies
CREATE POLICY "Anyone can read published events"
  ON events FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- EVENT_REGISTRATIONS policies
CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own registrations"
  ON event_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage registrations"
  ON event_registrations FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- NEWS_POSTS policies
CREATE POLICY "Anyone can read published news"
  ON news_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage news"
  ON news_posts FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- PROJECTS policies
CREATE POLICY "Anyone can read published projects"
  ON projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- ANNOUNCEMENTS policies
CREATE POLICY "Authenticated users can read published announcements"
  ON announcements FOR SELECT
  USING (is_published = true AND auth.role() = 'authenticated');

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- IMPACT_STATS policies
CREATE POLICY "Anyone can read stats"
  ON impact_stats FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage stats"
  ON impact_stats FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- CONTACT_MESSAGES policies
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT
  USING (public.has_role('admin', auth.uid()));

CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  USING (public.has_role('admin', auth.uid()));

-- SUPPORT_PLEDGES policies
CREATE POLICY "Anyone can insert pledges"
  ON support_pledges FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage pledges"
  ON support_pledges FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- VOLUNTEER_APPLICATIONS policies
CREATE POLICY "Anyone can insert volunteer applications"
  ON volunteer_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage volunteer applications"
  ON volunteer_applications FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- GALLERY policies
CREATE POLICY "Anyone can read gallery"
  ON gallery_albums FOR SELECT USING (true);
CREATE POLICY "Anyone can read gallery images"
  ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery albums"
  ON gallery_albums FOR ALL
  USING (public.has_role('admin', auth.uid()));
CREATE POLICY "Admins can manage gallery images"
  ON gallery_images FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- SITE_CONTENT policies
CREATE POLICY "Anyone can read site content"
  ON site_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage site content"
  ON site_content FOR ALL
  USING (public.has_role('admin', auth.uid()));

-- 7. STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-photos', 'member-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for member-photos
CREATE POLICY "Members can upload their own photo"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'member-photos' AND auth.uid()::text = (string_split(name, '/'))[1]);

CREATE POLICY "Members can read their own photo"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'member-photos' AND auth.uid()::text = (string_split(name, '/'))[1]);

CREATE POLICY "Admins can read all member photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'member-photos' AND public.has_role('admin', auth.uid()));

CREATE POLICY "Public can read member photos via signed URL"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'member-photos');

-- 8. SEED DATA — Default impact stats
-- ============================================================
INSERT INTO impact_stats (label, value, prefix, suffix, sort_order) VALUES
  ('Members', 0, '', '+', 1),
  ('Projects', 0, '', '+', 2),
  ('Lives Reached', 0, '', '+', 3),
  ('Students Supported', 0, '', '+', 4),
  ('Contributions', 0, '₦', 'M+', 5),
  ('Community Initiatives', 0, '', '+', 6)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SETUP COMPLETE
-- ============================================================
-- Next steps:
-- 1. Go to Supabase Dashboard > Authentication > Settings
--    and disable "Confirm email" if you want instant registration
-- 2. Create your first admin user:
--    a. Register via /membership/register
--    b. Go to SQL Editor and run:
--       INSERT INTO user_roles (user_id, role)
--       SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'YOUR_EMAIL';
--    c. Then update the member status to 'active':
--       UPDATE members SET status = 'active' WHERE email = 'YOUR_EMAIL';
-- ============================================================
