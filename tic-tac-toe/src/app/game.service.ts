import { Injectable, signal, computed } from '@angular/core';

export type PlayerSymbol = 'X' | 'O';
export interface Move { index: number; player: PlayerSymbol; }

const WIN_PATTERNS: number[][] = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

@Injectable({ providedIn: 'root' })
export class GameService {
  readonly board = signal<(PlayerSymbol | null)[]>(Array(9).fill(null));
  readonly currentPlayer = signal<PlayerSymbol>('X');
  readonly moves = signal<Move[]>([]);
  readonly player1Name = signal<string>('Spieler 1');
  readonly player2Name = signal<string>('Spieler 2');
  readonly winner = signal<PlayerSymbol | null>(null);
  readonly winningLine = signal<number[] | null>(null);
  readonly scoreboard = signal<Record<PlayerSymbol, number>>({ X: 0, O: 0 });
  readonly flyingWinner = signal<string | null>(null); // triggers animation banner text

  readonly isDraw = computed(() => !this.winner() && this.board().every((c: PlayerSymbol | null) => c !== null));
  readonly currentPlayerName = computed(() => this.currentPlayer() === 'X' ? this.player1Name() : this.player2Name());
  readonly winnerName = computed(() => {
    const w = this.winner();
    if (!w) return null;
    return w === 'X' ? this.player1Name() : this.player2Name();
  });

  makeMove(index: number) {
    if (this.board()[index] || this.winner()) return;
    const next = [...this.board()];
    next[index] = this.currentPlayer();
    this.board.set(next);
  this.moves.update((m: Move[]) => [...m, { index, player: this.currentPlayer() }]);

    this.checkWinner();

    if (!this.winner()) {
      this.currentPlayer.set(this.currentPlayer() === 'X' ? 'O' : 'X');
    }
  }

  private checkWinner() {
    const b = this.board();
    for (const pattern of WIN_PATTERNS) {
      const [a,bIdx,c] = pattern;
      const v1 = b[a];
      if (v1 && v1 === b[bIdx] && v1 === b[c]) {
        this.winner.set(v1);
        this.winningLine.set(pattern);
  this.scoreboard.update((s: Record<PlayerSymbol, number>) => ({ ...s, [v1]: s[v1] + 1 }));
        // trigger flying winner animation
        this.flyingWinner.set(this.winnerName());
        // auto-hide after a delay
        setTimeout(() => { if (this.flyingWinner() === this.winnerName()) this.flyingWinner.set(null); }, 3800);
        break;
      }
    }
  }

  resetBoard(keepNames = true) {
    this.board.set(Array(9).fill(null));
    this.currentPlayer.set('X');
    this.moves.set([]);
    this.winner.set(null);
    this.winningLine.set(null);
    this.flyingWinner.set(null);
    if (!keepNames) {
      this.player1Name.set('Spieler 1');
      this.player2Name.set('Spieler 2');
      this.scoreboard.set({ X:0, O:0 });
    }
  }

  setNames(p1: string, p2: string) {
    if (p1.trim()) this.player1Name.set(p1.trim());
    if (p2.trim()) this.player2Name.set(p2.trim());
  }
}
