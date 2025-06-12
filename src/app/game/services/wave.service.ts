import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Enemy, enemyTypes } from '../models/enemy.model';
import { ImageService } from './image.service';

@Injectable({ providedIn: 'root' })
export class WaveService {
  private wave = new BehaviorSubject<number>(0);
  wave$ = this.wave.asObservable();

  constructor(private imageService: ImageService) {}

  spawnWave(canvasWidth: number) {
    const enemies: Enemy[] = [];

    if (this.wave.value % 10 === 0) {
      enemies.push({
        x: Math.random() * (canvasWidth - 40),
        y: Math.random() * 100,
        image: this.imageService.enemyBulletImage, //this.imageService.loadImage(bossSprite),
        //missileSprite: this.missileSprite,
        width: 256,
        height: 128,
        /*firePattern: (boss) => {
          if (boss.frame % 60 === 0) spawnMissile(boss.x, boss.y);
        },*/
        hp: 1000 + Math.round((this.wave.value - 1) / 10) * 2,
        maxHp: 1000 + Math.round((this.wave.value - 1) / 10) * 2,
        speed: 0.1,
        canShoot: false,
        experience: 100,
        shootCooldown: 1000 + Math.random() * 1000,
        lastShotTime: 0,
        shield: 0,
        type: 'boss',
      });
    } else {
      const typeCount = Math.min(this.wave.value, enemyTypes.length);

      for (let i = 0; i < typeCount * 3; i++) {
        const type = enemyTypes[i % typeCount];
        const enemyImage = this.imageService.loadImage(type.image);

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
          shield: 0,
        });
      }
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
