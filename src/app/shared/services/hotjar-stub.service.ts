import { Injectable } from '@angular/core';

declare global {
  interface Window {
    hj?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class HotjarStubService {
  trigger(scenario: string): void {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('trigger', scenario);
    }
  }
}
