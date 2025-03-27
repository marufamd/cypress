<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { MenuIcon, XIcon } from 'lucide-vue-next';

import { navItems } from '@/util/router';

const navLinks = navItems.slice(0, -2);

// Mobile menu state
const mobileMenuOpen = ref(false);
</script>

<template>
  <nav class="shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <RouterLink to="/" class="flex items-center">
              <img src="@/assets/logo.png" alt="Cypress Logo" class="h-10 w-10 object-contain" />
              <span class="ml-2 text-xl font-bold">Cypress</span>
            </RouterLink>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <div class="flex space-x-4">
              <RouterLink
                v-for="item in navLinks"
                :key="item.name"
                :to="item.path"
                :class="[
                  $route.path === item.path
                    ? 'bg-teal-800 text-white'
                    : 'text-teal-800 hover:bg-teal-600 hover:text-white',
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                ]"
              >
                {{ item.name }}
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- User menu and mobile menu button -->
        <div class="flex items-center">
          <div class="hidden sm:flex sm:items-center sm:ml-6">
            <div class="flex items-center space-x-4">
              <RouterLink
                to="/login"
                class="text-teal-800 hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Log in
              </RouterLink>
              <RouterLink
                to="/register"
                class="bg-white text-teal-700 hover:bg-teal-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign up
              </RouterLink>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center sm:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-teal-100 hover:text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span class="sr-only">Open main menu</span>
              <MenuIcon v-if="!mobileMenuOpen" class="block h-6 w-6" />
              <XIcon v-else class="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="sm:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <RouterLink
          v-for="item in navLinks"
          :key="item.name"
          :to="item.path"
          :class="[
            $route.path === item.path
              ? 'bg-teal-800 text-white'
              : 'text-teal-100 hover:bg-teal-600 hover:text-white',
            'block px-3 py-2 rounded-md text-base font-medium transition-colors',
          ]"
          @click="mobileMenuOpen = false"
        >
          {{ item.name }}
        </RouterLink>
      </div>
      <div class="pt-4 pb-3 border-t border-teal-800">
        <div class="px-2 space-y-1">
          <RouterLink
            to="/login"
            class="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:bg-teal-600 hover:text-white transition-colors"
            @click="mobileMenuOpen = false"
          >
            Log in
          </RouterLink>
          <RouterLink
            to="/register"
            class="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:bg-teal-600 hover:text-white transition-colors"
            @click="mobileMenuOpen = false"
          >
            Sign up
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
