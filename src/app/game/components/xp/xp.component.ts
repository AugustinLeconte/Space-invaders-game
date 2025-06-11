import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-xp',
  imports: [],
  templateUrl: './xp.component.html',
  styleUrl: './xp.component.scss',
})
export class XpComponent {
  private playerSubscription!: Subscription;
  level: number = 0;
  xp: number = 0;
  xpToNextLevel: number = 0;

  constructor(public playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerSubscription = this.playerService.player$.subscribe((player) => {
      this.level = player.level;
      this.xp = player.xp;
      this.xpToNextLevel = player.xpToNextLevel;
    });
  }

  ngOnDestroy(): void {
    this.playerSubscription.unsubscribe();
  }
}
