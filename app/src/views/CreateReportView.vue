<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, MapPin, Camera, AlertCircle, Search, X, Check } from 'lucide-vue-next';
import 'leaflet/dist/leaflet.css';
import {
  LMap,
  LTileLayer,
  LMarker,
  LPolygon,
  LIcon,
  LPopup,
  LTooltip,
} from '@vue-leaflet/vue-leaflet';
import type { LatLngBoundsExpression, PointExpression } from 'leaflet';
import { Priority, useCreateReport, type Report } from '@/util/queries';
import { supabase } from '@/util/supabase';
import { Status } from '@/util/util';
import { user } from '@/util/auth';

const router = useRouter();
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const showSearchResults = ref(false);

// TODO: Use FormKit instead of manual refs.
const zoom = ref(12);
const center = ref<PointExpression>([43.7001, -79.4163]); // Toronto center
const mapOptions = {
  zoomControl: true,
  minZoom: 11,
  maxZoom: 18,
  maxBoundsViscosity: 1.0,
};
const torontoBounds: LatLngBoundsExpression = [
  [43.581, -79.639], // Southwest - Mississauga border
  [43.581, -79.1168], // Southeast
  [43.8554, -79.1168], // Northeast - Pickering border
  [43.8554, -79.639], // Northwest
];
const markerLatLng = ref<[number, number] | null>(null);

const reportType = ref('');
const title = ref('');
const description = ref('');
const priority = ref<Priority>(Priority.Medium);
const location = ref('');
const imageFile = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const imagePreview = ref('');
const formErrors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const submitSuccess = ref(false);

const reportTypes = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'streetlight', label: 'Streetlight' },
  { value: 'graffiti', label: 'Graffiti' },
  { value: 'sidewalk', label: 'Sidewalk' },
  { value: 'road-damage', label: 'Road Damage' },
  { value: 'other', label: 'Other' },
];

// Priority options
const priorityOptions = [
  { value: 'high', label: 'High', description: 'Immediate safety concern or hazard' },
  { value: 'medium', label: 'Medium', description: 'Significant issue requiring attention' },
  { value: 'low', label: 'Low', description: 'Minor issue that should be addressed' },
];

const customIconHtml = `
  <div style="
    background-color: #0D9488;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    animation: pulse 2s infinite;
  "></div>
`;

const handleMapClick = (event: any) => {
  const { lat, lng } = event.latlng;
  markerLatLng.value = [lat, lng];
  reverseGeocode([lat, lng]);
};

const handleMarkerDrag = (event: any) => {
  const { lat, lng } = event.latlng;
  markerLatLng.value = [lat, lng];
  reverseGeocode([lat, lng]);
};

const reverseGeocode = async (coords: [number, number]) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&zoom=18&addressdetails=1`,
    );
    const data = await response.json();

    if (data && data.display_name) {
      location.value = data.display_name;
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
  }
};

const searchLocation = async () => {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;
  showSearchResults.value = true;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&viewbox=${torontoBounds[0][1]},${torontoBounds[0][0]},${torontoBounds[2][1]},${torontoBounds[2][0]}&bounded=1`,
    );
    const data = await response.json();

    searchResults.value = data.slice(0, 5); // Limit to 5 results
  } catch (error) {
    console.error('Error searching location:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const selectSearchResult = (result: any) => {
  const lat = parseFloat(result.lat);
  const lon = parseFloat(result.lon);

  center.value = [lat, lon];
  zoom.value = 16;
  markerLatLng.value = [lat, lon];

  searchQuery.value = result.display_name;
  location.value = result.display_name;
  showSearchResults.value = false;
};

const handleInputFocus = () => {
  if (searchQuery.value && searchResults.value.length > 0) {
    showSearchResults.value = true;
  }
};

const handleInputBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false;
  }, 200);
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    imageFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// Remove uploaded image
const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = '';
  const input = document.getElementById('report-image') as HTMLInputElement;
  if (input) input.value = '';
};

