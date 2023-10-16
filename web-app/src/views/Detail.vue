<template>
  <div>
    <BusinessCard
      v-if="business"
      :business="business"
    />
    <Alert
      v-if="errorMessage"
      :message="errorMessage"
    />
  </div>
</template>

<script lang="ts" setup>
  import { Business } from '@/types';
  import axios from 'axios'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import BusinessCard from '@/components/BusinessCard.vue';
  import Alert from '@/components/Alert.vue';

  const URL = 'http://localhost:4000/business/'

  const route = useRoute()

  const business = ref<Business | undefined>(undefined)
  const errorMessage = ref<string | undefined>(undefined)

  onMounted(async () => {
    // I could pass the data directly from the search page
    // but then I could not reload the detail page
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
      errorMessage.value = 'Something went wrong. Please try (again) to search for the business you are looking for using its name or address.'
    }
  }
</script>
