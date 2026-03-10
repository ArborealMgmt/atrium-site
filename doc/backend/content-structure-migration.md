# Content Structure Migration Analysis

## Overview
This document analyzes the new CMS content structure (from seed files) and maps it to the current site implementation.

## New Content Structure (from seed files)

### Content Sections
1. **global** - Site-wide metadata, contact info, legal text
2. **home** - Homepage content
3. **apartments** - Apartments page content
4. **community** - Community page content
5. **neighborhood** - Neighborhood page content
6. **affordable** - Affordable housing page content
7. **listings** - Listings page content
8. **contact** - Contact page content

### Media Roles
- **logo** - Branding images (header/footer logos)
- **hero** - Full-width banners/backgrounds
- **gallery** - Multi-image collections
- **thumbnail** - Preview/social images
- **floorplan** - Floor plan images
- **feature** - Feature block images
- **badge** - Badge/icon images
- **marker** - Map marker images

## Key Field Mappings

### Global Section
- `global_property_name` - Property name
- `global_tagline` - Short tagline
- `global_primary_city` - Primary city
- `global_meta_title` - SEO meta title
- `global_meta_description` - SEO meta description
- `global_address_line1`, `global_address_line2`, `global_address_city`, `global_address_state`, `global_address_postal_code` - Address fields
- `global_phone_display`, `global_phone_raw` - Phone numbers
- `global_email_leasing` - Leasing email
- `global_office_hours` - Office hours
- `global_legal_copyright_text` - Copyright text
- `global_legal_equal_housing_text` - Equal housing text
- `global_legal_fair_housing_footer_text` - Fair housing footer text
- `global_pet_policy_summary` - Pet policy summary
- `global_parking_policy_summary` - Parking policy summary
- `global_screening_critical_info` - Screening critical info
- `global_screening_rental_criteria` - Screening rental criteria

### Home Section
- `home_hero_heading` - Hero heading
- `home_hero_subheading` - Hero subheading
- `home_intro_heading` - Intro heading
- `home_intro_body` - Intro body text
- `home_highlight_apartments_title`, `home_highlight_apartments_text` - Apartments highlight card
- `home_highlight_community_title`, `home_highlight_community_text` - Community highlight card
- `home_highlight_neighborhood_title`, `home_highlight_neighborhood_text` - Neighborhood highlight card
- `home_affordable_title`, `home_affordable_text` - Affordable housing section
- `home_pitch_1_title`, `home_pitch_1_text` - First pitch block
- `home_pitch_2_title`, `home_pitch_2_text` - Second pitch block
- `home_pitch_3_title`, `home_pitch_3_text` - Third pitch block
- `home_closer_title`, `home_closer_text` - Closing section

### Apartments Section
- `apartments_hero_heading` - Hero heading
- `apartments_hero_subheading` - Hero subheading
- `apartments_intro_heading` - Intro heading
- `apartments_intro_body` - Intro body text
- `apartments_feature_1_title`, `apartments_feature_1_text` - Feature 1
- `apartments_feature_2_title`, `apartments_feature_2_text` - Feature 2
- `apartments_feature_3_title`, `apartments_feature_3_text` - Feature 3
- `apartments_additional_title`, `apartments_additional_text` - Additional section

### Community Section
- `community_hero_heading` - Hero heading
- `community_hero_subheading` - Hero subheading
- `community_intro_heading` - Intro heading
- `community_intro_body` - Intro body text
- `community_feature_1_title`, `community_feature_1_text` - Feature 1
- `community_feature_2_title`, `community_feature_2_text` - Feature 2
- `community_feature_3_title`, `community_feature_3_text` - Feature 3
- `community_additional_title`, `community_additional_text` - Additional section

### Neighborhood Section
- `neighborhood_hero_heading` - Hero heading
- `neighborhood_hero_subheading` - Hero subheading
- `neighborhood_intro_heading` - Intro heading
- `neighborhood_intro_body` - Intro body text
- `neighborhood_walkability_text` - Walkability description
- `neighborhood_transit_text` - Transit description
- `neighborhood_feature_blocks` - Array of feature blocks (object_array with title and text)

