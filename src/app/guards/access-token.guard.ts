import { Injectable } from '@angular/core';
import {
    CanActivate,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
    Router
} from '@angular/router';
import { oAuth2Service } from '../services/oAuth2/oAuth2.service';
import { QueryParserService } from '../services/queryParser/query-parser.service';
import { LocalConfig } from '../local.config';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private queryService: QueryParserService,
        private oAuth2Service: oAuth2Service,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let queryParams = this.queryService.Parse(location.href);
        let access_token = localStorage.getItem("access_token");
        if (!access_token) {
            let code = queryParams["code"];
            let redirect_uri = localStorage.getItem("redirect_uri");
            if (code && redirect_uri) {
                this.oAuth2Service.generateNewToken(code, redirect_uri).then(res => {
                    localStorage.removeItem("redirect_uri");
                    location.href = redirect_uri;
                });
            }
            else {
                let authorize_path = LocalConfig.host + "/oauth/authorize/";
                let client_id = LocalConfig.oAuth2.client_id;
                let redirect_uri = location.href;
                localStorage.setItem("redirect_uri", redirect_uri);
                let response_type = "code";

                let redirectUrl = authorize_path;
                redirectUrl += "?client_id=" + client_id;
                redirectUrl += "&redirect_uri=" + redirect_uri;
                redirectUrl += "&response_type=" + response_type;

                location.href = redirectUrl;
            }
        }

        return true;
    }
}