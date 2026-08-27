import { Component, inject } from '@angular/core';
import { AuthStore } from './auth-store';
import { injectDispatch } from '@ngrx/signals/events';
import { AuthEvents } from './auth-events';

@Component({
  selector: 'app-auth',
  imports: [],
  template: `
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
  protected actions = injectDispatch(AuthEvents);
  protected store = inject(AuthStore);
  logout() {
    this.actions.userLoggedOut();
  }
  login(role: 'Employee' | 'HelpDesk' | 'HelpDeskManager') {
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
