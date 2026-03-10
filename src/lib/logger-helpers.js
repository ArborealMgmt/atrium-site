function formatDetail(detail) {
  if (detail === undefined || detail === null) {
    return undefined;
  }

  if (typeof detail === 'string') {
    return detail;
  }

  try {
    if (typeof detail === 'object') {
      return Object.entries(detail)
        .map(([key, value]) => `${key}=${stringifyDetailValue(value)}`)
        .join(', ');
    }
    return String(detail);
  } catch {
    return String(detail);
  }
}

function stringifyDetailValue(value) {
  if (value === undefined || value === null) {
    return String(value);
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

export function processLogArgs(args) {
  const message = typeof args[0] === 'string' ? args[0] : String(args[0]);
  const meta = args[1];
  const hasMeta = meta && typeof meta === 'object';
  const eventFields = {};

  if (hasMeta) {
    const detail = formatDetail(meta.detailedMessage);
    if (detail) {
      eventFields.detailedMessage = detail;
    }
  }

  return { message, eventFields };
}

export function __test__formatDetail(detail) {
  return formatDetail(detail);
}
