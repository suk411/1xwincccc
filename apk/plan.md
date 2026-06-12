# 1xKING Android APK — Build Plan

## Stack Choice: Capacitor (by Ionic)

| Factor | Capacitor | React Native | Flutter |
|---|---|---|---|
| APK size | ~6 MB | ~30 MB | ~50 MB |
| Purpose | Web app wrapper | Native UI framework | Native UI framework |
| Splash screen | Built-in plugin | 3rd-party lib | 3rd-party lib |
| Setup time | ~15 min | ~1 hr | ~1 hr |

Since 1xKING is already a web app (React + Vite), Capacitor wraps it natively. RN/Flutter would require a full rewrite.

---

## Phases

### Phase 1 — Scaffold
- [x] Create `apk/` folder
- [ ] Copy logo (`pwa-512x512.png`) from `../public/` into `apk/logo.png`
- [ ] Initialize Capacitor project with `npm init`
- [ ] Install `@capacitor/core`, `@capacitor/android`, `@capacitor/splash-screen`

### Phase 2 — Configuration
- [ ] Configure `capacitor.config.ts`:
  - `server.url`: `https://1xking.vercel.app/`
  - `plugins.SplashScreen`: logo, `#141011` background, launcher theme
  - `android.allowMixedContent`: `false`

### Phase 3 — Native Android enhancements
- [ ] Cold-start splash screen (Android 12+ SplashScreen API) — no white flash
- [ ] Native ProgressBar during WebView page load, auto-hides on completion

### Phase 4 — Build
- [ ] `npx cap sync android`
- [ ] `npx cap open android` → Build APK in Android Studio

---

## Detailed Setup

### Capacitor project
```bash
cd apk
npm init -y
npm install @capacitor/core @capacitor/android @capacitor/splash-screen
npx cap init 1xKING com.1xking.app
npx cap add android
```

### Splash screen config (`capacitor.config.ts`)
```ts
plugins: {
  SplashScreen: {
    launchShowDuration: 3000,
    backgroundColor: "#141011",
    androidSplashResourceName: "splash",
    androidScaleType: "FIT_CENTER",
    showSpinner: false,
    splashFullScreen: true,
    splashImmersive: true
  }
}
```

### Progress bar
- Add `ProgressBar` (horizontal) in `MainActivity.java` or the WebView layout XML
- WebView `onPageStarted` → show, `onPageFinished` → hide with fade

### Android cold-start theme
- Set `res/values/themes.xml` parent to `Theme.SplashScreen` (Android 12+)
- Uses same `#141011` background and logo drawable
