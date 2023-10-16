<template>
  <v-snackbar
    v-model="showSnackbar"
    class="snack-bar"
    location="top"
    color="red"
    :timeout="5000"
  >
    <div class="snack-bar__error">
      <v-icon
        class="snack-bar__error-icon"
        icon="mdi-alert"
      />
      <span>{{ message }}</span>
    </div>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

  interface Props {
    message: string;
    show: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    show: false
  })

  const showSnackbar = ref<boolean>(props.show)

  watch(() => props.show, (value) => {
    showSnackbar.value = value
  })
</script>

<style scoped lang="scss">
  .snack-bar {
    &__error {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      &-icon {
        margin-right: 16px;
      }
    }
  }
</style>
