import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { oAuth2Service } from '../oAuth2/oAuth2.service';
import { LocalConfig } from '../../local.config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestService {
  private wp_rest_api_url = LocalConfig.host;
  private posts_url;
  private post_url;

  private access_token: string;

  constructor(private http: Http, private oAuth2Service: oAuth2Service) {
    this.posts_url = this.wp_rest_api_url + "/wp-json/wp/v2/posts";
    this.post_url = this.posts_url + "/76"
  }

  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  post(title: string, content: string, token: string): Promise<string> {
    let url = this.post_url + "?access_token=" + token;
    let searchParams = new URLSearchParams();
    searchParams.set("title", title);
    searchParams.set("content", content);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post(url, searchParams, headers)
      .toPromise()
      .then(rest => rest.json().data)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error) //replace with something more solid later
    return Promise.reject(error.message || error);
  }
}
