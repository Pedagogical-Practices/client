// Using a global variable for the promise is HMR-proof.
const GOOGLE_MAPS_PROMISE = '__googleMapsLoadingPromise__';

export default defineNuxtPlugin(() => {
  // On server-side, do nothing.
  if (typeof window === 'undefined') {
    return;
  }

  // If the promise already exists, do nothing.
  if (window[GOOGLE_MAPS_PROMISE]) {
    return;
  }

  const config = useRuntimeConfig();
  const apiKey = config.public.googleMapsApiKey;

  if (!apiKey) {
    console.error('Google Maps API key is not configured. Please set NUXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file.');
    return;
  }

  // Create a new promise and store it globally.
  window[GOOGLE_MAPS_PROMISE] = new Promise((resolve, reject) => {
    const scriptId = 'google-maps-script';

    if (document.getElementById(scriptId)) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`;
    script.onload = () => resolve(true);
    script.onerror = (error) => {
      console.error('Error loading Google Maps script:', error);
      reject(error);
    };
    document.head.appendChild(script);
  });
});