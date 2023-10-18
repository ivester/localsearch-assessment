<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-list>
        <v-list-item
          :title="business.where"
          prepend-icon="mdi-map-marker"
          subtitle="Address"
        />
        <v-list-item
          v-if="business?.url"
          :title="business?.urlFormatted || business.url"
          :href="business.url"
          target="_blank"
          prepend-icon="mdi-web"
          subtitle="Website"
        />
        <v-list-item
          v-if="business?.phone"
          :title="business?.phoneFormatted || business.phone"
          :href="`tel:${business.phone}`"
          prepend-icon="mdi-phone"
          subtitle="Phone"
        />
      </v-list>
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <BusinessCardOpeningHours
        v-if="business?.openingHours"
        :opening-hours="business.openingHours"
      />
    </v-col>

</v-row>
</template>

<script lang="ts" setup>
  import { Business } from '@/types';
  import BusinessCardOpeningHours from './BusinessCardOpeningHours.vue';

  interface Props {
    business: Business;
  }

  defineProps<Props>()
</script>
