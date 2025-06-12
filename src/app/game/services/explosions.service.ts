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
}
