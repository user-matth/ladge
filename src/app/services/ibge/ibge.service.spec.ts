/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IbgeService } from './ibge.service';

describe('Service: Ibge', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IbgeService]
    });
  });

  it('should ...', inject([IbgeService], (service: IbgeService) => {
    expect(service).toBeTruthy();
  }));
});
