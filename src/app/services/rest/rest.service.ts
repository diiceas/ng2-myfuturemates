import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { oAuth2Service } from '../oAuth2/oAuth2.service';
import { LocalConfig } from '../../local.config';
import { Student } from '../../entities/student';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestService {
  private wp_rest_api_url = LocalConfig.wp_rest_api_url;
  private posts_url;
  private post_url;

  private access_token: string;

  constructor(private http: Http, private oAuth2Service: oAuth2Service) {
    this.posts_url = this.wp_rest_api_url + "/posts";
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

  getStudents(page: number, token: string, perPage: number = 10): Promise<{ students: Student[], pages: number }> {
    let url = this.wp_rest_api_url + "/students?per_page=" + perPage + "&page=" + page;
    console.log("url:" + url);
    return this.http.get(url)
      .toPromise()
      .then(function (rest: Response) {
        let students = rest.json() as Student[];
        let pages = +rest.headers.get("X-WP-TotalPages");

        return { students, pages };
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error) //replace with something more solid later
    return Promise.reject(error.message || error);
  }
}
