import { Component, inject, signal } from '@angular/core';
import { AuthStore } from './auth-store';
import { injectDispatch } from '@ngrx/signals/events';
import { AuthEvents } from './auth-events';
type Priorities = 'high' | 'low' | 'normal' | 'expedited';

@Component({
  selector: 'app-auth',
  imports: [],
  template: `
    @switch (priority()) {
      @case ('high') {
        <p>High Priority!</p>
      }
      @case ('low') {
        <p>Low Priority</p>
      }
      @case ('normal') {
        <p>Normal Priority</p>
      }
      @case ('expedited') {
        <p>It's on it's way!</p>
      }
      @default never;
    }
    <div>
      Auth
      @if (store.isLoggedIn()) {
        <button (click)="logout()" class="btn btn-warning">Logout {{ store.user() }}</button>
      } @else {
        <button (click)="login('Employee')" class="btn btn-primary">Login as Employee</button>
        <button (click)="login('HelpDesk')" class="btn btn-primary">Login as HelpDesk</button>
        <button (click)="login('HelpDeskManager')" class="btn btn-primary">
          Login as HelpDeskManager
        </button>
      }
    </div>
  `,
  styles: ``,
})
export class Auth {
  protected priority = signal<Priorities>('normal');
  protected actions = injectDispatch(AuthEvents);
  protected store = inject(AuthStore);
  logout() {
    this.actions.userChangedPassword({ oldPassword: 'wordpass', newPassword: 'wordpass!' });
    this.actions.userLoggedOut();
  }
  login(role: 'Employee' | 'HelpDesk' | 'HelpDeskManager') {
    this.doIt(-99);
    switch (role) {
      case 'Employee':
        this.actions.userLoggedIn({ name: 'Jill', groups: [] });
        break;
      case 'HelpDesk':
        this.actions.userLoggedIn({ name: 'Bob Helpdesk', groups: ['HelpDesk'] });
        break;
      case 'HelpDeskManager':
        this.actions.userLoggedIn({ name: 'Dale Manager', groups: ['HelpDeskManager'] });
        break;
    }
  }
}
