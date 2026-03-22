import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const VERSION_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const LAST_CHECK_KEY = 'last_version_check';
const LOCAL_STORAGE_KEY = 'app_version';

export const VersionCheck = () => {
  const location = useLocation();

  const checkForUpdates = useCallback(async (force = false) => {
    try {
      const now = Date.now();
      const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
      
      if (!force && lastCheck && (now - parseInt(lastCheck)) < VERSION_CHECK_INTERVAL) {
        return; // Skip if checked within the last 24h
      }

      localStorage.setItem(LAST_CHECK_KEY, now.toString());

      // Use timestamp query to bypass any possible caching
      const response = await fetch(`/version.json?t=${now}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) return;

      const data = await response.json();
      const latestVersion = data.version;
      const storedVersion = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (!storedVersion) {
        // Initial visit, just store the version
        localStorage.setItem(LOCAL_STORAGE_KEY, latestVersion);
        return;
      }

      if (latestVersion !== storedVersion) {
        console.log(`New version detected: ${latestVersion} (current: ${storedVersion})`);
        
        // Update stored version before reloading to prevent infinite loops
        localStorage.setItem(LOCAL_STORAGE_KEY, latestVersion);

        // Show update notification or auto-reload
        toast.info("New update available", {
          description: "The application has been updated. Refreshing to get the latest version...",
          duration: 5000,
          action: {
            label: "Refresh Now",
            onClick: () => window.location.reload()
          }
        });

        // Optional: Auto-reload after a delay if user doesn't interact
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error('Error checking for version update:', error);
    }
  }, []);

  useEffect(() => {
    // Check if we are on login or register page to force check
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    if (isAuthPage) {
      checkForUpdates(true);
    } else {
      checkForUpdates();
    }
  }, [location.pathname, checkForUpdates]);

  useEffect(() => {
    // Regular interval check
    const intervalId = setInterval(checkForUpdates, VERSION_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [checkForUpdates]);

  return null; // This component doesn't render any UI directly
};
