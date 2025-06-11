import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Enemy, enemyTypes } from '../models/enemy.model';

@Injectable({ providedIn: 'root' })
export class WaveService {
  private wave = new BehaviorSubject<number>(0);
  wave$ = this.wave.asObservable();

  spawnWave(canvasWidth: number) {
    const enemies: Enemy[] = [];

    const typeCount = Math.min(this.wave.value, enemyTypes.length);

    for (let i = 0; i < typeCount * 3; i++) {
      const type = enemyTypes[i % typeCount];
      const enemyImage = new Image();
      enemyImage.src = type.image;

      enemies.push({
        x: Math.random() * (canvasWidth - 40),
        y: Math.random() * 100,
        width: 40,
        height: 30,
        image: enemyImage,
        type: type.type,
        hp: type.hp + Math.round((this.wave.value - 1) / 10) * 2,
        maxHp: type.hp + Math.round((this.wave.value - 1) / 10) * 2,
        speed: type.speed,
        canShoot: type.canShoot,
        experience: type.experience,
        shootCooldown: 1000 + Math.random() * 1000,
        lastShotTime: 0,
      });
    }

    return enemies;
  }

  nextWave(): void {
    this.wave.next(this.wave.value + 1);
  }

  getNumberWave(): number {
    return this.wave.value;
  }
}
