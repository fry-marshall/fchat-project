import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpService } from '@library_v2/services/http.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { reducers } from './stores/app.state';
import { UserEffects } from './stores/user/user.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([UserEffects]),
    HttpClientModule,
    StoreDevtoolsModule.instrument({
      logOnly: !environment.production
    })
  ],
  providers: [
    CookieService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
