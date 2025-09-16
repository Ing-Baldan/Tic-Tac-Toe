import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './game.service';
import { SquareComponent } from './square.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, SquareComponent],
  template: `
    <div class="info">
      <div class="turn" [ngClass]="currentPlayer()">Am Zug: <strong>{{ currentPlayerName() }}</strong> ({{ currentPlayer() }})</div>
      <div class="score">
        <span class="x">{{ scoreboard().X }} <small>X</small></span>
        <span class="o">{{ scoreboard().O }} <small>O</small></span>
      </div>
    </div>

    <div class="grid" [class.finished]="!!winner() || isDraw()">
      <app-square *ngFor="let cell of board(); let i = index"
        [value]="cell"
        [disabled]="!!winner() || isDraw()"
        (pick)="onPick(i)"
        [ngClass]="{ win: winningLine()?.includes(i) }"
      ></app-square>
      <div *ngIf="winningLine() as line" class="win-line" [ngClass]="'pattern-' + patternClass(line)"></div>
    </div>

    <div class="result" *ngIf="winner() || isDraw()">
      <div class="badge" [ngClass]="winner()"> 
        <ng-container *ngIf="winner(); else draw">Sieger: {{ winnerName() }} 🎉</ng-container>
        <ng-template #draw>Unentschieden 🤝</ng-template>
      </div>
      <div class="actions">
        <button class="btn-inline" (click)="reset(false)">Neues Spiel</button>
        <button class="btn-inline" (click)="reset(true)">Zurücksetzen (inkl. Score)</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .info { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; margin-bottom:1rem; }
    .turn { padding:.5rem .9rem; background:var(--bg-alt); border:1px solid var(--border); border-radius: var(--radius); font-size:.9rem; }
    .turn.X strong { color: var(--accent-x); }
    .turn.O strong { color: var(--accent-o); }
    .score { margin-left:auto; display:flex; gap:.75rem; font-weight:600; }
    .score span { background:var(--bg-alt); border:1px solid var(--border); padding:.4rem .7rem; border-radius: var(--radius); display:flex; align-items:center; gap:.35rem; }
    .score .x { color: var(--accent-x); }
    .score .o { color: var(--accent-o); }

    .grid { position:relative; display:grid; grid-template-columns: repeat(3, 1fr); gap: clamp(.65rem,1.4vw,.9rem); }
    .grid.finished { opacity:.95; }

    .result { margin-top:1.75rem; display:flex; flex-direction:column; gap:1rem; align-items:center; }
    .badge { font-size:1.05rem; letter-spacing:.5px; background:linear-gradient(135deg,var(--accent-x),var(--accent-o)); -webkit-background-clip:text; color:transparent; font-weight:600; }
    .badge.X { background: var(--accent-x); -webkit-background-clip:initial; color: var(--accent-x); }
    .badge.O { background: var(--accent-o); -webkit-background-clip:initial; color: var(--accent-o); }
    .actions { display:flex; gap:.75rem; }

    .win-line { position:absolute; background: var(--accent-win); box-shadow:0 0 12px -2px rgba(255,212,59,.7), 0 0 2px 1px rgba(255,255,255,.3) inset; border-radius: 6px; opacity:.85; animation: appear .4s ease; }
    @keyframes appear { from { transform:scale(.6); opacity:0; } }

    /* Patterns – absolute overlay lines */
    .pattern-row { height:12px; width:100%; left:0; }
    .pattern-col { width:12px; height:100%; top:0; }
    .pattern-diag-main { height:12px; width:140%; top:50%; left:-20%; transform: rotate(45deg); transform-origin:center; }
    .pattern-diag-anti { height:12px; width:140%; top:50%; left:-20%; transform: rotate(-45deg); transform-origin:center; }

    /* Positioning for each row/col line */
    .pattern-0.pattern-row { top: calc(0 * (100% / 3) + 16%); }
    .pattern-1.pattern-row { top: calc(1 * (100% / 3) + 50% - 6px); }
    .pattern-2.pattern-row { top: calc(2 * (100% / 3) + 84% - 12px); }

    .pattern-3.pattern-col { left: calc(0 * (100% / 3) + 16%); }
    .pattern-4.pattern-col { left: calc(1 * (100% / 3) + 50% - 6px); }
    .pattern-5.pattern-col { left: calc(2 * (100% / 3) + 84% - 12px); }
  `]
})
export class BoardComponent {
  private game = inject(GameService);
  board = this.game.board;
  currentPlayer = this.game.currentPlayer;
  currentPlayerName = this.game.currentPlayerName;
  winner = this.game.winner;
  winnerName = this.game.winnerName;
  isDraw = this.game.isDraw;
  winningLine = this.game.winningLine;
  scoreboard = this.game.scoreboard;

  onPick(i: number) { this.game.makeMove(i); }
  reset(full: boolean) { this.game.resetBoard(!full); }

  patternClass(line: number[]): string {
    // Map pattern index to row/col/diag classification for CSS
    const idx = WIN_PATTERNS.findIndex(p => p === line);
    if (idx <= 2) return `row pattern-${idx} pattern-row`;
    if (idx <= 5) return `col pattern-${idx} pattern-col`;
    if (idx === 6) return 'diag pattern-diag-main';
    return 'diag pattern-diag-anti';
  }
}

// replicate patterns constant for classification (not exported outside file)
const WIN_PATTERNS: number[][] = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];
