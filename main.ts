import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { DatePipe } from '@angular/common';

import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { provideRouter } from '@angular/router';
import routeConfig from '../src/app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    BrowserModule,
    importProvidersFrom(HttpClientModule),
    provideRouter(routeConfig),
    DatePipe,
  ],
}).catch((err) => console.error(err));
