import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageService {
  loadImage = (src: string) => {
    const img = new Image();
    img.src = src;
    return img;
  };
}
