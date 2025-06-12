import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Entity, Player } from '../models/entity.model';
import { WaveService } from './wave.service';
import { ImageService } from './image.service';
import { XpService } from './xp.service';
import { PlayerService } from './player.service';
import { BulletsService } from './bullets.service';
import { KeysService } from './keys.service';
import { CanvasService } from './canvas.service';
import { EnemyService } from './enemy.service';
import { ExplosionService } from './explosions.service';
import { BackgroundService } from './background.service';
import { GameStateService } from './gameState.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private lastFrameTime = performance.now();

  private playerSubscription!: Subscription;
  private player!: Player;

  constructor(
    private waveService: WaveService,
    private imageService: ImageService,
    private xpService: XpService,
    private playerService: PlayerService,
    private keyService: KeysService,
    private bulletService: BulletsService,
    private canvasService: CanvasService,
    private enemyService: EnemyService,
    private explosionService: ExplosionService,
    private backgroundService: BackgroundService,
    private gameStateService: GameStateService
  ) {}

  init(canvas: HTMLCanvasElement) {
    this.playerService.initPlayer({
      x: 700,
      y: 650,
      width: 40,
      height: 30,
      hp: 100,
      maxHp: 100,
      speed: 5,
      experience: 0,
      level: 1,
      xp: 0,
      xpToNextLevel: this.xpService.calculateXpForLevel(2),
      image: this.imageService.loadImage('assets/space/player.png'),
    });
    this.canvasService.initCanvas(canvas);
    this.keyService.initKeys();
    this.imageService.initImages();

    this.playerSubscription = this.playerService.player$.subscribe((player) => {
      this.player = player;
    });

    this.backgroundService.updateScene('1');
    this.gameLoop();
  }

  private gameLoop = (now: number = performance.now()) => {
    const deltaTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    if (!this.gameStateService.isPaused() && this.player.hp > 0) {
      this.update(deltaTime);
      this.canvasService.draw();
    }
    this.keyService.pauseGestion();
    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    this.keyService.keyGestion();
    this.enemyService.shoots();
    this.bulletService.bulletMovement();
    this.enemyService.movement(this.canvasService.canvas.height);
    this.checkCollisions();
    this.explosionService.gestionExplosions(deltaTime);
    if (this.enemyService.isEmpty()) {
      this.waveService.nextWave();
      this.enemyService.addEnemies(
        this.waveService.spawnWave(this.canvasService.canvas.width)
      );
    }
    this.backgroundService.changeBackgroundFromWave(
      this.waveService.getNumberWave()
    );
  }

  private checkCollisions() {
    let enemies = this.enemyService.getEnemies();
    const bullets = this.bulletService.getBullets();
    bullets.forEach((bullet, i) => {
      enemies.forEach((enemy, j) => {
        if (this.isColliding(bullet, enemy)) {
          this.enemyService.takeDamage(j, bullet.damage);
          this.bulletService.removeBullet(i);
          if (this.enemyService.getEnemy(j).hp <= 0)
            this.enemyService.removeEnemy(enemy, j);
        }
      });
    });

    const enemyBullets = this.bulletService.getEnemyBullets();
    enemyBullets.forEach((bullet, i) => {
      if (this.isColliding(bullet, this.player)) {
        this.playerService.isHitted(bullet.damage);
        this.bulletService.removeEnemyBullet(i);
      }
    });

    enemies = this.enemyService.getEnemies();
    enemies.forEach((enemy, i) => {
      if (this.isColliding(enemy, this.player)) {
        this.playerService.isHitted(20);

        this.enemyService.removeEnemy(enemy, i);
      }
    });
  }

  private isColliding(a: Entity, b: Entity): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  ngOnDestroy(): void {
    this.playerSubscription.unsubscribe();
  }
}
