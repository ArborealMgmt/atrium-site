# Affordable Housing Restrictions - Backend Data Structure Specification

## Problem Statement

Most affordable housing programs have a single AMI percentage and one set of income limits that apply to all bedroom types. However, some programs have different AMI percentages and income limits for different bedroom types (e.g., 1-bedroom units have 40% AMI, 2-bedroom units have 50% AMI). 

We need a data structure that:
1. **Makes the simple case (most common) straightforward** - one AMI, one set of income limits
2. **Handles bedroom-specific variations elegantly** - when they exist
3. **Avoids unnecessary complexity** - don't require bedroom variations when there's only one set of data

## Proposed Data Structure

### Option 1: Grouped Structure (Recommended)

Return restrictions grouped by program name, with bedroom-specific variations nested. **Most programs will have a single bedroom variation** (with `bedrooms: null` meaning "applies to all"). Programs with bedroom-specific data will have multiple variations.

```typescript
interface AffordableHousingRestrictionsResponse {
  affordableHousingRestrictions: AffordableHousingProgram[];
  showAffordableContent: boolean;
}

interface AffordableHousingProgram {
  // Program-level information (same across all bedroom types)
  restrictionName: string;           // e.g., "Seattle MFTE P6"
  restrictionType: string;           // e.g., "MFTE"
  regulator: string | null;          // e.g., "Seattle Office of Housing"
  
  // Bedroom-specific variations
  bedroomVariations: BedroomVariation[];
  
  // Aggregated unit counts (sum across all bedroom types)
  totalRestrictedUnits: number | null;
  unitCount: number | null;          // Total available units across all bedroom types
}

interface BedroomVariation {
  bedrooms: number | null;           // null = applies to all bedroom types, or specific number (1, 2, 3, etc.)
  amiPercent: number | null;        // AMI percentage for this bedroom type
  currentMaxRent: number | null;     // Maximum rent for this bedroom type
  rentType: string | null;          // 'GROSS', 'NET', etc.
  
  // Unit counts for this specific bedroom type
  totalRestrictedUnits: number | null;
  unitCount: number | null;
  
  // Income limits for this bedroom type
  incomeLimits: IncomeLimits | null;
}

interface IncomeLimits {
  year: number;                     // e.g., 2025
  source: string;                   // e.g., "HUD"
  limits: IncomeLimit[];
}

interface IncomeLimit {
  householdSize: number;             // 1, 2, 3, 4, etc.
  limit: number;                     // Annual income limit in dollars
}
```

### Example Responses

#### Most Common Case: Simple Program (No Bedroom Variants)

**Most programs** will look like this - a single bedroom variation with `bedrooms: null` meaning it applies to all bedroom types:

```json
{
  "affordableHousingRestrictions": [
    {
      "restrictionName": "Section 8",
      "restrictionType": "Section 8",
      "regulator": "HUD",
      "totalRestrictedUnits": 25,
      "unitCount": 5,
      "bedroomVariations": [
        {
          "bedrooms": null,  // null = applies to all bedroom types
          "amiPercent": 30,
          "currentMaxRent": null,
          "rentType": null,
          "totalRestrictedUnits": 25,
          "unitCount": 5,
          "incomeLimits": {
            "year": 2025,
            "source": "HUD",
            "limits": [
              { "householdSize": 1, "limit": 28974 },
              { "householdSize": 2, "limit": 33084 },
              { "householdSize": 3, "limit": 37224 },
              { "householdSize": 4, "limit": 41364 }
            ]
          }
        }
      ]
    }
  ],
  "showAffordableContent": true
}
```

#### Less Common Case: Program with Bedroom-Specific Variations

When a program has different AMI percentages or income limits for different bedroom types, include multiple bedroom variations:

