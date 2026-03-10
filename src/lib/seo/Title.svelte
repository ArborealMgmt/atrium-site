<script>
  let { pageTitle, siteName = 'Property Site' } = $props();
  // For home page, show just the property name. For other pages, show "Page | Property Name"
  const fullTitle = pageTitle === 'Home' ? siteName : `${pageTitle} | ${siteName}`;
</script>

<title>{fullTitle}</title>
