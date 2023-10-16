<template>
  <div>
    <v-text-field
      v-model="query"
      label="Search Business Entries..."
      variant="solo-filled"
      append-inner-icon="mdi-magnify"
      @click:append-inner="search"
      @keyup.enter="search"
    />
    <SnackBar :message="errorMessage" :show="snackbar"/>
    <div v-if="businesses.length">
      <BusinessCard
        v-for="business in businesses"
        :key="business.id"
        :business="business"
        mode="search"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Business } from '@/types';
  import axios from 'axios'
  import { computed } from 'vue';
  import { ref } from 'vue'
  import BusinessCard from '@/components/BusinessCard.vue';
  import SnackBar from '@/components/SnackBar.vue';

  const query = ref<string>('')
  const businesses = ref<Business[]>([])
  const snackbar = ref<boolean>(false)
  const errorMessage = ref<string>('')

  // --- Computed ---

  const queryUrlFragment = computed((): string => query.value ? `?search=${query.value}` : '')

  // --- Methods ---

  async function search() {
    try {
      snackbar.value = false
      const {data} = await axios.get<Business[]>(`http://localhost:4000/businesses${queryUrlFragment.value}`)
      businesses.value = data
    } catch (error) {
      errorMessage.value = 'Something went wrong with the search request. Please try your search request in a few seconds again.'
      snackbar.value = true
    }
  }
</script>
