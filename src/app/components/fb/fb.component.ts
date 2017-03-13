import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { FbService } from "../../services/fb/fb.service";
import { Subscription } from 'rxjs/Subscription';
import { FbAuthResult } from '../../entities/fbAuthResult';
import { FbUserInfo } from '../../entities/fbUserInfo';

@Component({
  selector: 'app-fb',
  templateUrl: './fb.component.html',
  styleUrls: ['./fb.component.css'],
  providers: [FbService]
})
export class FbComponent implements OnInit {

  @Input() fbAppId: string;
  private connectedSubscription: Subscription;
  private connected = true;
  @Output() loginEvent = new EventEmitter<any>();

  constructor(
    private fbService: FbService
  ) { }

  login() {
    this.fbService.login().then(result => {      
       this.connected = result.status === "connected";
      if (this.connected) {
        this.fbService.me().then(res =>
          this.loginEvent.emit(res)
        );
      }
    });
  }

  onAuthHandler(authResult: FbAuthResult) {
    if (authResult.status != "initialized") {
      this.connected = authResult.status === "connected";
    }
  };

  ngOnInit() {
    this.fbService.init();
    this.connectedSubscription = this.fbService.authEventsStream.subscribe(result =>
      this.onAuthHandler(result)
    );
    this.fbService.getLoginStatus();
  }

  ngOnDestroy() {
    this.connectedSubscription.unsubscribe();
  }
}