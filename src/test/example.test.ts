import { describe, it, expect } from "vitest";
import { buildMailtoHref } from "@/components/portfolio/ContactSection";

describe("buildMailtoHref", () => {
  it("creates a valid mailto link with subject and body", () => {
    const href = buildMailtoHref(
      "hello@example.com",
      "Let's work together",
      "Hi there"
    );

    expect(href.startsWith("mailto:hello@example.com?")).toBe(true);
    expect(new URL(href).searchParams.get("subject")).toBe(
      "Let's work together"
    );
    expect(new URL(href).searchParams.get("body")).toBe("Hi there");
  });
});
