<template>
  <div class="min-h-screen flex flex-col">
    <div class="bg-teal-700 text-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Report Map</h1>
            <p class="mt-1 text-teal-100">View and explore street issues across Toronto</p>
          </div>
          <div class="mt-4 md:mt-0">
            <button 
              @click="showFilters = !showFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-teal-700 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-700 focus:ring-white"
            >
              <Filter class="h-4 w-4 mr-2" />
              {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex-1 flex flex-col md:flex-row">
      <div 
        v-show="showFilters"
        class="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 overflow-y-auto"
      >
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Filters</h3>
            <p class="mt-1 text-sm text-gray-500">Refine the reports shown on the map</p>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-900">Report Type</h4>
            <div class="mt-2 space-y-2">
              <div v-for="type in reportTypes" :key="type.value" class="flex items-center">
                <input
                  :id="`type-${type.value}`"
                  v-model="selectedTypes"
                  :value="type.value"
                  type="checkbox"
                  class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label :for="`type-${type.value}`" class="ml-2 text-sm text-gray-700">
                  {{ type.label }}
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-900">Status</h4>
            <div class="mt-2 space-y-2">
              <div v-for="status in statusOptions" :key="status.value" class="flex items-center">
                <input
                  :id="`status-${status.value}`"
                  v-model="selectedStatuses"
                  :value="status.value"
                  type="checkbox"
                  class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label :for="`status-${status.value}`" class="ml-2 text-sm text-gray-700">
                  {{ status.label }}
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-900">Priority</h4>
            <div class="mt-2 space-y-2">
              <div v-for="priority in priorityOptions" :key="priority.value" class="flex items-center">
                <input
                  :id="`priority-${priority.value}`"
                  v-model="selectedPriorities"
                  :value="priority.value"
                  type="checkbox"
                  class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label :for="`priority-${priority.value}`" class="ml-2 text-sm text-gray-700">
                  {{ priority.label }}
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-900">Date Range</h4>
            <div class="mt-2 space-y-2">
              <div>
                <label for="date-from" class="block text-xs text-gray-500">From</label>
                <input
                  id="date-from"
                  v-model="dateFrom"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="date-to" class="block text-xs text-gray-500">To</label>
                <input
                  id="date-to"
                  v-model="dateTo"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="applyFilters"
              class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Apply
            </button>
            <button
              @click="resetFilters"
              class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-nonefocus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <!-- Map Container -->
      <div class="flex-1 relative">
        <div id="map" class="absolute inset-0 z-0"></div>
        
        <!-- Toronto Area Label -->
        <div class="absolute top-5 right-5 bg-white bg-opacity-80 px-3 py-1 rounded-md shadow-sm z-10">
          <span class="text-sm font-medium text-gray-700">Toronto, ON</span>
        </div>
        
        <!-- Legend -->
        <div class="absolute bottom-5 right-5 bg-white p-3 rounded-lg shadow-md z-10">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Legend</h4>
          <div class="space-y-2">
            <div class="flex items-center">
              <div class="h-4 w-4 rounded-full bg-yellow-500"></div>
              <span class="ml-2 text-xs text-gray-700">Pending</span>
            </div>
            <div class="flex items-center">
              <div class="h-4 w-4 rounded-full bg-blue-500"></div>
              <span class="ml-2 text-xs text-gray-700">In Progress</span>
            </div>
            <div class="flex items-center">
              <div class="h-4 w-4 rounded-full bg-green-500"></div>
              <span class="ml-2 text-xs text-gray-700">Resolved</span>
            </div>
            <div class="flex items-center">
              <div class="h-4 w-4 rounded-full bg-gray-500"></div>
              <span class="ml-2 text-xs text-gray-700">Closed</span>
            </div>
          </div>
        </div>
        
        <!-- Selected Report Preview -->
        <div 
          v-if="selectedReport" 
          class="absolute top-5 left-5 bg-white p-4 rounded-lg shadow-md z-10 max-w-sm"
        >
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">{{ selectedReport.type }}</h3>
            <button @click="selectedReport = null" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="mt-2">
            <p class="text-sm text-gray-500">{{ selectedReport.description }}</p>
            <div class="mt-2 flex items-center">
              <MapPin class="h-4 w-4 text-gray-400" />
              <span class="ml-1 text-xs text-gray-500">{{ selectedReport.location }}</span>
            </div>
            <div class="mt-1 flex items-center">
              <Calendar class="h-4 w-4 text-gray-400" />
              <span class="ml-1 text-xs text-gray-500">{{ formatDate(selectedReport.dateSubmitted) }}</span>
            </div>
            <div class="mt-3">
              <router-link 
                :to="`/reports/${selectedReport.id}`"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Reset View Button -->
        <div class="absolute bottom-5 left-5 z-10">
          <button 
            @click="resetMapView"
            class="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            title="Reset map view"
          >
            <MapIcon class="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Filter, X, MapPin, Calendar } from 'lucide-vue-next'
import { Map as MapIcon } from 'lucide-vue-next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const showFilters = ref(false)
const selectedReport = ref(null)
const map = ref(null)
const markers = ref([])

// Toronto boundaries
const TORONTO_CENTER = [43.7001, -79.4163]
const TORONTO_BOUNDS = [
  [43.5810, -79.6390],
  [43.8554, -79.1168]
]

// Filter states
const selectedTypes = ref([])
const selectedStatuses = ref([])
const selectedPriorities = ref([])
const dateFrom = ref('')
const dateTo = ref('')

// Filter options
const reportTypes = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'streetlight', label: 'Streetlight' },
  { value: 'graffiti', label: 'Graffiti' },
  { value: 'sidewalk', label: 'Sidewalk' },
  { value: 'road-damage', label: 'Road Damage' },
  { value: 'other', label: 'Other' }
]

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' }
]

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

