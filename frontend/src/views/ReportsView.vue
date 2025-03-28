<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  MessageSquare, 
  Eye, 
  RefreshCw,
  SearchX,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import { Status, formatDate, formatStatus } from '@/util/util'

// TODO: replace with Supabase data
const reports = [
  {
    id: '1',
    type: 'Pothole',
    description: 'Large pothole in the middle of the road causing traffic hazards.',
    status: 'pending',
    priority: 'high',
    location: 'King St W & Spadina Ave',
    dateSubmitted: '2023-10-15T14:32:00Z',
    reportedBy: 'John Smith',
    imageUrl: 'https://placehold.co/300x150',
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
    dateSubmitted: '2023-10-12T18:45:00Z',
    reportedBy: 'Sarah Johnson',
    imageUrl: 'https://placehold.co/300x150',
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
    dateSubmitted: '2023-10-08T10:20:00Z',
    reportedBy: 'Michael Chen',
    imageUrl: 'https://placehold.co/300x150',
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
    dateSubmitted: '2023-10-14T09:10:00Z',
    reportedBy: 'Emily Rodriguez',
    imageUrl: 'https://placehold.co/300x150',
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
    dateSubmitted: '2023-10-16T11:05:00Z',
    reportedBy: 'David Wilson',
    imageUrl: 'https://placehold.co/300x150',
    comments: []
  },
  {
    id: '6',
    type: 'Other',
    description: 'Abandoned shopping carts blocking the bike lane.',
    status: 'closed',
    priority: 'low',
    location: 'College St & Ossington Ave',
    dateSubmitted: '2023-10-05T15:30:00Z',
    reportedBy: 'Lisa Patel',
    imageUrl: 'https://placehold.co/300x150',
    comments: [
      { id: '1', user: 'City Official', text: 'This is not under city jurisdiction. Please contact the store directly.', date: '2023-10-06T10:15:00Z' },
      { id: '2', user: 'Lisa Patel', text: 'I understand, thank you for the information.', date: '2023-10-06T11:30:00Z' }
    ]
  }
]

// Filter states
const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')

const filteredReports = computed(() => {
  return reports.filter(report => {
    if (statusFilter.value !== 'all' && report.status !== statusFilter.value) {
      return false
    }
    
    if (typeFilter.value !== 'all' && report.type.toLowerCase().replace(' ', '-') !== typeFilter.value) {
      return false
    }
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return (
        report.type.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.location.toLowerCase().includes(query) ||
        report.reportedBy.toLowerCase().includes(query)
      )
    }
    
    return true
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  typeFilter.value = 'all'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-teal-700 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold">Reports</h1>
        <p class="mt-2 text-teal-100">View and manage street issue reports in Toronto</p>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-4 flex-grow">
            <div class="w-full sm:w-64">
              <label for="search" class="sr-only">Search reports</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search reports..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div class="w-full sm:w-48">
              <label for="status-filter" class="sr-only">Filter by status</label>
              <select
                id="status-filter"
                v-model="statusFilter"
                class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div class="w-full sm:w-48">
              <label for="type-filter" class="sr-only">Filter by type</label>
              <select
                id="type-filter"
                v-model="typeFilter"
                class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="pothole">Pothole</option>
                <option value="streetlight">Streetlight</option>
                <option value="graffiti">Graffiti</option>
                <option value="sidewalk">Sidewalk</option>
                <option value="road-damage">Road Damage</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div class="flex items-center">
            <button 
              @click="resetFilters"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <RefreshCw class="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredReports.length > 0" class="space-y-4">
        <div 
          v-for="report in filteredReports" 
          :key="report.id" 
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="flex flex-col md:flex-row">
            <div class="md:w-48 h-48 md:h-auto flex-shrink-0 bg-gray-200 relative">
              <img 
                :src="report.imageUrl" 
                :alt="`Image of ${report.type}`" 
                class="w-full h-full object-cover"
              />
              <div 
                class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-800': report.status === 'pending',
                  'bg-blue-100 text-blue-800': report.status === 'in-progress',
                  'bg-green-100 text-green-800': report.status === 'resolved',
                  'bg-gray-100 text-gray-800': report.status === 'closed'
                }"
              >
                {{ formatStatus(report.status as Status) }}
              </div>
            </div>
            
            <div class="p-4 flex-1">
              <div class="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <div class="flex items-center">
                    <h3 class="text-lg font-semibold text-gray-900">{{ report.type }}</h3>
                    <span 
                      v-if="report.priority === 'high'" 
                      class="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                    >
                      High Priority
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">{{ report.description }}</p>
                </div>
                <div class="mt-2 md:mt-0 text-sm text-gray-500">
                  <div class="flex items-center">
                    <Calendar class="h-4 w-4 mr-1" />
                    <span>{{ formatDate(report.dateSubmitted) }}</span>
                  </div>
                  <div class="flex items-center mt-1">
                    <MapPin class="h-4 w-4 mr-1" />
                    <span>{{ report.location }}</span>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 flex flex-wrap items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <User class="h-4 w-4 mr-1" />
                  <span>Reported by: {{ report.reportedBy }}</span>
                </div>
                
                <div class="mt-2 sm:mt-0 flex space-x-2">
                  <button 
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <MessageSquare class="h-4 w-4 mr-1" />
                    <span>{{ report.comments.length }} {{ report.comments.length === 1 ? 'Comment' : 'Comments' }}</span>
                  </button>
                  
                  <RouterLink 
                    :to="`/reports/${report.id}`" 
                    class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <Eye class="h-4 w-4 mr-1" />
                    <span>View Report</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        v-else 
        class="bg-white rounded-lg shadow-md p-8 text-center"
      >
        <SearchX class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">No reports found</h3>
        <p class="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
        <button 
          @click="resetFilters"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Reset Filters
        </button>
      </div>
      
      <div v-if="filteredReports.length > 0" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ filteredReports.length }}</span> of <span class="font-medium">{{ reports.length }}</span> reports
        </div>
        <div class="flex space-x-2">
          <button 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled
          >
            <ChevronLeft class="h-4 w-4 mr-1" />
            Previous
          </button>
          <button 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled
          >
            Next
            <ChevronRight class="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>