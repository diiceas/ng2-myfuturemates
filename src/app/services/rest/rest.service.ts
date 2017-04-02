import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
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
    this.uni_url = this.wp_rest_api_url + "/universities";
    this.students_url = this.wp_rest_api_url + "/students";
  }

  addStudent(token: any, student: Student, nonce: string): Promise<Student> {
    let url = this.students_url;

    if (token && token.length > 0)
      url += "?access_token=" + token;

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

    return new Promise((resolve, reject) => {
      var createPost = new XMLHttpRequest();      
      createPost.open("POST", url);      
      createPost.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      if (nonce && nonce.length > 0) {
        createPost.setRequestHeader("X-WP-Nonce", nonce);
      }
      if (LocalConfig.basicAuthorization.enabled) {        
         createPost.setRequestHeader("Authorization", LocalConfig.basicAuthorization.balueBase64);
      }
      createPost.send(JSON.stringify(body));
      createPost.onreadystatechange = function () {
        if (createPost.readyState == 4) {
          if (createPost.status == 201) {            
            resolve(JSON.parse(createPost.response.split("</body>")[1]));
          } else {
            alert("Error - try again.");
          }
        }
      }
    });
  }

  getUniversity(uni: string): Promise<University> {
    let url = this.wp_rest_api_url + "/universities?slug=" + uni;
    return this.http.get(url)
      .toPromise()
      .then(results => {
        let parsedUni = this.parseUniJson(results.json()[0]);
        return parsedUni;
      }).catch(this.handleError);
  }

  getStudent(facebook_id: number): Promise<Student> {
    let url = this.students_url + "?per_page=" + 100; //!!! update this later in order to prevent creation of doublicates when amount of users is more than 100
    return this.http.get(url)
      .toPromise()
      .then(results => {
        let students = results.json().filter((student: Student) => +student.acf.facebook_id == facebook_id);
        if (students.length > 0)
          return students[0] as Student;
        return {} as Student;
      }).catch(this.handleError);
  }

  private parseUniJson(json): University {
    let students: Student[];

    if (json && json.acf.students) {
      students = json.acf.students.map(student => ({
        id: student.ID,
        acf: {
          facebook_url: student.acf.facebook_url,
          from_country: student.acf.from_country,
          email: student.acf.email,
          picture_url: student.acf.picture_url,
          facebook_id: student.acf.facebook_id,
          gender: student.acf.gender
        },
        title: {
          rendered: student.post_title
        }
      } as Student));
    } else {
      students = [] as Student[];
    };

    return json ? new University(
      json.acf.alpha_two_code,
      json.acf.country,
      json.acf.domain,
      json.title.rendered,
      json.acf.web_page,
      json.id,
      students
    ) : {} as University;
  }

  addUniversity(token: string, uni: University, nonce: string): Promise<any> {
    let url = this.uni_url;

    if (token && token.length > 0)
      url += "?access_token=" + token;

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
    if (nonce && nonce.length > 0) {
      headers.append("X-WP-Nonce", nonce);
    }

    if (LocalConfig.basicAuthorization.enabled) {
      headers.append("Authorization", LocalConfig.basicAuthorization.balueBase64);
    }

    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, body, options)
      .toPromise()
      .then(result => {
        return result.json();
      })
      .catch(this.handleError);
  }

  addStudentToUniversity(token: string, uni: University, student_id: number, nonce: string): Promise<University> {
    let url = this.uni_url + "/" + uni.id;

    if (token && token.length > 0)
      url += "?access_token=" + token;

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
    if (nonce && nonce.length > 0) {
      headers.append("X-WP-Nonce", nonce);
    }

    if (LocalConfig.basicAuthorization.enabled) {
      headers.append("Authorization", LocalConfig.basicAuthorization.balueBase64);
    }

    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options)
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
