import { Injectable } from '@angular/core';
import { Bullet } from '../models/entity.model';

@Injectable({ providedIn: 'root' })
export class BulletsService {
  private enemyBullets: Bullet[] = [];
  private bullets: Bullet[] = [];

  public addBullet(bullet: Bullet) {
    this.bullets.push(bullet);
  }

  public addEnemyBullet(bullet: Bullet) {
    this.enemyBullets.push(bullet);
  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  public getEnemyBullets(): Bullet[] {
    return this.enemyBullets;
  }

  public removeBullet(index: number) {
    this.bullets.splice(index, 1);
  }

  public removeEnemyBullet(index: number) {
    this.enemyBullets.splice(index, 1);
  }

  public bulletMovement() {
    this.bullets.forEach((b) => (b.y -= 7));

    this.bullets = this.bullets.filter((b) => b.y > 0);

    this.enemyBullets.forEach((b) => (b.y += 4));
  }
}