// Validate form
const validateForm = () => {
  const errors: Record<string, string> = {};

  if (!reportType.value) {
    errors.reportType = 'Please select a report type';
  }

  if (!title.value.trim()) {
    errors.description = 'Please provide a title';
  }

  if (!description.value.trim()) {
    errors.description = 'Please provide a description';
  } else if (description.value.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!priority.value) {
    errors.priority = 'Please select a priority';
  }

  if (!markerLatLng.value) {
    errors.location = 'Please select a location on the map';
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const { mutateAsync: createReport } = useCreateReport();

// Submit form
const submitReport = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    if (imageFile.value) {
      const fileExt = imageFile.value.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from('reports')
        .upload(`public/${fileName}`, imageFile.value);

      if (error) {
        console.error('Error uploading image:', error);
        throw new Error('Image upload failed');
      }

      const { data: publicUrlData } = supabase.storage
        .from('reports')
        .getPublicUrl(`public/${fileName}`);

      imageUrl.value = publicUrlData.publicUrl;
    }

    const payload: Omit<Report, 'id' | 'date_submitted'> = {
      type: reportType.value,
      title: title.value,
      user_id: user.value?.id!,
      description: description.value,
      status: Status.Pending,
      priority: priority.value,
      location: location.value.split(',')[0],
      coordinates: markerLatLng.value!,
      reported_by: user.value?.firstName! + ' ' + user.value?.lastName!
    };

    if (imageUrl.value) {
      payload.image_url = imageUrl.value;
    }

    await createReport(payload);

    submitSuccess.value = true;

    setTimeout(() => {
      router.push('/reports');
    }, 2000);
  } catch (error) {
    console.error('Error submitting report:', error);
    formErrors.value.submit = 'Failed to submit report. Please try again.';
  } finally {
    isSubmitting.value = false;
    console.log(user.value);
  }
};

