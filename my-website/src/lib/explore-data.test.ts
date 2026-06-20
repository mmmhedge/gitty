import { describe, expect, it } from 'vitest';
import { CONTACT, ICONS, PROJECTS, WRITING, type SectionItem } from './explore-data';

const SECTIONS: Record<string, SectionItem[]> = { PROJECTS, WRITING, CONTACT };

describe('explore-data sections', () => {
  for (const [sectionName, items] of Object.entries(SECTIONS)) {
    describe(sectionName, () => {
      it('every item references an icon that actually exists', () => {
        for (const item of items) {
          expect(ICONS[item.icon], `"${item.name}" references unknown icon "${item.icon}"`).toBeTypeOf('function');
        }
      });

      it('non-placeholder items have a real url, placeholders have null', () => {
        for (const item of items) {
          if (item.placeholder) {
            expect(item.url, `placeholder "${item.name}" should have url: null`).toBeNull();
          } else {
            expect(item.url, `"${item.name}" is missing a url`).toBeTruthy();
            expect(item.url!.length).toBeGreaterThan(0);
          }
        }
      });

      it('has no duplicate names', () => {
        const names = items.map((i) => i.name);
        expect(new Set(names).size).toBe(names.length);
      });
    });
  }

  it('CONTACT entries use the right link scheme for their kind', () => {
    const email = CONTACT.find((c) => c.name === 'Email');
    const github = CONTACT.find((c) => c.name === 'GitHub');
    const x = CONTACT.find((c) => c.name === 'X');

    expect(email?.url).toMatch(/^mailto:/);
    expect(github?.url).toMatch(/^https:\/\/github\.com\//);
    expect(x?.url).toMatch(/^https:\/\/x\.com\//);
  });

  it('PROJECTS github links all point to the same account', () => {
    for (const item of PROJECTS.filter((p) => !p.placeholder)) {
      expect(item.url).toMatch(/^https:\/\/github\.com\/ppo6\//);
    }
  });

  it('WRITING placeholder links are inert ("#") until real posts exist', () => {
    for (const item of WRITING.filter((w) => !w.placeholder)) {
      expect(item.url).toBe('#');
    }
  });
});

describe('ICONS', () => {
  it('every icon is a function that draws without throwing, given a minimal mock context', () => {
    const calls: string[] = [];
    const mockCtx = new Proxy(
      {},
      {
        get(_target, prop) {
          calls.push(String(prop));
          if (prop === 'setLineDash') return () => {};
          return () => {};
        },
        set() {
          return true;
        },
      }
    ) as unknown as CanvasRenderingContext2D;

    for (const [name, draw] of Object.entries(ICONS)) {
      calls.length = 0;
      expect(() => draw(mockCtx), `icon "${name}" threw while drawing`).not.toThrow();
      expect(calls.length, `icon "${name}" never touched the canvas context`).toBeGreaterThan(0);
    }
  });
});
