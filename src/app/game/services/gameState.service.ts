import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private gamePaused = new BehaviorSubject<string>('play');
  gamePaused$ = this.gamePaused.asObservable();

  public setGameState(newState: string): void {
    this.gamePaused.next(newState);
  }

  public state(): string {
    return this.gamePaused.value;
  }
}
