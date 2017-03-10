import { Component, OnInit, Input } from '@angular/core';
import { oAuth2Service } from '../../services/oAuth2/oAuth2.service';
import { RestService } from '../../services/rest/rest.service';
import { Student } from '../../entities/student';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-students-with-paging',
  templateUrl: './students-with-paging.component.html',
  styleUrls: ['./students-with-paging.component.css']
})
export class StudentsWithPagingComponent implements OnInit {
  @Input() students: Student[];
  access_token: string;

  pages = 1;
  readonly perPage = 10;
  currentPage: number = 1;

  constructor(
    private authService: oAuth2Service,
    private restService: RestService
  ) { }

  ngOnInit() {
    this.access_token = this.authService.getToken();
  }

  pageChangedHandler(page: number) {
    this.currentPage = page;

  }
  }
