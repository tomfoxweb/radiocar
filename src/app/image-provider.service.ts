import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageProviderService {
  private readonly carImageUrl = 'assets/images/car.svg';

  constructor() {}

  getCarImage(): Promise<HTMLImageElement> {
    return this.loadImage(this.carImageUrl);
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', () => {
        resolve(image);
      });
    });
  }
}
