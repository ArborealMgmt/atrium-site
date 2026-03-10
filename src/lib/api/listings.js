/**
 * Fetch property listings from API
 * @param {string} [propertyId] - Optional property ID to filter listings
 * @returns {Promise<Array>} Array of property listings
 */
export async function fetchListings(propertyId) {
  // const response = await fetch(`https://maynardapp.azurewebsites.net/api/public/nursery/properties/${propertyId}/listings`);
  // return await response.json();

  // For now, return mock data
  return getMockListings(propertyId);
}

/**
 * Mock listings data for testing
 * @param {string} [_propertyId] - Optional property ID to filter listings (currently unused)
 * @returns {Array} Array of mock property listings
 */
// eslint-disable-next-line no-unused-vars
function getMockListings(_propertyId) {
  return [
    {
      id: '1',
      unitId: 'unit-001',
      primaryRent: 1850,
      advertisedRent: 1850,
      primaryBedrooms: 1,
      primaryBathrooms: 1,
      primarySquareFeet: 650,
      sqft: 650,
      primaryDescription:
        'Beautiful one-bedroom imperial unit with modern finishes and spacious layout.',
      address1: '1502 Fawcett Ave',
      address2: 'Unit 101',
      city: 'Tacoma',
      state: 'WA',
      zip: '98402',
      unitType: 'Imperial',
      listingDeposit: 1850,
      deposit: 1850,
      applicationFee: 50,
      utilitiesIncluded: true,
      primaryAmenities: 'Hardwood floors, modern appliances, large windows, walk-in closet',
      catsAllowed: true,
      dogsAllowed: true,
      dogPolicy: 'Dogs under 50 lbs allowed. Breed restrictions apply.',
      availableOn: '2024-02-01',
      applicationURL: 'https://example.com/apply/unit-001',
      listingPhotos: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      ],
      unitPhotos: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      ],
    },
    {
      id: '2',
      unitId: 'unit-002',
      primaryRent: 2200,
      advertisedRent: 2200,
      primaryBedrooms: 2,
      primaryBathrooms: 1,
      primarySquareFeet: 950,
      sqft: 950,
      primaryDescription:
        'Spacious two-bedroom refinement unit featuring updated kitchen and natural light throughout.',
      address1: '1502 Fawcett Ave',
      address2: 'Unit 205',
      city: 'Tacoma',
      state: 'WA',
      zip: '98402',
      unitType: 'Refinement',
      listingDeposit: 2200,
      deposit: 2200,
      applicationFee: 50,
      utilitiesIncluded: false,
      primaryAmenities: 'Updated kitchen, balcony access, in-unit laundry, pet-friendly',
      catsAllowed: true,
      dogsAllowed: false,
      availableOn: '2024-01-15',
      applicationURL: 'https://example.com/apply/unit-002',
      listingPhotos: [
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
      unitPhotos: [
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
    },
    {
      id: '3',
      unitId: 'unit-003',
      primaryRent: 2800,
      advertisedRent: 2800,
      primaryBedrooms: 2,
      primaryBathrooms: 2,
      primarySquareFeet: 1200,
      sqft: 1200,
      primaryDescription:
        'Luxurious two-bedroom, two-bathroom apartment with premium finishes and stunning city views.',
      address1: '1502 Fawcett Ave',
      address2: 'Unit 310',
      city: 'Tacoma',
      state: 'WA',
      zip: '98402',
      unitType: 'Penthouse',
      listingDeposit: 2800,
      deposit: 2800,
      applicationFee: 75,
      utilitiesIncluded: true,
      primaryAmenities:
        'Premium finishes, city views, granite countertops, stainless steel appliances, in-unit washer/dryer',
      catsAllowed: true,
      dogsAllowed: true,
      dogPolicy: 'All dogs welcome. Additional pet deposit required.',
      availableOn: '2024-02-15',
      applicationURL: 'https://example.com/apply/unit-003',
      listingPhotos: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      ],
      unitPhotos: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      ],
    },
    {
      id: '4',
      unitId: 'unit-004',
      primaryRent: 1650,
      advertisedRent: 1650,
      primaryBedrooms: 1,
      primaryBathrooms: 1,
      primarySquareFeet: 550,
      sqft: 550,
      primaryDescription:
        'Cozy studio apartment perfect for first-time renters. Efficient layout maximizes space.',
      address1: '1502 Fawcett Ave',
      address2: 'Unit 50',
      city: 'Tacoma',
      state: 'WA',
      zip: '98402',
      unitType: 'Studio',
      listingDeposit: 1650,
      deposit: 1650,
      applicationFee: 50,
      utilitiesIncluded: true,
      primaryAmenities:
        'Efficient layout, large windows, updated bathroom, street parking available',
      catsAllowed: true,
      dogsAllowed: false,
      availableOn: '2024-01-20',
      applicationURL: 'https://example.com/apply/unit-004',
      listingPhotos: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      ],
      unitPhotos: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      ],
    },
  ];
}
