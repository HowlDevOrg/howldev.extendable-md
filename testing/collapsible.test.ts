import { describe, it, expect } from "vitest";
import { semanticDiffuser } from "../lib/logic/stringfunc";

describe("collapsible syntax parsing", () => {
  describe("basic collapsible blocks", () => {
    it("simple open collapsible (=v=) should be grouped into one item", () => {
      const value = "=v= Collapsible paragraph, default open.\nThis is inside.\n=";
      const modified = semanticDiffuser(value);
      expect(modified[0]).toStrictEqual("=v= Collapsible paragraph, default open.\nThis is inside.");
      expect(modified.length).toBe(1);
    });

    it("simple closed collapsible (=^=) should be grouped into one item", () => {
      const value = "=^= ## Header, default closed.\nThis is inside.\n\n- Here's a list.\n- Part 2.\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(1);
      expect(modified[0]).toStrictEqual(
        "=^= ## Header, default closed.\nThis is inside.\n\n- Here's a list.\n- Part 2."
      );
    });

    it("collapsible with content on multiple lines", () => {
      const value = "=v= Start\nLine 2\nLine 3\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(1);
      expect(modified[0]).toStrictEqual("=v= Start\nLine 2\nLine 3");
    });
  });

  describe("nested collapsible blocks", () => {
    it("first level collapsible with second level nested collapsible", () => {
      const value = "=^= First level\nHere's some text, as if this paragraph mattered.\n=v= Second level\n- Very internal list\n- part 2\n=\nNow that that's over with...\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(1);
      expect(modified[0]).toStrictEqual(
        "=^= First level\nHere's some text, as if this paragraph mattered.\n=v= Second level\n- Very internal list\n- part 2\n=\nNow that that's over with..."
      );
    });

    it("deeply nested collapsibles should all be contained in outer block", () => {
      const value = "=v= Outer\n=^= Middle\n=v= Inner\nContent\n=\n=\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(1);
      expect(modified[0]).toStrictEqual("=v= Outer\n=^= Middle\n=v= Inner\nContent\n=\n=");
    });

    it("multiple nested blocks within same parent", () => {
      const value = "=^= Parent\n=v= First child\nContent 1\n=\nSome text\n=v= Second child\nContent 2\n=\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(1);
      expect(modified[0]).toStrictEqual(
        "=^= Parent\n=v= First child\nContent 1\n=\nSome text\n=v= Second child\nContent 2\n="
      );
    });
  });

  describe("collapsible blocks with other markdown elements", () => {
    it("collapsible containing list items", () => {
      const value = "=^= List Container\n- Item 1\n- Item 2\n- Item 3\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(1);
      expect(modified[0]).toStrictEqual("=^= List Container\n- Item 1\n- Item 2\n- Item 3");
    });

    it("collapsible containing code block", () => {
      const value = "=v= Code Block\nHere's code:\n```ts\nconst x = 5;\n```\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(1);
      expect(modified[0]).toStrictEqual("=v= Code Block\nHere's code:\n```ts\nconst x = 5;\n```");
    });

    it("collapsible with header inside", () => {
      const value = "=^= ## Header Inside\nSome content\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(1);
      expect(modified[0]).toStrictEqual("=^= ## Header Inside\nSome content");
    });
  });

  describe("collapsible with surrounding content", () => {
    it("collapsible preceded by text", () => {
      const value = "This is before.\n=v= Inside\nContent\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(2);
      expect(modified[0]).toStrictEqual("This is before.");
      expect(modified[1]).toStrictEqual("=v= Inside\nContent");
    });

    it("collapsible followed by text", () => {
      const value = "=v= Inside\nContent\n=\nThis is after.";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(2);
      expect(modified[0]).toStrictEqual("=v= Inside\nContent");
      expect(modified[1]).toStrictEqual("This is after.");
    });

    it("collapsible surrounded by text", () => {
      const value = "Before.\n=^= Inside\nContent\n=\nAfter.";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(3);
      expect(modified[0]).toStrictEqual("Before.");
      expect(modified[1]).toStrictEqual("=^= Inside\nContent");
      expect(modified[2]).toStrictEqual("After.");
    });

    it("multiple consecutive collapsibles", () => {
      const value = "=v= First\nA\n=\n=^= Second\nB\n=";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(2);
      expect(modified[0]).toStrictEqual("=v= First\nA");
      expect(modified[1]).toStrictEqual("=^= Second\nB");
    });
  });

  describe("real-world example from full-setup.md", () => {
    it("all three example collapsibles are properly grouped", () => {
      const value = `=v= Collapsible paragraph, default open. 
This is inside. 
=

=^= ## Header, default closed.
This is inside.

- Here's a list. 
- Part 2. 
=

On top of that, you can also nest them. 
=^= First level
Here's some text, as if this paragraph mattered. 
=v= Second level
- Very internal list
- part 2
=
Now that that's over with...
=`;
      const modified = semanticDiffuser(value);
      // Should have: collapsible 1, collapsible 2, text, collapsible 3
      expect(modified.length).toBe(4);
      expect(modified[0]).toStrictEqual("=v= Collapsible paragraph, default open.\nThis is inside.");
      expect(modified[1]).toStrictEqual("=^= ## Header, default closed.\nThis is inside.\n\n- Here's a list.\n- Part 2.");
      expect(modified[2]).toStrictEqual("On top of that, you can also nest them.");
      expect(modified[3]).toContain("=^= First level");
    });
  });
});
