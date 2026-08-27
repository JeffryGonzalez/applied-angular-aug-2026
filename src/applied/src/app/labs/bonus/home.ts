import { Component, inject } from '@angular/core';
import { BonusStore, COLUMNS } from './bonus-store';
import { TitleCasePipe } from '@angular/common';
import { PascalCasePipe } from './pascalCasePipe';

@Component({
  selector: 'app-bonus-home',
  providers: [BonusStore],
  imports: [PascalCasePipe],
  template: ` <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          @for (col of cols; track col) {
            <th>
              {{ col | pascalCase }}

              <button
                [disabled]="store.sortingBy() === col && store.sortingDirection() === 'ascending'"
                (click)="store.setSorting(col, 'ascending')"
                class="btn btn-xs btn-circle"
              >
                👆
              </button>
              <button
                [disabled]="store.sortingBy() === col && store.sortingDirection() === 'descending'"
                (click)="store.setSorting(col, 'descending')"
                class="btn btn-xs btn-circle"
              >
                👇
              </button>
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (cust of store.list(); track cust.id) {
          <tr>
            @for (col of cols; track col) {
              <td>{{ cust[col] }}</td>
            }
          </tr>
        }
      </tbody>
    </table>
  </div>`,
  styles: ``,
})
export class Home {
  cols = COLUMNS;
  store = inject(BonusStore);
}
