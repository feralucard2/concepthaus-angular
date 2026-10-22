import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RootInterface } from '../interfaces/dataInterface';
import { WpCategory, WpPost } from '../interfaces/blogInterface';
import { DatosService } from '../services/datos.service';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {

  datach: RootInterface | undefined;
  lenguaje: string | null = 'ESP';
  activeSpinner: boolean = false;
  isactive: boolean = false;

  posts: WpPost[] = [];
  categorias: WpCategory[] = [];
  categoriaActiva: string | null = null;
  loadingPosts: boolean = true;
  heroError: boolean = false;

  constructor(private datosService: DatosService, public blogService: BlogService, private route: ActivatedRoute,
    private sanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platformId: Object) {
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

    // Los artículos se consultan solo en el navegador para que el prerender no deje contenido viejo
    if (isPlatformBrowser(this.platformId)) {
      this.blogService.getCategories().subscribe({
        next: categorias => {
          this.categorias = categorias;
          this.cargarPosts();
        },
        error: () => this.cargarPosts()
      });

      this.route.queryParamMap.subscribe(params => {
        this.categoriaActiva = params.get('categoria');
        if (this.categorias.length) {
          this.cargarPosts();
        }
      });
    }
  }

  cargarPosts() {
    const categoria = this.categorias.find(c => c.slug === this.categoriaActiva);
    this.loadingPosts = true;
    this.blogService.getPosts(categoria?.id).subscribe({
      next: posts => {
        this.posts = posts;
        this.loadingPosts = false;
      },
      error: () => {
        this.posts = [];
        this.loadingPosts = false;
      }
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
