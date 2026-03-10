// src/lib/analytics.ts

import { browser } from '$app/environment';

// Hardcoded for Terrapin Apartments
const PROPERTY_ID = '234';

// ============================================================================
// TYPES
// ============================================================================

export type TrackEvent =
  | 'PageView'
  | 'ViewUnit'
  | 'ViewGallery'
  | 'ViewAmenities'
  | 'ViewNeighborhood'
  | 'ViewAffordableHousing'
  | 'ClickCall'
  | 'ClickEmail'
  | 'ClickCTA'
  | 'ClickLogo'
  | 'ScheduleTour'
  | 'StartApplication'
  | 'SubmitLead'
  | 'SubmitApplication';

export type SiteType = 'property_site' | 'search_site' | 'portfolio_site' | 'corporate_site';

export type ReferrerSource =
  | 'zillow'
  | 'apartments_com'
  | 'trulia'
  | 'realtor'
  | 'google'
  | 'facebook'
  | 'instagram'
  | 'internal'
  | 'direct'
  | 'other';

export type TrafficCategory =
  | 'external_listing'
  | 'paid'
  | 'organic'
  | 'social'
  | 'internal'
  | 'direct'
  | 'other';

interface SiteContext {
  hostname: string;
  site_type: SiteType;
  property_id: string | null;
}

