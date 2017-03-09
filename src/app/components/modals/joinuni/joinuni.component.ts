import { Component, OnInit, Input } from '@angular/core';
import { University } from '../../../entities/university';

@Component({
  selector: 'app-joinuni-modal',
  templateUrl: './joinuni.component.html',
  styleUrls: ['./joinuni.component.css']
})
export class JoinuniComponent implements OnInit {
  @Input() uni: University;

  constructor() { }

  ngOnInit() {
  }

}
