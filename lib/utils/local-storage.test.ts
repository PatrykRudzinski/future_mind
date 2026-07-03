import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";

import { createLocalStorageAdapter } from "@/lib/utils/local-storage";

const schema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
  }),
);

const adapter = createLocalStorageAdapter({
  key: "test:favorites",
  schema,
  defaultValue: [],
});

describe("createLocalStorageAdapter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the default value when storage is empty", () => {
    expect(adapter.read()).toEqual({ success: true, data: [] });
  });

  it("reads and writes valid payloads", () => {
    const favorites = [{ id: "tt1375666", title: "Inception" }];

    expect(adapter.write(favorites)).toEqual({ success: true });
    expect(adapter.read()).toEqual({ success: true, data: favorites });
  });

  it("falls back to the default value when stored JSON is invalid", () => {
    localStorage.setItem("test:favorites", "{ invalid json");

    const result = adapter.read();

    if (result.success) {
      throw new Error("Expected read to fail");
    }

    expect(result.data).toEqual([]);
    expect(result.error.code).toBe("json_parse");
  });

  it("falls back to the default value when stored data fails validation", () => {
    localStorage.setItem("test:favorites", JSON.stringify([{ id: 123 }]));

    const result = adapter.read();

    if (result.success) {
      throw new Error("Expected read to fail");
    }

    expect(result.data).toEqual([]);
    expect(result.error.code).toBe("validation");
  });

  it("rejects invalid writes", () => {
    const result = adapter.write([{ id: 123, title: "Invalid" }] as never);

    if (result.success) {
      throw new Error("Expected write to fail");
    }

    expect(result.error.code).toBe("validation");
  });

  it("removes stored values", () => {
    adapter.write([{ id: "tt1375666", title: "Inception" }]);
    expect(adapter.remove()).toEqual({ success: true });
    expect(adapter.read()).toEqual({ success: true, data: [] });
  });
});
