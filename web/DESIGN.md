# AIP Developer Frontend Design

## Subject

AIP Developer is an agent control plane for developers and operators. The first job of the UI is repeated configuration: create projects, manage agents, bind prompts, skills, and MCP services without losing context.

## Direction

The interface follows a Cursor-inspired tool aesthetic: quiet canvas, dark left rail, thin borders, compact controls, monospace metadata, and strong keyboard focus. It should feel like an editor sidecar rather than a marketing dashboard.

## Tokens

- Canvas: `#F3F0EA`
- Panel: `#FFFDFA`
- Ink: `#191715`
- Muted text: `#756F66`
- Line: `#D9D1C4`
- Accent: `#5157D8`
- Success: `#16845D`
- Warning: `#A66B13`
- Danger: `#B7392D`

## Layout

```
+----------------------+-----------------------------------+
| dark navigation rail | workspace header + dense panels    |
| project/account nav  | metrics, forms, lists, bindings    |
+----------------------+-----------------------------------+
```

Use a persistent rail on desktop and collapse to a stacked header on small screens. Forms sit beside the related list whenever there is enough width. Repeated data appears as compact cards or rows, never as decorative nested cards.

## Signature

The auth view uses a small command trace board: a terminal command plus a node map. It is the only expressive visual device; the rest of the product stays disciplined and operational.

## Component Rules

- Keep API calls in `src/lib` and state orchestration in `src/hooks`.
- Keep domain types and labels in `src/domain`.
- Keep page-level UI in `src/components`.
- Do not define React components inside other components.
- Use direct file imports instead of barrel imports.
- Use functional state updates for form edits.
- Preserve stable dimensions for buttons, cards, tabs, and fields.
