import { Injectable } from '@angular/core';

@Injectable()
export class QueryParserService {

  constructor() { }

  Parse(variable): Array<string> {
    var urlParams;
    var match,
      pl = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
      urlParams[decode(match[1])] = decode(match[2]);
      return urlParams;
  }
}
