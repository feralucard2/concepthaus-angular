import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RootInterface } from '../interfaces/dataInterface';
import { DatosService } from '../services/datos.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataAvisoOneComponent } from './components/data-aviso-one/data-aviso-one.component';

@Component({
  selector: 'app-aviso',
  standalone: true,
  imports: [NgClass, DataAvisoOneComponent],
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.scss'
})
export class AvisoComponent implements OnInit{
datach: RootInterface | undefined;
  title = 'concepthaus-agular';
  lenguaje: string | null = 'ESP';
  activeSpinner: boolean = false;
  isactive: boolean = false;

  constructor(private datosService: DatosService, private sanitizer: DomSanitizer) {
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
