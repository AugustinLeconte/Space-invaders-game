import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private gamePaused = new BehaviorSubject<boolean>(false);
  gamePaused$ = this.gamePaused.asObservable();

  public paused(): void {
    this.gamePaused.next(!this.gamePaused.value);
  }

  public isPaused(): boolean {
    return this.gamePaused.value == true;
  }
}
