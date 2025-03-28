<script setup lang="ts">
import { ref } from 'vue';
import { AlertCircle } from 'lucide-vue-next';

const isLoading = ref(false);
const error = ref('');

const handleSubmit = async (data: any) => {
  try {
    // TODO: impl login with supabase
    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Form submitted:', data);
    isLoading.value = false;
  } catch (err) {
    isLoading.value = false;
    error.value = 'An error occurred during login. Please try again.';
    console.error(err);
  }
};
</script>

<template>
  <main class="h-screen mt-6 flex flex-col items-center justify-center bg-white p-4">
    <div class="-mt-24 w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg sm:p-8">
      <div class="flex flex-col items-center justify-center">
        <h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Log in to your account
        </h2>
      </div>

      <FormKit type="form" @submit="handleSubmit" :actions="false" class="mt-8 space-y-6">
        <div class="flex flex-col gap-6">
          <div v-if="error" class="p-4 border-l-4 border-red-500 bg-red-50 text-red-700">
            <div class="flex">
              <div class="flex-shrink-0">
                <AlertCircle class="h-5 w-5 text-red-500" />
              </div>
              <div class="ml-3">
                <p class="text-sm">{{ error }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <FormKit
              id="email"
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              validation="required|email"
              outer-class="w-full"
              label-class="block text-sm font-medium text-gray-700"
              input-class="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              validation-visibility="blur"
              message-class="text-red-600 text-sm mt-1"
            />
          </div>

          <div class="space-y-2">
            <FormKit
              id="password"
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              validation="required|length:8"
              outer-class="w-full"
              label-class="block text-sm font-medium text-gray-700"
              input-class="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              validation-visibility="blur"
              message-class="text-red-600 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            class="cursor-pointer w-full rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Logging in...' : 'Log in' }}
          </button>

          <div class="text-center text-sm text-gray-600">
            Don't have an account?
            <a href="/register" class="font-medium text-teal-700 hover:text-teal-600"> Sign up </a>
          </div>
        </div>
      </FormKit>
    </div>
  </main>
</template>
