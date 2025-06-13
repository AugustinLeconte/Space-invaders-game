import { Component } from '@angular/core';
import { PowerUp, PowerUpService } from '../../services/powerUps.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-power-ups',
  imports: [CommonModule, FormsModule],
  templateUrl: './power-ups.component.html',
  styleUrl: './power-ups.component.scss',
})
export class PowerUpsComponent {
  private powerUpSubscription!: Subscription;
  shield: number = 0;
  missiles: number = 0;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.powerUpSubscription = this.playerService.player$.subscribe(
      (player) => {
        console.log(player.shield);
        console.log(player.missiles);
        console.log('-------------------');
        this.shield = player.shield;
        this.missiles = player.missiles;
      }
    );
  }

  getArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  ngOnDestroy(): void {
    this.powerUpSubscription.unsubscribe();
  }
}
