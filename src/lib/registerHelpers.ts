export type NetworkInfo = {
  ip: string;
  ipCountry: string;
  ipCity: string;
  isp: string;
  asn: string;
  proxy: boolean;
  vpnDetected: boolean;
};

export type DeviceInfo = {
  deviceId: string;
  adId: string;
  fingerprint: string;
  platform: string;
  browser: string;
  os: string;
  screenResolution: string;
  deviceMemory: number;
};

const IPIFY_URL = "https://api.ipify.org?format=json";
const IPWHO_URL = "https://ipwho.is";

async function getIp(): Promise<string> {
  try {
    const res = await fetch(IPIFY_URL);
    if (!res.ok) return "";
    const data = await res.json();
    return typeof data?.ip === "string" ? data.ip : "";
  } catch {
    return "";
  }
}

export async function getGeo(ip: string): Promise<NetworkInfo> {
  if (!ip) {
    return {
      ip: "",
      ipCountry: "",
      ipCity: "",
      isp: "",
      asn: "",
      proxy: false,
      vpnDetected: false,
    };
  }

  try {
    const res = await fetch(`${IPWHO_URL}/${encodeURIComponent(ip)}`);
    if (!res.ok) throw new Error("geo fetch failed");
    const d = await res.json();

    return {
      ip,
      ipCountry: d.country_code || "",
      ipCity: d.city || "",
      isp: (d.connection && d.connection.isp) || "",
      asn: (d.connection && d.connection.asn) || "",
      proxy: !!(d.security && (d.security.proxy || d.security.vpn_proxies)),
      vpnDetected: !!(d.security && (d.security.vpn || d.security.vpn_detected || d.security.vpn_proxies)),
    };
  } catch {
    return {
      ip,
      ipCountry: "",
      ipCity: "",
      isp: "",
      asn: "",
      proxy: false,
      vpnDetected: false,
    };
  }
}

export function getDeviceBasics(): DeviceInfo {
  const STORAGE_KEY = "deviceId";
  let deviceId = localStorage.getItem(STORAGE_KEY) || "";
  if (!deviceId) {
    deviceId = (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now());
    try {
      localStorage.setItem(STORAGE_KEY, deviceId);
    } catch {
      // ignore
    }
  }

  const uaData = (navigator as any).userAgentData;
  const platform = (uaData?.platform as string) || navigator.platform || "";
  const brands = uaData?.brands || uaData?.uaList;
  const browser = Array.isArray(brands) && brands.length > 0 ? brands[0].brand : "";
  const os = platform;

  const width = window.screen?.width ?? 0;
  const height = window.screen?.height ?? 0;

  const deviceMemory = (navigator as any).deviceMemory || 0;

  // Fingerprint (basic fallback): userAgent + language + timezone
  const fpSource = [navigator.userAgent, navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone].join("|");
  const fingerprint = sha256Sync(fpSource);

  return {
    deviceId,
    adId: "",
    fingerprint,
    platform,
    browser,
    os,
    screenResolution: `${width}x${height}`,
    deviceMemory,
  };
}

function sha256Sync(value: string): string {
  // Quick sync hash for fingerprint; not cryptographically robust but OK for label
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString(16);
}

export async function sha256Hex(value: string): Promise<string> {
  try {
    const enc = new TextEncoder().encode(value);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return "";
  }
}

export async function buildRegisterExtras(): Promise<{ network: NetworkInfo; device: DeviceInfo; paymentMethodHash: string }> {
  const ip = await getIp();
  const network = await getGeo(ip);
  const device = getDeviceBasics();
  const paymentMethodHash = await sha256Hex("");
  return { network, device, paymentMethodHash };
}
