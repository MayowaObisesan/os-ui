/**
 * Utility functions for BrowserWindow component
 */

export interface BrowserHistoryEntry {
  url: string;
  title: string;
  timestamp: Date;
  favicon?: string;
}

export interface BrowserWindowConfig {
  allowedDomains?: string[];
  blockedDomains?: string[];
  enableJavaScript?: boolean;
  enablePopups?: boolean;
  userAgent?: string;
  referrerPolicy?: string;
}

const DEFAULT_CONFIG: Required<BrowserWindowConfig> = {
  allowedDomains: [],
  blockedDomains: [],
  enableJavaScript: true,
  enablePopups: false,
  userAgent: 'Mozilla/5.0 (compatible; BrowserWindow/1.0)',
  referrerPolicy: 'strict-origin-when-cross-origin',
};

const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'];

export interface ProcessedUrl {
  url: string;
  isValid: boolean;
  isExternal: boolean;
  isAllowed: boolean;
  protocol: string | null;
  domain: string | null;
  shouldUseIframe: boolean;
  error?: string;
}

/**
 * Process and validate a URL for browser display
 */
export function processUrl(url: string, config: BrowserWindowConfig = {}): ProcessedUrl {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const cleanUrl = url.trim();

  let isValid = false;
  let isExternal = false;
  let isAllowed = true;
  let protocol: string | null = null;
  let domain: string | null = null;
  let shouldUseIframe = true;
  let error: string | undefined;

  try {
    if (!cleanUrl) {
      error = 'Empty URL';
      return { url: cleanUrl, isValid: false, isExternal: false, isAllowed: false, protocol: null, domain: null, shouldUseIframe: false, error };
    }

    if (cleanUrl.startsWith('//')) {
      protocol = 'https:';
      const tempUrl = `https:${cleanUrl}`;
      const urlObj = new URL(tempUrl);
      domain = urlObj.hostname;
      isExternal = true;
      isValid = true;
    } else if (cleanUrl.startsWith('/') || cleanUrl.startsWith('./') || cleanUrl.startsWith('../') || !cleanUrl.includes(':')) {
      protocol = null;
      domain = null;
      isExternal = false;
      isValid = true;
      shouldUseIframe = false;
    } else {
      const urlObj = new URL(cleanUrl);
      protocol = urlObj.protocol;
      domain = urlObj.hostname;

      if (!ALLOWED_PROTOCOLS.includes(protocol)) {
        if (BLOCKED_PROTOCOLS.includes(protocol)) {
          error = `Blocked protocol: ${protocol}`;
          isAllowed = false;
        } else {
          error = `Unsupported protocol: ${protocol}`;
        }
        return { url: cleanUrl, isValid: false, isExternal: false, isAllowed: false, protocol, domain, shouldUseIframe: false, error };
      }

      isExternal = !isInternalDomain(domain);
      isValid = true;
    }

    if (domain && (cfg.allowedDomains.length > 0 || cfg.blockedDomains.length > 0)) {
      if (cfg.blockedDomains.includes(domain)) {
        isAllowed = false;
        error = `Domain blocked: ${domain}`;
      } else if (cfg.allowedDomains.length > 0 && !cfg.allowedDomains.includes(domain)) {
        isAllowed = false;
        error = `Domain not in whitelist: ${domain}`;
      }
    }

    if (protocol === 'mailto:' || protocol === 'tel:') {
      shouldUseIframe = false;
    }

  } catch (err) {
    error = 'Invalid URL format';
    isValid = false;
    isExternal = false;
    isAllowed = false;
    protocol = null;
    domain = null;
    shouldUseIframe = false;
  }

  return { url: cleanUrl, isValid, isExternal, isAllowed, protocol, domain, shouldUseIframe, error };
}

function isInternalDomain(hostname: string): boolean {
  if (typeof window === 'undefined') return false;
  const currentDomain = window.location.hostname;
  return hostname === currentDomain || hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * Handle special protocols that can't be displayed in iframe
 */
export function handleSpecialProtocol(url: string, protocol: string | null): void {
  if (!protocol) return;

  switch (protocol) {
    case 'mailto:':
      window.location.href = url;
      break;
    case 'tel:':
      window.location.href = url;
      break;
    case 'ftp:':
      window.open(url, '_blank', 'noopener,noreferrer');
      break;
    default:
      console.warn(`Unhandled protocol: ${protocol}`);
  }
}

/**
 * Get browser navigation history management
 */
export class BrowserHistory {
  private history: BrowserHistoryEntry[] = [];
  private currentIndex: number = -1;

  constructor(initialUrl?: string, initialTitle?: string) {
    if (initialUrl) {
      this.addEntry(initialUrl, initialTitle || initialUrl);
    }
  }

  addEntry(url: string, title: string, favicon?: string): void {
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push({ url, title, timestamp: new Date(), favicon });
    this.currentIndex = this.history.length - 1;
  }

  canGoBack(): boolean {
    return this.currentIndex > 0;
  }

  canGoForward(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  goBack(): BrowserHistoryEntry | null {
    if (this.canGoBack()) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  goForward(): BrowserHistoryEntry | null {
    if (this.canGoForward()) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  getCurrentEntry(): BrowserHistoryEntry | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }
}
