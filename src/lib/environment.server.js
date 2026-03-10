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

  return process.env.NODE_ENV;
}
