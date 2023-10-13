<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <code>{{ data.displayed_what }}</code>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
  import axios from 'axios'
  import { onMounted, ref } from 'vue'

  interface Data {
    displayed_what: string
  }

  const data = ref<Data>({ displayed_what: '' })
  onMounted(async () => {
    const response = await axios.get<Data>('http://localhost:4000')
    data.value = response.data
  })
</script>
