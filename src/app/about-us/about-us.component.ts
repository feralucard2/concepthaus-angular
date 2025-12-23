import { isPlatformBrowser, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, QueryList, ViewChildren } from '@angular/core';
import { RootInterface } from '../interfaces/dataInterface';
import { DatosService } from '../services/datos.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NgClass],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit, AfterViewInit {

  @ViewChildren('videoEl') videos!: QueryList<ElementRef<HTMLVideoElement>>;
  datach: RootInterface | undefined;
  title = 'concepthaus-agular';
  lenguaje: string | null = 'ESP';
  activeSpinner: boolean = false;
  isactive: boolean = false;

  constructor(private datosService: DatosService, private sanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platformId: Object) {
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
          this.activeSpinner = false;;
        });
      } else {
        this.datosService.getEsp().subscribe(data => {
          this.datach = data;
          this.activeSpinner = false;;
        });
      }
    }
  }

  ngAfterViewInit() {

    if (isPlatformBrowser(this.platformId)) {
      this.videos.forEach(videoRef => {
        const video = videoRef.nativeElement;
        video.muted = true; // Garantiza que está silenciado
        video.play().catch(err => {
          console.warn('Autoplay bloqueado por el navegador', err);
        });
      });
    }


  }


  getEsp() {
    localStorage.setItem('lenguaje', 'ESP');
    this.lenguaje = 'ESP';
    this.activeSpinner = true;
    this.datosService.getEsp().subscribe(data => {
      this.datach = data;
      this.activeSpinner = false;;
    });

  }

  getEng() {
    localStorage.setItem('lenguaje', 'ENG');
    this.lenguaje = 'ENG';
    this.activeSpinner = true;
    this.datosService.getEng().subscribe(data => {
          this.datach = data;
          this.activeSpinner = false;;
    });
  }


  sanitiza(data: string | undefined): SafeHtml {

    let dataZan = data ? data : '';

    return this.sanitizer.bypassSecurityTrustHtml(
      dataZan
    )
  }

  toggleMenu() {
    console.log("entramos");
    this.isactive = !this.isactive;
  }
}
