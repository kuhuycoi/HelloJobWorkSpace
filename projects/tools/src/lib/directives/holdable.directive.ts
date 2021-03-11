import { Directive, Output, EventEmitter, HostListener } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[appHoldable]'
})
export class HoldableDirective {
  @Output() holdTime: EventEmitter<number> = new EventEmitter();
  @Output() stop = new EventEmitter();
  @Output() start = new EventEmitter();
  stop$ = new Subject<any>();

  constructor() {
    this.stop$.subscribe(() => {
      // this.holdTime.emit(0);
      this.stop.emit();
    });
  }

  @HostListener('mouseup')
  onExit() {
    this.stop$.next();
  }

  @HostListener('mousedown')
  onHold() {
    this.start.emit();
    const ms = 100;

    interval(ms).pipe(
      takeUntil(this.stop$),
      tap(v => {
        this.holdTime.emit(v * ms);
      }),
    )
    .subscribe();

  }
}
