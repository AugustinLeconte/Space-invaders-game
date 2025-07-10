import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
import { GameStateService } from './gameState.service';
import { AugmentsService } from './augments.service';

@Injectable({ providedIn: 'root' })
export class XpService {
  constructor(
    private playerService: PlayerService,
    private gameStateService: GameStateService,
    private augmentService: AugmentsService
  ) {}

  public calculateXpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.2, level - 1));
  }

  public gainXp(amount: number): void {
    this.playerService.increaseXp(amount);

    const player = this.playerService.getPlayer();
    while (player.xp >= player.xpToNextLevel) {
      this.playerService.setXp((player.xp -= player.xpToNextLevel));
      this.playerService.increaseLevel(1);
      this.playerService.setXpToNextLevel(
        this.calculateXpForLevel(player.level + 2)
      );
      this.onLevelUp();
    }
  }

  public onLevelUp(): void {
    this.playerService.increaseMaxHp(20);
    this.gameStateService.setGameState('augmentSelection');
    this.augmentService.proposeAugments();
  }
}
