import { Component, OnInit } from '@angular/core';
import { oAuth2Service } from '../../services/oAuth2/oAuth2.service';
import { RestService } from '../../services/rest/rest.service';

@Component({
  selector: 'app-uni',
  templateUrl: './uni.component.html',
  styleUrls: ['./uni.component.css']
})
export class UniComponent implements OnInit {
  name: string;
  access_token: string;

  constructor(
    private authService: oAuth2Service,
    private restService: RestService
  ) { }

  ngOnInit() {
    this.access_token = this.authService.getToken();
  }

  joinUni(): void {
    this.restService.post(
      this.name, 
      "<h1>my content</h1>",
      this.access_token
      );
  }
}
