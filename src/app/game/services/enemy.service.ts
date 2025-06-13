import { Injectable } from '@angular/core';
import { Enemy } from '../models/enemy.model';
import { BulletsService } from './bullets.service';
import { ImageService } from './image.service';
import { CanvasService } from './canvas.service';
import { PlayerService } from './player.service';
import { ExplosionService } from './explosions.service';
import { XpService } from './xp.service';
import { PowerUpService } from './powerUps.service';

@Injectable({ providedIn: 'root' })
export class EnemyService {
  private enemies: Enemy[] = [];

  constructor(
    private bulletService: BulletsService,
    private imageService: ImageService,
    private playerService: PlayerService,
    private explosionService: ExplosionService,
    private xpService: XpService,
    private powerUpService: PowerUpService
  ) {}

  public isEmpty() {
    return this.enemies.length == 0;
  }

  public addEnemies(enemies: Enemy[]) {
    enemies.forEach((enemy) => this.enemies.push(enemy));
  }

  public shoots(): void {
    this.enemies.forEach((e) => {
      if (e.canShoot) {
        const now = Date.now();
        if (now - e.lastShotTime > e.shootCooldown) {
          this.bulletService.addEnemyBullet({
            x: e.x + e.width / 2 - 2,
            y: e.y + e.height,
            width: 4,
            height: 10,
            image: this.imageService.enemyBulletImage,
            damage: 10,
            velocity: 10,
          });
          e.lastShotTime = now;
        }
      }
    });
  }

  public movement(height: number): void {
    this.enemies.forEach((e, j) => {
      e.y += e.speed;
      if (e.y >= height) {
        this.enemies.splice(j, 1);
        this.playerService.isHitted(20);
      }
    });
  }

  public removeEnemy(enemy: Enemy, index: number) {
    this.enemies.splice(index, 1);

    const frameWidth = 87.5;
    const frameHeight = 128;

    this.explosionService.addExplosion({
      x: enemy.x + enemy.width / 2 - frameWidth / 2,
      y: enemy.y + enemy.height / 2 - frameHeight / 2,
      frame: 0,
      totalFrames: 7,
      sprite: this.imageService.explosionSprite,
      frameWidth,
      frameHeight,
      frameTimer: 0,
      frameInterval: 100,
    });

    this.xpService.gainXp(enemy.experience);

    this.powerUpService.trySpawnPowerUp(enemy.x, enemy.y);
  }

  public takeDamage(index: number, damage: number): void {
    this.enemies[index].hp -= damage;
    if (this.enemies[index].hp <= 0)
      this.removeEnemy(this.enemies[index], index);
  }

  public getEnemies(): Enemy[] {
    return this.enemies;
  }

  getEnemy(index: number): Enemy {
    return this.enemies[index];
  }

  public getClosestEnemy(x: number, y: number): Enemy | null {
    let closest: Enemy | null = null;
    let minDist = Infinity;

    for (const enemy of this.enemies) {
      const dx = enemy.x - x;
      const dy = enemy.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        closest = enemy;
      }
    }

    return closest;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.enemies.forEach((e) => {
      ctx.drawImage(e.image, e.x, e.y, e.width, e.height);

      ctx.fillStyle = 'black';
      ctx.fillRect(e.x, e.y - 6, e.width, 4);

      ctx.fillStyle = 'red';
      ctx.fillRect(e.x, e.y - 6, e.width * (e.hp / e.maxHp), 4);
    });
  }
}
