import { Component } from '@angular/core';
import { PowerUp, PowerUpService } from '../../services/powerUps.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-power-ups',
  imports: [CommonModule, FormsModule],
  templateUrl: './power-ups.component.html',
  styleUrl: './power-ups.component.scss',
})
export class PowerUpsComponent {
  private powerUpSubscription!: Subscription;
  powerUps: PowerUp[] = [];

  constructor(private powerUpService: PowerUpService) {}

  ngOnInit(): void {
    this.powerUpSubscription = this.powerUpService.powerUps$.subscribe(
      (powerUps) => {
        this.powerUps = powerUps;
      }
    );
  }

  ngOnDestroy(): void {
    this.powerUpSubscription.unsubscribe();
  }
}
