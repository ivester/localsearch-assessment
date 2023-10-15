<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-card>
          <v-card-title>
            <span class="headline">{{ business?.name }}</span>
          </v-card-title>
          Address: {{ business?.where }} <br />
          // TODO website
          Website: TODO <br />
          // TODO phone
          Phone: TODO <br />
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
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
  import {
    BusinessDetail,
    OpeningHour,
    OpeningHourMerged,
    OpeningHourFormatted,
    Day,
    Hour
  } from '@/types';
  import axios from 'axios'
  import { computed } from 'vue';
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const business = ref<BusinessDetail | null>(null)

  onMounted(async () => {
    // I could load all the data when searching and then just pass the data to the detail view
    // but then I could not reload a detail page on its own
    const { data } = await axios.get<BusinessDetail>(`http://localhost:4000/business/${route.params.id}`)
    business.value = data
  })

  // --- Computed ---

  // days with same hours grouped together
  const openingHoursMerged = computed((): OpeningHourMerged[] =>
    business.value?.openingHours.reduce(mergeOpeningHours, []) || [])

  // days and hours with same hours grouped together and formatted for display
  const openingHoursFormatted = computed((): OpeningHourFormatted[] =>
    // TODO maybe there is a better name for openingHourMerged - I call the param group - maybe openingHourGroupe?
    openingHoursMerged.value.map((group: OpeningHourMerged): OpeningHourFormatted => ({
        ...group,
        days: formatDays(group.days),
        hours: formatHours(group.hours)
      })
    ))

  // --- Methods ---

  // group days with same hours together
  const mergeOpeningHours = (acc: OpeningHourMerged[], curr: OpeningHour): OpeningHourMerged[] => {
    const previous = acc.at(-1)
    // only merge days with same hours together if they follow each other
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
