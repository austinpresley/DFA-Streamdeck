// Browser demonstration only. The native plugin has its own tested host.
export class Ceremony {
  #clock;
  #pending = new Set();
  #generation = 0;

  constructor(clock = globalThis) { this.#clock = clock; }

  cancel() {
    this.#generation++;
    for (const id of this.#pending) this.#clock.clearTimeout(id);
    this.#pending.clear();
  }

  start(steps) {
    this.cancel();
    const generation = this.#generation;
    for (const [delay, callback] of steps) {
      if (delay === 0) { callback(); continue; }
      const id = this.#clock.setTimeout(() => {
        this.#pending.delete(id);
        if (generation === this.#generation) callback();
      }, delay);
      this.#pending.add(id);
    }
  }
}
