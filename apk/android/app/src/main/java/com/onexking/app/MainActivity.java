package com.onexking.app;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.ProgressBar;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private ProgressBar progressBar;
    private LinearLayout splashLayout;
    private ProgressBar splashProgress;
    private boolean splashShown = true;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        progressBar = findViewById(R.id.progressBar);
        splashLayout = findViewById(R.id.splashLayout);
        splashProgress = findViewById(R.id.splashProgress);

        new Handler(Looper.getMainLooper()).post(() -> setupBridge());
    }

    private void setupBridge() {
        WebView webView = bridge.getWebView();
        if (webView == null) return;

        final WebChromeClient originalChrome = webView.getWebChromeClient();
        final WebViewClient originalView = webView.getWebViewClient();

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (splashShown && splashProgress != null) {
                    splashProgress.setProgress(newProgress);
                }
                if (newProgress < 100 && !splashShown && progressBar != null) {
                    progressBar.setProgress(newProgress);
                    if (progressBar.getVisibility() != View.VISIBLE) {
                        progressBar.setVisibility(View.VISIBLE);
                    }
                } else if (progressBar != null) {
                    progressBar.setVisibility(View.GONE);
                }
                if (originalChrome != null) {
                    originalChrome.onProgressChanged(view, newProgress);
                }
            }

            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                if (originalChrome != null) {
                    return originalChrome.onJsAlert(view, url, message, result);
                }
                return super.onJsAlert(view, url, message, result);
            }

            @Override
            public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
                if (originalChrome != null) {
                    return originalChrome.onJsConfirm(view, url, message, result);
                }
                return super.onJsConfirm(view, url, message, result);
            }

            @Override
            public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
                if (originalChrome != null) {
                    return originalChrome.onJsPrompt(view, url, message, defaultValue, result);
                }
                return super.onJsPrompt(view, url, message, defaultValue, result);
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (originalChrome != null) {
                    originalChrome.onPermissionRequest(request);
                } else {
                    super.onPermissionRequest(request);
                }
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                if (splashShown && splashLayout != null) {
                    splashShown = false;
                    splashLayout.animate()
                        .alpha(0f)
                        .setDuration(500)
                        .setListener(new AnimatorListenerAdapter() {
                            @Override
                            public void onAnimationEnd(Animator animation) {
                                splashLayout.setVisibility(View.GONE);
                            }
                        });
                }
                if (originalView != null) {
                    originalView.onPageFinished(view, url);
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (originalView != null) {
                    return originalView.shouldOverrideUrlLoading(view, request);
                }
                return false;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                if (originalView != null) {
                    originalView.onPageStarted(view, url, favicon);
                }
            }
        });
    }
}