### Affordable Section
- `affordable_heading` - Page heading
- `affordable_intro_body` - Intro body text
- `affordable_eligibility_bullets` - Array of eligibility requirements (string_array)
- `affordable_process_steps` - Array of process steps (string_array)
- `affordable_cta_text` - CTA button text

### Listings Section
- `listings_heading` - Page heading
- `listings_intro_body` - Intro body text
- `listings_no_availability_message` - No availability message
- `listings_pre_screening_text` - Pre-screening text

### Contact Section
- `contact_heading` - Contact heading
- `contact_intro_body` - Contact intro body
- `contact_form_success_message` - Form success message
- `contact_tour_heading` - Tour section heading
- `contact_tour_body` - Tour section body
- `contact_tour_success_message` - Tour success message

## Media Field Mappings

### Global Media
- `global_logo_image` (role: logo) - Main logo
- `global_thumbnail_image` (role: thumbnail) - Primary thumbnail
- `global_favicon_image` (role: thumbnail) - Favicon
- `global_social_share_image` (role: thumbnail) - Social share image
- `global_brand_pattern_image` (role: thumbnail) - Brand pattern

### Home Media
- `home_hero_image` (role: hero) - Homepage hero
- `home_highlight_apartments_image` (role: feature) - Apartments highlight card image
- `home_highlight_community_image` (role: feature) - Community highlight card image
- `home_highlight_neighborhood_image` (role: feature) - Neighborhood highlight card image
- `home_affordable_image` (role: feature) - Affordable housing image
- `home_gallery` (role: gallery) - Homepage gallery
- `home_pitch_1_image` (role: feature) - Pitch 1 image
- `home_pitch_2_image` (role: feature) - Pitch 2 image
- `home_pitch_3_image` (role: feature) - Pitch 3 image
- `home_closer_image` (role: hero) - Homepage closer image

### Apartments Media
- `apartments_hero_image` (role: hero) - Apartments hero
- `apartments_image_gallery` (role: gallery) - Apartments gallery
- `apartments_floorplan_gallery` (role: floorplan) - Floorplan gallery
- `apartments_feature_1_image` (role: feature) - Feature 1 image
- `apartments_feature_2_image` (role: feature) - Feature 2 image
- `apartments_feature_3_image` (role: feature) - Feature 3 image
- `apartments_additional_image` (role: feature) - Additional image

### Community Media
- `community_hero_image` (role: hero) - Community hero
- `community_gallery` (role: gallery) - Community gallery
- `community_feature_1_image` (role: feature) - Feature 1 image
- `community_feature_2_image` (role: feature) - Feature 2 image
- `community_feature_3_image` (role: feature) - Feature 3 image

### Neighborhood Media
- `neighborhood_hero_image` (role: hero) - Neighborhood hero
- `neighborhood_gallery` (role: gallery) - Neighborhood gallery
- `neighborhood_map_marker_image` (role: marker) - Map marker
- `neighborhood_walkscore_badge_image` (role: badge) - Walk Score badge
- `neighborhood_transit_badge_image` (role: badge) - Transit badge
- `neighborhood_feature_1_image` (role: feature) - Feature 1 image
- `neighborhood_feature_2_image` (role: feature) - Feature 2 image
- `neighborhood_feature_3_image` (role: feature) - Feature 3 image

### Affordable Media
- `affordable_hero_image` (role: hero) - Affordable hero

### Listings Media
- `listings_hero_image` (role: hero) - Listings hero
- `listings_gallery` (role: gallery) - Listings gallery

### Contact Media
- `contact_hero_image` (role: hero) - Contact hero

## Current Page Analysis

