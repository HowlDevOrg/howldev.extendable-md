import { describe, it, expect } from "vitest";
import { InlineMD } from "../lib/InlineMarkdown";

describe("can get bold text", () => {
  it("plain bold text works correctly", () => {
    const value = "**this is bold**";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual("<b>this is bold</b>");
  });

  it("bold text in a sentence works", () => {
    const value = "This is bold stuff **in a sentence**.";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual("This is bold stuff <b>in a sentence</b>.");
  });
  it("plain bold text works correctly with underlines", () => {
    const value = "__this is bold__";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual("<b>this is bold</b>");
  });

  it("bold text in a sentence works with underlines", () => {
    const value = "This is bold stuff __in a sentence__.";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual("This is bold stuff <b>in a sentence</b>.");
  });
});

describe("can get italicized text", () => {
  it("plain italic text works correctly", () => {
    const value = "*this is italic*";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual("<em>this is italic</em>");
  });

  it("italic text in a sentence works", () => {
    const value = "This is italic stuff *in a sentence*.";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual(
      "This is italic stuff <em>in a sentence</em>.",
    );
  });
  it("plain italic text works correctly with underlines", () => {
    const value = "_this is italic_";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual("<em>this is italic</em>");
  });

  it("italic text in a sentence works with underlines", () => {
    const value = "This is italic stuff _in a sentence_.";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual(
      "This is italic stuff <em>in a sentence</em>.",
    );
  });
});

it("can combine bold/italic text", () => {
  const value = "***this is bold and italic***";
  const modified = InlineMD(value);
  expect(modified).toStrictEqual("<em><b>this is bold and italic</b></em>");
});

describe("can get inline code", () => {
  it("plain inline code works correctly", () => {
    const value = "`this is code`";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual("<code>this is code</code>");
  });
  it("inline code in a sentence works correctly", () => {
    const value = "this is outside. `this is code`";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual(
      "this is outside. <code>this is code</code>",
    );
  });
});

describe("can strikethrough", () => {
  it("plain inline strike works correctly", () => {
    const value = "~~this is stricken~~";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual("<strike>this is stricken</strike>");
  });
  it("inline strike in a sentence works correctly", () => {
    const value = "this is outside. ~~this is stricken~~";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual(
      "this is outside. <strike>this is stricken</strike>",
    );
  });
});

describe("can get anchor elements", () => {
  it("plain anchor text works correctly", () => {
    const value = "[this is a link](https://example.com)";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual(
      '<a href="https://example.com">this is a link</a>',
    );
  });
  it("anchor text in a sentence works correctly", () => {
    const value = "Check out [this link](https://example.com) for more info.";
    const modified = InlineMD(value);
    expect(modified).toStrictEqual(
      'Check out <a href="https://example.com">this link</a> for more info.',
    );
  });
});
