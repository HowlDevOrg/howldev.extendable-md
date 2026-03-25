# Extendable-md

This is a home-grown Markdown parser with sensible defaults to display: 
- (Most) Standard Markdown (see wiki for specifics)
- LaTeX (both inline and codeblock)
- Syntax highlighting through Highlight.js and a sweet code display (my opinion)
- Built-in Mermaid viewer
- Topped off with DOMPurify by default

What makes it extendable is the overrides you pass into the one exposed component. You can override the default code viewer for a component that better suites your tastes/style, override the LaTeX component if KaTeX isn't working for you, the same for Mermaid blocks. In the future, I might be able to expose more of the Markdown parser to be overridden/extended, but I haven't made it yet. 