<template>
  <v-card
    data-cy="business-card"
    variant="tonal"
    :to="link"
    :elevation="2"
  >
    <v-card-title data-cy="business-card-title">{{ business.name }}</v-card-title>
    
    <v-divider></v-divider>
    
    <v-list v-if="variant === 'search'">
      <v-list-item
        :title="business.where"
        prepend-icon="mdi-map-marker"
        subtitle="Address"
      />
    </v-list>
    
    <BusinessCardDetail
      v-if="variant === 'detail'"
      :business="business"
    />
  </v-card>
</template>

<script lang="ts" setup>
  import { Business } from '@/types';
  import { computed } from 'vue';
  import { RouteLocationRaw } from 'vue-router';
  import BusinessCardDetail from './BusinessCardDetail.vue';

  // --- Props ---

  interface Props {
    business: Business;
    variant?: 'search' | 'detail';
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'detail'
  })

  // --- Computed ---

  const link = computed((): RouteLocationRaw | undefined => {
    return props.variant === 'search' ? { name: 'Detail', params: { id: props.business.id } } : undefined
  })
</script>
