import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalConfig } from '../../../local.config'

@Component({
  selector: 'app-uni-search-form',
  templateUrl: './uni-search.component.html',
  styleUrls: ['./uni-search.component.css']
})
export class UniSearchComponent implements OnInit {
  uniSource = LocalConfig.universities.wordpress.jsonSearchURL;
  private uni_json: any;

  constructor(
    private router: Router
  ) { }

  submitBtnClicked() {
    if (this.uni_json && this.uni_json.slug) {
      localStorage.setItem("redirect_uri", location.href + "uni/" + this.uni_json.slug);
      this.router.navigate(['/uni', this.uni_json.slug]);
    }
  }

  ngOnInit() {
  }
}
