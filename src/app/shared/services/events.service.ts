import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {
  listeners: any;
  eventsSubject: Subject<{ name: string; msg: any }>;
  events: any;

  constructor() {
    this.listeners = {};
    this.eventsSubject = new Subject<{ name: string; msg: any }>();
    this.events = this.eventsSubject.asObservable();

    this.events.subscribe(({ name, msg }) => {
      if (this.listeners[name]) {
        for (const listener of this.listeners[name]) {
          listener(msg);
        }
      }
    });
  }

  on(name: string, listener: (...args: any[]) => void) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(listener);
  }

  broadcast(name: string, msg: any) {
    this.eventsSubject.next({ name, msg });
  }
}
