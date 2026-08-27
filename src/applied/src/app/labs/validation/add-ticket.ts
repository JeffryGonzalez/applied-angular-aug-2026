import { Component, signal, Signal } from '@angular/core';
import { CreateTicketRequest } from '../../areas/shared/api';
import { form, FormField, FormRoot } from '@angular/forms/signals';
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

@Component({
  selector: 'app-tickets-add-ticket',
  imports: [FormRoot, FormField],
  template: `
    <div class="">
      <h2 class="font-bold text-2xl">Add A Ticket</h2>
      <form [formRoot]="form" class="flex flex-col gap-4">
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
    </div>
  `,
  styles: ``,
})
export class AddTicket {
  // the backing signal I always call "model"
  protected model = signal<Concrete<CreateTicketRequest>>({
    subject: '',
    priority: 'normal',
    assignedTo: '',
  });

  // this is the field that will hold the form definition, I call it "form"
  protected form = form(this.model);
}
