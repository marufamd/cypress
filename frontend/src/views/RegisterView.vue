<script setup lang="ts">
import { ref } from 'vue';
import { AlertCircle } from 'lucide-vue-next';
import { supabase } from '@/util/supabase';
import { useRouter } from 'vue-router';

const isLoading = ref(false);
const error = ref('');
const success = ref(false);

const handleSubmit = async (data: any) => {
  try {
    isLoading.value = true;
    error.value = '';
    success.value = false;

    const { email, password, firstName, lastName } = data;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (signUpError) throw signUpError;

    success.value = true;
  } catch (err: any) {
    error.value = err.message || 'An error occurred during signup. Please try again.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <main class="h-[90vh] mt-6 flex flex-col items-center justify-center bg-white p-4">
    <div class="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg sm:p-8">
      <div class="flex flex-col items-center justify-center">
        <h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <FormKit type="form" @submit="handleSubmit" :actions="false" :incomplete-message="false">
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

          <div v-if="success" class="p-4 border-l-4 border-green-500 bg-green-50 text-green-700">
            <div class="flex">
              <div class="flex-shrink-0">
                <AlertCircle class="h-5 w-5 text-green-500" />
              </div>
              <div class="ml-3">
                <p class="text-sm">Check your email to verify your account before logging in.</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormKit
              id="firstName"
              type="text"
              name="firstName"
              label="First Name"
              placeholder="John"
              validation="required"
              outer-class="w-full"
              label-class="block text-sm font-medium text-gray-700"
              input-class="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              validation-visibility="blur"
              message-class="text-red-600 text-sm mt-1"
            />

            <FormKit
              id="lastName"
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              validation="required"
              outer-class="w-full"
              label-class="block text-sm font-medium text-gray-700"
              input-class="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              validation-visibility="blur"
              message-class="text-red-600 text-sm mt-1"
            />
          </div>

          <FormKit
            id="email"
            type="email"
            name="email"
            label="Email"
            placeholder="you@example.com"
            validation="required|email"
            outer-class="w-full"
            label-class="block text-sm font-medium text-gray-700"
            input-class="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            validation-visibility="blur"
            message-class="text-red-600 text-sm mt-1"
          />

          <FormKit
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            validation="required|length:8"
            outer-class="w-full"
            label-class="block text-sm font-medium text-gray-700"
            input-class="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            validation-visibility="blur"
            message-class="text-red-600 text-sm mt-1"
          />

          <FormKit
            type="password"
            name="password_confirm"
            label="Re-enter Password"
            placeholder="••••••••"
            validation="required|confirm:password"
            outer-class="w-full"
            label-class="block text-sm font-medium text-gray-700"
            input-class="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            validation-visibility="blur"
            message-class="text-red-600 text-sm mt-1"
          />

          <button
            type="submit"
            class="cursor-pointer w-full rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
            :disabled="isLoading || success"
          >
            {{ isLoading ? 'Creating account...' : 'Sign up' }}
          </button>

          <div class="text-center text-sm text-gray-600">
            Already have an account?
            <a href="/login" class="font-medium text-teal-700 hover:text-teal-600"> Log in </a>
          </div>
        </div>
      </FormKit>
    </div>
  </main>
</template>
