import { describe, expect, it } from "vitest";

import { truncateWithEllipsis } from "@/lib/utils/truncate-with-ellipsis";

describe("truncateWithEllipsis", () => {
  it("returns the original text when it fits within maxLength", () => {
    expect(truncateWithEllipsis("Inception", 20)).toBe("Inception");
  });

  it("returns the original text when length equals maxLength", () => {
    const text = "a".repeat(20);

    expect(truncateWithEllipsis(text, 20)).toBe(text);
  });

  it("truncates long text and appends an ellipsis", () => {
    const text = "The Shawshank Redemption";

    expect(truncateWithEllipsis(text, 20)).toBe("The Shawshank Red...");
  });

  it("handles empty strings", () => {
    expect(truncateWithEllipsis("", 20)).toBe("");
  });

  it("supports custom maxLength values", () => {
    const plot = "a".repeat(200);

    expect(truncateWithEllipsis(plot, 160)).toBe(`${"a".repeat(157)}...`);
    expect(truncateWithEllipsis(plot, 160).length).toBe(160);
  });
});
