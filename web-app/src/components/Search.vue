<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- TODO make into components -->
      <v-text-field
        v-model="query"
        label="Search Business Entries..."
        variant="solo-filled"
        append-inner-icon="mdi-magnify"
        @click:append-inner="search"
        @keyup.enter="search"
      />
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
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
  import { Business } from '@/types';
  import axios from 'axios'
  import { computed } from 'vue';
  import { ref } from 'vue'

  const query = ref<string>('')
  const businesses = ref<Business[]>([])

  // --- Computed ---
  const queryUrlFragment = computed((): string => query.value ? `?search=${query.value}` : '')

  // --- Methods ---
  async function search() {
    const {data} = await axios.get<Business[]>(`http://localhost:4000/businesses${queryUrlFragment.value}`)
    businesses.value = data
  }
</script>
