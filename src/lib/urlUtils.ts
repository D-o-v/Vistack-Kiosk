export function getOrganizationCodeFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

export function getOrganizationCodeFromPath(): string | null {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  
  // Check if there's a code in the path like /kiosk/12345
  if (segments.length >= 2) {
    return segments[segments.length - 1];
  }
  
  return null;
}