interface AttributionContext {
  referrer: string | null;
  referrer_source: ReferrerSource;
  traffic_category: TrafficCategory;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

// ============================================================================
// SITE IDENTIFICATION
// ============================================================================

/**
 * Determines the site type based on hostname
 *
 * Site types:
 * - property_site: Individual property domains (betulahouse.com, etc.)
 * - search_site: Apartment search sites (search.nursery.com, seattleapartments.com, etc.)
 * - portfolio_site: Portfolio showcase (apodment.com)
 * - corporate_site: Main company site (arboreal.management)
 */
function getSiteType(hostname: string): SiteType {
  const host = hostname.toLowerCase();

  // Corporate site
  if (host.includes('arboreal.management') || host.includes('arboreal-info.com')) {
    return 'corporate_site';
  }

  // Portfolio site
  if (host.includes('apodment.com')) {
    return 'portfolio_site';
  }

  // Search sites - add patterns as needed
  if (
    host.includes('search.') ||
    host.includes('seattleapartments') ||
    host.includes('apartments.nursery') ||
    host.includes('find.')
  ) {
    return 'search_site';
  }

  // Default: property site (the ~90 individual property domains)
  return 'property_site';
}

/**
 * Gets full site context including hostname, site_type, and property_id
 */
function getSiteContext(): SiteContext {
  if (!browser) {
    return {
      hostname: '',
      site_type: 'property_site',
      property_id: null,
    };
  }

  const hostname = window.location.hostname;
  const siteType = getSiteType(hostname);

  // Hardcoded for Terrapin Apartments
  const propertyId = siteType === 'property_site' ? PROPERTY_ID : null;

  return {
    hostname,
    site_type: siteType,
    property_id: propertyId,
  };
}

// ============================================================================
// ATTRIBUTION & REFERRER HANDLING
// ============================================================================

/**
 * Parses referrer URL to identify the source
 */
function getReferrerSource(referrer: string, currentHostname: string): ReferrerSource {
  if (!referrer) return 'direct';

  const ref = referrer.toLowerCase();

  // Internal referrer (within our ecosystem)
  const internalDomains = [
    'arboreal',
    'apodment',
    'nursery',
    // Add other internal domains as needed
  ];
  if (internalDomains.some(domain => ref.includes(domain))) {
    return 'internal';
  }

  // External listing sites
  if (ref.includes('zillow.com')) return 'zillow';
  if (ref.includes('apartments.com')) return 'apartments_com';
  if (ref.includes('trulia.com')) return 'trulia';
  if (ref.includes('realtor.com')) return 'realtor';

  // Search engines
  if (ref.includes('google.')) return 'google';

  // Social
  if (ref.includes('facebook.com') || ref.includes('fb.com')) return 'facebook';
  if (ref.includes('instagram.com')) return 'instagram';

  return 'other';
}

/**
 * Categorizes traffic for easier reporting
 */
function getTrafficCategory(
  referrerSource: ReferrerSource,
  utmMedium: string | null,
  utmSource: string | null
): TrafficCategory {
  // Check UTM first (most explicit)
  if (utmMedium) {
    const medium = utmMedium.toLowerCase();
    if (medium === 'cpc' || medium === 'ppc' || medium === 'paid') return 'paid';
    if (medium === 'social') return 'social';
    if (medium === 'email') return 'other';
  }

  // External listing sites (Zillow, Apartments.com, etc.)
  if (['zillow', 'apartments_com', 'trulia', 'realtor'].includes(referrerSource)) {
    return 'external_listing';
  }

  // Map referrer source to category
  switch (referrerSource) {
    case 'google':
      return 'organic';
    case 'facebook':
    case 'instagram':
      return 'social';
    case 'internal':
      return 'internal';
    case 'direct':
      return 'direct';
    default:
      return 'other';
  }
}

/**
 * Gets full attribution context from URL params and referrer
 */
function getAttributionContext(): AttributionContext {
  if (!browser) {
    return {
      referrer: null,
      referrer_source: 'direct',
      traffic_category: 'direct',
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer || null;
  const hostname = window.location.hostname;

  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmContent = urlParams.get('utm_content');
  const utmTerm = urlParams.get('utm_term');

  const referrerSource = getReferrerSource(referrer || '', hostname);
  const trafficCategory = getTrafficCategory(referrerSource, utmMedium, utmSource);

  return {
    referrer,
    referrer_source: referrerSource,
    traffic_category: trafficCategory,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    utm_term: utmTerm,
  };
}

// ============================================================================
// SESSION STORAGE FOR ATTRIBUTION
// ============================================================================

const ATTRIBUTION_KEY = 'nursery_attribution';

/**
 * Stores attribution data in sessionStorage to persist across page navigations
 * Only stores on landing page (first page of session)
 */
function storeAttributionIfLanding(): void {
  if (!browser) return;

  // Only store if not already stored this session
  const existing = sessionStorage.getItem(ATTRIBUTION_KEY);
  if (existing) return;

  const attribution = getAttributionContext();
  sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
}

/**
 * Gets stored attribution data (from landing page)
 */
function getStoredAttribution(): AttributionContext | null {
  if (!browser) return null;

  const stored = sessionStorage.getItem(ATTRIBUTION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// ============================================================================
// DATALAYER & TRACKING
// ============================================================================

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Ensures dataLayer exists
 */
function ensureDataLayer(): void {
  if (browser) {
    window.dataLayer = window.dataLayer || [];
  }
}

/**
 * Pushes site context to dataLayer on page load
 * Should be called once on app initialization
 */
export function initializeAnalytics(): void {
  if (!browser) return;

  ensureDataLayer();
  storeAttributionIfLanding();

  const siteContext = getSiteContext();
  const attribution = getStoredAttribution() || getAttributionContext();

  // Push initial context to dataLayer
  window.dataLayer.push({
    event: 'site_context_ready',
    ...siteContext,
    ...attribution,
  });
}

/**
 * Main tracking function - pushes events to dataLayer for GTM
 *
 * @param event - Event name (e.g., 'ViewUnit', 'SubmitLead')
 * @param properties - Event-specific properties
 */
export function track(event: TrackEvent, properties: Record<string, unknown> = {}): void {
  if (!browser) return;

  ensureDataLayer();

  const siteContext = getSiteContext();
  const attribution = getStoredAttribution();

  // Build event payload
  const eventData: Record<string, unknown> = {
    event,
    ...siteContext,
    ...properties,
    timestamp: new Date().toISOString(),
  };

  // Include attribution on conversion events
  const conversionEvents: TrackEvent[] = [
    'SubmitLead',
    'ScheduleTour',
    'StartApplication',
    'SubmitApplication',
  ];
  if (conversionEvents.includes(event) && attribution) {
    eventData.referrer_source = attribution.referrer_source;
    eventData.traffic_category = attribution.traffic_category;
    eventData.utm_source = attribution.utm_source;
    eventData.utm_medium = attribution.utm_medium;
    eventData.utm_campaign = attribution.utm_campaign;
  }

  // Push to GTM dataLayer
  window.dataLayer.push(eventData);

  // Also send to other analytics (Plausible, Meta Pixel, Clarity)
  trackPlausible(event, eventData);
  trackMetaPixel(event, eventData);
  trackClarity(event);
}

/**
 * Track page views - call on SPA route changes
 */
export function trackPageView(pagePath?: string): void {
  if (!browser) return;

  ensureDataLayer();

  const siteContext = getSiteContext();
  const path = pagePath || window.location.pathname;

  window.dataLayer.push({
    event: 'PageView',
    page_path: path,
    page_url: window.location.href,
    page_title: document.title,
    ...siteContext,
  });
}

// ============================================================================
// THIRD-PARTY INTEGRATIONS
// ============================================================================

function trackPlausible(event: TrackEvent, properties: Record<string, unknown>): void {
  if (browser && window.plausible) {
    window.plausible(event, { props: properties });
  }
}

function trackMetaPixel(event: TrackEvent, properties: Record<string, unknown>): void {
  if (browser && window.fbq) {
    // Map events to Meta Pixel standard events
    const metaEventMap: Record<string, string> = {
      SubmitLead: 'Lead',
      ScheduleTour: 'Schedule',
      StartApplication: 'InitiateCheckout',
      SubmitApplication: 'CompleteRegistration',
      ViewUnit: 'ViewContent',
    };

    const metaEvent = metaEventMap[event] || event;
    window.fbq('track', metaEvent, properties);
  }
}

function trackClarity(event: TrackEvent): void {
  if (browser && window.clarity) {
    window.clarity('set', 'last_event', event);
  }
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export { getSiteContext, getSiteType, getAttributionContext, getStoredAttribution };
