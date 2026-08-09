import crest from "@/assets/gcn-crest.png.asset.json";

export const CREST_URL = crest.url;

export const ORG = {
  name: "Government College Nasarawa 2009 Set Alumni",
  short: "GCN 09 Set",
  tagline: "United by Heritage. Driven by Impact.",
  rcNumber: "9712732",
  email: "info@gcn09set.org",
  phone: "+234 (0) 000 000 0000",
  address: "Nasarawa, Nasarawa State, Nigeria",
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Our Impact", to: "/impact" },
  { label: "Projects", to: "/projects" },
  { label: "Events", to: "/events" },
  { label: "Alumni", to: "/alumni" },
  { label: "News", to: "/news" },
  { label: "Contact", to: "/contact" },
] as const;

export const CORE_VALUES = [
  { title: "Unity", subtitle: "Stronger Together", icon: "Users" },
  { title: "Service", subtitle: "Giving Back", icon: "HeartHandshake" },
  { title: "Integrity", subtitle: "Doing What Is Right", icon: "ShieldCheck" },
  { title: "Compassion", subtitle: "People First", icon: "Heart" },
  { title: "Excellence", subtitle: "Striving for Better", icon: "Award" },
  { title: "Collaboration", subtitle: "Better Together", icon: "Handshake" },
  { title: "Legacy", subtitle: "Building for Tomorrow", icon: "Landmark" },
] as const;

export const FOCUS_AREAS = [
  {
    title: "Education",
    body: "Supporting students, schools and educational development.",
    icon: "GraduationCap",
  },
  {
    title: "Member Welfare",
    body: "Supporting our members and creating a dependable community of care.",
    icon: "LifeBuoy",
  },
  {
    title: "Community Development",
    body: "Supporting initiatives that improve communities and quality of life.",
    icon: "Building2",
  },
  {
    title: "Economic Empowerment",
    body: "Supporting skills development, entrepreneurship and sustainable opportunities.",
    icon: "TrendingUp",
  },
  {
    title: "Social Responsibility",
    body: "Supporting vulnerable and marginalised individuals.",
    icon: "HandHeart",
  },
  {
    title: "Mentorship & Networking",
    body: "Connecting members and creating professional and personal growth opportunities.",
    icon: "Network",
  },
] as const;

export const PROJECT_CATEGORIES = [
  "Education",
  "Welfare",
  "Community Development",
  "Empowerment",
  "Social Responsibility",
] as const;

export const PROJECT_STATUSES = ["Upcoming", "Ongoing", "Completed"] as const;

export const EVENT_CATEGORIES = [
  "Alumni Reunion",
  "AGM",
  "Networking",
  "Charity",
  "Education",
  "Community Outreach",
  "Social Events",
] as const;

export const NEWS_CATEGORIES = [
  "Alumni News",
  "Announcements",
  "Projects",
  "Education",
  "Community",
  "Member Stories",
  "Events",
  "Opportunities",
] as const;

export const CONTRIBUTION_OPTIONS = [
  "Volunteering",
  "Mentorship",
  "Education Support",
  "Community Projects",
  "Welfare",
  "Fundraising",
  "Professional Expertise",
  "Event Support",
  "Technology",
  "Media & Communications",
  "Partnerships",
] as const;

export const EMPLOYMENT_TYPES = [
  "Employed",
  "Self-employed",
  "Business Owner",
  "Entrepreneur",
  "Student",
  "Retired",
  "Other",
] as const;

export const SUPPORT_CAUSES = [
  "Education",
  "Welfare",
  "Community Development",
  "Empowerment",
  "Special Projects",
] as const;

export const DEFAULT_STATS = [
  { label: "Members", value: 0, prefix: "", suffix: "+" },
  { label: "Projects", value: 0, prefix: "", suffix: "+" },
  { label: "Lives Reached", value: 0, prefix: "", suffix: "+" },
  { label: "Students Supported", value: 0, prefix: "", suffix: "+" },
  { label: "Contributions", value: 0, prefix: "₦", suffix: "M+" },
  { label: "Community Initiatives", value: 0, prefix: "", suffix: "+" },
];

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}
