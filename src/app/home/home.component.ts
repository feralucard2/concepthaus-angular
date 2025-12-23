
import { AfterViewInit, Component, ElementRef, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { RootInterface } from '../interfaces/dataInterface';
import { DatosService } from '../services/datos.service';
import Swiper from 'swiper';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import { Inject, PLATFORM_ID } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiMailService } from '../services/apiMail.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

Swiper.use([Autoplay, FreeMode]);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {


  @ViewChildren('videoEl') videos!: QueryList<ElementRef<HTMLVideoElement>>;
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  datach: RootInterface | undefined;
  title = 'concepthaus-agular';
  lenguaje: string | null = 'ESP';
  activeSpinner: boolean = false;
  contactForm!: FormGroup;
  isactive: boolean = false;
  listLogos: string[] = [
    "img/logos/Slide Logos Web-01.png",
    "img/logos/Slide Logos Web-02.png",
    "img/logos/Slide Logos Web-03.png",
    "img/logos/Slide Logos Web-04.png",
    "img/logos/Slide Logos Web-05.png",
    "img/logos/Slide Logos Web-06.png",
    "img/logos/Slide Logos Web-07.png",
    "img/logos/Slide Logos Web-08.png",
    "img/logos/Slide Logos Web-09.png",
    "img/logos/Slide Logos Web-10.png",
    "img/logos/Slide Logos Web-11.png",
    "img/logos/Slide Logos Web-12.png",
    "img/logos/Slide Logos Web-13.png",
    "img/logos/Slide Logos Web-14.png",
    "img/logos/Slide Logos Web-15.png",
    "img/logos/Slide Logos Web-16.png",
    "img/logos/Slide Logos Web-17.png",
    "img/logos/Slide Logos Web-18.png",
    "img/logos/Slide Logos Web-19.png",
    "img/logos/Slide Logos Web-20.png",
    "img/logos/Slide Logos Web-21.png",
    "img/logos/Slide Logos Web-22.png",
    "img/logos/Slide Logos Web-23.png",
    "img/logos/Slide Logos Web-24.png",
    "img/logos/Slide Logos Web-25.png",
    "img/logos/Slide Logos Web-26.png",
    "img/logos/Slide Logos Web-27.png",
    "img/logos/Slide Logos Web-28.png",
  ]


  constructor(
    private datosService: DatosService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private apiMailService: ApiMailService, private router: Router) {
    if (typeof localStorage !== 'undefined') {
      let lenguaje = localStorage.getItem('lenguaje');
      if (!lenguaje) {
        localStorage.setItem('lenguaje', 'ENG');
      } else {
        this.lenguaje = lenguaje;
      }
    }


  }

  ngAfterViewInit() {

    if (isPlatformBrowser(this.platformId)) {
      const swiper = new Swiper('.logos-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        loop: true,
        freeMode: true,
        speed: 7000,
        allowTouchMove: false,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          stopOnLastSlide: false,
          reverseDirection: false
        },
      });

      swiper.el.addEventListener('mousedown', e => e.stopPropagation());
      swiper.el.addEventListener('touchstart', e => e.stopPropagation());
      swiper.el.addEventListener('pointerdown', e => e.stopPropagation());
      swiper.el.addEventListener('click', e => e.stopPropagation());


      this.videos.forEach(videoRef => {
        const video = videoRef.nativeElement;
        video.muted = true;
        video.play().catch(err => {
          console.warn('Autoplay bloqueado por el navegador', err);
        });
      });
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

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      business: ['', Validators.required],
      help: ['', Validators.required]
    });
  }

  onSubmit() {

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    // Aquí puedes manejar el envío del formulario

    this.apiMailService.sendMail(this.contactForm.value).subscribe(data => {
      if (data['success'] === true) {
        this._snackBar.open('Data sent successfully ✅', 'exit', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 2000
        });
        this.router.navigate(['/thank-you']);
      } else {
        this._snackBar.open('Error sending data ❌', 'exit', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 2000
        });
      }
    }, error => {
      this._snackBar.open('Error sending data ❌', 'exit', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2000
      });
     });
    this.contactForm.reset();
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

  toggleMenu() {
    console.log("entramos");
    this.isactive = !this.isactive;
  }
}

