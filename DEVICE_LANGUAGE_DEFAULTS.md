# Device-Based Default Language Behavior

This document defines the default language behavior by device type:

- iPhone/iOS visitors default to English (`en`)
- Android visitors default to Marathi (`mr`)
- Any non-iPhone and non-Android device defaults to English (`en`)
- Users can always switch language manually
- Manual selection is remembered and always takes priority on future visits

## Scope

This behavior is implemented at the app layer in `src/contexts/LanguageContext.tsx` (inside `readInitialLocale()`), not in CloudFront routing.

No separate page routes are required.

## Decision Order (First Visit vs Returning Visit)

When the app loads, locale selection should follow this order:

1. If `localStorage["uttarafarm-locale"]` is set to `en` or `mr`, use it.
2. Otherwise, detect device type from `navigator.userAgent`:
   - iOS device -> `en`
   - Android device -> `mr`
3. For every other device type (non-iPhone and non-Android), default to `en`.

## Recommended Detection Logic

Use a helper like this in `LanguageContext.tsx`:

```ts
function getDeviceDefaultLocale(): Locale {
  const ua = navigator.userAgent.toLowerCase();

  const isAndroid = ua.includes("android");
  const isIOS =
    /iphone|ipad|ipod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) return "en";
  if (isAndroid) return "mr";
  return "en";
}
```

Then call this helper only when no stored preference exists.

## Important Notes

- This is a defaulting strategy, not a hard language lock.
- User preference in local storage must always override device detection.
- User-agent based detection is best-effort and may not be perfect for all browsers/devices.
- Keep the existing language switcher visible and functional for both locales.

## QA Checklist

- Fresh iPhone visit (no local storage) loads in English.
- Fresh Android visit (no local storage) loads in Marathi.
- Fresh visit on all other devices (no local storage) loads in English.
- After switching language, refresh keeps user-selected locale.
- Desktop browsers load in English by default.
- Clearing site storage restores device-based default logic on next visit.
