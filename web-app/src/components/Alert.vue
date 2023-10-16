<template>
  <v-alert
    :text="message"
    type="error"
  >
    <div>
      <v-btn class="alert-button" to="/">Go to Search</v-btn>
    </div>
  </v-alert>
</template>

<script lang="ts" setup>
  interface Props {
    message: string;
  }

  defineProps<Props>()
</script>

<style lang="scss" scoped>
  .alert-button {
    margin-top: 16px;
  }
</style>
