<template>
  <v-card
    :to="link"
    variant="tonal"
    :elevation="4"
  >
    <v-card-title>
      <span class="headline">{{ business.name }}</span>
    </v-card-title>
    <v-card-text>
      {{ business.where }} <br />
      <div v-if="mode === 'detail'">
        <span v-if="business?.url">Website: <a :href="business.url" target="_blank">{{ business?.urlFormatted || business.url }}</a> <br /></span>
        <span v-if="business?.phone">Phone: <a :href="`tel:${business.phone}`">{{ business?.phoneFormatted || business.phone }}</a> <br /></span>
        <OpeningHours v-if="business?.openingHours" :opening-hours="business.openingHours"/>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { Business } from '@/types';
  import OpeningHours from './OpeningHours.vue';
import { computed } from 'vue';
import { RouteLocationRaw } from 'vue-router';

  // --- Props ---

  interface Props {
    business: Business;
    mode?: 'search' | 'detail';
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: 'detail'
  })

  // --- Computed ---

  const link = computed((): RouteLocationRaw | undefined => {
    return props.mode === 'search' ? { name: 'Detail', params: { id: props.business.id } } : undefined
  })
</script>