const reports = [
  {
    id: '1',
    type: 'Pothole',
    description: 'Large pothole in the middle of the road causing traffic hazards.',
    status: 'pending',
    priority: 'high',
    location: 'King St W & Spadina Ave',
    coordinates: [43.6442, -79.3957],
    dateSubmitted: '2023-10-15T14:32:00Z',
    reportedBy: 'John Smith',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Pothole',
    comments: [
      { id: '1', user: 'City Official', text: 'We have received your report and will investigate.', date: '2023-10-16T09:15:00Z' }
    ]
  },
  {
    id: '2',
    type: 'Streetlight',
    description: 'Streetlight not working for the past week, creating safety concerns at night.',
    status: 'in-progress',
    priority: 'medium',
    location: 'Queen St E & Broadview Ave',
    coordinates: [43.6573, -79.3520],
    dateSubmitted: '2023-10-12T18:45:00Z',
    reportedBy: 'Sarah Johnson',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Streetlight',
    comments: [
      { id: '1', user: 'City Official', text: 'Maintenance crew has been dispatched.', date: '2023-10-13T11:20:00Z' },
      { id: '2', user: 'Sarah Johnson', text: 'Thank you for the quick response!', date: '2023-10-13T12:05:00Z' }
    ]
  },
  {
    id: '3',
    type: 'Graffiti',
    description: 'Offensive graffiti on public building wall needs to be removed.',
    status: 'resolved',
    priority: 'low',
    location: 'Bloor St W & Bathurst St',
    coordinates: [43.6659, -79.4117],
    dateSubmitted: '2023-10-08T10:20:00Z',
    reportedBy: 'Michael Chen',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Graffiti',
    comments: [
      { id: '1', user: 'City Official', text: 'Cleanup crew scheduled for tomorrow.', date: '2023-10-09T08:30:00Z' },
      { id: '2', user: 'City Official', text: 'Graffiti has been removed.', date: '2023-10-10T16:45:00Z' }
    ]
  },
  {
    id: '4',
    type: 'Sidewalk',
    description: 'Cracked and uneven sidewalk creating tripping hazard for pedestrians.',
    status: 'in-progress',
    priority: 'medium',
    location: 'Yonge St & Eglinton Ave',
    coordinates: [43.7046, -79.3973],
    dateSubmitted: '2023-10-14T09:10:00Z',
    reportedBy: 'Emily Rodriguez',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Sidewalk',
    comments: [
      { id: '1', user: 'City Official', text: 'Assessment completed. Repair scheduled for next week.', date: '2023-10-16T14:20:00Z' }
    ]
  },
  {
    id: '5',
    type: 'Road Damage',
    description: 'Large crack across the entire road width causing vehicle damage.',
    status: 'pending',
    priority: 'high',
    location: 'Danforth Ave & Pape Ave',
    coordinates: [43.6786, -79.3458],
    dateSubmitted: '2023-10-16T11:05:00Z',
    reportedBy: 'David Wilson',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Road+Damage',
    comments: []
  },
  {
    id: '6',
    type: 'Other',
    description: 'Abandoned shopping carts blocking the bike lane.',
    status: 'closed',
    priority: 'low',
    location: 'College St & Ossington Ave',
    coordinates: [43.6553, -79.4222],
    dateSubmitted: '2023-10-05T15:30:00Z',
    reportedBy: 'Lisa Patel',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Other',
    comments: [
      { id: '1', user: 'City Official', text: 'This is not under city jurisdiction. Please contact the store directly.', date: '2023-10-06T10:15:00Z' },
      { id: '2', user: 'Lisa Patel', text: 'I understand, thank you for the information.', date: '2023-10-06T11:30:00Z' }
    ]
  },
  {
    id: '7',
    type: 'Pothole',
    description: 'Multiple potholes along this stretch of road.',
    status: 'pending',
    priority: 'medium',
    location: 'Dundas St W & Dufferin St',
    coordinates: [43.6498, -79.4293],
    dateSubmitted: '2023-10-17T08:15:00Z',
    reportedBy: 'Robert Kim',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Pothole',
    comments: []
  },
  {
    id: '8',
    type: 'Streetlight',
    description: 'Three consecutive streetlights not working on this block.',
    status: 'in-progress',
    priority: 'high',
    location: 'St Clair Ave W & Bathurst St',
    coordinates: [43.6814, -79.4181],
    dateSubmitted: '2023-10-13T19:22:00Z',
    reportedBy: 'Jennifer Lee',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Streetlight',
    comments: [
      { id: '1', user: 'City Official', text: 'Electrical team scheduled for inspection.', date: '2023-10-14T10:05:00Z' }
    ]
  },
  {
    id: '9',
    type: 'Graffiti',
    description: 'Large graffiti on public park equipment.',
    status: 'resolved',
    priority: 'medium',
    location: 'Trinity Bellwoods Park',
    coordinates: [43.6469, -79.4137],
    dateSubmitted: '2023-10-09T14:10:00Z',
    reportedBy: 'Thomas Wong',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Graffiti',
    comments: [
      { id: '1', user: 'City Official', text: 'Cleanup completed.', date: '2023-10-11T16:30:00Z' }
    ]
  },
  {
    id: '10',
    type: 'Sidewalk',
    description: 'Tree roots have caused significant sidewalk uplift.',
    status: 'pending',
    priority: 'high',
    location: 'Roncesvalles Ave & High Park Blvd',
    coordinates: [43.6487, -79.4490],
    dateSubmitted: '2023-10-16T15:45:00Z',
    reportedBy: 'Maria Garcia',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Sidewalk',
    comments: [
      { id: '1', user: 'City Official', text: 'Assessment scheduled for next week.', date: '2023-10-17T09:20:00Z' }
    ]
  },
  {
    id: '11',
    type: 'Pothole',
    description: 'Deep pothole causing damage to vehicles.',
    status: 'pending',
    priority: 'high',
    location: 'Bay St & Bloor St W',
    coordinates: [43.6700, -79.3900],
    dateSubmitted: '2023-10-17T10:30:00Z',
    reportedBy: 'William Taylor',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Pothole',
    comments: []
  },
  {
    id: '12',
    type: 'Streetlight',
    description: 'Streetlight flickering and causing distraction to drivers.',
    status: 'in-progress',
    priority: 'medium',
    location: 'Yonge St & Dundas St E',
    coordinates: [43.6560, -79.3802],
    dateSubmitted: '2023-10-14T16:20:00Z',
    reportedBy: 'Olivia Brown',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Streetlight',
    comments: [
      { id: '1', user: 'City Official', text: 'Technician scheduled for repair.', date: '2023-10-15T09:45:00Z' }
    ]
  },
  {
    id: '13',
    type: 'Road Damage',
    description: 'Sinkhole forming in the middle of the intersection.',
    status: 'pending',
    priority: 'high',
    location: 'Avenue Rd & St Clair Ave W',
    coordinates: [43.6880, -79.4030],
    dateSubmitted: '2023-10-16T08:15:00Z',
    reportedBy: 'James Wilson',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Road+Damage',
    comments: [
      { id: '1', user: 'City Official', text: 'Emergency team dispatched for assessment.', date: '2023-10-16T09:30:00Z' }
    ]
  },
  {
    id: '14',
    type: 'Graffiti',
    description: 'Graffiti on public library exterior wall.',
    status: 'resolved',
    priority: 'low',
    location: 'College St & Grace St',
    coordinates: [43.6560, -79.4140],
    dateSubmitted: '2023-10-10T11:25:00Z',
    reportedBy: 'Sophia Martinez',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Graffiti',
    comments: [
      { id: '1', user: 'City Official', text: 'Cleanup completed on October 12.', date: '2023-10-12T15:10:00Z' }
    ]
  },
  {
    id: '15',
    type: 'Sidewalk',
    description: 'Sidewalk completely blocked by construction debris.',
    status: 'in-progress',
    priority: 'medium',
    location: 'Queen St W & University Ave',
    coordinates: [43.6515, -79.3870],
    dateSubmitted: '2023-10-15T13:40:00Z',
    reportedBy: 'Daniel Johnson',
    imageUrl: 'https://placeholder.svg?height=300&width=300&text=Sidewalk',
    comments: [
      { id: '1', user: 'City Official', text: 'Construction company notified to clear debris.', date: '2023-10-16T10:20:00Z' }
    ]
  }
]

