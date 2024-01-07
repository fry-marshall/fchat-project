import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable()
export class LoadingService{

    public isLoadingPage: BehaviorSubject<boolean> = new BehaviorSubject(true)

    showLoader(){
        this.isLoadingPage.next(true)
    }

    hideLoader(){
        this.isLoadingPage.next(false)
    }
}