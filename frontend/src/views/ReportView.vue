<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ChevronLeft,
  MapPin,
  User,
  Clock,
  MessageSquare,
  ClipboardCheck,
  CheckCircle,
  Archive,
  Bell,
  Share2,
  Printer,
} from 'lucide-vue-next';
import { formatDate, formatStatus, Status, timeAgo } from '@/util/util';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

const router = useRouter();
const route = useRoute();

// Todo: Use actual data from supabase
const reports = [
  {
    id: '1',
    type: 'Pothole',
    description: 'Large pothole in the middle of the road causing traffic hazards.',
    status: 'pending',
    priority: 'high',
    location: 'King St W & Spadina Ave',
    coordinates: { lat: 43.6441, lng: -79.3957 },
    dateSubmitted: '2023-10-15T14:32:00Z',
    reportedBy: 'John Smith',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Pothole',
    comments: [
      {
        id: '1',
        user: 'City Official',
        text: 'We have received your report and will investigate.',
        date: '2023-10-16T09:15:00Z',
      },
    ],
  },
  {
    id: '2',
    type: 'Streetlight',
    description: 'Streetlight not working for the past week, creating safety concerns at night.',
    status: 'in-progress',
    priority: 'medium',
    location: 'Queen St E & Broadview Ave',
    coordinates: { lat: 43.6598, lng: -79.3485 },
    dateSubmitted: '2023-10-12T18:45:00Z',
    reportedBy: 'Sarah Johnson',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Streetlight',
    comments: [
      {
        id: '1',
        user: 'City Official',
        text: 'Maintenance crew has been dispatched.',
        date: '2023-10-13T11:20:00Z',
      },
      {
        id: '2',
        user: 'Sarah Johnson',
        text: 'Thank you for the quick response!',
        date: '2023-10-13T12:05:00Z',
      },
    ],
  },
  {
    id: '3',
    type: 'Graffiti',
    description: 'Offensive graffiti on public building wall needs to be removed.',
    status: 'resolved',
    priority: 'low',
    location: 'Bloor St W & Bathurst St',
    coordinates: { lat: 43.6666, lng: -79.4111 },
    dateSubmitted: '2023-10-08T10:20:00Z',
    reportedBy: 'Michael Chen',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Graffiti',
    comments: [
      {
        id: '1',
        user: 'City Official',
        text: 'Cleanup crew scheduled for tomorrow.',
        date: '2023-10-09T08:30:00Z',
      },
      {
        id: '2',
        user: 'City Official',
        text: 'Graffiti has been removed.',
        date: '2023-10-10T16:45:00Z',
      },
    ],
  },
  {
    id: '4',
    type: 'Sidewalk',
    description: 'Cracked and uneven sidewalk creating tripping hazard for pedestrians.',
    status: 'in-progress',
    priority: 'medium',
    location: 'Yonge St & Eglinton Ave',
    coordinates: { lat: 43.7076, lng: -79.3996 },
    dateSubmitted: '2023-10-14T09:10:00Z',
    reportedBy: 'Emily Rodriguez',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Sidewalk',
    comments: [
      {
        id: '1',
        user: 'City Official',
        text: 'Assessment completed. Repair scheduled for next week.',
        date: '2023-10-16T14:20:00Z',
      },
    ],
  },
  {
    id: '5',
    type: 'Road Damage',
    description: 'Large crack across the entire road width causing vehicle damage.',
    status: 'pending',
    priority: 'high',
    location: 'Danforth Ave & Pape Ave',
    coordinates: { lat: 43.6784, lng: -79.3443 },
    dateSubmitted: '2023-10-16T11:05:00Z',
    reportedBy: 'David Wilson',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Road+Damage',
    comments: [],
  },
  {
    id: '6',
    type: 'Other',
    description: 'Abandoned shopping carts blocking the bike lane.',
    status: 'closed',
    priority: 'low',
    location: 'College St & Ossington Ave',
    coordinates: { lat: 43.6544, lng: -79.4244 },
    dateSubmitted: '2023-10-05T15:30:00Z',
    reportedBy: 'Lisa Patel',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Other',
    comments: [
      {
        id: '1',
        user: 'City Official',
        text: 'This is not under city jurisdiction. Please contact the store directly.',
        date: '2023-10-06T10:15:00Z',
      },
      {
        id: '2',
        user: 'Lisa Patel',
        text: 'I understand, thank you for the information.',
        date: '2023-10-06T11:30:00Z',
      },
    ],
  },
];

