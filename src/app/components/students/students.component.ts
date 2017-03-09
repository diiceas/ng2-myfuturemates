import { Component, OnInit, Input, Injectable } from '@angular/core';
import { Student } from '../../entities/student'

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  @Input() students: Student[];
  
  constructor() { }
  
  ngOnInit() {
    //console.log("Students" + this.students);
   }
}
