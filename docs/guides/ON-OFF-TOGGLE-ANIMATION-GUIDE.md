# "Align ON/OFF" Toggle Animation — How It Works & How to Reuse It

Source of truth: `src/pages/Home/sections/ProblemsSection.jsx` (the "One straight line
from chaos to aligned" section), state in `src/pages/Home/HomeContext.jsx`.

This is the pattern behind the toggle switch that flips the whole panel between a
"messy/without Align" state and a "clean/with Align" state — track color, knob
position, label text, line-chart path, status icons, and card copy all switch
together, smoothly, from one boolean.

## 1. The core idea

One boolean lives in global state. Everything that needs to change look — text,
icons, colors, paths — is **rendered twice** (once for the ON look, once for the
OFF look), stacked in the same place with `position:absolute`, and only their
**opacity** is toggled via a CSS custom property. Nothing is conditionally
mounted/unmounted — both versions always exist in the DOM, so the crossfade is a
pure CSS transition with zero layout jank or remount flicker.

The boolean itself drives a handful of CSS custom properties (`--wOn`, `--wOff`,
`--wLabel`, `--wTrack`, `--wKnob`) set once at the section's root `style`. Every
descendant just reads `var(--wOn,1)` / `var(--wOff,0)` etc. — no per-element
JS re-render needed for the visual flip, only the root re-renders when state
changes and the vars cascade down.

## 2. The state piece (HomeContext.jsx)

```js
// initial state
probOn: true,   // true = "Align ON" (the good state), false = "Align OFF"

// reducer
case 'TOGGLE_PROB':
  return { ...s, probOn: !s.probOn };

// action-name -> dispatch mapping (used by the button's data-act)
if (name === 'toggleAbs') return dispatch({ type: 'TOGGLE_PROB' });

// derived label text read via b('togLabel')
case 'togLabel': return state.probOn ? 'Align ON' : 'Align OFF';
```

That's the entire state surface: one boolean, one reducer case, one action name,
one derived label string. If you reuse this in a new section, give the new
boolean its own name (e.g. `svcOn`), its own `TOGGLE_X` case, and its own action
name — don't reuse `probOn`/`toggleAbs`, they're wired specifically to this
section's button.

## 3. The CSS variables (ProblemsSection.jsx, top of the component)

```jsx
const on = state.probOn;
const wVars = {
  '--wOn':    on ? '1' : '0',                 // 1 when ON, 0 when OFF
  '--wOff':   on ? '0' : '1',                 // inverse of wOn
  '--wLabel': on ? '#1a56db' : '#e5484d',     // label text color
  '--wTrack': on ? '#1a56db' : '#c9d3e0',     // switch track color
  '--wKnob':  on ? 'translateX(29px)' : 'translateX(0)', // knob position
};

<section style={{ ...otherStyles, ...wVars }}>
```

Spreading `wVars` into the section's `style` prop puts these as CSS custom
properties on that DOM node. Every descendant element inherits them and can read
them with `var(--name, fallback)`.

## 4. Reading the vars — the crossfade pattern

Every place that needs to look different ON vs OFF is written as **two
absolutely-stacked copies**, one gated to `var(--wOn,1)`, one to `var(--wOff,0)`:

```jsx
<div style={{ position: 'relative', /* ...sizing... */ }}>
  <span style={{ position: 'absolute', inset: 0, opacity: 'var(--wOn,1)', transition: 'opacity .4s ease' }}>
    {/* the "good" version: green check icon, "One-tap approved", etc. */}
  </span>
  <span style={{ position: 'absolute', inset: 0, opacity: 'var(--wOff,0)', transition: 'opacity .4s ease' }}>
    {/* the "bad" version: red icon, "Stuck for days", etc. */}
  </span>
</div>
```

Because `wOn` and `wOff` are always exact inverses (1/0 or 0/1), exactly one copy
is visible at full opacity at any time, and toggling state just flips both
`opacity` values, which CSS transitions smoothly over `.4s`. Both copies keep
occupying the same space (`position:absolute; inset:0` inside a `position:relative`
parent) so nothing shifts around during the fade.

This same var pair is reused everywhere in the section: the headline sentence
above the diagram, the four status pills ("Approvals", "Payroll", "Reporting",
"Custom software"), the four numbered step-circles, the "Your business ➜ result"
end icon, the background radial tint, and even which of the two SVG paths (smooth
line vs tangled scribble) is visible — all driven by the same two variables.

## 5. The switch control itself

```jsx
<button
  data-act="toggleAbs"
  onClick={() => act('toggleAbs')}
  aria-label="Toggle Align on or off"
  style={{
    position: 'relative', width: '62px', height: '33px', border: 'none',
    borderRadius: '99px', background: 'var(--wTrack,#1a56db)',
    cursor: 'pointer', transition: 'background .35s ease', padding: 0,
  }}
>
  <span style={{
    position: 'absolute', top: '4px', insetInlineStart: '4px',
    width: '25px', height: '25px', borderRadius: '50%', background: '#fff',
    transform: 'var(--wKnob,translateX(29px))',
    transition: 'transform .35s cubic-bezier(.5,1.6,.4,1)',
    boxShadow: '0 2px 7px rgba(15,23,41,.3)',
  }} />
</button>
```

- Track color animates via `background: var(--wTrack,...)` + its own `transition`.
- Knob position animates via `transform: var(--wKnob,...)` with a bouncy
  `cubic-bezier(.5,1.6,.4,1)` easing (gives it a little overshoot "snap").
- The label next to it reads `var(--wLabel,...)` for its text color and
  `b('togLabel')` (see §2) for its actual text.

## 6. Recipe: reusing this pattern in a new section

1. **Add a boolean to HomeContext** (or local `useState` if the section doesn't
   need global state): `myFlagOn: true` in initial state, a `TOGGLE_MYFLAG`
   reducer case, and an action-name mapping like `toggleAbs` → your own name
   (e.g. `toggleMyFlag`).
2. **Build the CSS-var object** at the top of your component, same shape as
   `wVars` above, but with your own var names (`--myOn`, `--myOff`, plus any
   color/position vars your specific UI needs — you don't need all 5, only
   what your specific visuals require).
3. **Spread the vars onto a root element** that wraps everything that needs to
   react to the toggle (a section, or just an inner wrapper div — doesn't have
   to be the whole `<section>`).
4. **For every place that changes look**, render both states stacked with
   `position:absolute` (inside a `position:relative` sized parent) and gate
   each with `opacity: var(--myOn,1)` / `var(--myOff,0)` + a `transition`.
   Do **not** conditionally render (`{on && <X/>}`) if you want a crossfade —
   conditional rendering unmounts/remounts and skips the transition entirely.
5. **Build the switch control** (or reuse the exact button/knob markup above)
   wired to your new action name, reading your own `--myTrack`/`--myKnob` vars.
6. **Pick a transition timing** per property: opacity crossfades read best at
   `.35s–.5s ease`; a knob/position move reads better with a slight overshoot
   (`cubic-bezier(.5,1.6,.4,1)`) so it doesn't feel purely mechanical.

## 7. Minimal generic template

```jsx
// --- state (HomeContext.jsx) ---
// initial: myOn: true
// reducer: case 'TOGGLE_MY': return { ...s, myOn: !s.myOn };
// action:  if (name === 'toggleMy') return dispatch({ type: 'TOGGLE_MY' });

// --- component ---
function MySection() {
  const { state, act } = useHome();
  const on = state.myOn;
  const vars = {
    '--myOn': on ? '1' : '0',
    '--myOff': on ? '0' : '1',
    '--myTrack': on ? '#1a56db' : '#c9d3e0',
    '--myKnob': on ? 'translateX(29px)' : 'translateX(0)',
  };

  return (
    <div style={{ position: 'relative', ...vars }}>
      {/* content that crossfades */}
      <div style={{ position: 'relative', height: 24 }}>
        <span style={{ position: 'absolute', inset: 0, opacity: 'var(--myOn,1)', transition: 'opacity .4s ease' }}>
          Good-state copy
        </span>
        <span style={{ position: 'absolute', inset: 0, opacity: 'var(--myOff,0)', transition: 'opacity .4s ease' }}>
          Bad-state copy
        </span>
      </div>

      {/* the switch */}
      <button
        onClick={() => act('toggleMy')}
        aria-label="Toggle my thing on or off"
        style={{ position: 'relative', width: 62, height: 33, border: 'none', borderRadius: 99, background: 'var(--myTrack,#1a56db)', cursor: 'pointer', transition: 'background .35s ease', padding: 0 }}
      >
        <span style={{ position: 'absolute', top: 4, left: 4, width: 25, height: 25, borderRadius: '50%', background: '#fff', transform: 'var(--myKnob,translateX(29px))', transition: 'transform .35s cubic-bezier(.5,1.6,.4,1)', boxShadow: '0 2px 7px rgba(15,23,41,.3)' }} />
      </button>
    </div>
  );
}
```

## 8. Why this approach (not `useState` + conditional JSX)

- **One state change, one re-render, many synchronized transitions** — the vars
  cascade to every descendant in a single render pass; you don't need to thread
  `on`/`off` props down through children or re-render each child separately.
- **Smooth crossfade requires both states mounted at once** — CSS `opacity`
  transitions don't work across mount/unmount, only across a value change on an
  element that stays in the DOM. Rendering both and toggling opacity is the
  standard way to animate a content swap in plain CSS without a JS animation
  library.
- **Cheap to extend** — adding a new element that should react to the toggle is
  just "wrap it twice, gate with `var(--wOn)`/`var(--wOff)`" — no new state,
  no new wiring, it automatically follows whatever the switch is doing.
