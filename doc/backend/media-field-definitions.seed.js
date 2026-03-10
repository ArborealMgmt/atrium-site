/**
 * Seed data for PropertyMediaFieldDefinition
 * Seeds all media/image fields needed for apartment microsite generation
 *
 * Media Roles:
 * - logo: Branding images (header/footer logos)
 * - hero: Full-width banners/backgrounds
 * - gallery: Multi-image collections
 * - thumbnail: Preview/social images
 * - floorplan: Floor plan images
 * - feature: Feature block images
 * - badge: Badge/icon images
 * - marker: Map marker images
 */

'use strict';

const MEDIA_FIELD_DEFINITIONS = [
  // ============================================
  // GLOBAL SECTION
  // Site-wide branding and metadata images
  // ============================================
  {
    key: 'global_logo_image',
    role: 'logo',
    section: 'global',
    label: 'Logo Image',
    description:
      'Main property or company logo. Use a horizontal logo with transparent background. This appears in the site header and footer.',
    example_url: null,
    recommended_dimensions: '600x200 (3:1, SVG or PNG)',
    max_file_size_kb: 300,
    max_count: 1,
    is_required: true,
    sort_order: 10,
    allowed_media_types: '["image"]'
  },
  {
    key: 'global_thumbnail_image',
    role: 'thumbnail',
    section: 'global',
    label: 'Thumbnail Image',
    description:
      'Primary thumbnail image used for previews and social sharing. Typically a clean exterior or property composite.',
    example_url: null,
    recommended_dimensions: '1200x630 (Open Graph, 1.91:1)',
    max_file_size_kb: 600,
    max_count: 1,
    is_required: true,
    sort_order: 11,
    allowed_media_types: '["image"]'
  },
  {
    key: 'global_favicon_image',
    role: 'thumbnail',
    section: 'global',
    label: 'Favicon Image (Optional)',
    description:
      'Optional favicon for the site. Small icon displayed in browser tabs and bookmarks.',
    example_url: null,
    recommended_dimensions: '32x32 or 64x64 (square, PNG or ICO)',
    max_file_size_kb: 50,
    max_count: 1,
    is_required: false,
    sort_order: 12,
    allowed_media_types: '["image"]'
  },
  {
    key: 'global_social_share_image',
    role: 'thumbnail',
    section: 'global',
    label: 'Social Share Image (Optional)',
    description:
      'Optional image to override the default Open Graph image for social sharing. Should work well at small sizes.',
    example_url: null,
    recommended_dimensions: '1200x630 (Open Graph, 1.91:1)',
    max_file_size_kb: 600,
    max_count: 1,
    is_required: false,
    sort_order: 13,
    allowed_media_types: '["image"]'
  },
  {
    key: 'global_brand_pattern_image',
    role: 'thumbnail',
    section: 'global',
    label: 'Brand Pattern Image (Optional)',
    description:
      'Optional decorative background pattern or texture image for branding elements throughout the site.',
    example_url: null,
    recommended_dimensions: '800x800 (square, seamless pattern)',
    max_file_size_kb: 200,
    max_count: 1,
    is_required: false,
    sort_order: 14,
    allowed_media_types: '["image"]'
  },

  // ============================================
  // HOME SECTION
  // Homepage media fields
  // ============================================
  {
    key: 'home_hero_image',
    role: 'hero',
    section: 'home',
    label: 'Homepage Hero Image',
    description:
      'Full-width hero background for the homepage. Use a striking exterior or lobby image, or a short looping video clip that matches the hero heading and subheading.',
    example_url: null,
    recommended_dimensions: '1920x1080 (16:9)',
    max_file_size_kb: 1500,
    max_count: 1,
    is_required: true,
    sort_order: 100,
    allowed_media_types: '["image","video"]'
  },
  {
    key: 'home_highlight_apartments_image',
    role: 'feature',
    section: 'home',
    label: 'Highlight Apartments Image',
    description:
      'Image for the apartments highlight card on the homepage. Featured on the image card leading to the apartments section.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: true,
    sort_order: 101,
    allowed_media_types: '["image"]'
  },
  {
    key: 'home_highlight_community_image',
    role: 'feature',
    section: 'home',
    label: 'Highlight Community Image',
    description:
      'Image for the community highlight card on the homepage. Featured on the image card leading to the community section.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: true,
    sort_order: 102,
    allowed_media_types: '["image"]'
  },
  {
    key: 'home_highlight_neighborhood_image',
    role: 'feature',
    section: 'home',
    label: 'Highlight Neighborhood Image',
    description:
      'Image for the neighborhood highlight card on the homepage. Featured on the image card leading to the neighborhood section.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: true,
    sort_order: 103,
    allowed_media_types: '["image"]'
  },
  {
    key: 'home_affordable_image',
    role: 'feature',
    section: 'home',
    label: 'Affordable Housing Image',
    description:
      'Image for the affordable housing section on the homepage. Only shown if the property has an affordable housing page.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: false,
    sort_order: 104,
    allowed_media_types: '["image"]'
  },
  {
    key: 'home_gallery',
    role: 'gallery',
    section: 'home',
    label: 'Homepage Gallery',
    description:
      'Photos of unit interiors and common areas (kitchen, living room, bedroom, lobby, corridors). This gallery feeds the homepage image strip.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9) or 1200x800 (3:2)',
    max_file_size_kb: 800,
    max_count: 20,
    is_required: true,
    sort_order: 105,
    allowed_media_types: '["image"]'
  },
  {
    key: 'home_pitch_1_image',
    role: 'feature',
    section: 'home',
    label: 'Pitch 1 Image',
    description:
      'Image for the first pitch block on the homepage (photo-anchored horizontal block with CTA).',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: false,
    sort_order: 106,
    allowed_media_types: '["image"]'
  },
  {
    key: 'home_pitch_2_image',
    role: 'feature',
    section: 'home',
    label: 'Pitch 2 Image',
    description:
      'Image for the second pitch block on the homepage (photo-anchored horizontal block with CTA).',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: false,
    sort_order: 107,
    allowed_media_types: '["image"]'
  },
  {
    key: 'home_pitch_3_image',
    role: 'feature',
    section: 'home',
    label: 'Pitch 3 Image',
    description:
      'Image for the third pitch block on the homepage (photo-anchored horizontal block with CTA).',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: false,
    sort_order: 108,
    allowed_media_types: '["image"]'
  },
  {
    key: 'home_closer_image',
    role: 'hero',
    section: 'home',
    label: 'Homepage Closer Image',
    description:
      'Image for the closing section at the bottom of the homepage (mini-hero style).',
    example_url: null,
    recommended_dimensions: '1920x1080 (16:9)',
    max_file_size_kb: 1200,
    max_count: 1,
    is_required: false,
    sort_order: 109,
    allowed_media_types: '["image"]'
  },

  // ============================================
  // APARTMENTS SECTION
  // Apartments page media fields
  // ============================================
  {
    key: 'apartments_hero_image',
    role: 'hero',
    section: 'apartments',
    label: 'Apartments Hero Image',
    description:
      'Full-width hero background for the apartments page. Use an image that showcases the property or unit interiors that matches the apartments hero heading.',
    example_url: null,
    recommended_dimensions: '1920x1080 (16:9)',
    max_file_size_kb: 1500,
    max_count: 1,
    is_required: true,
    sort_order: 200,
    allowed_media_types: '["image","video"]'
  },
  {
    key: 'apartments_image_gallery',
    role: 'gallery',
    section: 'apartments',
    label: 'Apartments Image Gallery',
    description:
      'Photos of unit interiors and common areas for the apartments page. Used in the main photo gallery.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9) or 1200x800 (3:2)',
    max_file_size_kb: 800,
    max_count: 20,
    is_required: true,
    sort_order: 201,
    allowed_media_types: '["image"]'
  },
  {
    key: 'apartments_floorplan_gallery',
    role: 'floorplan',
    section: 'apartments',
    label: 'Floorplan Gallery',
    description:
      'Optional floorplan images for key unit types. These are used on the apartments page alongside live listing data. One image per major floorplan is sufficient.',
    example_url: null,
    recommended_dimensions: '1600x1200 (4:3) or 1200x1200 (1:1)',
    max_file_size_kb: 1000,
    max_count: 20,
    is_required: false,
    sort_order: 202,
    allowed_media_types: '["image"]'
  },
  {
    key: 'apartments_feature_1_image',
    role: 'feature',
    section: 'apartments',
    label: 'Feature 1 Image',
    description:
      'Image for the first feature block on the apartments page.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: true,
    sort_order: 203,
    allowed_media_types: '["image"]'
  },
  {
    key: 'apartments_feature_2_image',
    role: 'feature',
    section: 'apartments',
    label: 'Feature 2 Image',
    description:
      'Image for the second feature block on the apartments page.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: true,
    sort_order: 204,
    allowed_media_types: '["image"]'
  },
  {
    key: 'apartments_feature_3_image',
    role: 'feature',
    section: 'apartments',
    label: 'Feature 3 Image',
    description:
      'Image for the third feature block on the apartments page.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: true,
    sort_order: 205,
    allowed_media_types: '["image"]'
  },
  {
    key: 'apartments_additional_image',
    role: 'feature',
    section: 'apartments',
    label: 'Additional Image',
    description:
      'Optional image for an additional section on the apartments page.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: false,
    sort_order: 206,
    allowed_media_types: '["image"]'
  },

  // ============================================
  // COMMUNITY SECTION
  // Community page media fields
  // ============================================
  {
    key: 'community_hero_image',
    role: 'hero',
    section: 'community',
    label: 'Community Hero Image',
    description:
      'Full-width hero background for the community page. Ideally a hero shot of the best shared space (roof deck, gym, lounge) that reinforces the community intro text.',
    example_url: null,
    recommended_dimensions: '1920x1080 (16:9)',
    max_file_size_kb: 1200,
    max_count: 1,
    is_required: true,
    sort_order: 300,
    allowed_media_types: '["image","video"]'
  },
  {
    key: 'community_gallery',
    role: 'gallery',
    section: 'community',
    label: 'Community Gallery',
    description:
      'Detail photos of specific amenities (gym equipment, rooftop views, bike room, community spaces). Used in the community gallery section with lightbox.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 20,
    is_required: false,
    sort_order: 301,
    allowed_media_types: '["image"]'
  },
  {
    key: 'community_feature_1_image',
    role: 'feature',
    section: 'community',
    label: 'Feature 1 Image',
    description:
      'Image for the first feature block on the community page.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: true,
    sort_order: 302,
    allowed_media_types: '["image"]'
  },
  {
    key: 'community_feature_2_image',
    role: 'feature',
    section: 'community',
    label: 'Feature 2 Image',
    description:
      'Image for the second feature block on the community page.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: true,
    sort_order: 303,
    allowed_media_types: '["image"]'
  },
  {
    key: 'community_feature_3_image',
    role: 'feature',
    section: 'community',
    label: 'Feature 3 Image',
    description:
      'Image for the third feature block on the community page.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: true,
    sort_order: 304,
    allowed_media_types: '["image"]'
  },

  // ============================================
  // NEIGHBORHOOD SECTION
  // Neighborhood page media fields
  // ============================================
  {
    key: 'neighborhood_hero_image',
    role: 'hero',
    section: 'neighborhood',
    label: 'Neighborhood Hero Image',
    description:
      'Header image for the neighborhood page, such as a streetscape, park, or recognizable local landmark that matches the neighborhood intro text.',
    example_url: null,
    recommended_dimensions: '1920x1080 (16:9)',
    max_file_size_kb: 1200,
    max_count: 1,
    is_required: true,
    sort_order: 400,
    allowed_media_types: '["image"]'
  },
  {
    key: 'neighborhood_gallery',
    role: 'gallery',
    section: 'neighborhood',
    label: 'Neighborhood Gallery',
    description:
      'Photos of nearby parks, transit, cafes, retail, and streets. Supports the neighborhood highlight blocks.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 20,
    is_required: false,
    sort_order: 401,
    allowed_media_types: '["image"]'
  },
  {
    key: 'neighborhood_map_marker_image',
    role: 'marker',
    section: 'neighborhood',
    label: 'Map Marker Image',
    description:
      'Custom pin/marker image for the neighborhood map. Should be a small icon or pin graphic.',
    example_url: null,
    recommended_dimensions: '64x64 or 128x128 (square, PNG with transparency)',
    max_file_size_kb: 100,
    max_count: 1,
    is_required: false,
    sort_order: 402,
    allowed_media_types: '["image"]'
  },
  {
    key: 'neighborhood_walkscore_badge_image',
    role: 'badge',
    section: 'neighborhood',
    label: 'Walk Score Badge Image',
    description:
      'Walk Score badge image for displaying walkability score on the neighborhood page.',
    example_url: null,
    recommended_dimensions: '200x200 (square, PNG)',
    max_file_size_kb: 100,
    max_count: 1,
    is_required: false,
    sort_order: 403,
    allowed_media_types: '["image"]'
  },
  {
    key: 'neighborhood_transit_badge_image',
    role: 'badge',
    section: 'neighborhood',
    label: 'Transit Badge Image',
    description:
      'Transit score badge image for displaying transit accessibility on the neighborhood page.',
    example_url: null,
    recommended_dimensions: '200x200 (square, PNG)',
    max_file_size_kb: 100,
    max_count: 1,
    is_required: false,
    sort_order: 404,
    allowed_media_types: '["image"]'
  },
  {
    key: 'neighborhood_feature_1_image',
    role: 'feature',
    section: 'neighborhood',
    label: 'Neighborhood Feature 1 Image',
    description:
      'Image for the first neighborhood feature block.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: false,
    sort_order: 405,
    allowed_media_types: '["image"]'
  },
  {
    key: 'neighborhood_feature_2_image',
    role: 'feature',
    section: 'neighborhood',
    label: 'Neighborhood Feature 2 Image',
    description:
      'Image for the second neighborhood feature block.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: false,
    sort_order: 406,
    allowed_media_types: '["image"]'
  },
  {
    key: 'neighborhood_feature_3_image',
    role: 'feature',
    section: 'neighborhood',
    label: 'Neighborhood Feature 3 Image',
    description:
      'Image for the third neighborhood feature block.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: false,
    sort_order: 407,
    allowed_media_types: '["image"]'
  },

  // ============================================
  // AFFORDABLE SECTION
  // Affordable housing page media fields
  // ============================================
  {
    key: 'affordable_hero_image',
    role: 'hero',
    section: 'affordable',
    label: 'Affordable Housing Hero Image',
    description:
      'Hero image for the affordable housing page. Use a welcoming community-focused image. Only needed if the affordable housing page is enabled.',
    example_url: null,
    recommended_dimensions: '1920x1080 (16:9)',
    max_file_size_kb: 1200,
    max_count: 1,
    is_required: false,
    sort_order: 500,
    allowed_media_types: '["image"]'
  },

  // ============================================
  // LISTINGS SECTION
  // Listings page media fields
  // ============================================
  {
    key: 'listings_hero_image',
    role: 'hero',
    section: 'listings',
    label: 'Listings Hero Image',
    description:
      'Full-width hero background for the listings page. Use an image that showcases available apartments.',
    example_url: null,
    recommended_dimensions: '1920x1080 (16:9)',
    max_file_size_kb: 1500,
    max_count: 1,
    is_required: true,
    sort_order: 600,
    allowed_media_types: '["image","video"]'
  },
  {
    key: 'listings_gallery',
    role: 'gallery',
    section: 'listings',
    label: 'Listings Gallery',
    description:
      'Photos of available apartments and unit interiors for the listings page.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9) or 1200x800 (3:2)',
    max_file_size_kb: 800,
    max_count: 20,
    is_required: false,
    sort_order: 601,
    allowed_media_types: '["image"]'
  },

  // ============================================
  // CONTACT SECTION
  // Contact page media fields
  // ============================================
  {
    key: 'contact_hero_image',
    role: 'hero',
    section: 'contact',
    label: 'Contact Hero Image',
    description:
      'Subtle background image for the contact / tour page, such as the lobby or exterior. Should not distract from the form; soft texture or shallow depth of field is ideal.',
    example_url: null,
    recommended_dimensions: '1600x900 (16:9)',
    max_file_size_kb: 800,
    max_count: 1,
    is_required: false,
    sort_order: 700,
    allowed_media_types: '["image"]'
  }
];

module.exports = { MEDIA_FIELD_DEFINITIONS };
