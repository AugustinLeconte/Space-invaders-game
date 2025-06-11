import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
import { CanvasService } from './canvas.service';
import { ImageService } from './image.service';
import { BulletsService } from './bullets.service';

@Injectable({ providedIn: 'root' })
export class KeysService {
  private keys: Record<string, boolean> = {};
  private keyLockP = false;
  private keyLockShoot = false;

  constructor(
    private playerService: PlayerService,
    private canvasService: CanvasService,
    private imageService: ImageService,
    private bulletService: BulletsService
  ) {}

  public initKeys() {
    console.log('inited');
    window.addEventListener('keydown', (e) => (this.keys[e.key] = true));
    window.addEventListener('keyup', (e) => (this.keys[e.key] = false));
  }

  public playerMovements() {
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

  public shootGestion() {
    const player = this.playerService.getPlayer();
    if (this.keys[' ']) {
      if (!this.keyLockShoot) {
        this.bulletService.addBullet({
          x: player.x + player.width / 2 - 2,
          y: player.y,
          width: 4,
          height: 10,
          image: this.imageService.bulletImage,
          damage: 10,
          velocity: 10,
        });
        this.keyLockShoot = true;
      }
    } else {
      this.keyLockShoot = false;
    }
  }
}
