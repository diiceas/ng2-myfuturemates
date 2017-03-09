import { Component, OnInit } from '@angular/core';
import { JsonService } from '../../services/json/json.service';
import { RestService } from '../../services/rest/rest.service';
import { oAuth2Service } from '../../services/oAuth2/oAuth2.service';
import { University } from '../../entities/university';
import { ActivatedRoute, Params } from '@angular/router';
//import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-uni-import',
  templateUrl: './uni-import.component.html',
  styleUrls: ['./uni-import.component.css']
})
export class UniImportComponent {

  constructor(
    private jsonService: JsonService,
    private restService: RestService,
    private oAuth2Service: oAuth2Service,
    private route: ActivatedRoute
  ) { }

  import() {
    this.jsonService.getJSON()
      // .map(
      // res => {
      //console.log(res)        
      //this.addNewUni(res[0] as University);
      //})
      .subscribe(result => this.addUniArray(result as University[]));
  }

  addUniArray(universities: University[]) {
    //console.log(universities);
    universities.forEach(uni => this.addNewUni(uni));
  }

  addNewUni(uni: University) {
    this.restService.addUniversity(
      this.oAuth2Service.getToken(),
      uni
    );

    //  this.restService.post("bbbbbbbbbbbbbbbbbbb", "aaaaaaaaa", this.oAuth2Service.getToken());
    //console.log(uni);
  }


  // ngOnInit(): void {
  //   this.route.fragment.subscribe(x => {
  //     console.log(x);
  //   });

  //   this.route.params
  //     .map((params: Params) => params["id"])
  //     .subscribe(result => console.log(result));
  // }

}
