import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './stores/app.state';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './stores/user/user.effects';
import { ViewsModule } from './views/views.module';
import { HttpService } from '@library_v2/services/http.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'test',
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
    EffectsModule.forRoot([UserEffects]),
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    CookieService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
