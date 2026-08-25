import { Component, inject, Service } from '@angular/core';
import { Settings } from './services/settings';
import { Settings2 } from './services/settings2';

@Component({
  selector: 'app-baby',
  imports: [],
  providers: [{ provide: Settings, useClass: Settings2 }],
  template: ` <p>Baby Component</p> `,
  styles: ``,
})
export class Baby {
  svc = inject(Settings);
}
