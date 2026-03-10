/**
 * Escapes special XML characters to prevent injection and ensure valid XML.
 * Replaces: & -> &amp;, < -> &lt;, > -> &gt;, " -> &quot;, ' -> &apos;
 *
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string safe for XML interpolation
 */
export function escapeXml(str) {
  if (typeof str !== 'string') {
    return String(str);
  }

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
