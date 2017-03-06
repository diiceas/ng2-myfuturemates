import { Component, OnInit } from '@angular/core';
import { oAuth2Service } from '../../services/oAuth2/oAuth2.service';
import { RestService } from '../../services/rest/rest.service';
import { Student } from '../../entities/student';

@Component({
  selector: 'app-uni',
  templateUrl: './uni.component.html',
  styleUrls: ['./uni.component.css']
})

export class UniComponent implements OnInit {
  name: string;
  access_token: string;
  students: Student[];
  pages: number;
  readonly perPage = 5;
  currentPage: number = 1;

  constructor(
    private authService: oAuth2Service,
    private restService: RestService
  ) { }

  ngOnInit() {
    this.access_token = this.authService.getToken();
    this.updateStudents();
  }

  pageChangedHandler(page: number) {
    this.currentPage = page;
    this.updateStudents(page);
  }

  updateStudents(page: number = 1) {
    this.restService.getStudents(
      page,
      this.access_token,
      this.perPage
    ).then(res => {
      this.students = res.students;
      this.pages = res.pages;
    });
  }

  joinUni(): void {
    this.restService.post(
      this.name,
      "<h1>my content</h1>",
      this.access_token
    );
  }
}
