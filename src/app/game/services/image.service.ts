import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageService {
  public bulletImage!: HTMLImageElement;
  public enemyBulletImage!: HTMLImageElement;
  public explosionSprite!: HTMLImageElement;

  public loadImage = (src: string) => {
    const img = new Image();
    img.src = src;
    return img;
  };

  public initImages() {
    this.enemyBulletImage = this.loadImage('assets/space/enemyBullet.png');
    this.bulletImage = this.loadImage('assets/space/bullet.png');
    this.explosionSprite = this.loadImage('assets/space/explosion.png');
  }
}
