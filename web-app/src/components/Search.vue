<template>
  <div class="search">
    <!-- TODO make into components -->
    <v-text-field
      v-model="query"
      label="Search Business Entries..."
      variant="solo-filled"
      append-inner-icon="mdi-magnify"
      @click:append-inner="search"
      @keyup.enter="search"
    />
    <v-snackbar
      v-model="snackbar"
      location="top"
      color="red"
      :timeout="5000"
    >
      <div class="search__error">
        <v-icon
          class="search__error-icon"
          icon="mdi-alert"
        />
        <span>{{ errorMessage }}</span>
      </div>
    </v-snackbar>
    <div v-if="businesses.length">
      <!-- TODO make shared component to share with detail view -->
      <v-card
        v-for="business in businesses"
        :key="business.id"
        :to="{ name: 'Detail', params: { id: business.id } }"
      >
        <v-card-title>
          <span class="headline">{{ business.name }}</span>
        </v-card-title>
        {{ business.where }}
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Business } from '@/types';
  import axios from 'axios'
  import { computed } from 'vue';
  import { ref } from 'vue'

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

<style scoped lang="scss">
  .search {
    &__error {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      &-icon {
        margin-right: 16px;
      }
    }
  }
</style>
