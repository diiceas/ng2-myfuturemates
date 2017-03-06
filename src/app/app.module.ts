import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { RestService } from './services/rest/rest.service';
import { oAuth2Service } from './services/oAuth2/oAuth2.service';
import { QueryParserService } from './services/queryParser/query-parser.service'

import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UniComponent } from './components/uni/uni.component';

import { AccessTokenGuard } from './guards/access-token.guard';
import { PaginationComponent } from './components/pagination/pagination.component';

let routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "uni",
    component: UniComponent,
    canActivate: [AccessTokenGuard]
  }
];

export const appRoutingProviders: any[] = [
  AccessTokenGuard
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UniComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    RestService,
    oAuth2Service,
    QueryParserService,
    appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
