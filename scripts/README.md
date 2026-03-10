# Microsite Setup Scripts

These scripts automate the microsite setup process step-by-step. Run them in order to set up a new microsite.

## Workflow

0. **Buy domain** on Cloudflare (manual - web interface only)
1. **Step 1**: Add domain to Azure Front Door
2. **Step 2**: Get TXT validation record from AFD
3. **Step 3**: Add DNS records (TXT + CNAME) to Cloudflare
4. **Step 4**: Add domain to default route in AFD
5. **Step 5**: Update brands.js configuration

## Scripts

### Step 1: Add Domain to Azure Front Door

```bash
node scripts/01-add-domain-to-afd.js --domain example.com
```

Adds the custom domain to Azure Front Door. Must be done before DNS validation.

### Step 2: Get TXT Validation Record

```bash
node scripts/02-get-afd-txt-record.js --domain example.com
```

Retrieves the TXT validation record that needs to be added to DNS. Copy the name and value for step 3.

### Step 3: Add DNS Records to Cloudflare

```bash
node scripts/03-add-cloudflare-dns.js \
  --domain example.com \
  --txt-name "_dnsauth.example.com" \
  --txt-value "_t8jyrhxar0816xs8prpm97xijobs63a"
```

Adds both the TXT validation record and CNAME records (@ and www) to Cloudflare DNS.

### Step 3b: Configure Email Routing (Optional)

```bash
node scripts/03b-add-email-routing.js --domain example.com
```

Configures Cloudflare Email Routing to forward all emails to `admin@arboreal.management`. This step is optional but recommended.

**Options:**

- `--destination, -e <email>`: Custom destination email (default: `admin@arboreal.management`)
- `--debug`: Show detailed API request/response for debugging

**Note:** Requires Cloudflare Email Routing to be enabled for the zone. The script will attempt to enable it automatically.

### Step 4: Add Domain to Default Route

```bash
node scripts/04-add-domain-to-afd-route.js --domain example.com
```

Adds the custom domain to the default route/endpoint in Front Door. May require manual steps in Azure Portal.

### Step 5: Update brands.js

```bash
node scripts/05-update-brands-js.js \
  --domain example.com \
  --brand-name "Example Site" \
  --property-id 123
```

Updates `src/lib/brands.js` with the new brand configuration.

**Options:**

- `--property-id, -p <id>`: Property ID from CMS (required)
- `--brand-id, -b <id>`: Brand ID (auto-generated from domain if not provided)
- `--brand-name, -n <name>`: Brand display name (auto-generated from domain if not provided)

**Note:** Property IDs are used directly as keys in the PROPERTY_CONFIG.

## Complete Workflow Example

```bash
# Step 1: Add domain to AFD
node scripts/01-add-domain-to-afd.js --domain example.com

# Step 2: Get TXT record (copy the values)
node scripts/02-get-afd-txt-record.js --domain example.com

# Step 3: Add DNS records (use values from step 2)
node scripts/03-add-cloudflare-dns.js \
  --domain example.com \
  --txt-name "_dnsauth.example.com" \
  --txt-value "_t8jyrhxar0816xs8prpm97xijobs63a"

# Step 3b: Configure email routing (optional)
node scripts/03b-add-email-routing.js --domain example.com

# Step 4: Add to route
node scripts/04-add-domain-to-afd-route.js --domain example.com

# Step 5: Update brands.js
node scripts/05-update-brands-js.js \
  --domain example.com \
  --brand-name "Example Site" \
  --property-id 123
```

## Dry Run Mode

All scripts support `--dry-run` to preview changes:

```bash
node scripts/01-add-domain-to-afd.js --domain example.com --dry-run
```

## Configuration

All scripts read from `microsite-config.json`:

```json
{
  "azure": {
    "frontDoorName": "nursery-app-front-door",
    "resourceGroup": "maynardapp2",
    "cnameRecord": "nurseryappfd4.azurefd.net"
  },
  "cloudflare": {
    "apiToken": "your-token",
    "zoneId": "your-zone-id"
  }
}
```

## Cloudflare API Token Permissions

Your Cloudflare API token needs the following permissions:

### For DNS Management (Step 3)

- **Zone → Zone → Read** - To verify zone access
- **Zone → DNS → Edit** - To create TXT and CNAME records

### For Email Routing (Step 3b)

- **Zone → Zone → Read** - To read zone information
- **Zone → Email Routing → Read** - To check Email Routing status
- **Zone → Email Routing → Edit** - **REQUIRED** - To enable Email Routing and create routing rules

**Important:** Zone → Zone → Edit is NOT sufficient. Email Routing requires the specific "Email Routing" permissions. Both Read and Edit are recommended for full functionality.

### Creating the Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Create custom token with these permissions:
   - **Permissions:**
     - Zone → Zone → Read
     - Zone → Zone → Edit
     - Zone → DNS → Edit
     - **Zone → Email Routing → Read** (for Step 3b - checking status)
     - **Zone → Email Routing → Edit** (for Step 3b - creating rules)
   - **Zone Resources:** Include → All zones (or specific zones)

   **Note:** The "Edit zone DNS" template does NOT include Email Routing permissions.
   You must create a custom token and add Email Routing permissions manually.
   Both Read and Edit are recommended for full Email Routing functionality.

4. Copy the token and add to `microsite-config.json`

**Note:** Email Routing does NOT work with OAuth tokens (`wrangler login`). You must use an API token.

## Troubleshooting

### Step 1 fails: "Domain already exists"

- Domain is already in Front Door, continue to step 2

### Step 2 fails: "Could not find validation properties"

- Run step 1 first to add the domain
- Wait a few seconds after step 1 for Front Door to process

### Step 3 fails: "DNS record already exists"

- Records may already exist, check Cloudflare dashboard
- Use `--dry-run` to preview what would be created

### Step 4: Manual steps required

- Some Front Door configurations require manual association in Azure Portal
- Follow the instructions provided by the script

## Testing Individual Steps

Each script can be run independently for testing:

```bash
# Test step 1
node scripts/01-add-domain-to-afd.js --domain test.example.com --dry-run

# Test step 2 (requires step 1 to be completed)
node scripts/02-get-afd-txt-record.js --domain test.example.com

# Test step 3 (requires step 2 output)
node scripts/03-add-cloudflare-dns.js \
  --domain test.example.com \
  --txt-name "_dnsauth.test.example.com" \
  --txt-value "_example123token456test789" \
  --dry-run
```
