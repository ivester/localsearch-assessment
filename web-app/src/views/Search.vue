<template>
  <div class="search">
    <v-text-field
      v-model="query"
      label="Search Business"
      variant="solo-filled"
      append-inner-icon="mdi-magnify"
      @click:append-inner="search"
      @keyup.enter="search"
    />
    <SnackBar :message="errorMessage" :show="snackbar"/>
    <v-row v-if="businesses.length">
      <v-col
        v-for="business in businesses"
        :key="business.id"
        cols="6"
      >
        <BusinessCard
          :business="business"
          mode="search"
        />
      </v-col>
    </v-row>
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

<style>
  .search {
    /* give the search view a min height so the input doesn't jump around when results are shown */
    /* works fine for the expected two results - would need a better solution for more results */
    min-height: 400px;
  }
</style>
