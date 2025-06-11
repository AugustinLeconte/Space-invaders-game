import { Component } from '@angular/core';
import { WaveService } from '../../services/wave.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wave',
  imports: [],
  templateUrl: './wave.component.html',
  styleUrl: './wave.component.scss',
})
export class WaveComponent {
  private waveSubscription!: Subscription;
  wave: number = 0;

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
