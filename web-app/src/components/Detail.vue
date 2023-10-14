<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-card>
          <v-card-title>
            <span class="headline">Business Title {{ $route.params.id }}</span>
          </v-card-title>
          {{ business?.where }}
        </v-card>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
  // load business details from /business/:id using axios
  import axios from 'axios'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  interface Business {
    id: string;
    name: string;
    where: string;
  }

  const business = ref<Business | null>(null) // TODO do that in other places as well - Business or null

  onMounted(async () => {
    // TODO maybe make some env where I can set URL - by default localhost:4000
    // TODO --> axios response type
    const { data } = await axios.get<Business>(`http://localhost:4000/business/${route.params.id}`)
    business.value = data
  })

</script>
