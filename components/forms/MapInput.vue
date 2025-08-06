<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="address"
        :label="label || 'Ubicación'"
        variant="outlined"
        clearable
        hint="Ingrese una dirección y presione Enter, o haga clic/arrastre el marcador."
        persistent-hint
        @keydown.enter.prevent="geocodeAddress"
      ></v-text-field>

      <div ref="mapContainer" class="map-container"></div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const props = defineProps<{
  modelValue?: string;
  label?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const address = ref(props.modelValue || "");
const mapContainer = ref<HTMLElement | null>(null);

let map: google.maps.Map | null = null;
let marker: google.maps.marker.AdvancedMarkerElement | null = null;
let geocoder: google.maps.Geocoder | null = null;

// Function to wait until Google Maps is ready
function waitForGoogleMaps(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      if (
        window.google &&
        window.google.maps &&
        window.google.maps.importLibrary
      ) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

onMounted(async () => {
  try {
    await waitForGoogleMaps();
    await initializeMap();
    if (address.value) {
      geocodeAddress();
    }
  } catch (error) {
    console.error("Error al inicializar Google Maps:", error);
    if (mapContainer.value) {
      mapContainer.value.innerHTML = "<p>No se pudo cargar el mapa.</p>";
    }
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== address.value) {
      address.value = newValue || "";
      geocodeAddress();
    }
  }
);

async function initializeMap() {
  if (!mapContainer.value) return;

  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    "marker"
  )) as google.maps.MarkerLibrary;

  geocoder = new google.maps.Geocoder();
  const initialLatLng = new google.maps.LatLng(4.60971, -74.08175); // Bogotá

  map = new google.maps.Map(mapContainer.value, {
    center: initialLatLng,
    zoom: 12,
    mapId: "DEMO_MAP_ID", // Recommended for Advanced Markers
  });

  marker = new AdvancedMarkerElement({
    map: map,
    position: initialLatLng,
    gmpDraggable: true,
  });

  map.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      updateMarkerPosition(e.latLng);
      reverseGeocode(e.latLng);
    }
  });

  marker.addListener("dragend", () => {
    if (marker && marker.position) {
      reverseGeocode(marker.position as google.maps.LatLng);
    }
  });
}

function geocodeAddress() {
  if (!geocoder || !address.value) return;

  const coords = address.value.split(",").map((s) => parseFloat(s.trim()));
  if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    const latLng = new google.maps.LatLng(coords[0], coords[1]);
    updateMarkerPosition(latLng);
    if (map) map.setCenter(latLng);
    return;
  }

  geocoder.geocode({ address: address.value }, (results, status) => {
    if (status === "OK" && results && results[0]) {
      const location = results[0].geometry.location;
      updateMarkerPosition(location);
      if (map) map.setCenter(location);
    } else {
      console.warn("Geocode failed: " + status);
    }
  });
}

function reverseGeocode(latLng: google.maps.LatLng) {
  if (!geocoder) return;

  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === "OK" && results && results[0]) {
      address.value = results[0].formatted_address;
    }
  });
}

function updateMarkerPosition(
  latLng: google.maps.LatLng | google.maps.LatLngLiteral
) {
  if (marker) {
    marker.position = latLng;
  }
}

watch(address, (newAddress) => {
  emit("update:modelValue", newAddress);
});
</script>

<style scoped>
.map-container {
  height: 300px;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 4px;
}
</style>
