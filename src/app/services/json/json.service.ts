import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LocalConfig } from '../../local.config'

@Injectable()
export class JsonService {
  worldUniversitiesJsonURL = LocalConfig.universities.world.jsonURL;

  constructor(private http: Http) {
  }

  public getUniversities(count: number): Observable<any> {
    return this.http.get(this.worldUniversitiesJsonURL)
      .map((res: any) => res.json().slice(0, count))
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error) //replace with something more solid later
    return Promise.reject(error.message || error);
  }
}