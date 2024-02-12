declare class Counter {
  private _fns;
  private self;
  constructor();
  increment(): void;
  get_count(): number;
  deinit(): void;
}
export { Counter };
export default Counter;
