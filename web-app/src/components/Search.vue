<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- TODO make into components -->
      <v-text-field
        label="Search Business Entries..."
        variant="solo-filled"
        append-inner-icon="mdi-magnify"
        @click:append-inner="search"
        @keyup.enter="search"
      />
      <v-card v-if="data.displayed_what">
        <v-card-title>
          <span class="headline">{{ data.displayed_what }}</span>
        </v-card-title>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
  import axios from 'axios'
  import { ref } from 'vue'

  interface Data {
    displayed_what: string
  }

  const data = ref<Data>({ displayed_what: '' })
  async function search() {
    const response = await axios.get<Data>('http://localhost:4000')
    data.value = response.data
  }
</script>
