import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { RestService } from '../../services/rest/rest.service'
import { oAuth2Service } from '../../services/oAuth2/oAuth2.service'
import { University } from '../../entities/university'
import { Student } from '../../entities/student'
import { FbService } from '../../services/fb/fb.service'
import { FbAuthResult, AuthResponse } from '../../entities/fbAuthResult'
import { FbMeInfo } from '../../entities/fbMeInfo'
import { FbUserInfo } from '../../entities/fbUserInfo'

declare var jQuery:any;

@Component({
  selector: 'app-uni',
  templateUrl: './uni.component.html',
  styleUrls: ['./uni.component.css'],
  providers: [FbService]
})
export class UniComponent implements OnInit {
  slug: string;
  uni: University;
  nonce: string;
  user: FbUserInfo;

  private showSuccessMessage = false;
  private showAlreadyJoinedMessage = false;
  private showLoader = false;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private oAuth2Service: oAuth2Service,
    private fbService: FbService
  ) {
    this.initUserInfo();
  }

  initUserInfo() {
    this.user = new FbUserInfo(
      {
        authResponse: {} as AuthResponse,
        status: "initialized"
      } as FbAuthResult,
      false
    );
  }

  ngOnInit() {   
    this.nonce = jQuery("#nonce").val();
    
    this.route.params.subscribe(params => {
      this.slug = params["slug"];
      this.restService.getUniversity(
        this.slug        
      ).then(uni => {
        this.uni = uni;
        this.fbService.init();
        this.updateUserInfo();
      });
    });
  }

  showJoinButton(): boolean {
    if (this.showLoader)
      return false;

    if (this.user.isInitialized()) {
      return false;
    }

    if (this.user.isConnedted()) {
      if (!this.user.isJoinedToUni()) {
        console.log("user is authorized but is not related to the university");
        return true; //user is authorized but is not related to the university
      } else {
        console.log("user is authorized and is related to the university; no need to show the button");
        return false; // user is authorized and is related to the university; no need to show the button
      }
    } else {
      console.log("user is not authorized");
      return true; //user is not authorized, and it's not clear if user is joined to uni yet    
    }
  }

  getUserInfo(): Promise<FbUserInfo> {
    return new Promise((resolve, reject) => {
      this.fbService.getLoginStatus().then(result => {
        let joinedToUni = false;
        let authResult = {} as FbAuthResult;

        authResult = result;

        if (authResult.status === "connected") {
          let uniStudentsFiltered = this.uni.students.filter(
            student => +student.acf.facebook_id == authResult.authResponse.userID
          );

          if (uniStudentsFiltered.length > 0) {
            joinedToUni = true;
          }
        }

        let user = new FbUserInfo(authResult, joinedToUni);
        resolve(user);
      });
    });
  }

  updateUserInfo() {
    return new Promise<FbUserInfo>((resolve, reject) => this.getUserInfo().then(user => {
      this.user = user;
      resolve(user);
    }));
  }

  isUniAndStudentsFound(): boolean {
    return (this.uni && this.uni.name != null);
  }

  isUniAndStudentsNotFound(): boolean {
    return this.uni && !this.uni.name;
  }

  login(): void {
    if (!this.user.isConnedted()) {
      this.fbService.login().then((result: FbAuthResult) => {
        if (result.status === "connected") {
          this.updateUserInfo().then(user => {
            if (user.isConnedted()) {
              if (!user.isJoinedToUni()) {
                this.showLoader = true;
                this.joinUserToUni(user).then(university => {
                  this.joinedToUserToUniHandler(university);
                });
              } else {
                let uniStudentsFiltered = this.uni.students.filter(
                  student => +student.acf.facebook_id == user.getFacebookId()
                );

                this.showAlreadyJoinedMessage = true;
                this.showLoader = false;
              }
            } else {
              throw ("@diiceas: user is supposed to be connected after login but it is not");
            }
          })
        } else {
          //user somehow did not manage to login
          throw ("@diiceas: user is failed to login");
        }
      });
    }
    else {
      if (!this.user.isJoinedToUni()) {
        this.showLoader = true;
        this.joinUserToUni(this.user).then(university => {
          this.joinedToUserToUniHandler(university);
        });
      }
      else {
        throw ("@diiceas: user is already joined to university, no need to join again");
      }
    }
  }

  joinedToUserToUniHandler(university: University) {
    this.uni = university;
    this.updateUserInfo().then(() => {
      this.showLoader = false;
      this.showSuccessMessage = true;
    });
  }

  joinUserToUni(user: FbUserInfo): Promise<University> {
    return new Promise((resolve, reject) => {
      this.restService.getStudent(
        user.getFacebookId()).then(student => {
          //if user exists, it will be added to the university
          if (student.id) {
            this.addStudentToUni(student.id, this.uni).then(university => resolve(university));
          }
          else { //if user does not exist it will be created and added to the university
            this.fbService.me().then(res => {
              let newStudent = this.ConvertToStudent(res);
              this.createStudent(newStudent).then(student => {
                this.addStudentToUni(student.id, this.uni).then(university => resolve(university));
              });
            });
          }
        });
    });
  }

  createStudent(newStudent: Student): Promise<Student> {
    return new Promise((resolve, reject) => {
      this.restService.addStudent(
        this.oAuth2Service.getToken(),
        newStudent,
        this.nonce
      ).then(student => resolve(student));
    });
  }

  ConvertToStudent(userInfo: FbMeInfo): Student {
    let email = userInfo.email;
    let name = userInfo.name;
    let picture_url = userInfo.picture.data.url;
    let facebook_url = userInfo.link;
    let facebook_id = userInfo.id;
    let gender = userInfo.gender;

    let uni = this.uni;

    let student = {
      id: -1,
      acf: {
        from_country: "?",
        email: email,
        picture_url: picture_url,
        facebook_url: facebook_url,
        facebook_id: facebook_id,
        gender: gender,
      },
      title: {
        rendered: name
      }
    } as Student;

    return student;
  }

  addStudentToUni(
    studentId: number,
    uni: University
  ): Promise<University> {
    return this.restService.addStudentToUniversity(
      this.oAuth2Service.getToken(),
      this.uni,
      studentId,
      this.nonce
    );
  }

  getJoinedStudentInfo(): Student {
    return this.uni.getStudentByUserInfo(this.user);
  }
}
