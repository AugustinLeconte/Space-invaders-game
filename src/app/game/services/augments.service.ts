import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Augment {
  title: string;
  level: number;
  description: string;
  image: HTMLImageElement;
}

@Injectable({ providedIn: 'root' })
export class AugmentsService {
  private selectedAugments = new BehaviorSubject<Array<Augment>>([]);
  selectedAugments$ = this.selectedAugments.asObservable();
  private augments = new BehaviorSubject<Array<Augment>>([]);
  augments$ = this.augments.asObservable();

  public proposeAugments() {}
}
