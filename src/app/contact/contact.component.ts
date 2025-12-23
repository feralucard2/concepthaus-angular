import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { RootInterface } from '../interfaces/dataInterface';
import { DatosService } from '../services/datos.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiMailService } from '../services/apiMail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  datach: RootInterface | undefined;
  title = 'concepthaus-agular';
  lenguaje: string | null = 'ESP';
  activeSpinner: boolean = false;
  isactive: boolean = false;
  contactForm!: FormGroup;

  constructor(
    private datosService: DatosService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private apiMailService: ApiMailService,
    private router: Router
  ) {
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



    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      business: ['', Validators.required],
      help: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.contactForm.invalid);
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

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
