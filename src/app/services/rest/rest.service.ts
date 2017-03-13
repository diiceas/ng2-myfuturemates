import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { oAuth2Service } from '../oAuth2/oAuth2.service';
import { LocalConfig } from '../../local.config';
import { Student } from '../../entities/student';
import { University } from '../../entities/university';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestService {
  private wp_rest_api_url = LocalConfig.wp_rest_api_url;
  private posts_url;
  private post_url;
  private uni_url;
  private students_url;

  private access_token: string;

  constructor(private http: Http, private oAuth2Service: oAuth2Service) {
    this.posts_url = this.wp_rest_api_url + "/posts";
    this.post_url = this.posts_url + "/76"
    this.uni_url = this.wp_rest_api_url + "/universities";
    this.students_url = this.wp_rest_api_url + "/students";
  }

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
    return this.http.get(url)
      .toPromise()
      .then(function (rest: Response) {
        let students = rest.json() as Student[];
        let pages = +rest.headers.get("X-WP-TotalPages");

        return { students, pages };
      })
      .catch(this.handleError);
  }

  addStudent(token: any, student: any): Promise<any> {
    let url = this.students_url + "?access_token=" + token;
    let fields = {
      "from_country": student.acf.from_country,
      "email": student.acf.email,      
      "picture_url": student.acf.picture_url,
      "facebook_url": student.acf.facebook_url,
      "facebook_id": student.acf.facebook_id,
      "gender": student.acf.gender
    };

    let body = {
      "title": student.title.rendered,
      "status": "publish",
      "fields": fields
    };

    let headers = new Headers({ 'Content-Type': 'application/json' });

    console.log(body);

    return this.http.post(url, body, headers)
      .toPromise()
      .then(result => {
        console.log("Student has been added. Additional info: " + result.json());
        return result.json();
      })
      .catch(this.handleError);
  }

  getUniversity(uni: string, token: string): Promise<University> {
    let url = this.wp_rest_api_url + "/universities?slug=" + uni;
    return this.http.get(url)
      .toPromise()
      .then(results => {
        let parsedUni = this.parseUniJson(results.json()[0]);
        return parsedUni;
      }).catch(this.handleError);
  }

  private parseUniJson(json): University {
    let students: Student[];

    if (json && json.acf.students) {
      students = json.acf.students.map(student => ({
        id: student.ID,
        acf: {
          facebook_url: student.acf.facebook_url,
          from_country: student.acf.from_country
        },
        title: {
          rendered: student.post_title
        }
      } as Student));
    } else {
      students = [] as Student[];
    };

    return json ? {
      id: json.id,
      name: json.title.rendered,
      country: json.acf.country,
      alpha_two_code: json.acf.alpha_two_code,
      domain: json.acf.domain,
      web_page: json.acf.web_page,
      students: students
    } : {} as University;
  }

  addUniversity(token: string, uni: University): Promise<any> {
    let url = this.uni_url + "?access_token=" + token;

    let fields = {
      "country": uni.country,
      "web_page": uni.web_page,
      "domain": uni.domain,
      "alpha_two_code": uni.alpha_two_code
    };

    let body = {
      "title": uni.name,
      "status": "publish",
      "fields": fields
    };

    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post(url, body, headers)
      .toPromise()
      .then(result => {
        return result.json();
      })
      .catch(this.handleError);
  }

  addStudentToUniversity(token: string, uni: University, student_id: number): Promise<any> {
    let url = this.uni_url + "/" + uni.id + "?access_token=" + token;

    let mappedStudents = uni.students.map(item => item.id);
    mappedStudents.push(student_id);

    let fields = {
      "students": mappedStudents
    };

    let body = {
      "title": uni.name,
      "status": "publish",
      "fields": fields
    };

    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post(url, body, headers)
      .toPromise()
      .then(result => {
        return this.parseUniJson(result.json());
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error) //replace with something more solid later
    return Promise.reject(error.message || error);
  }
}
