CREATE TYPE public.app_role AS ENUM ('admin','member');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TYPE public.membership_status AS ENUM ('pending','active','suspended','inactive');

CREATE SEQUENCE public.membership_seq START 1;

CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  membership_id text NOT NULL UNIQUE,
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  preferred_name text,
  gender text,
  date_of_birth date,
  photo_url text,
  phone text,
  whatsapp text,
  email text NOT NULL,
  address text,
  city text,
  state text,
  country text,
  set_year text NOT NULL DEFAULT '2009',
  house text,
  class_department text,
  year_joined text,
  graduation_year text,
  student_id text,
  school_notes text,
  employment_type text,
  profession text,
  job_title text,
  organisation text,
  industry text,
  business_name text,
  business_website text,
  linkedin text,
  professional_location text,
  emergency_contact_name text,
  emergency_contact_relationship text,
  emergency_contact_phone text,
  interests text[] NOT NULL DEFAULT '{}',
  skills text[] NOT NULL DEFAULT '{}',
  other_interest text,
  status public.membership_status NOT NULL DEFAULT 'pending',
  show_in_directory boolean NOT NULL DEFAULT true,
  show_phone boolean NOT NULL DEFAULT false,
  show_email boolean NOT NULL DEFAULT false,
  show_organisation boolean NOT NULL DEFAULT true,
  is_spotlight boolean NOT NULL DEFAULT false,
  spotlight_bio text,
  spotlight_achievement text,
  spotlight_contribution text,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT SELECT ON public.members TO anon;
GRANT ALL ON public.members TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_membership_id() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.membership_id IS NULL OR NEW.membership_id = '' THEN
    NEW.membership_id := 'GCN09-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.membership_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER members_set_membership_id BEFORE INSERT ON public.members FOR EACH ROW EXECUTE FUNCTION public.set_membership_id();
CREATE TRIGGER members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "members read own" ON public.members FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "members read directory" ON public.members FOR SELECT TO authenticated USING (status = 'active' AND show_in_directory = true);
CREATE POLICY "spotlight public" ON public.members FOR SELECT TO anon USING (status = 'active' AND is_spotlight = true);
CREATE POLICY "members insert own" ON public.members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "members update own" ON public.members FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "admins manage members" ON public.members FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.grant_member_role() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.user_id, 'member') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER members_grant_role AFTER INSERT ON public.members FOR EACH ROW EXECUTE FUNCTION public.grant_member_role();

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Education',
  location text,
  summary text,
  description text,
  status text NOT NULL DEFAULT 'Upcoming',
  project_date date,
  impact text,
  beneficiaries text,
  image_url text,
  gallery text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "published projects public" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Alumni Reunion',
  event_date date,
  event_time text,
  venue text,
  description text,
  image_url text,
  registration_open boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT ON public.events TO anon;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "published events public" ON public.events FOR SELECT USING (is_published = true);
CREATE POLICY "admins manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  full_name text,
  email text,
  phone text,
  attended boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own registrations" ON public.event_registrations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "register self" ON public.event_registrations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "cancel own" ON public.event_registrations FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage registrations" ON public.event_registrations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.news_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Alumni News',
  author text,
  excerpt text,
  content text,
  image_url text,
  published_at date,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_posts TO authenticated;
GRANT SELECT ON public.news_posts TO anon;
GRANT ALL ON public.news_posts TO service_role;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER news_updated_at BEFORE UPDATE ON public.news_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "published news public" ON public.news_posts FOR SELECT USING (is_published = true);
CREATE POLICY "admins manage news" ON public.news_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "members read announcements" ON public.announcements FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "admins manage announcements" ON public.announcements FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  prefix text,
  suffix text DEFAULT '+',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_stats TO authenticated;
GRANT SELECT ON public.impact_stats TO anon;
GRANT ALL ON public.impact_stats TO service_role;
ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER impact_stats_updated_at BEFORE UPDATE ON public.impact_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "stats public" ON public.impact_stats FOR SELECT USING (true);
CREATE POLICY "admins manage stats" ON public.impact_stats FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  label text NOT NULL,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT SELECT ON public.site_content TO anon;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "content public" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "admins manage content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  interest_area text,
  skills text,
  availability text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.volunteer_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.volunteer_applications TO authenticated;
GRANT ALL ON public.volunteer_applications TO service_role;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone volunteers" ON public.volunteer_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "admins manage volunteers" ON public.volunteer_applications FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone contacts" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admins manage messages" ON public.contact_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.support_pledges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  cause text NOT NULL DEFAULT 'Education',
  amount numeric,
  currency text NOT NULL DEFAULT 'NGN',
  message text,
  status text NOT NULL DEFAULT 'pledged',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.support_pledges TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.support_pledges TO authenticated;
GRANT ALL ON public.support_pledges TO service_role;
ALTER TABLE public.support_pledges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone pledges" ON public.support_pledges FOR INSERT WITH CHECK (true);
CREATE POLICY "admins manage pledges" ON public.support_pledges FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_albums TO authenticated;
GRANT SELECT ON public.gallery_albums TO anon;
GRANT ALL ON public.gallery_albums TO service_role;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "albums public" ON public.gallery_albums FOR SELECT USING (true);
CREATE POLICY "admins manage albums" ON public.gallery_albums FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT SELECT ON public.gallery_images TO anon;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "images public" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "admins manage images" ON public.gallery_images FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "member photos read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'member-photos');
CREATE POLICY "member photos upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'member-photos');
CREATE POLICY "member photos update own" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'member-photos' AND owner = auth.uid());