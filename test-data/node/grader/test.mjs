import assert from "assert";
import squareRoot from "./square-root.mjs";
import { describe, it } from "node:test";

describe("squareRoot", () => {
  it("square root of 4 should be 2", () => {
    assert.equal(squareRoot(4), 2);
  });

  it("square root of 16 should be 4", () => {
    assert.equal(squareRoot(16), 4);
  });

  it("should return NaN when given a negative number", () => {
    assert.equal(isNaN(squareRoot(-1)), true);
  });
});
