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
  currentPage: number;
  readonly perPage = 10;

  constructor(
    private authService: oAuth2Service,
    private restService: RestService
  ) { }

  ngOnInit() {
    this.access_token = this.authService.getToken();
    this.updateStudents();
  }

  pageClickedHandler(page: number) {
    if (page >= 1 && page <= this.pages) {
      this.updateStudents(page);
    }
  }

  updateStudents(page: number = 1) {
    this.currentPage = page;
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

  createRange(number) {
    let items = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
}
