<template>
  <div class="opening-hours">
    Opening Hours: <br />
    <br />

    <span
      v-for="openingHour in openingHoursFormatted"
      :key="openingHour.id"
      class="opening-hours__values"
    >
      <span>{{openingHour.days}}: </span>
      <!-- Ignoring the key lint error here as I am not worried about performance here. Otherwise I would have to add a unique id to each list element -->
      <!-- https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key -->
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <span v-for="hour in openingHour.hours">
        {{ hour }}<br>
      </span>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import {
    OpeningHour,
    OpeningHourGrouped,
    OpeningHourFormatted,
    Day,
    Hour,
  } from '@/types';
  import { computed } from 'vue';

  // --- Props ---

  interface Props {
    openingHours: OpeningHour[];
  }

  const props = defineProps<Props>()

  // --- Computed ---

  // days with same opening hours grouped together
  const openingHoursGrouped = computed((): OpeningHourGrouped[] =>
    props.openingHours.reduce(groupOpeningHours, []) || [])

  // opening hours formatted for display
  const openingHoursFormatted = computed((): OpeningHourFormatted[] =>
    openingHoursGrouped.value.map((group: OpeningHourGrouped): OpeningHourFormatted => ({
        ...group,
        days: formatDays(group.days),
        hours: formatHours(group.hours)
      })
    ))

  // group days with same hours together
  const groupOpeningHours = (acc: OpeningHourGrouped[], curr: OpeningHour): OpeningHourGrouped[] => {
    const previous = acc.at(-1)
    // only group days with same opening hours together if they follow each other
    const hoursSameAsPervious = JSON.stringify(previous?.hours) === JSON.stringify(curr.hours)

    if (hoursSameAsPervious) {
      // add the current day to previous group if opening hours are the same
      previous?.days.push(curr.day)
    } else {
      // create new group if opening hours are not the same
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
    &__values {
      text-transform: capitalize;
    }
  }
</style>
