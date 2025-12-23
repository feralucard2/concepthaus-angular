import { provideRouter, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AvisoComponent } from './aviso/aviso.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'avisolegal', component: AvisoComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: '**', redirectTo: '' }
];
