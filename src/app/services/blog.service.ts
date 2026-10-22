import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WpCategory, WpPost, WpTerm } from '../interfaces/blogInterface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // El WordPress no tiene permalinks activos, por eso se usa ?rest_route= en lugar de /wp-json
  private apiUrl = 'https://blog.concepthaus.mx/';
  private uncategorizedSlug = 'uncategorized';

  constructor(private http: HttpClient) { }

  getPosts(categoryId?: number, perPage: number = 100): Observable<WpPost[]> {
    let params = new HttpParams()
      .set('rest_route', '/wp/v2/posts')
      .set('_embed', 'wp:featuredmedia,wp:term')
      .set('per_page', perPage);
    if (categoryId) {
      params = params.set('categories', categoryId);
    }
    return this.http.get<WpPost[]>(this.apiUrl, { params });
  }

  getPostBySlug(slug: string): Observable<WpPost | undefined> {
    const params = new HttpParams()
      .set('rest_route', '/wp/v2/posts')
      .set('_embed', 'wp:featuredmedia,wp:term')
      .set('slug', slug);
    return this.http.get<WpPost[]>(this.apiUrl, { params }).pipe(map(posts => posts[0]));
  }

  getCategories(): Observable<WpCategory[]> {
    const params = new HttpParams()
      .set('rest_route', '/wp/v2/categories')
      .set('hide_empty', true)
      .set('per_page', 100);
    return this.http.get<WpCategory[]>(this.apiUrl, { params }).pipe(
      map(categories => categories.filter(c => c.slug !== this.uncategorizedSlug))
    );
  }

  getCategory(post: WpPost | undefined): WpTerm | undefined {
    const terms = post?._embedded?.['wp:term'] ?? [];
    return terms.flat().find(t => t.taxonomy === 'category' && t.slug !== this.uncategorizedSlug);
  }

  getImage(post: WpPost | undefined, size: string = 'full'): string {
    const media = post?._embedded?.['wp:featuredmedia']?.[0];
    if (!media?.source_url) {
      return '';
    }
    return media.media_details?.sizes?.[size]?.source_url ?? media.source_url;
  }

  getImageAlt(post: WpPost | undefined): string {
    return post?._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? '';
  }

  getReadingTime(post: WpPost | undefined): number {
    const text = (post?.content?.rendered ?? '').replace(/<[^>]*>/g, ' ');
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  formatDate(date: string | undefined, lenguaje: string | null): string {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    if (lenguaje === 'ENG') {
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    const month = d.toLocaleDateString('es-MX', { month: 'long' });
    return `${d.getDate()} de ${month} ${d.getFullYear()}`;
  }
}
