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
        <v-card
          v-for="business in businesses"
          :key="business.id"
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
  import axios from 'axios'
  import { ref } from 'vue'

  interface Result {
    id: string;
    name: string;
    where: string;
  }

  const query = ref<String>('')
  const businesses = ref<Result[]>([])
  async function search() {
    // TODO maybe make some env where I can set URL - by default localhost:4000
    // TODO axios response type
    const response = await axios.get<Result[]>(`http://localhost:4000/businesses?search=${query.value}`)
    businesses.value = response.data
  }
</script>
