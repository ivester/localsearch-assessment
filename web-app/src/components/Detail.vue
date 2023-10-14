<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-card>
          <v-card-title>
            <span class="headline">Business Title {{ $route.params.id }}</span>
          </v-card-title>
          Name: TODO <br />
          Address: {{ business?.where }} <br />
          Website: TODO <br />
          Phone: TODO <br />
          Opening Hours: TODO <br />
          <br />

          <span
            v-for="openingHour in openingHours"
            :key="openingHour.id"
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
  import axios from 'axios'
  import { computed } from 'vue';
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  // TODO move into composable - computed: openingHoursRaw, openingHours - methods: processOpeningHours (inside that method use "merge equal times" method)
  // TODO make all the interfaces

  // TODO Decision - merge only days together with same times which follow each other

  interface Business {
    id: string;
    name: string;
    where: string;
  }

  interface BusinessDetail extends Business {
    openingHours: openingHour[];
  }

  interface openingHour {
    id: number;
    day: string; // TODO make into enum - same for server
    hours: Hour[];
  }

  interface openingHourMerged {
    id: number;
    days: string[]
    hours: Hour[];
  }

  interface Hour {
    start: string;
    end: string;
  }

  const business = ref<BusinessDetail | null>(null) // TODO do that in other places as well - Business or null

  onMounted(async () => {
    // TODO maybe make some env where I can set URL - by default localhost:4000
    // TODO --> axios response type
    // I could load all the data when searching and then just pass the data to the detail view
    // but then I could not reload a detail page on its own
    const { data } = await axios.get<BusinessDetail>(`http://localhost:4000/business/${route.params.id}`)
    business.value = data
  })

  // TODO always add return type

  // TODO make these two computed one into functions and then make computed for business where I calculate everything correctly

  // TODO generally - remove return and just use arrow for implicit return
  // TODO for testing it would make sense to move into composable
  // TODO manage days that are not defined - show them as closed

  const openingHoursMerged = computed(() => {
    return business.value?.openingHours.reduce((acc, curr) => {
      const previous = acc.at(-1)
      const hoursSameAsPervious = JSON.stringify(previous?.hours) === JSON.stringify(curr.hours)

      if (hoursSameAsPervious) {
        previous?.days.push(curr.day)
      } else {
        acc.push({
          id: curr.id,
          days: [curr.day],
          hours: curr.hours
        })
      }
      return acc
    }, [] as openingHourMerged[])
    || []
  })

  const openingHours = computed(() => openingHoursMerged.value.map(group => {
    const firstDay = group.days.at(0)
    const lastDay = group.days.at(-1)
    const hasMultipleDays = group.days.length > 1

    return {
      ...group,
      days: firstDay + (hasMultipleDays ? ` - ${lastDay}` : ''),
      hours: group.hours.map(time => `${time.start} - ${time.end}`)
    }
  }))

</script>
