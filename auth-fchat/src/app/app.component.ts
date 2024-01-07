import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private loadingService: LoadingService
  ){}

  public isLoading = this.loadingService.isLoadingPage

  ngOnInit() {
    this.loadingService.showLoader();

    setTimeout(() => {
      this.loadingService.hideLoader();
    }, 2000);
  }
}
