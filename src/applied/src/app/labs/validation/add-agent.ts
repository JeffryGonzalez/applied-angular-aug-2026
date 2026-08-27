import { Component, signal, Signal } from '@angular/core';
import { CreateTicketRequest } from '../../areas/shared/api';
import { form, FormField, FormRoot } from '@angular/forms/signals';

@Component({
  selector: 'app-tickets-add-agent',
  imports: [FormRoot, FormField],
  template: `
    <h2 class="font-bold text-2xl">Add A Ticket</h2>

    <form [formRoot]="form">
      <label class="label"> Subject <input class="input" [formField]="form.subject" /> </label>

      <label>
        Priority
        <select class="select select-ghost" [formField]="form.priority">
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
      </label>
    </form>
  `,
  styles: ``,
})
export class AddAgent {
  // the backing signal I always call "model"
  protected model = signal<CreateTicketRequest>({
    subject: '',
    priority: 'normal',
    assignedTo: '',
  });

  // this is the field that will hold the form definition, I call it "form"
  protected form = form(this.model);
}
