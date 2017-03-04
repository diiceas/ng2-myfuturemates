import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { TokenInfo } from './tokenInfo';
import { LocalConfig } from '../../local.config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class oAuth2Service {
  private wp_rest_api_url = LocalConfig.host;
  private oauth_url;
  private authorize_url;
  private token_url;

  constructor(private http: Http) {
    this.oauth_url = this.wp_rest_api_url + "/oauth";
    this.authorize_url = this.oauth_url + "/autorize";
    this.token_url = this.oauth_url + "/token";
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error) //replace with something more solid later
    return Promise.reject(error.message || error);
  }

  getToken(): string {
    return (JSON.parse(localStorage.getItem("access_token")) as TokenInfo).access_token;
  }

  generateNewToken(code: string, redirect_uri): Promise<TokenInfo> {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

    let searchParams = new URLSearchParams();
    searchParams.set("client_id", LocalConfig.oAuth2.client_id);
    searchParams.set("grant_type", LocalConfig.oAuth2.grant_type);
    searchParams.set("client_secret", LocalConfig.oAuth2.client_secret);
    searchParams.set("code", code);
    searchParams.set("redirect_uri", redirect_uri);

    return this.http.post(this.token_url, searchParams, { headers: headers })
      .toPromise()
      .then(rest => {
        let access_token = rest.json() as TokenInfo;
        localStorage.setItem("access_token", JSON.stringify(access_token));
        return access_token;
      })
      .catch(this.handleError);
  }
}
