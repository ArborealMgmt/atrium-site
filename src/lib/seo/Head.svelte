<script>
  import Title from '$lib/seo/Title.svelte';

  let {
    pageTitle,
    data = {},
    description = '',
    keywords = '',
    imageUrl = '',
    imageWidth = '',
    imageHeight = '',
    imageAltText = '',
  } = $props();

  const { host = '', protocol = '', path = '', content = {}, site = {} } = data;

  const isPublished = site.isPublished ?? false;
  // Get site name from CMS content, fallback to generic name
  const siteName =
    content.global_property_name ||
    content.meta_property_name ||
    content.site_name ||
    'Property Site';
  const fullTitle = `${siteName} | ${pageTitle}`;

  const canonicalUrl = `${protocol}://${host}${path}`;
</script>

<svelte:head>
  <Title {pageTitle} {siteName} />

  {#if canonicalUrl}
    <link rel="canonical" href={canonicalUrl} />
    <meta name="url" content={canonicalUrl} />
  {/if}

  {#if description}
    <meta name="description" content={description} />
  {/if}

  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}

  {#if !isPublished}
    <meta name="robots" content="noindex, nofollow" />
  {/if}

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  {#if canonicalUrl}
    <meta property="og:url" content={canonicalUrl} />
  {/if}
  <meta property="og:title" content={fullTitle} />
  {#if description}
    <meta property="og:description" content={description} />
  {/if}
  {#if imageUrl}
    <meta property="og:image" content={imageUrl} />
  {/if}
  {#if imageWidth}
    <meta property="og:image:width" content={imageWidth} />
  {/if}
  {#if imageHeight}
    <meta property="og:image:height" content={imageHeight} />
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@arborealmanagement" />
  {#if canonicalUrl}
    <meta name="twitter:url" content={canonicalUrl} />
  {/if}
  <meta name="twitter:title" content={fullTitle} />
  {#if description}
    <meta name="twitter:description" content={description} />
  {/if}
  {#if imageUrl}
    <meta name="twitter:image" content={imageUrl} />
  {/if}
  {#if imageAltText}
    <meta name="twitter:image:alt" content={imageAltText} />
  {/if}
</svelte:head>
