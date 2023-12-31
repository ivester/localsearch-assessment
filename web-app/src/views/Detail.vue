<template>
  <div class="detail">

    <!-- back to search button -->
    <v-btn
      v-if="business"
      data-cy="detail-back-button"
      class="detail-button"
      icon="mdi-magnify"
      to="/"
    />

    <!-- business card with all the details -->
    <BusinessCard
      v-if="business"
      :business="business"
    />

    <!-- error message if there is an error -->
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
  import { SERVER_URL } from '@/main';

  const route = useRoute()

  const business = ref<Business | undefined>(undefined)
  const errorMessage = ref<string | undefined>(undefined)

  onMounted(() => {
    // I could pass the data directly from the search page
    // but then I could not reload the detail page
    // therefore I load the data here again
    load()
  })

  // --- Methods ---

  // load and set business data or set error message
  const load = async (): Promise<undefined> => {
    try {
      const { data } = await axios.get<Business>(`${SERVER_URL}business/${route.params.id}`)
      business.value = data
    } catch (error: any) {
      if (error?.response?.status === 404) {
        errorMessage.value = `The business with the id "${route.params.id}" does not exist exist. Please try to search for the business you are looking for using its name or address.`
        return
      }
      errorMessage.value = 'Something went wrong. Please try (again) to search for the business you are looking for using its name or address.'
    }
  }
</script>

<style lang="scss" scoped>
.detail {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-button {
    margin-bottom: 16px;
  }
}
</style>
