import { TestBed } from '@angular/core/testing';
import { Timer } from './timer';

describe('Timer', () => {
  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    await TestBed.configureTestingModule({ imports: [Timer] }).compileComponents();
  });

  afterEach(() => vi.useRealTimers());

  it('does not tick until started', async () => {
    const fixture = TestBed.createComponent(Timer);
    await fixture.whenStable();

    vi.advanceTimersByTime(3000);
    await fixture.whenStable();

    expect(text(fixture)).toContain('25:00');
  });

  it('counts down once started', async () => {
    const fixture = TestBed.createComponent(Timer);
    await fixture.whenStable();

    click(fixture, 'Start');
    await fixture.whenStable();

    vi.advanceTimersByTime(3000);
    await fixture.whenStable();

    expect(text(fixture)).toContain('24:57');
  });

  // The role nobody named: pause/resume must not stack intervals.
  it('does not double-tick after pause and resume', async () => {
    const fixture = TestBed.createComponent(Timer);
    await fixture.whenStable();

    click(fixture, 'Start');
    await fixture.whenStable();
    click(fixture, 'Pause');
    await fixture.whenStable();
    click(fixture, 'Start');
    await fixture.whenStable();

    vi.advanceTimersByTime(3000);
    await fixture.whenStable();

    expect(text(fixture)).toContain('24:57');
  });

  // The other role nobody named, and the one you can't see on screen.
  it('stops ticking when the component is destroyed', async () => {
    const fixture = TestBed.createComponent(Timer);
    await fixture.whenStable();

    click(fixture, 'Start');
    await fixture.whenStable();

    fixture.destroy();
    expect(vi.getTimerCount()).toBe(0);
  });
});

function text(fixture: { nativeElement: HTMLElement }) {
  return fixture.nativeElement.textContent ?? '';
}

function click(fixture: { nativeElement: HTMLElement }, label: string) {
  const button = [...fixture.nativeElement.querySelectorAll('button')].find((b) =>
    b.textContent?.trim().startsWith(label),
  );
  if (!button) throw new Error(`no button labelled ${label}`);
  button.click();
}
