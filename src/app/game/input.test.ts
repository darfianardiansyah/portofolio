import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createInput } from "./input";

describe("input controls", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    const listeners = new Map<string, Function[]>();
    const fakeTarget = {
      addEventListener: (type: string, fn: Function) => {
        const list = listeners.get(type) || [];
        list.push(fn);
        listeners.set(type, list);
      },
      removeEventListener: (type: string, fn: Function) => {
        const list = listeners.get(type) || [];
        listeners.set(type, list.filter((item) => item !== fn));
      },
      dispatchEvent: (event: any) => {
        const list = listeners.get(event.type) || [];
        list.forEach((fn) => fn(event));
      },
    };

    (globalThis as any).window = fakeTarget;
    (globalThis as any).document = { ...fakeTarget, hidden: false };
  });

  afterEach(() => {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
  });

  function createMockCanvas() {
    return {
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLCanvasElement;
  }

  it("processes analog joystick vector movement", () => {
    const canvas = createMockCanvas();
    let interacted = false;
    const input = createInput(canvas, () => { interacted = true; });

    expect(input.movement()).toEqual({ x: 0, z: 0 });

    input.setVector({ x: 0.5, z: -0.5 });
    const move = input.movement();
    expect(move.x).toBeCloseTo(0.5);
    expect(move.z).toBeCloseTo(-0.5);

    input.setVector(null);
    expect(input.movement()).toEqual({ x: 0, z: 0 });

    input.dispose();
    expect(interacted).toBe(false);
  });

  it("handles directional pointer input", () => {
    const canvas = createMockCanvas();
    const input = createInput(canvas, () => {});

    input.setPointer(1, "up");
    expect(input.movement()).toEqual({ x: 0, z: -1 });

    input.setPointer(1, null);
    expect(input.movement()).toEqual({ x: 0, z: 0 });

    input.dispose();
  });

  it("zeros movement when paused", () => {
    const canvas = createMockCanvas();
    const input = createInput(canvas, () => {});

    input.setVector({ x: 1, z: 0 });
    input.setPaused(true);
    expect(input.movement()).toEqual({ x: 0, z: 0 });

    input.dispose();
  });
});