// Get report ID from route params
const reportId = computed(() => route.params.id);

// Find the report based on ID
const report = computed(() => {
  const foundReport = reports.find((r) => r.id === reportId.value);
  if (!foundReport) {
    // Handle case where report is not found
    router.push('/reports');
    return reports[0]; // Return a default to prevent errors
  }
  return foundReport;
});

// New comment form
const newComment = ref('');

const addDays = (date: string, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const randomNearbyLocation = (location: string) => {
  const streets = [
    'King St',
    'Queen St',
    'Dundas St',
    'College St',
    'Bloor St',
    'Spadina Ave',
    'Bathurst St',
    'Yonge St',
    'Bay St',
    'University Ave',
  ];

  const directions = ['W', 'E'];

  const parts = location.split('&');
  let mainStreet = parts[0].trim();

  mainStreet = mainStreet.replace(/ [NESW]$/, '');

  let otherStreet;
  do {
    otherStreet = streets[Math.floor(Math.random() * streets.length)];
  } while (otherStreet === mainStreet);

  const direction = directions[Math.floor(Math.random() * directions.length)];

  return `${mainStreet} ${direction} & ${otherStreet}`;
};

const randomDaysAgo = () => {
  const days = Math.floor(Math.random() * 14) + 1;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const goBack = () => {
  router.push('/reports');
};

const addComment = () => {
  if (!newComment.value.trim()) return;

  // TODO: Use Supabase for data persitence
  report.value.comments.push({
    id: `temp-${Date.now()}`,
    user: 'You',
    text: newComment.value,
    date: new Date().toISOString(),
  });

  newComment.value = '';
};
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <div class="bg-teal-700 text-white py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center">
          <button @click="goBack" class="mr-4 p-1 rounded-full hover:bg-teal-600 transition-colors">
            <ChevronLeft class="h-6 w-6" />
          </button>
          <div>
            <h1 class="text-2xl font-bold flex items-center">
              Report #{{ report.id }}
              <span
                class="ml-3 px-3 py-1 text-sm rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': report.status === 'pending',
                  'bg-blue-100 text-blue-800': report.status === 'in-progress',
                  'bg-green-100 text-green-800': report.status === 'resolved',
                  'bg-gray-100 text-gray-800': report.status === 'closed',
                }"
              >
                {{ formatStatus(report.status as Status) }}
              </span>
            </h1>
            <p class="mt-1 text-teal-100">{{ report.type }} Issue</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900">Report Details</h2>
                <div class="flex items-center">
                  <Clock class="h-5 w-5 text-gray-400 mr-2" />
                  <span class="text-sm text-gray-500"
                    >Reported {{ timeAgo(report.dateSubmitted) }}</span
                  >
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Description</h3>
                  <p class="mt-1 text-gray-900">{{ report.description }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Location</h3>
                    <p class="mt-1 text-gray-900 flex items-center">
                      <MapPin class="h-4 w-4 text-gray-400 mr-1" />
                      {{ report.location }}
                    </p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Reported By</h3>
                    <p class="mt-1 text-gray-900 flex items-center">
                      <User class="h-4 w-4 text-gray-400 mr-1" />
                      {{ report.reportedBy }}
                    </p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Priority</h3>
                    <p class="mt-1">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-red-100 text-red-800': report.priority === 'high',
                          'bg-yellow-100 text-yellow-800': report.priority === 'medium',
                          'bg-blue-100 text-blue-800': report.priority === 'low',
                        }"
                      >
                        {{ report.priority.charAt(0).toUpperCase() + report.priority.slice(1) }}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Date Submitted</h3>
                    <p class="mt-1 text-gray-900">{{ formatDate(report.dateSubmitted) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Report Image -->
            <div class="border-t border-gray-200">
              <div class="p-6">
                <h3 class="text-sm font-medium text-gray-500 mb-3">Photo Evidence</h3>
                <img
                  :src="report.imageUrl"
                  :alt="`Image of ${report.type}`"
                  class="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>

          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Location</h2>
            <div class="rounded-lg border border-gray-200 overflow-hidden">
              <LMap
                ref="map"
                :zoom="16"
                :center="[report.coordinates.lat, report.coordinates.lng]"
                style="height: 16rem; width: 100%"
              >
                <LTileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LMarker :lat-lng="[report.coordinates.lat, report.coordinates.lng]" />
              </LMap>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">
                Comments ({{ report.comments.length }})
              </h2>

              <div v-if="report.comments.length === 0" class="text-center py-8">
                <MessageSquare class="h-12 w-12 mx-auto text-gray-300" />
                <p class="mt-2 text-gray-500">No comments yet</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="comment in report.comments"
                  :key="comment.id"
                  class="p-4 border border-gray-200 rounded-lg"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <div
                          class="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center"
                        >
                          <User class="h-6 w-6 text-teal-700" />
                        </div>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ comment.user }}</p>
                        <p class="text-sm text-gray-500">{{ formatDate(comment.date) }}</p>
                      </div>
                    </div>
                    <div v-if="comment.user === 'City Official'" class="ml-4">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                      >
                        Official
                      </span>
                    </div>
                  </div>
                  <div class="mt-2 text-sm text-gray-700">
                    <p>{{ comment.text }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-6 border-t border-gray-200 pt-6">
                <h3 class="text-lg font-medium text-gray-900">Add a comment</h3>
                <form @submit.prevent="addComment" class="mt-4">
                  <div>
                    <label for="comment" class="sr-only">Comment</label>
                    <textarea
                      id="comment"
                      v-model="newComment"
                      rows="3"
                      class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3"
                      placeholder="Write a comment..."
                    ></textarea>
                  </div>
                  <div class="mt-3 flex justify-end">
                    <button
                      type="submit"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      :disabled="!newComment.trim()"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Status Updates</h2>

              <div class="space-y-4">
                <div class="relative pb-8">
                  <span
                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="h-8 w-8 bg-teal-500 rounded-full flex items-center justify-center ring-8 ring-white"
                        >
                          <ClipboardCheck class="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900">Report Submitted</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          {{ formatDate(report.dateSubmitted) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="report.status !== 'pending'" class="relative pb-8">
                  <span
                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center ring-8 ring-white"
                        >
                          <Tool class="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900">In Progress</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          {{ formatDate(addDays(report.dateSubmitted, 2)) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="report.status === 'resolved' || report.status === 'closed'"
                  class="relative pb-8"
                >
                  <span
                    v-if="report.status === 'closed'"
                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center ring-8 ring-white"
                        >
                          <CheckCircle class="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900">Resolved</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          {{ formatDate(addDays(report.dateSubmitted, 5)) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="report.status === 'closed'" class="relative">
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="h-8 w-8 bg-gray-500 rounded-full flex items-center justify-center ring-8 ring-white"
                        >
                          <Archive class="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900">Closed</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          {{ formatDate(addDays(report.dateSubmitted, 7)) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Card -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Actions</h2>

              <div class="space-y-3">
                <button
                  class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Bell class="h-4 w-4 mr-2" />
                  Subscribe to Updates
                </button>

                <button
                  class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Share2 class="h-4 w-4 mr-2" />
                  Share Report
                </button>

                <button
                  class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Printer class="h-4 w-4 mr-2" />
                  Print Report
                </button>
              </div>
            </div>
          </div>

          <!-- Similar Reports -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Similar Reports Nearby</h2>

              <div class="space-y-4">
                <div v-for="i in 2" :key="i" class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-md bg-gray-200"></div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ report.type }} Issue</p>
                    <p class="text-xs text-gray-500">{{ randomNearbyLocation(report.location) }}</p>
                    <p class="text-xs text-gray-500">{{ randomDaysAgo() }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-4 text-center">
                <button class="text-sm font-medium text-teal-600 hover:text-teal-500">
                  View All Nearby Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
