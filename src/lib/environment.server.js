export function resolveEnvironmentFromHost(host) {
  const lowerCaseHost = host?.toLowerCase();
  const isLocal = lowerCaseHost?.includes('local');
  if (!isLocal) {
    return 'production';
  }

  const hasStagingPort = lowerCaseHost?.includes(':4373');

  if (hasStagingPort) {
    return 'staging';
  }

  const hasDevPort = lowerCaseHost?.includes(':4370');
  if (hasDevPort) {
    return 'development';
  }

  return typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';
}
