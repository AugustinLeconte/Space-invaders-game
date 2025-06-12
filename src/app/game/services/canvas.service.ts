import { Injectable } from '@angular/core';
import { Bullet } from '../models/entity.model';
import { BehaviorSubject } from 'rxjs';
import { ImageService } from './image.service';
import { PlayerService } from './player.service';
import { BulletsService } from './bullets.service';
import { EnemyService } from './enemy.service';
import { ExplosionService } from './explosions.service';

@Injectable({ providedIn: 'root' })
export class CanvasService {
  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;

  constructor(
    private imageService: ImageService,
    private playerService: PlayerService,
    private bulletService: BulletsService,
    private enemyService: EnemyService,
    private explosionService: ExplosionService
  ) {}

  initCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    const playerImage = this.imageService.loadImage('assets/space/player.png');
    playerImage.onload = () => {
      this.ctx.drawImage(playerImage, 100, 100, 40, 30);
    };
  }

  public resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public draw() {
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /*if (this.transitioning && this.nextBackgroundImage) {
      this.ctx.globalAlpha = 1 - this.backgroundAlpha;
      if (this.backgroundImage) {
        this.ctx.drawImage(
          this.backgroundImage,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      }

      this.ctx.globalAlpha = this.backgroundAlpha;
      this.ctx.drawImage(
        this.nextBackgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      this.ctx.globalAlpha = 1;

      this.backgroundAlpha += 0.02;

      if (this.backgroundAlpha >= 1) {
        this.backgroundImage = this.nextBackgroundImage!;
        this.nextBackgroundImage = undefined;
        this.transitioning = false;
        this.backgroundAlpha = 1;
      }
    } else {
      if (this.backgroundImage) {
        this.ctx.drawImage(
          this.backgroundImage,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      }
    }*/

    const player = this.playerService.getPlayer();
    this.ctx.drawImage(
      player.image,
      player.x,
      player.y,
      player.width,
      player.height
    );

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(player.x, player.y - 6, player.width, 4);

    this.ctx.fillStyle = 'lime';
    this.ctx.fillRect(
      player.x,
      player.y - 6,
      player.width * (player.hp / player.maxHp),
      4
    );

    const explosions = this.explosionService.getExplosions();
    explosions.forEach((e) => {
      const col = e.frame;
      this.ctx.drawImage(
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

    const bullets = this.bulletService.getBullets();
    bullets.forEach((b) =>
      this.ctx.drawImage(b.image, b.x, b.y, b.width, b.height)
    );

    const enemyBullets = this.bulletService.getEnemyBullets();
    enemyBullets.forEach((b) =>
      this.ctx.drawImage(b.image, b.x, b.y, b.width, b.height)
    );

    const enemies = this.enemyService.getEnemies();
    enemies.forEach((e) => {
      this.ctx.drawImage(e.image, e.x, e.y, e.width, e.height);

      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(e.x, e.y - 6, e.width, 4);

      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(e.x, e.y - 6, e.width * (e.hp / e.maxHp), 4);
    });
  }
}
