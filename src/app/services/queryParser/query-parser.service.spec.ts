/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QueryParserService } from './query-parser.service';

describe('QueryParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryParserService]
    });
  });

  it('should ...', inject([QueryParserService], (service: QueryParserService) => {
    expect(service).toBeTruthy();
  }));
});
