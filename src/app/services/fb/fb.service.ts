import { Injectable } from '@angular/core';
import { LocalConfig } from '../../local.config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FbAuthResult } from '../../entities/fbAuthResult';

declare const FB: any;

@Injectable()
export class FbService {
 
  constructor() { }

  login(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.login(result => resolve(result), { scope: 'public_profile, email' });
    });
  }

  me(): Promise<any> {
    let fields = `
      picture.width(100),
      id,
      cover,
      name,
      first_name,
      last_name,
      age_range,
      link,gender,
      locale,timezone,
      updated_time,
      verified,
      email`;
    return new Promise((resolve, reject) => {
      FB.api('/me', { fields: fields }, result => {
        resolve(result);
      });
    });
  }

  init(): void {
    FB.init({
      appId: LocalConfig.fb.appId,
      cookie: false,  // enable cookies to allow the server to access
      // the session
      xfbml: true,  // parse social plugins on this page
      version: 'v2.5' // use graph api version 2.5
    });
  }

  getLoginStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.getLoginStatus(response => {
        resolve(response);        
      })
    });
  }
}