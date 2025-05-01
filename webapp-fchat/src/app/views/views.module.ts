import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewsComponent } from "./views.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UiModule } from "@library_v2/ui-module";
import { ComponentsModule } from "../components/components.module";
import { ViewsService } from "./views.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
    {
        path: '',
        canActivate: [
            //AuthGuard
        ],
        component: ViewsComponent
    }
]

@NgModule({ declarations: [
        ViewsComponent
    ], imports: [UiModule,
        ComponentsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule.forChild(routes)], providers: [
        ViewsService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class ViewsModule { }