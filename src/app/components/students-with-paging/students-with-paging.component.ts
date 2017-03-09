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
  @Input() uni: string;
  @Output() loadStudents = new EventEmitter<Student[]>();

  access_token: string;
  students: Student[];
  pages: number;
  readonly perPage = 10;
  currentPage: number = 1;

  constructor(
    private authService: oAuth2Service,
    private restService: RestService
  ) { }

  ngOnInit() {
    this.access_token = this.authService.getToken();
    this.updateStudents(this.currentPage);
  }

  pageChangedHandler(page: number) {
    this.currentPage = page;
    this.updateStudents(page);
  }

  updateStudents(page: number) {
    if (this.uni) {
      this.restService.getUniversity(
        this.uni,
        this.access_token
      ).then(university => {
        if (university && university.acf.students) {
          this.students = university.acf.students.map(student => ({
            acf: {
              facebook_url: student.acf.facebook_url,
              from_country: student.acf.from_country
            },
            title: {
              rendered: student.post_title
            }
          } as Student));
        } else {
          this.students = [] as Student[];
        }
        //console.log(this.students);
        this.pages = 1;
        this.loadStudents.emit(this.students);
      });
    } else {
      this.restService.getStudents(
        page,
        this.access_token,
        this.perPage
      ).then(res => {
        this.students = res.students;
        this.pages = res.pages;
        //console.log(this.students);
        this.loadStudents.emit(this.students);
      });
    };
  }
}
