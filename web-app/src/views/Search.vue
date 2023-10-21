<template>
  <div class="search">

    <!-- search input -->
    <v-text-field
      data-cy="search-input"
      v-model="query"
      label="Search Business"
      variant="solo-filled"
      append-inner-icon="mdi-magnify"
      :autofocus="true"
      @click:append-inner="search"
      @keyup.enter="search"
    />

    <!-- popup error message if there is an error -->
    <SnackBar :message="errorMessage" :show="snackbar"/>

    <!-- no results message -->
    <div
      v-if="!businesses.length && isSearching"
      data-cy="search-no-results"
    >
      No results for current search request
    </div>
    
    <!-- search results list -->
    <v-row v-if="businesses.length">
      <!-- On bigger screens, show two columns of cards -->
      <!-- If there is only one result than show only one column, even on a big screen -->
      <v-col
        v-for="business in businesses"
        :key="business.id"
        cols="12"
        :md="businesses.length > 1 ? 6 : 12"
      >
        <BusinessCard
          :business="business"
          variant="search"
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
  import { SERVER_URL } from '@/main';

  const query = ref<string>('')
  const isSearching = ref<boolean>(false)
  const businesses = ref<Business[]>([])
  const snackbar = ref<boolean>(false)
  const errorMessage = ref<string>('')

  // --- Computed ---

  const queryUrlFragment = computed((): string => query.value ? `?search=${query.value}` : '')

  // --- Methods ---

  async function search() {
    isSearching.value = !!query.value
    try {
      snackbar.value = false
      const {data} = await axios.get<Business[]>(`${SERVER_URL}businesses/${queryUrlFragment.value}`)
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
