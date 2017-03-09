import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RestService } from '../../services/rest/rest.service';
import { oAuth2Service } from '../../services/oAuth2/oAuth2.service';
import { University } from '../../entities/university';
import { Student } from '../../entities/student';

@Component({
  selector: 'app-uni',
  templateUrl: './uni.component.html',
  styleUrls: ['./uni.component.css']
})

export class UniComponent implements OnInit {
  slug: string;
  uni: University;
  students: Student[];

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private oAuth2Service: oAuth2Service
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.slug = params["slug"];
      this.restService.getUniversity(
        this.slug,
        this.oAuth2Service.getToken()
      ).then(json =>
        this.uni = this.getUniversityByJSON(json)
        );
    });
  }

  private getUniversityByJSON(json: any): University {
    return json ? {
      name: json.title.rendered,
      country: json.acf.country,
      alpha_two_code: json.acf.alpha_two_code,
      domain: json.acf.domain,
      web_page: json.acf.web_page
    } : {} as University;
  }

  loadStudentsHandler(students: Student[]) {
    //console.log(students);
    this.students = students;
  }

  isUniAndStudentsFound(): boolean {
    return (this.uni && this.uni.name && this.students != null);
  }

  isUniAndStudentsNotFound(): boolean {
    return this.uni && !this.uni.name && this.students && this.students.length == 0;
  }
}
