import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewsComponent } from "./views.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UiModule } from "@library_v2/ui-module";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";
import { ForgotpasswordComponent } from "./forgotpassword-page/forgotpassword.component";
import { ResetpasswordComponent } from "./resetpassword-page/resetpassword.component";
import { VerifyEmailComponent } from "./verifyemail-page/verifyemail.component";
import { SignUpViewComponent } from "./signup-view/signup-view.component";
import { SignInViewComponent } from "./signin-view/signin-view.component";

const routes: Routes = [
    {
        path: '',
        canActivate: [
            //AuthGuard
        ],
        component: ViewsComponent,
        children: [
            {
                path: '',
                redirectTo: '/welcome-page',
                pathMatch: 'full'
            },
            {
                path: 'welcome-page',
                component: WelcomePageComponent
            },
            {
                path: 'signup',
                component: SignUpViewComponent
            },
            {
                path: 'signin',
                component: SignInViewComponent
            },
            {
                path: 'forgotpassword',
                component: ForgotpasswordComponent
            },
            {
                path: 'resetpassword',
                component: ResetpasswordComponent
            },
            {
                path: 'verifyemail',
                component: VerifyEmailComponent
            },
        ],
    }
]

@NgModule({
    declarations: [
        ViewsComponent,
        WelcomePageComponent,
        SignUpViewComponent,
        SignInViewComponent,
        ForgotpasswordComponent,
        ResetpasswordComponent,
        VerifyEmailComponent
    ],
    imports: [
        UiModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule.forChild(routes),
    ],
    providers: [
    ]
})
export class ViewsModule { }