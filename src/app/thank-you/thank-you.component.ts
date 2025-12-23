import { Component, OnInit } from '@angular/core';
import { DatosService } from '../services/datos.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RootInterface } from '../interfaces/dataInterface';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss'
})
export class ThankYouComponent implements OnInit{
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

  sanitiza(data: string | undefined): SafeHtml {

      let dataZan = data ? data : '';

      return this.sanitizer.bypassSecurityTrustHtml(
        dataZan
      )
    }


}
