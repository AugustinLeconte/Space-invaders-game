import { Component } from '@angular/core';
import { WaveService } from '../../services/wave.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wave',
  imports: [CommonModule],
  templateUrl: './wave.component.html',
  styleUrl: './wave.component.scss',
})
export class WaveComponent {
  private waveSubscription!: Subscription;
  wave: number = 1;

  constructor(public waveService: WaveService) {}

  ngOnInit(): void {
    this.waveSubscription = this.waveService.wave$.subscribe((wave) => {
      this.wave = wave;
    });
  }

  ngOnDestroy(): void {
    this.waveSubscription.unsubscribe();
  }
}
