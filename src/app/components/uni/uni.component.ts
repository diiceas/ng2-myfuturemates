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
      ).then(uni => this.uni = uni);
    });
  }

  isUniAndStudentsFound(): boolean {
    return (this.uni && this.uni.name != null);
  }

  isUniAndStudentsNotFound(): boolean {
    return this.uni && !this.uni.name;
  }

  updateUniversityHandler(university: University) {
    console.log("Updated university:");
    console.log(university);
    this.uni = university;
  }
}
