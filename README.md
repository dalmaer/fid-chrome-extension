# First Input Delay (FID) Chrome Extension

![An example of a good 1s FID score (thus green!)](example-1s.png)

This Chrome extension tracks the [FID (First Input Delay)](https://web.dev/fid/ "web.dev article on FID") metric for pages that you visit as you browse the Web.

There is now a great [Core Web Vitals extension](https://github.com/GoogleChrome/web-vitals-extension/ "Core Web Vitals Extension") that I recommend!

NOTE: There are other extensions for key metrics such as:

- [LCP (Largest Contentful Paint)](https://github.com/dalmaer/lcp-chrome-extension)
- [FCP (First Contentful Paint)](https://github.com/dalmaer/fcp-chrome-extension)
- [CLS (Cumulative Layout Shift)](https://github.com/dalmaer/cls-chrome-extension)

## Installation

This is very alpha! I haven't put the extension in the store yet, so, clone the repo and then go to chrome://extensions. Once there, click on the "Load unpacked" button and select the directory that you just cloned.

## Features

- As FID events are sent to the extension from the [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) the icon will update by changing color (green for good, yellow for adequate, and red for pood) and showing the number of seconds in the badge. If it takes longer than 9999 seconds, it will just say "BAD" because the badge can only show 4 characters and .... well it _is_ really bad
- Click on the icon badge UI to see a scoreboard popup of the pages that have scores, ordered by fastest to slowest (ability to clear the history in this popup too)
- It stores the FID for the load in local storage, so when you go back it can show you the score from earlier

## Bugs / Issues

- If you don't see results from a page, it may be that the result hasn't come back, or it may be the item below..
- If you aren't seeing results on an internal site or see an error `"This page cannot be scripted due to an ExtensionsSettings policy."` it means that your organization is limiting content scripts (often on internal content). To fix this, you need to add a `key: $TOKEN_FROM_YOUR_ORGANIZATION` to the `manifest.json`

# Metrics

| Color  | Description |
| ------ | ----------- |
| GREEN  | good        |
| YELLOW | adequate    |
| RED    | poor        |

## FID thresholds

| Color  | Threshold |
| ------ | --------- |
| GREEN  | < 100ms   |
| YELLOW | < 300ms   |
| RED    | > 300ms   |

## Other metrics as FYI:

```
LCP: GREEN < 2.5 second,       YELLOW < 4s,    RED > 4s
FCP: GREEN < 1s,               YELLOW < 3s,    RED > 300ms
CLS: GREEN < 0.1,              YELLOW < 0.25,  RED > 0.25
```

# States

- No results for this tab: "FID"
- FID isn't available (e.g. policy doesn't allow content script injection): "FID" with a [grey] square
- FID is good: Green background with score in badge
- FID is adequate: Yellow background with score in badge
- FID is poor: Red background with score in badge, or "BAD" if the score is greater than 9999 due to a badge only allowing 4 characters