### Homepage (`+page.svelte`)
**Current keys used:**
- `home_hero_heading` ✅ (matches new structure)
- `home_hero_subheading` ✅ (matches new structure)
- `home_intro_heading` ✅ (matches new structure)
- `home_intro_body` ✅ (matches new structure)
- `apartments_intro_heading` ✅ (matches new structure)
- `apartments_intro_body` ✅ (matches new structure)
- `amenities_intro_heading` ❌ (old key - needs update)
- `amenities_intro_body` ❌ (old key - needs update)
- `gallery_headline` ❌ (old key - needs update)
- `gallery_intro_body` ❌ (old key - needs update)
- `home_services_heading` ❌ (old key - needs update)
- `home_services_description` ❌ (old key - needs update)
- `affordable_housing_heading` ❌ (old key - should use `home_affordable_title`)
- `affordable_housing_intro_body` ❌ (old key - should use `home_affordable_text`)
- `affordable_housing_cta_text` ❌ (old key - needs update)
- `home_connected_heading` ❌ (old key - needs update)
- `home_connected_body` ❌ (old key - needs update)
- `home_connected_cta` ❌ (old key - needs update)
- `home_contact_heading` ❌ (old key - needs update)
- `home_contact_description` ❌ (old key - needs update)
- `home_contact_ready_heading` ❌ (old key - needs update)
- `home_contact_ready_description` ❌ (old key - needs update)
- `contact_phone_display` ✅ (should use `global_phone_display`)
- `contact_email_leasing` ✅ (should use `global_email_leasing`)
- `contact_address` ✅ (should use combined global address fields)
- `meta_property_name` ❌ (should use `global_property_name`)
- `meta_description` ❌ (should use `global_meta_description`)

**Media used:**
- `hero_home_main` ❌ (old slot - should use `home_hero_image`)
- `floorplan` role ✅ (matches)
- `amenity` role ✅ (matches)
- `gallery` role ✅ (matches)

### Neighborhood Page (`neighborhood/+page.svelte`)
**Current keys used:**
- `neighborhood_intro_heading` ✅ (matches new structure)
- `neighborhood_intro_body` ✅ (matches new structure)
- `meta_property_name` ❌ (should use `global_property_name`)
- `meta_description` ❌ (should use `global_meta_description`)
- `contact_address` ✅ (should use combined global address fields)

### Amenities Page (`amenities/+page.svelte`)
**Current keys used:**
- `amenities_intro_heading` ❌ (old key - needs update)
- `amenities_intro_body` ❌ (old key - needs update)
- `meta_property_name` ❌ (should use `global_property_name`)
- `meta_description` ❌ (should use `global_meta_description`)
- `hero_amenities_main` ❌ (old slot - needs update)

**Note:** The amenities page might need to be merged into the community page or updated to use community content.

### Listings Page (`listings/+page.svelte`)
**Current keys used:**
- `apartments_hero_heading` ✅ (matches new structure)
- `apartments_hero_subheading` ✅ (matches new structure)
- `apartments_intro_heading` ✅ (matches new structure)
- `apartments_listings_section_heading` ❌ (old key - should use `listings_heading`)
- `apartments_listings_section_description` ❌ (old key - should use `listings_intro_body`)
- `meta_property_name` ❌ (should use `global_property_name`)
- `meta_description` ❌ (should use `global_meta_description`)
- `hero_apartments_main` ❌ (old slot - should use `listings_hero_image`)

### Contact Page (`contact-us/+page.svelte`)
**Current keys used:**
- `contact_page_intro_heading` ❌ (should use `contact_heading`)
- `contact_page_intro_body` ❌ (should use `contact_intro_body`)
- `contact_phone_number` ❌ (should use `global_phone_display` or `global_phone_raw`)
- `contact_phone_display` ✅ (should use `global_phone_display`)
- `contact_email_address` ❌ (should use `global_email_leasing`)
- `contact_email_leasing` ✅ (should use `global_email_leasing`)
- `contact_email` ❌ (should use `global_email_leasing`)

