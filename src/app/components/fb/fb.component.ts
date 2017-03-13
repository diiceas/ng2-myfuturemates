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

  ngOnInit() {
    this.fbService.init();
    this.fbService.getLoginStatus().then(result => {
      this.connected = result.status === "connected";
      console.log(result);
    });
  }
}