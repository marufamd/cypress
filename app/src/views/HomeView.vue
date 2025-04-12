<script setup lang="ts">
import {
  MapPin,
  Bell,
  CheckCircle,
  Smartphone,
  Map,
  Camera,
  UserCheck,
  Activity,
} from 'lucide-vue-next';
</script>

<template>
  <main class="min-h-screen flex flex-col">
    <section class="bg-teal-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div class="block md:hidden">
            <img src="@/assets/logo.png" alt="Cypress Logo" class="w-64 h-64 mx-auto rounded-4xl" />
          </div>
          <div class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight">
              Report & Track Street Issues in Toronto
            </h1>
            <p class="text-xl text-teal-100">
              Cypress makes it easy to report disturbances, broken streetlights, graffiti, and other
              street-related issues directly to the City of Toronto.
            </p>
            <div class="flex justify-center align-center">
              <router-link
                to="/register"
                class="px-6 py-3 bg-white text-teal-700 font-medium rounded-md hover:bg-teal-50 transition-colors shadow-md"
              >
                Get Started
              </router-link>
            </div>
          </div>
          <div class="hidden md:block">
            <img src="@/assets/logo.png" alt="Cypress Logo" class="w-64 h-64 mx-auto rounded-4xl" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900">How It Works</h2>
          <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Cypress streamlines the process of reporting and resolving street issues in Toronto
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <MapPin class="h-6 w-6 text-teal-700" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Report an Issue</h3>
            <p class="text-gray-600">
              Easily pinpoint the exact location on our interactive map and submit detailed reports
              with photos.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Bell class="h-6 w-6 text-teal-700" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Track Progress</h3>
            <p class="text-gray-600">
              Receive notifications and follow the status of your reports from submission to
              resolution.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle class="h-6 w-6 text-teal-700" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Get Resolution</h3>
            <p class="text-gray-600">
              City officials review and address issues, keeping you informed throughout the process.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900">Key Features</h2>
          <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Designed to make reporting street issues easier and more effective
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-1">
              <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Map class="h-5 w-5 text-teal-700" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold mb-2">Interactive Mapping</h3>
              <p class="text-gray-600">
                Precise location reporting with GIS support to accurately pinpoint and visualize
                issues.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0 mt-1">
              <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Camera class="h-5 w-5 text-teal-700" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold mb-2">Photo Evidence</h3>
              <p class="text-gray-600">
                Submit photos with your reports to provide clear visual evidence of the issues.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0 mt-1">
              <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <UserCheck class="h-5 w-5 text-teal-700" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold mb-2">User Verification</h3>
              <p class="text-gray-600">
                Secure authentication ensures the integrity of reports and prevents false
                submissions.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0 mt-1">
              <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Activity class="h-5 w-5 text-teal-700" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold mb-2">Status Tracking</h3>
              <p class="text-gray-600">
                Monitor the progress of your reports from submission to resolution with clear status
                updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-teal-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to improve your community?</h2>
        <p class="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
          Join thousands of Toronto residents who are making their streets safer and better
          maintained with Cypress.
        </p>
        <router-link
          to="/register"
          class="inline-block px-8 py-4 bg-white text-teal-700 font-medium rounded-md hover:bg-teal-50 transition-colors shadow-md text-lg"
        >
          Sign Up Now
        </router-link>
      </div>
    </section>
  </main>
</template>
