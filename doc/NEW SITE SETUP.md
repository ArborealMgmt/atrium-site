# Manual New Site Setup Guide

This guide walks you through manually setting up a new microsite on the Nursery platform. This process configures Azure Front Door, Cloudflare DNS, and the application configuration to serve a new property site.

## Prerequisites

Before starting, ensure you have:

1. **Domain purchased** and added to Cloudflare
2. **Azure CLI** installed and authenticated (`az login`)
3. **Cloudflare API Token** with appropriate permissions (see [API Token Setup](#cloudflare-api-token-setup))
4. **Property ID** from the CMS (the numeric ID of the property in Maynard CMS)
5. **Configuration file** (`microsite-config.json`) set up with:
   - Azure subscription ID, resource group, and Front Door profile name
   - Cloudflare API token and zone ID
   - CNAME record value (Azure Front Door endpoint)

### Cloudflare API Token Setup

Your Cloudflare API token needs these permissions:

**For DNS Setup (Steps 1-3):**
- **Zone → Zone → Read** - To verify zone access
- **Zone → DNS → Edit** - To create TXT and CNAME records

**For Email Routing (Step 3b - Optional):**
- **Zone → Email Routing → Read** - To check Email Routing status
- **Zone → Email Routing → Edit** - To enable Email Routing and create routing rules

**Note:** The "Edit zone DNS" template does NOT include Email Routing permissions. You must create a custom token and add Email Routing permissions manually.

To create the token:
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Create a custom token with the permissions listed above
4. Copy the token and add it to `microsite-config.json`

## Overview

The setup process consists of 5 main steps:

1. **Add domain to Azure Front Door** - Registers the domain with Front Door
2. **Get TXT validation record** - Retrieves the DNS validation token
3. **Add DNS records to Cloudflare** - Adds TXT validation and CNAME records
4. **Add domain to Front Door route** - Associates domain with the default route
5. **Update brands.js** - Configures the application to recognize the new domain

**Optional Step 3b:** Configure email routing to forward emails to a central address.

---

## Step 1: Add Domain to Azure Front Door

This step registers your custom domain with Azure Front Door. The domain must be added before DNS validation can occur.

### Manual Steps

1. **Open Azure Portal** or use Azure CLI
2. **Navigate to your Front Door profile:**
   - Go to: Azure Portal → Front Door profiles → `[your-front-door-name]`
   - Or use CLI: `az afd profile show --name [front-door-name] --resource-group [resource-group]`

3. **Add the custom domain:**
   - In Azure Portal: Go to **Custom domains** → **+ Add**
   - Enter the domain name (e.g., `example.com`)
   - Click **Add**

   **Or using Azure CLI:**
   ```bash
   az afd custom-domain create \
     --resource-group [resource-group] \
     --profile-name [front-door-name] \
     --custom-domain-name [domain-with-dashes] \
     --host-name [domain]
   ```
   
   Where:
   - `[resource-group]` = Your Azure resource group (e.g., `nursery-app-rg`)
   - `[front-door-name]` = Your Front Door profile name
   - `[domain-with-dashes]` = Domain with dots replaced by dashes (e.g., `example-com`)
   - `[domain]` = Full domain name (e.g., `example.com`)

4. **Verify the domain was added:**
   ```bash
   az afd custom-domain show \
     --resource-group [resource-group] \
     --profile-name [front-door-name] \
     --custom-domain-name [domain-with-dashes]
   ```

### Expected Result

- Domain appears in the Front Door custom domains list
- Domain status shows as "Pending" or "Validating" (validation will complete after DNS records are added)

### Troubleshooting

- **Error: "Domain already exists"** - Domain is already in Front Door, continue to Step 2
- **Error: "Invalid domain format"** - Ensure domain doesn't include `http://` or `https://`

---

## Step 2: Get TXT Validation Record

Azure Front Door generates a TXT record that must be added to your DNS to prove domain ownership. This step retrieves that record.

### Manual Steps

1. **Get the validation token from Azure Front Door:**

   **Using Azure CLI:**
   ```bash
   az afd custom-domain show \
     --resource-group [resource-group] \
     --profile-name [front-door-name] \
     --custom-domain-name [domain-with-dashes] \
     --query "{validationProperties:validationProperties}" \
     -o json
   ```

2. **Extract the validation token:**
   - Look for `validationProperties.validationToken` in the output
   - The TXT record name will be: `_dnsauth.[your-domain]`
   - The TXT record value will be the `validationToken` value (starts with `_`)

   **Example output:**
   ```json
   {
     "validationProperties": {
       "validationToken": "_t8jyrhxar0816xs8prpm97xijobs63a",
       "validationState": "Pending"
     }
   }
   ```

3. **Record these values:**
   - **TXT Name:** `_dnsauth.[your-domain]` (e.g., `_dnsauth.example.com`)
   - **TXT Value:** The validation token (e.g., `_t8jyrhxar0816xs8prpm97xijobs63a`)

### Expected Result

- You have the TXT record name and value ready for Step 3
- Validation token is a string starting with `_` followed by alphanumeric characters

### Troubleshooting

- **Error: "Could not find validation properties"** - Wait a few seconds after Step 1, then try again
- **Error: "validationToken is missing"** - The domain may need to be re-added to Front Door

---

## Step 3: Add DNS Records to Cloudflare

This step adds the TXT validation record and CNAME records to Cloudflare DNS. These records:
- **TXT record:** Proves domain ownership to Azure Front Door
- **CNAME records:** Routes traffic from your domain to Azure Front Door

### Manual Steps

1. **Log in to Cloudflare Dashboard:**
   - Go to: https://dash.cloudflare.com
   - Select the zone for your domain

2. **Add the TXT validation record:**
   - Go to **DNS** → **Records**
   - Click **Add record**
   - **Type:** `TXT`
   - **Name:** `_dnsauth` (or `_dnsauth.[your-domain]` if using fully qualified)
   - **Content:** The validation token from Step 2 (e.g., `_t8jyrhxar0816xs8prpm97xijobs63a`)
   - **TTL:** `Auto` or `3600`
   - Click **Save**

3. **Add CNAME record for root domain (@):**
   - Click **Add record**
   - **Type:** `CNAME`
   - **Name:** `@` (or your root domain)
   - **Target:** Your Azure Front Door CNAME (from `microsite-config.json`, e.g., `nursery-app-fd.azurefd.net`)
   - **TTL:** `Auto` or `3600`
   - **Proxy status:** Can be Proxied (orange cloud) or DNS only (grey cloud)
   - Click **Save**

   **Note:** If you have other records at the root (MX, NS, etc.), you may encounter a CNAME conflict. Cloudflare's CNAME Flattening (enabled by default for Pro/Business plans) should handle this.

4. **Add CNAME record for www subdomain:**
   - Click **Add record**
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** Same Azure Front Door CNAME as above
   - **TTL:** `Auto` or `3600`
   - **Proxy status:** Same as root domain
   - Click **Save**

### Expected Result

- TXT record appears in DNS records
- Two CNAME records created (@ and www)
- DNS records show as "Active" in Cloudflare

### Troubleshooting

- **Error: "CNAME conflict at root domain"** - This happens if you have MX, NS, or A records at root. Solutions:
  - Use Cloudflare's CNAME Flattening (enabled by default for Pro/Business)
  - Or use an A record pointing to Azure Front Door IP instead
  - Or remove conflicting records if not needed
- **Error: "TXT record already exists"** - Delete the existing TXT record and create a new one, or verify the existing value matches
- **Error: "Invalid TXT format"** - Ensure the TXT value doesn't include quotes (Cloudflare adds them automatically)

---

## Step 3b: Configure Email Routing (Optional)

This optional step configures Cloudflare Email Routing to forward all emails for the domain to a central email address (default: `admin@arboreal.management`).

### Manual Steps

1. **Enable Email Routing in Cloudflare:**
   - Go to Cloudflare Dashboard → **Email** → **Email Routing**
   - Click **Get started** or **Enable Email Routing**
   - Follow the prompts to verify your domain

2. **Create a catch-all routing rule:**
   - In Email Routing, go to **Routing rules**
   - Click **Create address**
   - **Email address:** `*@[your-domain]` (e.g., `*@example.com`)
   - **Destination:** Your destination email (e.g., `admin@arboreal.management`)
   - Click **Save**

3. **Verify MX records:**
   - Cloudflare should automatically create MX records
   - Go to **DNS** → **Records** and verify MX records exist
   - They should point to Cloudflare's email routing servers

### Expected Result

- Email Routing is enabled for the domain
- Catch-all rule created: `*@[your-domain]` → `[destination-email]`
- MX records visible in DNS

### Troubleshooting

- **Error: "Email Routing not available"** - Ensure your Cloudflare plan supports Email Routing
- **Error: "Cannot create routing rule"** - Check that your API token has "Zone → Email Routing → Edit" permission
- **MX records not created** - Email Routing should create them automatically; if not, check Email Routing status in dashboard

---

## Step 4: Add Domain to Front Door Route

This step associates your custom domain with a Front Door route/endpoint so traffic is routed correctly.

### Manual Steps

1. **Find your Front Door endpoint and route:**
   ```bash
   # List endpoints
   az afd endpoint list \
     --resource-group [resource-group] \
     --profile-name [front-door-name] \
     -o json
   
   # List routes for an endpoint
   az afd route list \
     --resource-group [resource-group] \
     --profile-name [front-door-name] \
     --endpoint-name [endpoint-name] \
     -o json
   ```

2. **Get the current route configuration:**
   ```bash
   az afd route show \
     --resource-group [resource-group] \
     --profile-name [front-door-name] \
     --endpoint-name [endpoint-name] \
     --route-name [route-name] \
     -o json
   ```

3. **Update the route to include your custom domain:**

   **Using Azure CLI:**
   ```bash
   az afd route update \
     --resource-group [resource-group] \
     --profile-name [front-door-name] \
     --endpoint-name [endpoint-name] \
     --route-name [route-name] \
     --custom-domains /subscriptions/[subscription-id]/resourceGroups/[resource-group]/providers/Microsoft.Cdn/profiles/[front-door-name]/customDomains/[domain-with-dashes] \
     --origin-group [origin-group-id] \
     --patterns-to-match "/*" \
     --supported-protocols Http Https \
     --forwarding-protocol MatchRequest \
     --https-redirect Enabled \
     --link-to-default-domain Enabled
   ```

   **Important:** The `--custom-domains` parameter REPLACES all existing custom domains. You must include ALL existing custom domains plus the new one. Get the existing custom domain IDs from the route show command above.

   **Or using Azure Portal:**
   1. Go to: Azure Portal → Front Door profiles → `[your-front-door-name]` → **Routes**
   2. Click on your route (usually "default-route")
   3. Click **Edit**
   4. Under **Custom domains**, check the box for your custom domain
   5. Click **Save**

### Expected Result

- Custom domain appears in the route's custom domains list
- Route configuration shows the domain is associated

### Troubleshooting

- **Error: "Custom domain not found"** - Ensure Step 1 completed successfully
- **Error: "Route update failed"** - You may need to include all existing custom domains in the update command
- **Manual update required** - If CLI fails, use Azure Portal to add the domain to the route

---

## Step 5: Update brands.js Configuration

This step updates the application configuration to recognize your new domain and map it to the correct property ID.

### Manual Steps

1. **Open `src/lib/brands.js`** in your editor

2. **Find the `PROPERTY_CONFIG` object** (should be near the top of the file)

3. **Add or update the property entry:**
   ```javascript
   [property-id]: { // [your-domain]
     domains: [
       '[local-domain].local:4370', // dev port
       '[local-domain].local:4373', // prod port
       '[your-domain]', // production
     ],
     propertyId: [property-id],
   },
   ```

   Where:
   - `[property-id]` = The numeric property ID from CMS
   - `[your-domain]` = Your production domain (e.g., `example.com`)
   - `[local-domain]` = Domain with dots replaced by dashes (e.g., `example-com`)

   **Example:**
   ```javascript
   123: { // example.com
     domains: [
       'example-com.local:4370', // dev port
       'example-com.local:4373', // prod port
       'example.com', // production
     ],
     propertyId: 123,
   },
   ```

4. **Place the entry before the `DEFAULT:` entry** in the `PROPERTY_CONFIG` object

5. **Save the file**

6. **For local development, add to `/etc/hosts`:**
   ```bash
   127.0.0.1 [local-domain].local
   ```
   
   Example:
   ```bash
   127.0.0.1 example-com.local
   ```

### Expected Result

- Property configuration added to `brands.js`
- Domain mapping configured for dev, prod, and production
- Local domain added to `/etc/hosts` for local development

### Troubleshooting

- **Error: "Property already exists"** - Update the existing entry instead of creating a new one
- **Error: "Could not find PROPERTY_CONFIG"** - Ensure you're editing the correct file and the structure hasn't changed

---

## Verification Steps

After completing all steps, verify the setup:

### 1. Verify DNS Records

```bash
# Check TXT record
dig TXT _dnsauth.[your-domain] +short

# Check CNAME records
dig CNAME [your-domain] +short
dig CNAME www.[your-domain] +short
```

### 2. Verify Domain Validation in Azure

```bash
az afd custom-domain show \
  --resource-group [resource-group] \
  --profile-name [front-door-name] \
  --custom-domain-name [domain-with-dashes] \
  --query "properties.validationProperties.validationState"
```

Should return: `"Approved"` (may take 10-30 minutes after DNS records are added)

### 3. Verify SSL Certificate

Azure Front Door will automatically provision an SSL certificate once validation is complete. This typically takes 10-30 minutes.

Check in Azure Portal:
- Front Door → Custom domains → Your domain → SSL certificate status

### 4. Test the Domain

1. **Wait for DNS propagation** (can take a few minutes)
2. **Wait for SSL certificate provisioning** (10-30 minutes)
3. **Visit:** `https://[your-domain]`
4. **Verify:** Site loads correctly and shows content for the correct property

### 5. Verify Property ID Mapping

1. **Check CMS:** Ensure property ID exists and is published in Maynard CMS
2. **Check local dev:** Visit `http://[local-domain].local:4370` and verify it loads the correct property

---

## Post-Setup Checklist

- [ ] Domain added to Azure Front Door
- [ ] TXT validation record added to Cloudflare DNS
- [ ] CNAME records (@ and www) added to Cloudflare DNS
- [ ] Domain validation shows "Approved" in Azure
- [ ] Domain added to Front Door route
- [ ] `brands.js` updated with property configuration
- [ ] Local domain added to `/etc/hosts` (for local dev)
- [ ] SSL certificate provisioned (check Azure Portal)
- [ ] Domain accessible at `https://[your-domain]`
- [ ] Site shows correct property content
- [ ] Email routing configured (if Step 3b was completed)

---

## Troubleshooting Common Issues

### Domain Validation Stuck on "Pending"

- **Wait longer:** Validation can take 10-30 minutes after DNS records are added
- **Check DNS propagation:** Use `dig` or online DNS checker to verify TXT record is visible
- **Verify TXT record value:** Must match exactly (case-sensitive)
- **Re-add domain:** If stuck for hours, try removing and re-adding the domain in Front Door

### SSL Certificate Not Provisioned

- **Wait:** SSL provisioning happens automatically after validation, can take 10-30 minutes
- **Check validation status:** Must be "Approved" before SSL can be provisioned
- **Check Front Door logs:** Look for SSL certificate errors in Azure Portal

### Site Shows Wrong Property or 404

- **Verify property ID:** Check that the property ID in `brands.js` matches the CMS
- **Check property is published:** Property must be published in Maynard CMS
- **Check domain mapping:** Verify the domain in `brands.js` matches your actual domain
- **Clear cache:** Try hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

### CNAME Conflict at Root Domain

- **Use CNAME Flattening:** Cloudflare Pro/Business plans have this enabled by default
- **Use A record instead:** Point to Azure Front Door IP (less flexible)
- **Remove conflicting records:** If email isn't needed, remove MX records

### Email Routing Not Working

- **Check Email Routing is enabled:** Verify in Cloudflare dashboard
- **Check routing rules:** Ensure catch-all rule exists
- **Verify MX records:** Should be created automatically by Email Routing
- **Check API token permissions:** Must have "Zone → Email Routing → Edit"

---

## Additional Resources

- **Automated Setup Script:** See `scripts/domain-setup/setup-microsite.sh` for automated setup
- **Individual Scripts:** Each step has a corresponding script in `scripts/domain-setup/`
- **Azure Front Door Docs:** https://docs.microsoft.com/azure/frontdoor/
- **Cloudflare DNS Docs:** https://developers.cloudflare.com/dns/
- **Cloudflare Email Routing Docs:** https://developers.cloudflare.com/email-routing/

---

## Quick Reference: Command Summary

```bash
# Step 1: Add domain to AFD
az afd custom-domain create \
  --resource-group [resource-group] \
  --profile-name [front-door-name] \
  --custom-domain-name [domain-with-dashes] \
  --host-name [domain]

# Step 2: Get TXT record
az afd custom-domain show \
  --resource-group [resource-group] \
  --profile-name [front-door-name] \
  --custom-domain-name [domain-with-dashes] \
  --query "{validationProperties:validationProperties}" \
  -o json

# Step 4: Add to route (include ALL existing custom domains)
az afd route update \
  --resource-group [resource-group] \
  --profile-name [front-door-name] \
  --endpoint-name [endpoint-name] \
  --route-name [route-name] \
  --custom-domains [all-custom-domain-ids-space-separated] \
  [other-route-parameters...]

# Verify validation status
az afd custom-domain show \
  --resource-group [resource-group] \
  --profile-name [front-door-name] \
  --custom-domain-name [domain-with-dashes] \
  --query "properties.validationProperties.validationState"
```

---

**Last Updated:** 2025-01-XX
**Maintained By:** Nursery Development Team

