# Install, uninstall and troubleshooting

## Requirements

- macOS 13 or later. Built as a universal executable; checked on Apple
  silicon. The Intel slice has not been run.
- Stream Deck application 6.5 or later, as declared in the manifest. That
  minimum is checked against the APIs DFA uses and Elgato's schema; Full installation and lifecycle checks in the Stream Deck app remain
  pending (HC-4).
- Any Stream Deck with keys. Seven controls also work on Stream Deck + dials.

## Install

1. Quit nothing; Stream Deck can stay open.
2. Double-click `DFA-<version>.streamDeckPlugin`. Stream Deck asks to install
   the plugin. Confirm.
3. In the Stream Deck app's action list, open the DFA category and drag
   any of the twenty-one controls onto a key. Fader, More, Warmth, Less,
   Sweet spot / Flux alignment, Fine tune / Second opinion and Confidence
   can also be placed on a Stream Deck + dial.

Select a placed action in Stream Deck to edit its settings. Label replaces
the text on that button; leave it blank for DFA's changing status text.
Main color opens a color picker and updates the housing and its darker regions.
Accent color changes the arcs and indicators. Changes save to that placed action, so two
copies of the same toy can have different colors and labels. Press Enter or
leave the Label field to save text. Reset appearance restores the original
blue background, amber accent and changing text.

Each action also has Sound, DFA volume (default 20%), Reduce motion and
Preview. Reset appearance keeps those preferences. Volume affects DFA's own
sounds only. Existing profiles retain their original look after updating.

Fader, More, Warmth, Less, Confidence and Sweet spot also show Step size. Choose 1 point for fine adjustments or
5 points for the original behavior. This sets the amount per press or dial
tick for that placed action. Changing it keeps the current value; holding a
key, pressing a dial or tapping its strip resets to 50, or 20 for Sweet spot.
Fine tune turns set temporary wobble strength and always return to 50. Reset appearance
keeps your chosen step. Existing actions default to 5 points after updating.

## Uninstall

In the Stream Deck app, open Preferences, then Plugins, select DFA and
uninstall it. Or quit Stream Deck and delete
`~/Library/Application Support/com.elgato.StreamDeck/Plugins/com.austinpresley.dfa.sdPlugin`.
DFA writes nothing else on your Mac. Its per-key settings live in your Stream
Deck profiles and disappear with the placed actions.

## Troubleshooting

**A key shows a static picture instead of DFA's art.** A custom image set on
that key in the Stream Deck app takes precedence over DFA's frames. Clear the
key's custom image.

**No sound.** Check the action's Sound switch and DFA volume in its settings,
then your Mac's current output device and volume. DFA plays through the
default output and never changes system volume. Muting one key does not mute
the others.

**The plugin does not start.** Check the Stream Deck and macOS versions above.
Build 0.5.0.0 is Developer ID signed and Apple-notarized. Its standalone
executable uses Apple's online notarization ticket lookup, so connect to the
internet for the first launch. If macOS still blocks it, reinstall from the
official download and record the exact warning for support.

**Diagnostics.** DFA logs a missing or failed sound to the unified log:

```sh
log stream --predicate 'subsystem == "com.austinpresley.dfa" OR subsystem == "StreamDeckPlugin"'
```

Stream Deck's own logs are in `~/Library/Logs/ElgatoStreamDeck/`.
