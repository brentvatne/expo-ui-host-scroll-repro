# expo-ui-host-scroll-repro

Minimal Expo SDK 58 app for an `@expo/ui` issue: a native stack header doesn't track the scroll view inside a `Host` when another view comes before the `Host` in the screen. The large title never collapses and the bar never switches to its scrolled appearance, so rows show through the title.

UIKit (and react-native-screens) only find a screen's content scroll view along the first-subview chain of its view controller's view. When the `Host` is the screen's only child, that chain happens to reach the hosted `UIScrollView`. Any view before it (a floating button, a banner, a segmented control in its own `Host`) ends the chain somewhere else.

## Run

```sh
bun install
EXPO_USE_PRECOMPILED_MODULES=0 npx expo run:ios
```

`EXPO_USE_PRECOMPILED_MODULES=0` builds Expo modules from source, so a patch to `@expo/ui` / `expo-modules-core` in `node_modules` takes effect.

Launch arguments (the simulator can't be scrolled from the command line):

| Argument | Effect |
|---|---|
| `-scrolled 1` | Scrolls to row 20 a second after launch (`scrollPosition`). |
| `-overlay 1` | Renders a floating button before the list `Host` (absolutely positioned, no `zIndex`). |
| `-above 1` | Puts a segmented control in its own `Host` above the list. |
| `-list 1` | Uses a `List` instead of a `ScrollView` (at rest only). |

```sh
xcrun simctl launch booted dev.brentvatne.hostscrollrepro -overlay 1 -scrolled 1
```

## Evidence

`pr-evidence/` has iOS 27.0 simulator (iPhone 17) screenshots before and after the change in the linked PR: `before-*` with stock `@expo/ui` 58.0.14, `after-*` with the change applied to `node_modules`.
