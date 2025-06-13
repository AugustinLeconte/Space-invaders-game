import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
import { CanvasService } from './canvas.service';
import { ImageService } from './image.service';
import { BulletsService } from './bullets.service';
import { GameStateService } from './gameState.service';
import { MissileService } from './missile.service';

@Injectable({ providedIn: 'root' })
export class KeysService {
  private keys: Record<string, boolean> = {};
  private keyLockPause = false;
  private keyLockShootMissile = false;
  private lastShotTime: number = 0;
  private shootCooldown: number = 400 + Math.random() * 400;

  constructor(
    private playerService: PlayerService,
    private canvasService: CanvasService,
    private imageService: ImageService,
    private bulletService: BulletsService,
    private gameStateService: GameStateService,
    private missileService: MissileService
  ) {}

  public initKeys() {
    window.addEventListener('keydown', (e) => (this.keys[e.key] = true));
    window.addEventListener('keyup', (e) => (this.keys[e.key] = false));
  }

  public keyGestion() {
    this.playerMovements();
    this.shootGestion();
    this.shootMissileGestion();
  }

  private playerMovements() {
    const player = this.playerService.getPlayer();
    if (this.keys['ArrowLeft'] && player.x - 5 >= 0)
      this.playerService.setPlayerPositionX(-5);
    if (
      this.keys['ArrowRight'] &&
      player.x + 5 < this.canvasService.canvas.width - player.width
    )
      this.playerService.setPlayerPositionX(5);
    if (this.keys['ArrowUp'] && player.y - 5 >= 0)
      this.playerService.setPlayerPositionY(-5);
    if (
      this.keys['ArrowDown'] &&
      player.y + 5 < this.canvasService.canvas.height - player.height
    )
      this.playerService.setPlayerPositionY(5);
  }

  private shootMissileGestion() {
    const player = this.playerService.getPlayer();
    if (this.keys['f']) {
      if (!this.keyLockShootMissile && this.playerService.missileNumber() > 0) {
        this.missileService.launchMissile(
          player.x + player.width / 2 - 2,
          player.y,
          5,
          50
        );
        this.playerService.launchMissile();
        this.keyLockShootMissile = true;
      }
    } else {
      this.keyLockShootMissile = false;
    }
  }

  private shootGestion() {
    const player = this.playerService.getPlayer();
    const now = Date.now();

    if (now - this.lastShotTime > this.shootCooldown) {
      this.bulletService.addBullet({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        image: this.imageService.bulletImage,
        damage: 10,
        velocity: 10,
      });
      this.lastShotTime = now;
    }
  }

  public pauseGestion() {
    if (this.keys[' ']) {
      if (!this.keyLockPause) {
        this.gameStateService.paused();
        this.keyLockPause = true;
      }
    } else {
      this.keyLockPause = false;
    }
  }
}
