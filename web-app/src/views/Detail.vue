<template>
  <div>
    <BusinessCard
      v-if="business"
      :business="business"
    />
    <span v-if="errorMessage">
      <!-- TODO make pretty -->
      {{ errorMessage }}<br>
      <router-link to="/">Go to Search</router-link>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { Business } from '@/types';
  import axios from 'axios'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import BusinessCard from '@/components/BusinessCard.vue';

  const URL = 'http://localhost:4000/business/'

  const route = useRoute()

  const business = ref<Business | undefined>(undefined)
  const errorMessage = ref<string | undefined>(undefined)

  onMounted(async () => {
    // I could pass the data directly from the search page
    // but then I could not reload this page here
    // therefore I load the data here again
    load()
  })

  // --- Methods ---

  // load and set business data or set error message
  const load = async (): Promise<undefined> => {
    try {
      const { data } = await axios.get<Business>(`${URL}${route.params.id}`)
      business.value = data
    } catch (error) {
      errorMessage.value = 'Something went wrong. Please try to search for the business you are looking for using its name or address.'
    }
  }
</script>

<style lang="scss" scoped>
  .opening-hours {
    text-transform: capitalize;
  }
</style>
