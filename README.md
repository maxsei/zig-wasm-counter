# zig-wasm-counter

This repo is to show how you might persist wasm module's state in memory. Importing the `Counter` class will fetch, load, and wrap the wasm binary. This means the import will block and it is recommended to import the `Counter` type and use a dynamic import where it the `Counter` is directly required in your javascript code.
