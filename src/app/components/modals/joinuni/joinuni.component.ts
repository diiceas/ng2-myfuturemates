import { Component, OnInit, Input } from '@angular/core';
import { University } from '../../../entities/university';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-joinuni-modal',
  templateUrl: './joinuni.component.html',
  styleUrls: ['./joinuni.component.css']
})
export class JoinuniComponent implements OnInit {
  @Input() uni: University;
  default_start_year = 2017;

  constructor(public fb: FormBuilder) { }

  ngOnInit() {
    this.addStudentForm.setValue({
      start_year: this.default_start_year,
      name: "",
      facebook_url: "",
      from_country: ""
    });
  }

  public addStudentForm = this.fb.group({
    name: ["", Validators.required],
    from_country: ["", Validators.required],
    facebook_url: ["", Validators.required],
    start_year: ["", Validators.required]
  });

  submittedFormHandler(event) {
    console.log(this.addStudentForm.value);
  }
}

