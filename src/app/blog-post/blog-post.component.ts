import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RootInterface } from '../interfaces/dataInterface';
import { WpPost, WpTerm } from '../interfaces/blogInterface';
import { DatosService } from '../services/datos.service';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss'
})
export class BlogPostComponent implements OnInit {

  datach: RootInterface | undefined;
  lenguaje: string | null = 'ESP';
  activeSpinner: boolean = false;
  isactive: boolean = false;

  post: WpPost | undefined;
  categoria: WpTerm | undefined;
  relacionado: WpPost | undefined;

  constructor(private datosService: DatosService, public blogService: BlogService, private route: ActivatedRoute,
    private router: Router, private sanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platformId: Object) {
    if (typeof localStorage !== 'undefined') {
      let lenguaje = localStorage.getItem('lenguaje');
      if (!lenguaje) {
        localStorage.setItem('lenguaje', 'ENG');
      } else {
        this.lenguaje = lenguaje;
      }
    }
  }

  ngOnInit(): void {
    this.activeSpinner = true;
    if (typeof localStorage !== 'undefined') {
      if (this.lenguaje === 'ENG') {
        this.datosService.getEng().subscribe(data => {
          this.datach = data;
          this.activeSpinner = false;
        });
      } else {
        this.datosService.getEsp().subscribe(data => {
          this.datach = data;
          this.activeSpinner = false;
        });
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe(params => {
        const slug = params.get('slug');
        if (slug) {
          this.cargarPost(slug);
        }
      });
    }
  }

  cargarPost(slug: string) {
    this.blogService.getPostBySlug(slug).subscribe({
      next: post => {
        if (!post) {
          this.router.navigate(['/blog']);
          return;
        }
        this.post = post;
        this.categoria = this.blogService.getCategory(post);
        this.relacionado = undefined;
        window.scrollTo(0, 0);
        this.cargarRelacionado(post);
      },
      error: () => this.router.navigate(['/blog'])
    });
  }

  // Busca otro artículo de la misma categoría; si no hay, el más reciente
  cargarRelacionado(post: WpPost) {
    this.blogService.getPosts(this.categoria?.id, 10).subscribe(posts => {
      const otro = posts.find(p => p.id !== post.id);
      if (otro || !this.categoria) {
        this.relacionado = otro;
        return;
      }
      this.blogService.getPosts(undefined, 10).subscribe(recientes => {
        this.relacionado = recientes.find(p => p.id !== post.id);
      });
    });
  }

  getEsp() {
    localStorage.setItem('lenguaje', 'ESP');
    this.lenguaje = 'ESP';
    this.activeSpinner = true;
    this.datosService.getEsp().subscribe(data => {
      this.datach = data;
      this.activeSpinner = false;
    });
  }

  getEng() {
    localStorage.setItem('lenguaje', 'ENG');
    this.lenguaje = 'ENG';
    this.activeSpinner = true;
    this.datosService.getEng().subscribe(data => {
      this.datach = data;
      this.activeSpinner = false;
    });
  }

  sanitiza(data: string | undefined): SafeHtml {
    let dataZan = data ? data : '';
    return this.sanitizer.bypassSecurityTrustHtml(dataZan);
  }

  toggleMenu() {
    this.isactive = !this.isactive;
  }
}
