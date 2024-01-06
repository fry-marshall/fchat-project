import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './stores/app.state';
import { HttpClientModule } from '@angular/common/http';
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

const config: SocketIoConfig = { url: environment.apiUrl, options: {} };

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/views.module').then(m => m.ViewsModule)
  }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([UserEffects, MessageEffects]),
    HttpClientModule,
    RouterModule.forRoot(routes),
    StoreDevtoolsModule.instrument({
      //logOnly: !environment.production
    }),
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [
    CookieService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
