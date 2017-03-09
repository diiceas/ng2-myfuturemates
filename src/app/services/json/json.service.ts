import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class JsonService {

  constructor(private http: Http) {
    var obj;
    this.getJSON().subscribe(data => obj = data, error => console.log(error));
  }

  public getJSON(): Observable<any> {
     //return this.http.get("https://jsonplaceholder.typicode.com/posts")
     return this.http.get("https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json")
      .map((res: any) => res.json().slice(0,40))      
      .catch(this.handleError);
      // .catch((error: any) => {
      //   console.log(error); return null;
      // });
  }

   private handleError(error: any): Promise<any> {
    console.error('An error occured', error) //replace with something more solid later
    return Promise.reject(error.message || error);
  }
}