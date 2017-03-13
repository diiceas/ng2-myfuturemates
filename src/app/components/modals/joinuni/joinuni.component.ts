import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { University } from '../../../entities/university';
import { FormBuilder, Validators } from '@angular/forms';
import { RestService } from '../../../services/rest/rest.service';
import { oAuth2Service } from '../../../services/oAuth2/oAuth2.service';
import { Student } from '../../../entities/student';
import { FbUserInfo } from '../../../entities/fbUserInfo';

declare var jQuery: any;

@Component({
  selector: 'app-joinuni-modal',
  templateUrl: './joinuni.component.html',
  styleUrls: ['./joinuni.component.css']
})
export class JoinuniComponent implements OnInit {
  @Input() uni: University;
  @Output() updateUniversity = new EventEmitter<University>();

  private showSuccessMessage = false;
  private showLoader = false;

  constructor(
    public fb: FormBuilder,
    private restService: RestService,
    private oAuth2Service: oAuth2Service
  ) { }

  ngOnInit() {
  }


  loginEventHandler(userInfo: any) {
    this.showLoader = true;
    
    let email = userInfo.email;
    let name = userInfo.name;
    let picture_url = userInfo.picture.data.url;
    let facebook_url = userInfo.link;
    let facebook_id = userInfo.id;
    let gender = userInfo.gender;

    let uni = this.uni;

    this.addStudentToUni(
      email,
      name,
      picture_url,
      facebook_url,
      facebook_id,
      gender,
      uni
    );
  }

  addStudentToUni(
    email: string,
    name: string,
    picture_url: string,
    facebook_url: string,
    facebook_id: string,
    gender: string,
    uni: University
  ) {
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

    console.log(student);

    this.restService.addStudent(
      this.oAuth2Service.getToken(),
      student
    ).then(result => {
      console.log("new student id");
      console.log(result.id);
      if (result.id) {
        this.restService.addStudentToUniversity(
          this.oAuth2Service.getToken(),
          this.uni,
          result.id
        ).then(newStudent => {
          let university: University;
          university = newStudent;          
          this.updateUniversity.emit(university);          
          this.showLoader = false;
          this.showSuccessMessage = true;
          console.log("university has been emmitted");
        })
      }
    });
  }  
}