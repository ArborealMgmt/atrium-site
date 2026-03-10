/**
 * Seed data for PropertyCopyFieldDefinition
 * Seeds all text/content fields needed for apartment microsite generation
 *
 * Schema based on PropertySiteTextContent interface:
 * - global: Site-wide metadata, contact info, and legal text
 * - home: Homepage content
 * - apartments: Apartments page content
 * - community: Community page content
 * - neighborhood: Neighborhood page content
 * - affordable: Affordable housing page content
 * - listings: Listings page content
 * - contact: Contact page content
 *
 * Field Types:
 * - text: single line input
 * - textarea: multiline text
 * - boolean: true/false toggle
 * - string_array: array of strings (tag/chip editor)
 * - object_array: array of objects with schema (repeatable blocks)
 */

'use strict';

const COPY_FIELD_DEFINITIONS = [
  // ============================================
  // GLOBAL SECTION
  // Site-wide metadata, contact info, and legal text
  // ============================================
  {
    key: 'global_property_name',
    section: 'global',
    label: 'Property Name',
    description: 'The official name of the property as it should appear throughout the site',
    example: 'Rook Apartments',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 0
  },
  {
    key: 'global_tagline',
    section: 'global',
    label: 'Tagline',
    description: 'A short, memorable tagline for the property',
    example: 'Modern Living in Downtown Tacoma',
    field_type: 'text',
    array_item_schema: null,
    max_length: 150,
    is_multiline: false,
    is_required: true,
    sort_order: 1
  },
  {
    key: 'global_primary_city',
    section: 'global',
    label: 'Primary City',
    description: 'The primary city for location-based content and SEO',
    example: 'Tacoma',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 2
  },
  {
    key: 'global_meta_title',
    section: 'global',
    label: 'Meta Title',
    description: 'SEO meta title for search engines (50-60 characters recommended)',
    example: 'Rook Apartments | Modern Living in Downtown Tacoma',
    field_type: 'text',
    array_item_schema: null,
    max_length: 70,
    is_multiline: false,
    is_required: true,
    sort_order: 3
  },
  {
    key: 'global_meta_description',
    section: 'global',
    label: 'Meta Description',
    description: 'SEO meta description for search engines (150-160 characters recommended)',
    example: 'Discover modern apartments in downtown Tacoma with stunning views, premium amenities, and a vibrant community at Rook Apartments.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 200,
    is_multiline: true,
    is_required: true,
    sort_order: 4
  },
  {
    key: 'global_address_line1',
    section: 'global',
    label: 'Address Line 1',
    description: 'Street address of the property',
    example: '1234 Main Street',
    field_type: 'text',
    array_item_schema: null,
    max_length: 200,
    is_multiline: false,
    is_required: true,
    sort_order: 5
  },
  {
    key: 'global_address_line2',
    section: 'global',
    label: 'Address Line 2',
    description: 'Optional additional address information (suite, unit, building number, etc.)',
    example: 'Suite 100',
    field_type: 'text',
    array_item_schema: null,
    max_length: 200,
    is_multiline: false,
    is_required: false,
    sort_order: 6
  },
  {
    key: 'global_address_city',
    section: 'global',
    label: 'City',
    description: 'City for the property address',
    example: 'Tacoma',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 7
  },
  {
    key: 'global_address_state',
    section: 'global',
    label: 'State',
    description: 'State abbreviation for the property address',
    example: 'WA',
    field_type: 'text',
    array_item_schema: null,
    max_length: 2,
    is_multiline: false,
    is_required: true,
    sort_order: 8
  },
  {
    key: 'global_address_postal_code',
    section: 'global',
    label: 'Postal Code',
    description: 'ZIP or postal code for the property address',
    example: '98402',
    field_type: 'text',
    array_item_schema: null,
    max_length: 10,
    is_multiline: false,
    is_required: true,
    sort_order: 9
  },
  {
    key: 'global_phone_display',
    section: 'global',
    label: 'Phone (Display)',
    description: 'Phone number formatted for display',
    example: '(253) 555-1234',
    field_type: 'text',
    array_item_schema: null,
    max_length: 30,
    is_multiline: false,
    is_required: true,
    sort_order: 10
  },
  {
    key: 'global_phone_raw',
    section: 'global',
    label: 'Phone (Raw)',
    description: 'Phone number in raw format for links (digits only, with country code if needed)',
    example: '12535551234',
    field_type: 'text',
    array_item_schema: null,
    max_length: 20,
    is_multiline: false,
    is_required: true,
    sort_order: 11
  },
  {
    key: 'global_email_leasing',
    section: 'global',
    label: 'Leasing Email',
    description: 'Email address for leasing inquiries',
    example: 'leasing@rookapartments.com',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 12
  },
  {
    key: 'global_office_hours',
    section: 'global',
    label: 'Office Hours',
    description: 'Office hours displayed on the contact page',
    example: 'Mon-Fri: 9am-6pm | Sat: 10am-5pm | Sun: 12pm-5pm',
    field_type: 'text',
    array_item_schema: null,
    max_length: 200,
    is_multiline: false,
    is_required: false,
    sort_order: 13
  },
  {
    key: 'global_legal_copyright_text',
    section: 'global',
    label: 'Copyright Text',
    description: 'Copyright notice for the site footer',
    example: '© 2024 Rook Apartments. All rights reserved.',
    field_type: 'text',
    array_item_schema: null,
    max_length: 200,
    is_multiline: false,
    is_required: true,
    sort_order: 14
  },
  {
    key: 'global_legal_equal_housing_text',
    section: 'global',
    label: 'Equal Housing Text',
    description: 'Equal housing opportunity statement',
    example: 'We are committed to providing equal housing opportunities regardless of race, color, religion, sex, national origin, disability, or familial status.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 15
  },
  {
    key: 'global_legal_fair_housing_footer_text',
    section: 'global',
    label: 'Fair Housing Footer Text',
    description: 'Fair housing statement for the site footer',
    example: 'Equal Housing Opportunity. This property does not discriminate on the basis of race, color, religion, sex, handicap, familial status, or national origin.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 16
  },
  {
    key: 'global_pet_policy_summary',
    section: 'global',
    label: 'Pet Policy Summary',
    description: 'Brief summary of the pet policy for display on the site',
    example: 'We welcome cats and dogs with a maximum of 2 pets per apartment. Breed restrictions apply. Pet deposit and monthly pet rent required.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 17
  },
  {
    key: 'global_parking_policy_summary',
    section: 'global',
    label: 'Parking Policy Summary',
    description: 'Brief summary of parking availability and policy',
    example: 'On-site parking available for an additional monthly fee. One space per apartment, subject to availability.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 18
  },
  {
    key: 'global_screening_critical_info',
    section: 'global',
    label: 'Screening Critical Info',
    description: 'Critical information that the prospect should know before applying or touring the property',
    example: 'The apartment building has no elevator. Please contact us if you have any questions.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 1000,
    is_multiline: true,
    is_required: true,
    sort_order: 19
  },
  {
    key: 'global_screening_rental_criteria',
    section: 'global',
    label: 'Screening Rental Criteria',
    description: 'Detailed rental criteria and requirements for applicants',
    example: 'Minimum credit score: 600. Income must be 3x monthly rent. No evictions in past 5 years. References required.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 2000,
    is_multiline: true,
    is_required: true,
    sort_order: 20
  },

  // ============================================
  // HOME SECTION
  // Homepage content fields
  // ============================================
  {
    key: 'home_hero_heading',
    section: 'home',
    label: 'Hero Heading',
    description: 'Main headline displayed on the homepage hero section',
    example: 'Welcome Home to Rook',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 100
  },
  {
    key: 'home_hero_subheading',
    section: 'home',
    label: 'Hero Subheading',
    description: 'Supporting text below the hero heading',
    example: 'Modern apartments with stunning views in the heart of downtown Tacoma',
    field_type: 'text',
    array_item_schema: null,
    max_length: 200,
    is_multiline: false,
    is_required: true,
    sort_order: 101
  },
  {
    key: 'home_intro_heading',
    section: 'home',
    label: 'Intro Heading',
    description: 'Heading for the homepage introduction section',
    example: 'Discover Your New Home',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 102
  },
  {
    key: 'home_intro_body',
    section: 'home',
    label: 'Intro Body',
    description: 'Body text for the homepage introduction section',
    example: 'Nestled at the edge of the Brewery District, Rook offers a perfect blend of industrial charm and modern comfort. Our thoughtfully designed spaces and vibrant community create an unparalleled living experience.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 1000,
    is_multiline: true,
    is_required: true,
    sort_order: 103
  },
  {
    key: 'home_highlight_apartments_title',
    section: 'home',
    label: 'Highlight Apartments Title',
    description: 'Title for the apartments highlight card on the homepage',
    example: 'Explore Our Apartments',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 104
  },
  {
    key: 'home_highlight_apartments_text',
    section: 'home',
    label: 'Highlight Apartments Text',
    description: 'Description text for the apartments highlight card on the homepage',
    example: 'Discover thoughtfully designed spaces that blend style and functionality.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 105
  },
  {
    key: 'home_highlight_community_title',
    section: 'home',
    label: 'Highlight Community Title',
    description: 'Title for the community highlight card on the homepage',
    example: 'Vibrant Community',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 106
  },
  {
    key: 'home_highlight_community_text',
    section: 'home',
    label: 'Highlight Community Text',
    description: 'Description text for the community highlight card on the homepage',
    example: 'Experience a welcoming community with shared spaces and regular events.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 107
  },
  {
    key: 'home_highlight_neighborhood_title',
    section: 'home',
    label: 'Highlight Neighborhood Title',
    description: 'Title for the neighborhood highlight card on the homepage',
    example: 'Prime Location',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 108
  },
  {
    key: 'home_highlight_neighborhood_text',
    section: 'home',
    label: 'Highlight Neighborhood Text',
    description: 'Description text for the neighborhood highlight card on the homepage',
    example: 'Located in the heart of downtown with easy access to dining, shopping, and entertainment.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: false,
    sort_order: 109
  },
  {
    key: 'home_affordable_title',
    section: 'home',
    label: 'Affordable Housing Title',
    description: 'Title for the affordable housing section on the homepage (shown if property has affordable housing page)',
    example: 'Affordable Housing Available',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: false,
    sort_order: 110
  },
  {
    key: 'home_affordable_text',
    section: 'home',
    label: 'Affordable Housing Text',
    description: 'Description text for the affordable housing section on the homepage. Only shown if the property has an affordable housing page.',
    example: 'Income-qualified residents may be eligible for reduced rent on select apartments.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: false,
    sort_order: 111
  },
  {
    key: 'home_pitch_1_title',
    section: 'home',
    label: 'Pitch 1 Title',
    description: 'Title for the first pitch block on the homepage (photo-anchored horizontal block)',
    example: 'Brand New Construction',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: false,
    sort_order: 112
  },
  {
    key: 'home_pitch_1_text',
    section: 'home',
    label: 'Pitch 1 Text',
    description: 'Description text for the first pitch block on the homepage',
    example: 'Be the first to experience eco-friendly living',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: false,
    sort_order: 113
  },
  {
    key: 'home_pitch_2_title',
    section: 'home',
    label: 'Pitch 2 Title',
    description: 'Title for the second pitch block on the homepage',
    example: 'Mountain Views',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: false,
    sort_order: 114
  },
  {
    key: 'home_pitch_2_text',
    section: 'home',
    label: 'Pitch 2 Text',
    description: 'Description text for the second pitch block on the homepage',
    example: 'Wake up to the smile of Mt. Rainier and be filled with light',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: false,
    sort_order: 115
  },
  {
    key: 'home_pitch_3_title',
    section: 'home',
    label: 'Pitch 3 Title',
    description: 'Title for the third pitch block on the homepage',
    example: 'Welcoming Community',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: false,
    sort_order: 116
  },
  {
    key: 'home_pitch_3_text',
    section: 'home',
    label: 'Pitch 3 Text',
    description: 'Description text for the third pitch block on the homepage',
    example: 'Monthly events hosted by your friendly staff',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: false,
    sort_order: 117
  },
  {
    key: 'home_closer_title',
    section: 'home',
    label: 'Closer Title',
    description: 'Title for the closing section at the bottom of the homepage (mini-hero style)',
    example: 'Cornus House',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: false,
    sort_order: 118
  },
  {
    key: 'home_closer_text',
    section: 'home',
    label: 'Closer Text',
    description: 'Text for the closing section at the bottom of the homepage',
    example: 'Where Dreams Become Reality',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: false,
    sort_order: 119
  },

  // ============================================
  // APARTMENTS SECTION
  // Apartments page content
  // ============================================
  {
    key: 'apartments_hero_heading',
    section: 'apartments',
    label: 'Hero Heading',
    description: 'Main heading displayed on the apartments page hero section',
    example: 'Explore Our Units',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 200
  },
  {
    key: 'apartments_hero_subheading',
    section: 'apartments',
    label: 'Hero Subheading',
    description: 'Supporting text below the hero heading on the apartments page',
    example: 'Start your journey toward a beautifully crafted home that fits you perfectly.',
    field_type: 'text',
    array_item_schema: null,
    max_length: 200,
    is_multiline: false,
    is_required: true,
    sort_order: 201
  },
  {
    key: 'apartments_intro_heading',
    section: 'apartments',
    label: 'Intro Heading',
    description: 'Heading for the apartments page introduction',
    example: 'Find Your Perfect Space',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 202
  },
  {
    key: 'apartments_intro_body',
    section: 'apartments',
    label: 'Intro Body',
    description: 'Body text for the apartments page introduction',
    example: 'From cozy studios to spacious two-bedrooms, our apartments feature modern finishes, abundant natural light, and thoughtful layouts designed for comfortable living.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 1000,
    is_multiline: true,
    is_required: true,
    sort_order: 203
  },
  {
    key: 'apartments_feature_1_title',
    section: 'apartments',
    label: 'Feature 1 Title',
    description: 'Title for the first feature block on the apartments page',
    example: 'Modern Finishes',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 204
  },
  {
    key: 'apartments_feature_1_text',
    section: 'apartments',
    label: 'Feature 1 Text',
    description: 'Description text for the first feature block on the apartments page',
    example: 'Premium appliances, quartz countertops, and designer fixtures throughout.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 205
  },
  {
    key: 'apartments_feature_2_title',
    section: 'apartments',
    label: 'Feature 2 Title',
    description: 'Title for the second feature block on the apartments page',
    example: 'Abundant Natural Light',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 206
  },
  {
    key: 'apartments_feature_2_text',
    section: 'apartments',
    label: 'Feature 2 Text',
    description: 'Description text for the second feature block on the apartments page',
    example: 'Large windows and open floor plans create bright, airy living spaces.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 207
  },
  {
    key: 'apartments_feature_3_title',
    section: 'apartments',
    label: 'Feature 3 Title',
    description: 'Title for the third feature block on the apartments page',
    example: 'Thoughtful Layouts',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 208
  },
  {
    key: 'apartments_feature_3_text',
    section: 'apartments',
    label: 'Feature 3 Text',
    description: 'Description text for the third feature block on the apartments page',
    example: 'Every square foot is designed for comfort, functionality, and style.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 209
  },
  {
    key: 'apartments_additional_title',
    section: 'apartments',
    label: 'Additional Title',
    description: 'Optional title for an additional section on the apartments page',
    example: 'Feeling Zen?',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: false,
    sort_order: 210
  },
  {
    key: 'apartments_additional_text',
    section: 'apartments',
    label: 'Additional Text',
    description: 'Optional description text for an additional section on the apartments page',
    example: 'Apartments were designed by a Feng Shui master...',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 1000,
    is_multiline: true,
    is_required: false,
    sort_order: 211
  },

  // ============================================
  // COMMUNITY SECTION
  // Community page content
  // ============================================
  {
    key: 'community_hero_heading',
    section: 'community',
    label: 'Hero Heading',
    description: 'Main heading displayed on the community page hero section',
    example: 'Welcome to Our Community',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 300
  },
  {
    key: 'community_hero_subheading',
    section: 'community',
    label: 'Hero Subheading',
    description: 'Supporting text below the hero heading on the community page',
    example: 'Experience a vibrant community designed for connection and comfort.',
    field_type: 'text',
    array_item_schema: null,
    max_length: 200,
    is_multiline: false,
    is_required: true,
    sort_order: 301
  },
  {
    key: 'community_intro_heading',
    section: 'community',
    label: 'Intro Heading',
    description: 'Heading for the community page introduction',
    example: 'More Than Just Apartments',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 302
  },
  {
    key: 'community_intro_body',
    section: 'community',
    label: 'Intro Body',
    description: 'Body text for the community page introduction',
    example: 'We aim to be more than just modern housing — we strive to be a meaningful part of the neighborhood. Designed with connection and community in mind.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 1000,
    is_multiline: true,
    is_required: true,
    sort_order: 303
  },
  {
    key: 'community_feature_1_title',
    section: 'community',
    label: 'Feature 1 Title',
    description: 'Title for the first feature block on the community page',
    example: 'Shared Spaces',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 304
  },
  {
    key: 'community_feature_1_text',
    section: 'community',
    label: 'Feature 1 Text',
    description: 'Description text for the first feature block on the community page',
    example: 'From rooftop lounges to co-working spaces, our shared amenities bring neighbors together.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 305
  },
  {
    key: 'community_feature_2_title',
    section: 'community',
    label: 'Feature 2 Title',
    description: 'Title for the second feature block on the community page',
    example: 'Regular Events',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 306
  },
  {
    key: 'community_feature_2_text',
    section: 'community',
    label: 'Feature 2 Text',
    description: 'Description text for the second feature block on the community page',
    example: 'Monthly social events, workshops, and gatherings foster a sense of belonging.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 307
  },
  {
    key: 'community_feature_3_title',
    section: 'community',
    label: 'Feature 3 Title',
    description: 'Title for the third feature block on the community page',
    example: 'Welcoming Staff',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 308
  },
  {
    key: 'community_feature_3_text',
    section: 'community',
    label: 'Feature 3 Text',
    description: 'Description text for the third feature block on the community page',
    example: 'Our friendly, professional team is here to support you every step of the way.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 309
  },
  {
    key: 'community_additional_title',
    section: 'community',
    label: 'Additional Title',
    description: 'Optional title for an additional section on the community page',
    example: 'Want to connect deeper?',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: false,
    sort_order: 310
  },
  {
    key: 'community_additional_text',
    section: 'community',
    label: 'Additional Text',
    description: 'Optional description text for an additional section on the community page',
    example: 'Experience our vibrant shared spaces, year-round events, and warm welcome for all.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 1000,
    is_multiline: true,
    is_required: false,
    sort_order: 311
  },

  // ============================================
  // NEIGHBORHOOD SECTION
  // Neighborhood page content
  // ============================================
  {
    key: 'neighborhood_hero_heading',
    section: 'neighborhood',
    label: 'Hero Heading',
    description: 'Main heading displayed on the neighborhood page hero section',
    example: 'Explore Your New Neighborhood',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 400
  },
  {
    key: 'neighborhood_hero_subheading',
    section: 'neighborhood',
    label: 'Hero Subheading',
    description: 'Supporting text below the hero heading on the neighborhood page',
    example: 'Located in the heart of downtown, you\'ll be steps away from everything that matters.',
    field_type: 'text',
    array_item_schema: null,
    max_length: 200,
    is_multiline: false,
    is_required: true,
    sort_order: 401
  },
  {
    key: 'neighborhood_intro_heading',
    section: 'neighborhood',
    label: 'Intro Heading',
    description: 'Heading for the neighborhood page introduction',
    example: 'Prime Location',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 402
  },
  {
    key: 'neighborhood_intro_body',
    section: 'neighborhood',
    label: 'Intro Body',
    description: 'Body text for the neighborhood page introduction',
    example: 'Located in the heart of downtown Tacoma, you\'ll be steps away from local breweries, restaurants, museums, and the waterfront.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 1000,
    is_multiline: true,
    is_required: true,
    sort_order: 403
  },
  {
    key: 'neighborhood_walkability_text',
    section: 'neighborhood',
    label: 'Walkability Text',
    description: 'Text describing the walkability of the neighborhood',
    example: 'Walk Score of 95 - Walkers\' Paradise. Most errands can be accomplished on foot.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 404
  },
  {
    key: 'neighborhood_transit_text',
    section: 'neighborhood',
    label: 'Transit Text',
    description: 'Text describing public transit options in the neighborhood',
    example: 'Excellent transit connections with multiple bus lines and light rail within walking distance.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 405
  },
  {
    key: 'neighborhood_feature_blocks',
    section: 'neighborhood',
    label: 'Neighborhood Feature Blocks',
    description: 'Repeatable blocks highlighting neighborhood features. Each block has a title and text.',
    example: '[{"title": "Brewery District", "text": "Explore Tacoma\'s craft beer scene with over a dozen breweries within walking distance."}, {"title": "Arts & Culture", "text": "World-class museums and galleries are just minutes away."}]',
    field_type: 'object_array',
    array_item_schema: JSON.stringify({
      title: { type: 'text', label: 'Title', required: true, maxLength: 100 },
      text: { type: 'textarea', label: 'Text', required: true, maxLength: 500 }
    }),
    max_length: 10000,
    is_multiline: true,
    is_required: true,
    sort_order: 406
  },

  // ============================================
  // AFFORDABLE SECTION
  // Affordable housing page content
  // ============================================
  {
    key: 'affordable_heading',
    section: 'affordable',
    label: 'Page Heading',
    description: 'Main heading for the affordable housing page',
    example: 'Affordable Housing Program',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: false,
    sort_order: 500
  },
  {
    key: 'affordable_intro_body',
    section: 'affordable',
    label: 'Intro Body',
    description: 'Body text explaining the affordable housing program and eligibility',
    example: 'We are proud to offer affordable housing units as part of our commitment to the community. Income-qualified residents may be eligible for reduced rent on select apartments.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 2000,
    is_multiline: true,
    is_required: false,
    sort_order: 501
  },
  {
    key: 'affordable_eligibility_bullets',
    section: 'affordable',
    label: 'Eligibility Bullets',
    description: 'List of eligibility requirements for the affordable housing program',
    example: '["Household income must be at or below 60% of area median income", "Must pass standard credit and background screening", "Proof of income required"]',
    field_type: 'string_array',
    array_item_schema: null,
    max_length: 5000,
    is_multiline: true,
    is_required: false,
    sort_order: 502
  },
  {
    key: 'affordable_process_steps',
    section: 'affordable',
    label: 'Process Steps',
    description: 'List of steps in the affordable housing application process',
    example: '["Submit application with income documentation", "Attend eligibility review meeting", "Complete credit and background check", "Sign lease agreement"]',
    field_type: 'string_array',
    array_item_schema: null,
    max_length: 5000,
    is_multiline: true,
    is_required: false,
    sort_order: 503
  },
  {
    key: 'affordable_cta_text',
    section: 'affordable',
    label: 'CTA Button Text',
    description: 'Text for the call-to-action button on the affordable housing page',
    example: 'Check Your Eligibility',
    field_type: 'text',
    array_item_schema: null,
    max_length: 50,
    is_multiline: false,
    is_required: false,
    sort_order: 504
  },

  // ============================================
  // LISTINGS SECTION
  // Listings page content
  // ============================================
  {
    key: 'listings_heading',
    section: 'listings',
    label: 'Page Heading',
    description: 'Main heading for the listings page',
    example: 'Available Apartments',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 600
  },
  {
    key: 'listings_intro_body',
    section: 'listings',
    label: 'Intro Body',
    description: 'Body text for the listings page introduction',
    example: 'Browse our available apartments and find the perfect home for you.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 1000,
    is_multiline: true,
    is_required: true,
    sort_order: 601
  },
  {
    key: 'listings_no_availability_message',
    section: 'listings',
    label: 'No Availability Message',
    description: 'Message displayed when no apartments are currently available',
    example: 'We\'re currently at full capacity, but we\'d love to add you to our waitlist. Contact us to learn more.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 602
  },
  {
    key: 'listings_pre_screening_text',
    section: 'listings',
    label: 'Pre-Screening Text',
    description: 'Text displayed before the listings explaining screening requirements',
    example: 'All applicants must pass a background check and credit screening. Application fee is $50 per applicant.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 1000,
    is_multiline: true,
    is_required: false,
    sort_order: 603
  },

  // ============================================
  // CONTACT SECTION
  // Contact page content
  // ============================================
  {
    key: 'contact_heading',
    section: 'contact',
    label: 'Contact Heading',
    description: 'Main heading for the contact page',
    example: 'Get in Touch',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 700
  },
  {
    key: 'contact_intro_body',
    section: 'contact',
    label: 'Contact Intro Body',
    description: 'Body text for the contact page introduction',
    example: 'Have questions about our apartments or want to learn more? Our leasing team is here to help.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 701
  },
  {
    key: 'contact_form_success_message',
    section: 'contact',
    label: 'Contact Form Success Message',
    description: 'Message displayed after successful contact form submission',
    example: 'Thank you for reaching out! Our team will get back to you within 24 hours.',
    field_type: 'text',
    array_item_schema: null,
    max_length: 300,
    is_multiline: false,
    is_required: true,
    sort_order: 702
  },
  {
    key: 'contact_tour_heading',
    section: 'contact',
    label: 'Tour Section Heading',
    description: 'Heading for the schedule a tour section',
    example: 'Schedule a Tour',
    field_type: 'text',
    array_item_schema: null,
    max_length: 100,
    is_multiline: false,
    is_required: true,
    sort_order: 703
  },
  {
    key: 'contact_tour_body',
    section: 'contact',
    label: 'Tour Section Body',
    description: 'Body text for the schedule a tour section',
    example: 'Experience our community firsthand. Schedule a personalized tour and see why residents love calling Rook home.',
    field_type: 'textarea',
    array_item_schema: null,
    max_length: 500,
    is_multiline: true,
    is_required: true,
    sort_order: 704
  },
  {
    key: 'contact_tour_success_message',
    section: 'contact',
    label: 'Tour Form Success Message',
    description: 'Message displayed after successful tour scheduling',
    example: 'Your tour has been scheduled! Check your email for confirmation details.',
    field_type: 'text',
    array_item_schema: null,
    max_length: 300,
    is_multiline: false,
    is_required: true,
    sort_order: 705
  }
];

module.exports = { COPY_FIELD_DEFINITIONS };