// Computed filtered reports
const filteredReports = computed(() => {
  return reports.filter(report => {
    // Type filter
    if (selectedTypes.value.length > 0 && !selectedTypes.value.includes(report.type.toLowerCase().replace(' ', '-'))) {
      return false
    }
    
    // Status filter
    if (selectedStatuses.value.length > 0 && !selectedStatuses.value.includes(report.status)) {
      return false
    }
    
    // Priority filter
    if (selectedPriorities.value.length > 0 && !selectedPriorities.value.includes(report.priority)) {
      return false
    }
    
    // Date range filter
    if (dateFrom.value) {
      const fromDate = new Date(dateFrom.value)
      const reportDate = new Date(report.dateSubmitted)
      if (reportDate < fromDate) {
        return false
      }
    }
    
    if (dateTo.value) {
      const toDate = new Date(dateTo.value)
      toDate.setHours(23, 59, 59, 999) // End of the day
      const reportDate = new Date(report.dateSubmitted)
      if (reportDate > toDate) {
        return false
      }
    }
    
    return true
  })
})

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }).format(date)
}

const getMarkerColor = (status) => {
  switch (status) {
    case 'pending': return 'yellow'
    case 'in-progress': return 'blue'
    case 'resolved': return 'green'
    case 'closed': return 'gray'
    default: return 'red'
  }
}

