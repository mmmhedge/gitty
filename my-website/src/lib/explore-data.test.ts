import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTACT, ICONS, WORK, WRITING, type SectionItem } from './explore-data';

const SECTIONS: Record<string, SectionItem[]> = { WORK, WRITING, CONTACT };

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

  it('every WORK item unwraps into real context, and any links are https', () => {
    for (const item of WORK.filter((w) => !w.placeholder)) {
      expect(item.detail, `"${item.name}" is missing detail text`).toBeTruthy();
      for (const l of item.links ?? []) {
        expect(l.url, `"${item.name}" link "${l.label}" is not https`).toMatch(/^https:\/\//);
      }
    }
  });

  it('WORK images exist on disk under public/', () => {
    for (const item of WORK) {
      if (!item.img) continue;
      expect(item.img.src, `"${item.name}" img src should be a /img/... path`).toMatch(/^\/img\//);
      expect(item.img.alt, `"${item.name}" img is missing alt text`).toBeTruthy();
      const onDisk = join(__dirname, '../../public', item.img.src);
      expect(existsSync(onDisk), `"${item.name}" img file missing: ${onDisk}`).toBe(true);
    }
  });

  it('WORK github links all point to the same account', () => {
    for (const item of WORK) {
      for (const l of item.links ?? []) {
        if (l.url.includes('github.com')) {
          expect(l.url).toMatch(/^https:\/\/github\.com\/ppo6\//);
        }
      }
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
