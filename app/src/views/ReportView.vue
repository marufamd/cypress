<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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
  Trash,
} from 'lucide-vue-next';
import { formatDate, formatStatus, Status, timeAgo } from '@/util/util';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Priority,
  useComments,
  useCreateComment,
  useDeleteReport,
  useReport,
} from '@/util/queries';
import { user } from '@/util/auth';

const router = useRouter();
const route = useRoute();

const reportId = computed(() => route.params.id as string);
const { report, isLoading } = useReport(reportId);
const { mutateAsync: deleteReport } = useDeleteReport();
const { comments } = useComments(reportId);
const { mutateAsync: createComment } = useCreateComment();

watch([report, isLoading], ([val, loading]) => {
  if (!loading && val === null) {
    router.push('/reports');
  }
});

const newComment = ref('');

const addComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    await createComment({
      report_id: reportId.value,
      user_id: user.value?.id!,
      user_name: user.value?.firstName + ' ' + user.value?.lastName,
      text: newComment.value,
    });
    newComment.value = '';
  } catch (error) {
    console.error('Failed to post comment:', error);
  }
};

const handleDelete = async () => {
  if (!report.value?.id) return;

  const confirmed = confirm('Are you sure you want to delete this report?');
  if (!confirmed) return;

  try {
    await deleteReport(report.value.id);
    router.push('/reports');
  } catch (error) {
    console.error('Failed to delete report:', error);
    alert('Failed to delete report.');
  }
};

const goBack = () => {
  router.push('/reports');
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
              {{ report?.title }}
              <span
                class="ml-3 px-3 py-1 text-sm rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': report?.status === 'pending',
                  'bg-blue-100 text-blue-800': report?.status === 'in-progress',
                  'bg-green-100 text-green-800': report?.status === 'resolved',
                  'bg-gray-100 text-gray-800': report?.status === 'closed',
                }"
              >
                {{ formatStatus(report?.status as Status) }}
              </span>
            </h1>
            <p class="mt-1 text-teal-100 capitalize">{{ report?.type }} Issue</p>
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
                    >Reported {{ timeAgo(report?.date_submitted) }}</span
                  >
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Description</h3>
                  <p class="mt-1 text-gray-900">{{ report?.description }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Location</h3>
                    <p class="mt-1 text-gray-900 flex items-center">
                      <MapPin class="h-4 w-4 text-gray-400 mr-1" />
                      {{ report?.location }}
                    </p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Reported By</h3>
                    <p class="mt-1 text-gray-900 flex items-center">
                      <User class="h-4 w-4 text-gray-400 mr-1" />
                      {{ report?.reported_by }}
                    </p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Priority</h3>
                    <p class="mt-1">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-red-100 text-red-800': report?.priority === Priority.High,
                          'bg-yellow-100 text-yellow-800': report?.priority === Priority.Medium,
                          'bg-blue-100 text-blue-800': report?.priority === Priority.Low,
                        }"
                      >
                        {{
                          report?.priority
                            ? report.priority.charAt(0).toUpperCase() + report.priority.slice(1)
                            : ''
                        }}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Date Submitted</h3>
                    <p class="mt-1 text-gray-900">{{ formatDate(report?.date_submitted) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Report Image -->
            <div v-if="report?.image_url" class="border-t border-gray-200">
              <div class="p-6">
                <h3 class="text-sm font-medium text-gray-500 mb-3">Photo Evidence</h3>
                <img
                  :src="report.image_url"
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
                :center="[report?.coordinates[0] ?? 0, report?.coordinates[1] ?? 0]"
                style="height: 16rem; width: 100%"
              >
                <LTileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LMarker :lat-lng="[report?.coordinates[0] ?? 0, report?.coordinates[1] ?? 0]" />
              </LMap>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">
                Comments ({{ comments?.length }})
              </h2>

              <div v-if="comments?.length === 0" class="text-center py-8">
                <MessageSquare class="h-12 w-12 mx-auto text-gray-300" />
                <p class="mt-2 text-gray-500">No comments yet</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="comment in comments"
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
                        <p class="text-sm font-medium text-gray-900">{{ comment.user_name }}</p>
                        <p class="text-sm text-gray-500">{{ formatDate(comment.date) }}</p>
                      </div>
                    </div>
                    <div v-if="comment.user_name === 'City Official'" class="ml-4">
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
                      :disabled="!newComment.trim() || !user"
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
                          {{ formatDate(report?.date_submitted) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="report?.status !== Status.Pending" class="relative pb-8">
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
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="report?.status === 'resolved' || report?.status === 'closed'"
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
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="report?.status === Status.Closed" class="relative">
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
                        <p class="mt-0.5 text-sm text-gray-500"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Actions</h2>

              <div class="space-y-3">
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

                <button
                  v-if="report?.user_id === user?.id"
                  @click="handleDelete"
                  class="w-full flex items-center justify-center px-4 py-2 border transition-all cursor-pointer border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash class="h-4 w-4 mr-2" />
                  Delete Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
