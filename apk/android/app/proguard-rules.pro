# Capacitor ProGuard Rules
-keep @interface com.getcapacitor.annotation.*
-keep class com.getcapacitor.** { *; }
-keep class * extends com.getcapacitor.Plugin
-keep class * extends com.getcapacitor.BridgeActivity

# Keep WebView JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep custom plugins
-keep class com.onexking.app.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}