const goBack = () => {
  router.push('/reports');
};
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-teal-700 text-white py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center">
          <button @click="goBack" class="mr-4 p-1 rounded-full hover:bg-teal-600 transition-colors">
            <ChevronLeft class="h-6 w-6" />
          </button>
          <div>
            <h1 class="text-2xl font-bold">Submit Report</h1>
            <p class="mt-1 text-teal-100">Report an issue in your neighborhood</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success message -->
    <div
      v-if="submitSuccess"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div class="flex flex-col items-center text-center">
          <div class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check class="h-8 w-8 text-green-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
          <p class="text-gray-600 mb-6">Thank you for your report. We'll review it shortly.</p>
          <p class="text-sm text-gray-500">Redirecting to reports page...</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="p-6">
          <form @submit.prevent="submitReport" class="space-y-8">
            <!-- Report Type -->
            <div>
              <label for="report-type" class="block text-sm font-medium text-gray-700 mb-1">
                Report Type <span class="text-red-500">*</span>
              </label>
              <select
                id="report-type"
                v-model="reportType"
                class="block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                :class="{ 'border-red-300': formErrors.reportType }"
              >
                <option value="" disabled>Select a report type</option>
                <option v-for="type in reportTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
              <p v-if="formErrors.reportType" class="mt-1 text-sm text-red-600">
                {{ formErrors.reportType }}
              </p>
            </div>

            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="title"
                type="text"
                class="block p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                :class="{ 'border-red-300': formErrors.title }"
                placeholder="Give your report a short title"
              />
              <p v-if="formErrors.title" class="mt-1 text-sm text-red-600">
                {{ formErrors.title }}
              </p>
              <p class="mt-1 text-sm text-gray-500">{{ title.length }}/100 characters</p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                v-model="description"
                rows="4"
                class="block p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                :class="{ 'border-red-300': formErrors.description }"
                placeholder="Describe the issue in detail..."
              ></textarea>
              <p v-if="formErrors.description" class="mt-1 text-sm text-red-600">
                {{ formErrors.description }}
              </p>
              <p class="mt-1 text-sm text-gray-500">{{ description.length }}/500 characters</p>
            </div>

            <!-- Priority -->
            <div>
              <span class="block text-sm font-medium text-gray-700 mb-3">
                Priority <span class="text-red-500">*</span>
              </span>
              <div class="space-y-4">
                <div
                  v-for="option in priorityOptions"
                  :key="option.value"
                  class="relative flex items-start"
                >
                  <div class="flex items-center h-5">
                    <input
                      :id="`priority-${option.value}`"
                      v-model="priority"
                      :value="option.value"
                      type="radio"
                      class="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label :for="`priority-${option.value}`" class="font-medium text-gray-700">
                      {{ option.label }}
                    </label>
                    <p class="text-gray-500">{{ option.description }}</p>
                  </div>
                </div>
              </div>
              <p v-if="formErrors.priority" class="mt-1 text-sm text-red-600">
                {{ formErrors.priority }}
              </p>
            </div>

            <!-- Location -->
            <div>
              <span class="block text-sm font-medium text-gray-700 mb-3">
                Location <span class="text-red-500">*</span>
              </span>

              <!-- Search box -->
              <div class="relative mb-4">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  v-model="searchQuery"
                  @focus="handleInputFocus"
                  @blur="handleInputBlur"
                  placeholder="Search for a location in Toronto"
                  class="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
                <div class="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="button"
                    @click="searchLocation"
                    class="p-2 text-gray-500 hover:text-teal-600"
                  >
                    <span class="sr-only">Search</span>
                    <Search class="h-5 w-5" />
                  </button>
                </div>

                <!-- Search results dropdown -->
                <div
                  v-show="showSearchResults && (searchResults.length > 0 || isSearching)"
                  class="absolute z-9999 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200"
                >
                  <div v-if="isSearching" class="p-4 text-center text-gray-500">
                    <div class="flex justify-center items-center">
                      <svg
                        class="animate-spin h-5 w-5 text-teal-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Searching...
                    </div>
                  </div>
                  <ul v-else-if="searchResults.length > 0" class="max-h-60 overflow-y-auto">
                    <li
                      v-for="(result, index) in searchResults"
                      :key="index"
                      @mousedown="selectSearchResult(result)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div class="flex items-start">
                        <MapPin class="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span class="ml-2 text-sm">{{ result.display_name }}</span>
                      </div>
                    </li>
                  </ul>
                  <div v-else class="p-4 text-center text-gray-500">No results found</div>
                </div>
              </div>

              <!-- Map -->
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <l-map
                  ref="map"
                  style="height: 400px; width: 100%"
                  :zoom="zoom"
                  :center="center"
                  :options="mapOptions"
                  :max-bounds="[torontoBounds[0], torontoBounds[2]]"
                  @click="handleMapClick"
                >
                  <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    layer-type="base"
                    name="OpenStreetMap"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                  ></l-tile-layer>

                  <l-polygon
                    :lat-lngs="torontoBounds"
                    color="#0F766E"
                    :fill="true"
                    :fill-color="'#0F766E'"
                    :fill-opacity="0.05"
                    :weight="2"
                  ></l-polygon>

                  <l-marker
                    v-if="markerLatLng"
                    :lat-lng="markerLatLng"
                    :draggable="true"
                    @dragend="handleMarkerDrag"
                  >
                    <l-icon
                      :html="customIconHtml"
                      :icon-size="[24, 24]"
                      :icon-anchor="[12, 12]"
                      class-name="custom-marker"
                    ></l-icon>
                    <l-tooltip>{{ location || 'Selected location' }}</l-tooltip>
                  </l-marker>
                </l-map>
              </div>

              <!-- Selected location info -->
              <div v-if="markerLatLng" class="mt-3 p-3 bg-gray-50 rounded-md">
                <div class="flex items-start">
                  <MapPin class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div class="ml-2">
                    <p class="text-sm text-gray-700">{{ location || 'Selected location' }}</p>
                    <p class="text-xs text-gray-500">
                      Coordinates: {{ markerLatLng[0].toFixed(6) }},
                      {{ markerLatLng[1].toFixed(6) }}
                    </p>
                  </div>
                </div>
              </div>

              <p v-if="formErrors.location" class="mt-1 text-sm text-red-600">
                {{ formErrors.location }}
              </p>
              <p class="mt-2 text-sm text-gray-500">
                Click on the map to set the location or search for an address
              </p>
            </div>

            <!-- Image Upload (Optional) -->
            <div>
              <span class="block text-sm font-medium text-gray-700 mb-3">
                Photo Evidence (Optional)
              </span>

              <div
                v-if="!imagePreview"
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
              >
                <div class="space-y-1 text-center">
                  <Camera class="mx-auto h-12 w-12 text-gray-400" />
                  <div class="flex text-sm text-gray-600">
                    <label
                      for="report-image"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                    >
                      <span>Upload a photo</span>
                      <input
                        id="report-image"
                        type="file"
                        accept="image/*"
                        @change="handleImageUpload"
                        class="sr-only"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              <div v-else class="mt-1 relative rounded-md overflow-hidden">
                <img
                  :src="imagePreview"
                  alt="Report image preview"
                  class="h-64 object-fit"
                />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <X class="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <!-- Submit button -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="goBack"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="mr-2">
                  <svg
                    class="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
              </button>
            </div>

            <!-- General form error -->
            <div v-if="formErrors.submit" class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <AlertCircle class="h-5 w-5 text-red-400" />
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">{{ formErrors.submit }}</h3>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
/* Custom marker pulse animation */
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

.custom-marker div {
  animation: pulse 2s infinite;
}
</style>
