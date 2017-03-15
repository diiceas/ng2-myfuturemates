import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RestService } from '../../services/rest/rest.service';
import { oAuth2Service } from '../../services/oAuth2/oAuth2.service';
import { University } from '../../entities/university';
import { Student } from '../../entities/student';
import { FbService } from '../../services/fb/fb.service';
import { JoinuniComponent } from '../modals/joinuni/joinuni.component';

@Component({
  selector: 'app-uni',
  templateUrl: './uni.component.html',
  styleUrls: ['./uni.component.css'],
  providers: [FbService]
})

export class UniComponent implements OnInit {
  slug: string;
  uni: University;
  isJoinedToUni = true;
  @ViewChild(JoinuniComponent) joinuniComponent: JoinuniComponent;

    constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private oAuth2Service: oAuth2Service,
    private fbService: FbService
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.slug = params["slug"];
      this.restService.getUniversity(
        this.slug,
        this.oAuth2Service.getToken()
      ).then(uni => {
        this.uni = uni;
        //console.log(uni);

        this.fbService.init();

        // this.fbService.getLoginStatus().then(result => {          
        //   console.log(result);
        // });
        this.updateJoinedStatus();

      });
    });
  }

  updateJoinedStatus() {
    this.fbService.getLoginStatus().then(result => {
      console.log(result);
      if (result.status === "connected") {
        console.log("userID: " + result.authResponse.userID);
        console.log(this.uni.students);
        this.isJoinedToUni = this.uni.students.filter(student =>
          // 1==1
          //console.log(student)
          student.acf.facebook_id == result.authResponse.userID
        ).length > 0;
      } else {
        this.isJoinedToUni = false;
      }

      console.log(this.isJoinedToUni);
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
    this.updateJoinedStatus();
  }

  login(): void {
    this.joinuniComponent.login();
    this.isJoinedToUni = true;
  }
}
