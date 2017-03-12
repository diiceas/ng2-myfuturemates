import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { University } from '../../../entities/university';
import { FormBuilder, Validators } from '@angular/forms';
import { RestService } from '../../../services/rest/rest.service';
import { oAuth2Service } from '../../../services/oAuth2/oAuth2.service';
import { Student } from '../../../entities/student';

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
  student: Student;

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
    start_year: ["", Validators.required]
  });

  submittedFormHandler(event) {
    jQuery("#myModal").modal("hide");

    this.student = {
      acf: {
        facebook_url: this.addStudentForm.value.facebook_url,
        from_country: this.addStudentForm.value.from_country
      },
      title: {
        rendered: this.addStudentForm.value.name
      }
    } as Student;

    this.restService.addStudent(
      this.oAuth2Service.getToken(),
      this.student
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

