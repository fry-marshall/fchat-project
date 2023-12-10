import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class ViewsService{

    private showConvList: BehaviorSubject<boolean> = new BehaviorSubject(true)
    showConvList$ = this.showConvList.asObservable()

    updateShowConvList(value: boolean){
        this.showConvList.next(value)
    }
}