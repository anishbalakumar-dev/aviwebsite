// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

interface SocialLink {
  href: string;
  label: string;
}

interface Site {
  website: string;
  author: string;
  profile: string;
  desc: string;
  title: string;
  ogImage: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  scheduledPostMargin: number;
  showArchives: boolean;
  showBackButton: boolean;
  editPost: {
    enabled: boolean;
    text: string;
    url: string;
  };
  dynamicOgImage: boolean;
  lang: string;
  timezone: string;
}

// Site configuration
export const SITE: Site = {
  website: "https://example.com/",
  author: "Site Author",
  profile: "https://example.com/about",
  desc: "A clean, minimal Astro blog template you can adapt to your own brand.",
  title: "Avishek Ganguly",
  ogImage: "favicon.ico",
  lightAndDarkMode: true,
  postPerIndex: 10,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: false,
  showBackButton: false,
  editPost: {
    enabled: true,
    text: "Edit on GitHub",
    url: "https://github.com/your-org/your-repo/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en",
  timezone: "America/New_York",
};

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.desc;

// Navigation links
export const NAV_LINKS: SocialLink[] = [
  {
    href: "/",
    label: "Blog",
  },
  {
    href: "/about",
    label: "About",
  },
];

// Social media links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://medium.com/@avishek.g_63458",
    label: "Medium",
  },
  {
    href: "https://www.linkedin.com/in/avganguly/",
    label: "LinkedIn",
  },
];

// Icon map for social media
export const ICON_MAP: Record<string, string> = {
  Medium: "medium",
  LinkedIn: "linkedin",
};
