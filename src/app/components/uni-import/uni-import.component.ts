import { Component, OnInit } from '@angular/core';
import { JsonService } from '../../services/json/json.service';
import { RestService } from '../../services/rest/rest.service';
import { oAuth2Service } from '../../services/oAuth2/oAuth2.service';
import { University } from '../../entities/university';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import { LocalConfig } from '../../local.config';

@Component({
  selector: 'app-uni-import',
  templateUrl: './uni-import.component.html',
  styleUrls: ['./uni-import.component.css']
})
export class UniImportComponent {
  private worldUniversitiesJsonURL: string;
  private wordpressUniversitiesJsonURL = LocalConfig.universities.wordpress.jsonURL; //for label use only. Delete later if not needed
  private worldUniversitiesSearchApiUrl = LocalConfig.universities.world.searchApiURL; //for label use only. Delete later if not needed
  private wordpressUniversitiesAdminUrl = LocalConfig.universities.wordpress.adminURL; //for label use only. Delete later if not needed
  private readonly countToImport = 50;

  constructor(
    private jsonService: JsonService,
    private restService: RestService,
    private oAuth2Service: oAuth2Service,
    private route: ActivatedRoute
  ) {
    this.worldUniversitiesJsonURL = jsonService.worldUniversitiesJsonURL;
  }

  import() {
    this.jsonService.getUniversities(this.countToImport)
      .subscribe(result => this.addUniArray(result as University[]));
  }

  addUniArray(universities: University[]) {
    universities.forEach(uni => this.addNewUni(uni));
  }

  addNewUni(uni: University) {
    this.restService.addUniversity(
      this.oAuth2Service.getToken(),
      uni
    );
  }
}