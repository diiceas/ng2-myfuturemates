import { Component, OnInit, EventEmitter } from '@angular/core';
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
  searchFieldChange = new EventEmitter();

  searchFieldValue: string;

  constructor(
    private router: Router
  ) { }

  searchValueChanged(value: any) {
    this.searchFieldValue = this.escapeHtml(this.searchFieldValue);
  }

  escapeHtml(unsafe: string) {
    unsafe = String(unsafe);
    return unsafe.replace("&#8217;", "'");
  }

  submitBtnClicked() {
    if (this.uni_json && this.uni_json.slug) {
      localStorage.setItem("redirect_uri", location.href + "universities/" + this.uni_json.slug);
      this.router.navigate(['/universities', this.uni_json.slug]);
    }
  }

  ngOnInit() {
  }
}
