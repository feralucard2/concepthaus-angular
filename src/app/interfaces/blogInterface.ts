export interface WpRendered {
  rendered: string;
}

export interface WpMediaSize {
  source_url: string;
  width: number;
  height: number;
}

export interface WpMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: {
    sizes?: { [size: string]: WpMediaSize };
  };
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WpPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: WpMedia[];
    'wp:term'?: WpTerm[][];
  };
}

export interface WpCategory {
  id: number;
  count: number;
  name: string;
  slug: string;
  parent: number;
}
