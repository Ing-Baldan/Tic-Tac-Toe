import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" class="square" [disabled]="disabled() || !!value()" (click)="pick.emit()" [class.X]="value()==='X'" [class.O]="value()==='O'">
      <span class="mark" *ngIf="value() as v">{{ v }}</span>
    </button>
  `,
  styles: [`
    :host { display:block; }
    .square { width:100%; aspect-ratio:1; background:var(--bg-alt); border:1px solid var(--border); border-radius: 18px; position:relative; font-size: clamp(2.2rem,5vw,3.2rem); font-weight:600; color:var(--text); display:flex; align-items:center; justify-content:center; cursor:pointer; transition: background var(--transition), transform var(--transition), border-color var(--transition); }
    .square:hover:not(:disabled) { background: var(--border); }
    .square:active:not(:disabled) { transform: scale(.95); }
    .square:disabled { cursor: default; opacity:.9; }
    .square.X { color: var(--accent-x); }
    .square.O { color: var(--accent-o); }
    .mark { animation: pop .35s var(--transition); display:inline-block; }
    @keyframes pop { 0% { transform: scale(.4) rotate(-20deg); opacity:0; } 60% { transform: scale(1.08); opacity:1; } 100% { transform: scale(1); } }
  `]
})
export class SquareComponent {
  value = input<string | null>(null);
  disabled = input<boolean>(false);
  pick = output<void>();
}
