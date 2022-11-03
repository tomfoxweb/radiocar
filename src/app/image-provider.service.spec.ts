import { TestBed } from '@angular/core/testing';

import { ImageProviderService } from './image-provider.service';

describe('ImageProviderService', () => {
  let service: ImageProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
