import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewsComponent } from "./views.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UiModule } from "@library_v2/ui-module";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";
import { ForgotpasswordViewComponent } from "./forgotpassword-view/forgotpassword-view.component";
import { ResetpasswordViewComponent } from "./resetpassword-view/resetpassword-view.component";
import { SignUpViewComponent } from "./signup-view/signup-view.component";
import { SignInViewComponent } from "./signin-view/signin-view.component";
import { VerifyEmailViewComponent } from "./verifyemail-view/verifyemail-view.component";

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
                component: ForgotpasswordViewComponent
            },
            {
                path: 'resetpassword',
                component: ResetpasswordViewComponent
            },
            {
                path: 'verifyemail',
                component: VerifyEmailViewComponent
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
        ForgotpasswordViewComponent,
        ResetpasswordViewComponent,
        VerifyEmailViewComponent
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