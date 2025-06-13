import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Missile } from '../models/entity.model';
import { EnemyService } from './enemy.service';
import { v4 as uuidv4 } from 'uuid';
import { ImageService } from './image.service';

@Injectable({ providedIn: 'root' })
export class MissileService {
  private missiles: Missile[] = [];

  constructor(
    private enemyService: EnemyService,
    private imageService: ImageService
  ) {}

  launchMissile(x: number, y: number, damage: number, radius: number = 50) {
    const target = this.enemyService.getClosestEnemy(x, y);
    if (!target) return;

    const missile: Missile = {
      id: uuidv4(),
      x,
      y,
      width: 64,
      height: 64,
      image: this.imageService.loadImage(
        'assets/space/bullets/Missile/Missile_1_Explosion_000.png'
      ),
      speed: 3,
      target,
      radius,
      damage,
      velocity: 10,
      angle: 0,
    };

    this.missiles.push(missile);
  }

  public updateMissiles() {
    const updatedMissiles = this.missiles
      .map((missile) => {
        const targetCenterX = missile.target.x + missile.target.width / 2;
        const targetCenterY = missile.target.y + missile.target.height / 2;
        const missileCenterX = missile.x;
        const missileCenterY = missile.y;

        const dx = targetCenterX - missileCenterX;
        const dy = targetCenterY - missileCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          this.explode(missile);
          return null;
        }

        const vx = (dx / distance) * missile.speed;
        const vy = (dy / distance) * missile.speed;
        const angle = Math.atan2(dy, dx);

        return {
          ...missile,
          x: missile.x + vx,
          y: missile.y + vy,
          angle,
        };
      })
      .filter((m): m is Missile => m !== null);

    this.missiles = updatedMissiles;
  }

  private explode(missile: Missile) {
    const enemies = this.enemyService.getEnemies();
    enemies.forEach((enemy, index) => {
      const dx = enemy.x - missile.x;
      const dy = enemy.y - missile.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= missile.radius) {
        this.enemyService.takeDamage(index, missile.damage);
      }
    });
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.missiles.forEach((m) => {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.angle);
      ctx.drawImage(m.image, -m.width / 2, -m.height / 2, m.width, m.height);
      ctx.restore();
    });
  }
}
