import { Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { GameService } from './game.service';
import { BoardComponent } from './board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, BoardComponent],
  template: `
    <div class="shell">
      <header>
        <div class="stack-h" style="justify-content:center; position:relative;">
          <h1>Tic Tac Toe</h1>
          <button class="btn-inline push" type="button" (click)="toggleTheme()" [attr.aria-label]="'Theme umschalten auf ' + (nextTheme())">
            <span *ngIf="theme() === 'dark'">🌞</span>
            <span *ngIf="theme() === 'light'">🌙</span>
            <small style="font-size:.7rem; letter-spacing:.5px; text-transform:uppercase;">{{ theme() }}</small>
          </button>
        </div>
        <p class="subtitle">1 vs 1 – gleicher Rechner</p>
      </header>
      <main>
        <form class="player-form" (submit)="applyNames($event)">
          <div class="fields">
            <label>
              <span>Spieler X</span>
              <input type="text" [(ngModel)]="p1" name="p1" maxlength="18" placeholder="Spieler 1" />
            </label>
            <label>
              <span>Spieler O</span>
              <input type="text" [(ngModel)]="p2" name="p2" maxlength="18" placeholder="Spieler 2" />
            </label>
            <button class="btn-inline submit" type="submit">Übernehmen</button>
          </div>
        </form>
        <app-board></app-board>
        <div class="flying" *ngIf="flyingWinnerName() as w">
          <div class="fly-text">🎉 {{ w }} gewinnt! 🎉</div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .shell { max-width: 840px; margin: 0 auto; padding: clamp(1rem,2.5vw,2rem); }
    header { text-align: center; margin-bottom: 1.5rem; }
    h1 { font-size: clamp(1.9rem, 4.5vw, 3rem); margin: 0 0 .25rem; background: linear-gradient(90deg,var(--accent-x),var(--accent-o)); -webkit-background-clip:text; color:transparent; }
    .subtitle { margin:0; font-size:.95rem; color: var(--muted); }
    main { background: var(--bg-alt); border:1px solid var(--border); padding: 2rem; border-radius: var(--radius); box-shadow: 0 4px 24px -8px rgba(0,0,0,.5); display:flex; flex-direction:column; gap:1.75rem; }
    .player-form .fields { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); align-items:end; }
    .player-form label { display:flex; flex-direction:column; gap:.4rem; font-size:.75rem; letter-spacing:.7px; font-weight:600; text-transform:uppercase; color: var(--muted); }
    .player-form input { background:var(--bg); border:1px solid var(--border); border-radius: var(--radius); padding:.6rem .75rem; color:var(--text); font:inherit; transition: border-color var(--transition), background var(--transition); }
    .player-form input:focus { outline:none; border-color: var(--accent-o); background: var(--bg-alt); }
    .player-form .submit { align-self:stretch; }
    .flying { position:fixed; inset:0; pointer-events:none; overflow:hidden; z-index:50; }
    .fly-text { position:absolute; top:50%; left:-30%; transform:translateY(-50%); font-size: clamp(2rem,4.5vw,3.5rem); font-weight:700; white-space:nowrap; background:linear-gradient(90deg,var(--accent-x),var(--accent-o)); -webkit-background-clip:text; color:transparent; filter: drop-shadow(0 4px 12px rgba(0,0,0,.6)); animation: fly 3.8s ease-in-out forwards; }
    @keyframes fly { 0% { transform: translate(-30%, -50%) scale(.6) rotate(-8deg); opacity:0; } 12% { opacity:1; } 40% { transform: translate(35%, -50%) scale(1) rotate(1deg); } 70% { transform: translate(90%, -50%) scale(1) rotate(-2deg); opacity:1; } 85% { opacity:1; } 100% { transform: translate(130%, -50%) scale(.9) rotate(6deg); opacity:0; } }
  `]
})
export class AppComponent {
  private themeService = inject(ThemeService);
  private game = inject(GameService);
  theme = this.themeService.theme;
  nextTheme = computed(() => this.theme() === 'dark' ? 'light' : 'dark');
  flyingWinnerName = this.game.flyingWinner;
  p1 = this.game.player1Name();
  p2 = this.game.player2Name();

  constructor() {
    effect(() => {
      // reactive side effect placeholder if we want transitions
    });
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  applyNames(ev: Event) {
    ev.preventDefault();
    this.game.setNames(this.p1, this.p2);
  }
}