## Migration Strategy

### Phase 1: Update Global Fields
1. Update all pages to use `global_*` fields for metadata, contact info, etc.
2. Update address handling to use new global address fields
3. Update phone/email fields to use global versions

### Phase 2: Update Homepage
1. Replace old content keys with new `home_*` keys
2. Update media references to use new media field keys
3. Update highlight cards to use new `home_highlight_*` keys
4. Update pitch blocks to use new `home_pitch_*` keys
5. Update closer section to use new `home_closer_*` keys

### Phase 3: Update Apartments Page
1. Create apartments page if it doesn't exist
2. Use `apartments_*` content keys
3. Use `apartments_*` media keys

### Phase 4: Update Community Page
1. Create community page if it doesn't exist
2. Use `community_*` content keys
3. Use `community_*` media keys
4. Consider merging amenities page into community page

### Phase 5: Update Neighborhood Page
1. Update to use `neighborhood_*` keys
2. Add support for `neighborhood_feature_blocks` array
3. Add walkability and transit text sections
4. Update media references

### Phase 6: Update Listings Page
1. Update to use `listings_*` keys
2. Update hero image reference
3. Add no availability message support

### Phase 7: Update Contact Page
1. Update to use `contact_*` keys
2. Update to use `global_*` contact fields
3. Add tour section support

### Phase 8: Add Affordable Housing Page
1. Create affordable housing page if needed
2. Use `affordable_*` keys
3. Support eligibility bullets and process steps arrays

## Actual API Response Analysis (Property 4)

### Confirmed Structure
The API response for property 4 confirms the new structure:

1. **Copy Fields**: All fields use the new `{section}_{field_name}` format
   - ✅ `global_property_name`, `global_tagline`, `global_address_*`, etc.
   - ✅ `home_hero_heading`, `home_hero_subheading`, `home_intro_*`, etc.
   - ✅ `apartments_*`, `community_*`, `neighborhood_*`, `affordable_*`, `listings_*`, `contact_*`

2. **Media Structure**: 
   - Media is grouped by role: `feature`, `gallery`, `hero`
   - Each media item has: `id`, `cloudinaryId`, `altText`, `caption`, `sortOrder`, `isPrimary`, `slot`
   - **Important**: `slot` is now `null` - the old slot-based system is gone
   - Use `isPrimary` flag to identify primary images

3. **Special Field Types**:
   - `neighborhood_feature_blocks` - JSON string that needs parsing: `"[{\"title\": \"...\", \"text\": \"...\"}]"`
   - `affordable_eligibility_bullets` - JSON string with escaped newlines
   - `affordable_process_steps` - JSON string with escaped newlines

4. **Additional API Fields**:
   - `screeningInfo` - Object with `criticalPreScreeningInfo` and `rentalCriteria`
   - `showAffordableContent` - Boolean flag
   - `affordableHousingRestrictions` - Array of restriction objects

### Key Changes from Old Structure
- ❌ Old: `meta_property_name` → ✅ New: `global_property_name`
- ❌ Old: `contact_phone_display` → ✅ New: `global_phone_display`
- ❌ Old: `contact_email_leasing` → ✅ New: `global_email_leasing`
- ❌ Old: `hero_home_main` (slot) → ✅ New: Use `hero` role with `isPrimary` flag
- ❌ Old: `amenities_intro_heading` → ✅ New: Use `community_*` fields
- ❌ Old: `gallery_headline` → ✅ New: Not in new structure (may need to be removed or mapped)

## Next Steps
1. ✅ Test API endpoint to see actual data structure - **COMPLETED**
2. Start with Phase 1 (Global Fields) - lowest risk
3. Update pages one by one, testing each change
4. Update media helper functions to handle `isPrimary` instead of slots
5. Update any components that reference old keys
6. Add JSON parsing for array fields (`neighborhood_feature_blocks`, `affordable_eligibility_bullets`, etc.)

