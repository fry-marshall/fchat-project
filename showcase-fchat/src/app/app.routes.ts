import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CguPageComponent } from './cgu-page/cgu-page.component';
import { SupportPageComponent } from './support-page/support-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'cgu',
        component: CguPageComponent
    },
    {
        path: 'support',
        component: SupportPageComponent
    },
];
