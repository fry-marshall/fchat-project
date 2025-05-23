import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './stores/app.state';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './stores/user/user.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpService } from '@library_v2/services/http.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@environments/environment';
import { MessageEffects } from './stores/message/message.effects';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorService } from './http-interceptor.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/views.module').then((m) => m.ViewsModule),
  },
];

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([UserEffects, MessageEffects]),
    RouterModule.forRoot(routes),
    StoreDevtoolsModule.instrument({
      //logOnly: !environment.production
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    CookieService,
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
