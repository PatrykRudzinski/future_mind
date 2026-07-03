import { describe, expect, it } from "vitest";

import { movieSearchFormSchema, movieSearchParamsSchema } from "@/lib/schemas/movie";

describe("movieSearchParamsSchema", () => {
  it("accepts valid search params", () => {
    expect(
      movieSearchParamsSchema.parse({
        query: "inception",
        year: "2010",
        type: "movie",
        page: "2",
      }),
    ).toEqual({
      query: "inception",
      year: 2010,
      type: "movie",
      page: 2,
    });
  });

  it("rejects empty queries", () => {
    expect(
      movieSearchParamsSchema.safeParse({
        query: "",
      }).success,
    ).toBe(false);
  });
});

describe("movieSearchFormSchema", () => {
  it("accepts valid form values", () => {
    expect(
      movieSearchFormSchema.parse({
        query: "inception",
        year: "2010",
        type: "movie",
      }),
    ).toEqual({
      query: "inception",
      year: "2010",
      type: "movie",
    });
  });

  it("allows an empty year", () => {
    expect(
      movieSearchFormSchema.parse({
        query: "inception",
        year: "",
        type: "all",
      }),
    ).toEqual({
      query: "inception",
      year: "",
      type: "all",
    });
  });

  it("rejects invalid years", () => {
    const result = movieSearchFormSchema.safeParse({
      query: "inception",
      year: "20",
      type: "all",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.year?.[0]).toContain("4-digit year");
    }
  });
});