```json
{
  "affordableHousingRestrictions": [
    {
      "restrictionName": "Seattle MFTE P6",
      "restrictionType": "MFTE",
      "regulator": "Seattle Office of Housing",
      "totalRestrictedUnits": 50,
      "unitCount": 10,
      "bedroomVariations": [
        {
          "bedrooms": 1,
          "amiPercent": 40,
          "currentMaxRent": 965,
          "rentType": "GROSS",
          "totalRestrictedUnits": 20,
          "unitCount": 5,
          "incomeLimits": {
            "year": 2025,
            "source": "HUD",
            "limits": [
              { "householdSize": 1, "limit": 38632 },
              { "householdSize": 2, "limit": 44153 },
              { "householdSize": 3, "limit": 44153 },
              { "householdSize": 4, "limit": 55187 }
            ]
          }
        },
        {
          "bedrooms": 2,
          "amiPercent": 50,
          "currentMaxRent": 1200,
          "rentType": "GROSS",
          "totalRestrictedUnits": 30,
          "unitCount": 5,
          "incomeLimits": {
            "year": 2025,
            "source": "HUD",
            "limits": [
              { "householdSize": 1, "limit": 48290 },
              { "householdSize": 2, "limit": 55187 },
              { "householdSize": 3, "limit": 62085 },
              { "householdSize": 4, "limit": 68982 }
            ]
          }
        }
      ]
    }
  ],
  "showAffordableContent": true
}
```

### Edge Cases

1. **Program with missing total units**: If `totalRestrictedUnits` is unknown but `unitCount` is known:

2. **Program with missing data**: If `totalRestrictedUnits` is unknown but `unitCount` is known:
   ```json
   {
     "restrictionName": "Some Program",
     "totalRestrictedUnits": null,
     "unitCount": 10,
     "bedroomVariations": [...]
   }
   ```

3. **Program with no current vacancies**: All `unitCount` values are 0:
   ```json
   {
     "restrictionName": "Some Program",
     "unitCount": 0,
     "bedroomVariations": [
       {
         "bedrooms": 1,
         "unitCount": 0,
         "incomeLimits": { ... }  // Still show income limits even with 0 units
       }
     ]
   }
   ```

## Key Design Decisions

1. **Always use `bedroomVariations` array**: Even for simple programs with no bedroom variants, use an array with one item. This keeps the structure consistent and makes the frontend code simpler.

2. **`bedrooms: null` means "applies to all"**: When a program has the same AMI/income limits for all bedroom types, use `bedrooms: null` in the single bedroom variation.

3. **`bedrooms: number` means "specific bedroom type"**: When a program has different data for specific bedroom types, use the actual bedroom number (1, 2, 3, etc.).

4. **Program-level totals are optional**: If you can't aggregate totals across bedroom types, `totalRestrictedUnits` and `unitCount` at the program level can be `null`. The frontend will sum from bedroom variations if needed.

## Benefits of This Structure

1. **Simple case is simple**: Most programs = one item in `bedroomVariations` array with `bedrooms: null`
2. **Complex case is clear**: Bedroom-specific programs = multiple items in `bedroomVariations` array
3. **Consistent structure**: Same structure for both cases, just different array lengths
4. **Clear grouping**: Programs are already grouped, no frontend grouping logic needed
5. **Bedroom-specific data**: Each bedroom variation has its own AMI, rent, and income limits
6. **Aggregated totals**: Program-level totals are provided for quick reference (when available)
7. **Simpler frontend**: Frontend can iterate through programs and their variations directly

## Migration Path

If you want to maintain backward compatibility during migration:

1. **Phase 1**: Return both old and new structure
   ```json
   {
     "affordableHousingRestrictions": [...],  // New structure
     "affordableHousingRestrictionsLegacy": [...]  // Old flat structure
   }
   ```

2. **Phase 2**: Frontend switches to new structure

3. **Phase 3**: Remove legacy structure

## Alternative: Option 2 (Flat Array - Current Approach)

If the grouped structure is too complex to implement, you can keep the current flat array structure but ensure:
- Multiple restrictions with the same `restrictionName` but different `bedrooms` values when there are bedroom variants
- Single restriction with `bedrooms: null` for programs without bedroom variants
- Each restriction has its own `amiPercent`, `incomeLimits`, etc.
- Frontend will group them (current approach works, but requires more frontend logic)

**Recommendation**: Option 1 (grouped structure) is cleaner and more maintainable long-term, but Option 2 works if you need to maintain the current API structure.

