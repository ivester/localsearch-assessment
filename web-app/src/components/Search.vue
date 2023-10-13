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
      <div v-if="results.length">
        <v-card
          v-for="result in results"
          :key="result.local_entry_id"
        >
          <v-card-title>
            <span class="headline">{{ result.displayed_what }}</span>
          </v-card-title>
        </v-card>
      </div>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
  import axios from 'axios'
  import { ref } from 'vue'

  interface Result {
    local_entry_id: string
    displayed_what: string
  }

  const query = ref<String>('')
  const results = ref<Result[]>([])
  async function search() {
    // TODO maybe make some env where I can set URL - by default localhost:4000
    const response = await axios.get<Result[]>(`http://localhost:4000/businesses?search=${query.value}`)
    results.value = response.data
  }
</script>
