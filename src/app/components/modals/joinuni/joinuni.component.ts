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

  default_start_year = 2017;
  joined = false;

  constructor(
    public fb: FormBuilder,
    private restService: RestService,
    private oAuth2Service: oAuth2Service
  ) { }

  ngOnInit() {
    this.clearForm();
  }

  clearForm() {
    this.addStudentForm.setValue({
      start_year: this.default_start_year,
      name: "",
      facebook_url: "",
      from_country: ""
    });
  }

  prepopulate() {
    this.addStudentForm.setValue({
      start_year: this.default_start_year,
      name: "Yury TATSENKA",
      facebook_url: "https://www.facebook.com/yury.tatsenka",
      from_country: "Belarus"
    });
  }

  public addStudentForm = this.fb.group({
    name: ["", Validators.required],
    from_country: ["", Validators.required],
    facebook_url: ["", Validators.required],
    start_year: [{ value: '', disabled: true }, Validators.required]
  });

  loginEventHandler(userInfo: any) {
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
    facebook_id: number,
    gender: string,
    uni: University
  ) {
    let student = {
      acf: {
        from_country: "?",
        email: email,
        picture_url: picture_url,
        facebook_url: facebook_url,
        facebook_id: facebook_id,
        gender: gender
      },
      title: {
        rendered: name
      }
    };

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
          this.clearForm();
          this.updateUniversity.emit(university);
          this.joined = true;
          console.log("university has been emmitted");
        })
      }
    });
  }  
}

