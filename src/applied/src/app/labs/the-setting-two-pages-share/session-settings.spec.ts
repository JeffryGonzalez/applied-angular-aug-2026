import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SessionSettings } from './session-settings';
import { Settings } from './settings';
import { Timer } from './timer';

describe('a setting two pages share', () => {
  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    await TestBed.configureTestingModule({
      imports: [Timer, Settings],
      providers: [provideRouter([]), SessionSettings],
    }).compileComponents();
  });

  afterEach(() => vi.useRealTimers());

  it('starts the timer at the configured length', async () => {
    TestBed.inject(SessionSettings).setMinutes(50);

    const fixture = TestBed.createComponent(Timer);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('50:00');
  });

  // Both pages get the same instance. That is the whole point of the lab, and
  // it is a consequence of where the service is provided, not of anything
  // either component does.
  it('both pages see the same instance', async () => {
    const settingsPage = TestBed.createComponent(Settings);
    await settingsPage.whenStable();

    const input = settingsPage.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '50';
    input.dispatchEvent(new Event('change'));

    expect(TestBed.inject(SessionSettings).sessionMinutes()).toBe(50);
  });

  it('reset uses the current setting, not the one it started with', async () => {
    const fixture = TestBed.createComponent(Timer);
    await fixture.whenStable();

    TestBed.inject(SessionSettings).setMinutes(5);
    click(fixture, 'Reset');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('5:00');
  });

  // Nobody asked for this. The uncast role, pinned so a later change has to
  // decide it on purpose rather than by accident.
  it('a running session keeps its own length when the setting changes', async () => {
    const fixture = TestBed.createComponent(Timer);
    await fixture.whenStable();

    click(fixture, 'Start');
    await fixture.whenStable();
    vi.advanceTimersByTime(3000);
    await fixture.whenStable();

    TestBed.inject(SessionSettings).setMinutes(50);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('24:57');
  });

  it('clamps the setting to something a session could plausibly be', () => {
    const settings = TestBed.inject(SessionSettings);

    settings.setMinutes(0);
    expect(settings.sessionMinutes()).toBe(1);

    settings.setMinutes(9999);
    expect(settings.sessionMinutes()).toBe(120);
  });
});

function click(fixture: { nativeElement: HTMLElement }, label: string) {
  const button = [...fixture.nativeElement.querySelectorAll('button')].find((b) =>
    b.textContent?.trim().startsWith(label),
  );
  if (!button) throw new Error(`no button labelled ${label}`);
  button.click();
}
