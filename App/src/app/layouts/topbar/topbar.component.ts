import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';
import { ClaimsDto } from 'src/app/core/models/auth.models';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {
  @Output() mobileMenuButtonClicked = new EventEmitter();
  element:any;

  loggedinUser?:ClaimsDto;

  constructor(@Inject(DOCUMENT) private document: any, private store: StorageService,
  private apiService: ApiService)
  {}

  ngOnInit() {
    this.loggedinUser = this.store.getUserClaims();

    this.element = document.documentElement;
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  logout()
  {
    this.apiService.PostRequest(null, '/api/Auth/logout', false, true).subscribe((res) => {

    }).add(() => {
      this.store.removeUserClaims();
      window.location.href = '/login';
    });
  }
}
