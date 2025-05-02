import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpService } from '@library_v2/services/http.service';
import { CookieService } from 'ngx-cookie-service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { reducers } from './stores/app.state';
import { UserEffects } from './stores/user/user.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterModule, Routes } from '@angular/router';
import { LoadingService } from './loading.service';
import { AuthEffects } from './stores/auth/auth.effects';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/views.module').then((m) => m.ViewsModule),
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      logOnly: !environment.production,
      connectInZone: true,
    }),
  ],
  providers: [
    CookieService,
    HttpService,
    LoadingService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
