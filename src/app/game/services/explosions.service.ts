import { Injectable } from '@angular/core';
import { Explosion } from '../models/explosion.model';

@Injectable({ providedIn: 'root' })
export class ExplosionService {
  private explosions: Explosion[] = [];

  public addExplosion(explosion: Explosion): void {
    this.explosions.push(explosion);
  }

  public getExplosions(): Explosion[] {
    return this.explosions;
  }

  public filterExistingExplosions() {
    this.explosions = this.explosions.filter((e) => e.frame < e.totalFrames);
  }

  public gestionExplosions(deltaTime: number) {
    const explosions = this.getExplosions();
    explosions.forEach((e) => {
      e.frameTimer += deltaTime;
      if (e.frameTimer >= e.frameInterval) {
        e.frame++;
        e.frameTimer = 0;
      }
    });
    this.filterExistingExplosions();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.explosions.forEach((e) => {
      const col = e.frame;
      ctx.drawImage(
        e.sprite,
        col * e.frameWidth,
        0,
        e.frameWidth,
        e.frameHeight,
        e.x,
        e.y,
        e.frameWidth,
        e.frameHeight
      );
    });
  }
}