const createCustomMarker = (report) => {
  const color = getMarkerColor(report.status)
  
  // Create a custom icon
  const markerIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color === 'yellow' ? '#EAB308' : color === 'blue' ? '#3B82F6' : color === 'green' ? '#22C55E' : '#6B7280'}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
  
  return markerIcon
}

const initMap = () => {
  // Create map with Toronto center and restricted to Toronto bounds
  map.value = L.map('map', {
    center: TORONTO_CENTER,
    zoom: 12,
    minZoom: 11, // Restrict zoom out to still see Toronto
    maxZoom: 18, // Allow zooming in for detail
    maxBounds: TORONTO_BOUNDS, // Restrict panning to Toronto area
    maxBoundsViscosity: 1.0 // Make the bounds completely solid
  })
  
  // Add tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    bounds: TORONTO_BOUNDS // Restrict tiles to Toronto area
  }).addTo(map.value)
  
  // Add Toronto city boundary outline (simplified)
  const torontoBoundary = L.polygon([
    [43.5810, -79.6390], // Southwest
    [43.5810, -79.1168], // Southeast
    [43.8554, -79.1168], // Northeast
    [43.8554, -79.6390]  // Northwest
  ], {
    color: '#0F766E', // Teal color matching the app theme
    weight: 2,
    fillOpacity: 0.05,
    fillColor: '#0F766E'
  }).addTo(map.value)
  
  // Add markers for all reports
  updateMarkers()
}

const updateMarkers = () => {
  // Clear existing markers
  if (markers.value.length > 0) {
    markers.value.forEach(marker => {
      map.value.removeLayer(marker)
    })
    markers.value = []
  }
  
  // Add markers for filtered reports
  filteredReports.value.forEach(report => {
    const marker = L.marker(report.coordinates, { icon: createCustomMarker(report) })
      .addTo(map.value)
      .on('click', () => {
        selectedReport.value = report
      })
    
    markers.value.push(marker)
  })
  
  // Adjust map view to fit all markers if there are any, but stay within Toronto bounds
  if (markers.value.length > 0) {
    const group = new L.featureGroup(markers.value)
    const bounds = group.getBounds()
    
    // Ensure the bounds are within Toronto
    const adjustedBounds = L.latLngBounds(
      L.latLng(
        Math.max(bounds.getSouth(), TORONTO_BOUNDS[0][0]),
        Math.max(bounds.getWest(), TORONTO_BOUNDS[0][1])
      ),
      L.latLng(
        Math.min(bounds.getNorth(), TORONTO_BOUNDS[1][0]),
        Math.min(bounds.getEast(), TORONTO_BOUNDS[1][1])
      )
    )
    
    map.value.fitBounds(adjustedBounds, { padding: [50, 50] })
  } else {
        resetMapView()
    }
}

const applyFilters = () => {
  updateMarkers()
  if (window.innerWidth < 768) { // Mobile view
    showFilters.value = false
  }
}

const resetFilters = () => {
  selectedTypes.value = []
  selectedStatuses.value = []
  selectedPriorities.value = []
  dateFrom.value = ''
  dateTo.value = ''
  updateMarkers()
}

const resetMapView = () => {
  // Reset to default Toronto view
  map.value.setView(TORONTO_CENTER, 12)
  selectedReport.value = null
}

// Initialize map when component is mounted
onMounted(() => {
  initMap()
})

// Watch for changes in filtered reports
watch(filteredReports, () => {
  if (map.value) {
    updateMarkers()
  }
})
</script>

<style>
/* Fix for Leaflet images not loading properly */
.leaflet-default-icon-path {
  background-image: url("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png");
}

.leaflet-control-attribution {
  font-size: 8px !important;
}

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