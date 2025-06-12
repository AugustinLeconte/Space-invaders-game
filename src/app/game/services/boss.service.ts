import { Injectable } from '@angular/core';
import { Enemy } from '../models/enemy.model';

@Injectable({ providedIn: 'root' })
export class BossService {
  private boss!: Enemy;
  frame = 0;

  initBoss(x: number, y: number) {
    this.boss.x = x;
    this.boss.y = y;
    this.boss.hp = 1000;
  }

  update(dt: number) {
    this.frame++;
    if (this.boss.firePattern) this.boss.firePattern(this);
    // déplace tourelles, gère phases selon frame/hp…
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.boss.image,
      this.boss.x - this.boss.width / 2,
      this.boss.y
    );
  }
}
