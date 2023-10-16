<template>
  <div>
    <v-card v-if="business">
      <v-card-title>
        <span class="headline">{{ business?.name }}</span>
      </v-card-title>
      Address: {{ business?.where }} <br />
      <span v-if="business?.url">Website: <a :href="business.url" target="_blank">{{ business?.urlFormatted || business.url }}</a> <br /></span>
      <span v-if="business?.phone">Phone: <a :href="`tel:${business.phone}`">{{ business?.phoneFormatted || business.phone }}</a> <br /></span>
      Opening Hours: <br />
      <br />

      <!-- TODO add everywhere classes in the BEM style -->
      <span
        v-for="openingHour in openingHoursFormatted"
        :key="openingHour.id"
        class="opening-hours"
      >
        {{openingHour.days}}:
        <!-- Ignoring the key lint error here as I am not worried about performance here. Otherwise I would have to add a unique id to each list element -->
        <!-- https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key -->
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <span v-for="hour in openingHour.hours">
          {{ hour }}<br>
        </span>
        <br>
      </span>
    </v-card>
    <span v-if="errorMessage">
      {{ errorMessage }}<br>
      <router-link to="/">Go to Search</router-link>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import {
    BusinessDetail,
    OpeningHour,
    OpeningHourGrouped,
    OpeningHourFormatted,
    Day,
    Hour
  } from '@/types';
  import axios from 'axios'
  import { computed } from 'vue';
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const URL = 'http://localhost:4000/business/'

  const route = useRoute()

  const business = ref<BusinessDetail | undefined>(undefined)
  const errorMessage = ref<string | undefined>(undefined)

  onMounted(async () => {
    // I could load all the data when searching and then just pass the data to the detail view
    // but then I could not reload a detail page on its own
    load()
  })

  // --- Computed ---

  // days with same hours grouped together
  const openingHoursGrouped = computed((): OpeningHourGrouped[] =>
    business.value?.openingHours.reduce(groupOpeningHours, []) || [])

  // days and hours with same hours grouped together and formatted for display
  const openingHoursFormatted = computed((): OpeningHourFormatted[] =>
    openingHoursGrouped.value.map((group: OpeningHourGrouped): OpeningHourFormatted => ({
        ...group,
        days: formatDays(group.days),
        hours: formatHours(group.hours)
      })
    ))

  // --- Methods ---

  // load and set business data or set error message
  const load = async (): Promise<undefined> => {
    try {
      const { data } = await axios.get<BusinessDetail>(`${URL}${route.params.id}`)
      business.value = data
    } catch (error) {
      errorMessage.value = 'Something went wrong. Please try to search for the business you are looking for using its name or address.'
    }
  }

  // group days with same hours together
  const groupOpeningHours = (acc: OpeningHourGrouped[], curr: OpeningHour): OpeningHourGrouped[] => {
    const previous = acc.at(-1)
    // only group days with same hours together if they follow each other
    const hoursSameAsPervious = JSON.stringify(previous?.hours) === JSON.stringify(curr.hours)

    if (hoursSameAsPervious) {
      // add the current day to previous group if hours are the same
      previous?.days.push(curr.day)
    } else {
      // create new group if hours are not the same
      acc.push({
        id: curr.id,
        days: [curr.day],
        hours: curr.hours
      })
    }

    return acc
  }

  // format days to display the first and last day if multiple days are selected
  const formatDays = (days: Day[]): string => {
    const firstDay = days.at(0)
    const lastDay = days.at(-1)
    const hasMultipleDays = days.length > 1
    const daysFormatted = hasMultipleDays
      ? `${firstDay} - ${lastDay}`
      : firstDay

    return daysFormatted || ''
  }

  // format hours to show the opening hours if defined or the string 'closed' if not defined
  const formatHours = (hours: Hour[]): string[] => hours.length
    ? hours.map(time => `${time.start} - ${time.end}`)
    : ['closed']
</script>

<style lang="scss" scoped>
  .opening-hours {
    text-transform: capitalize;
  }
</style>
