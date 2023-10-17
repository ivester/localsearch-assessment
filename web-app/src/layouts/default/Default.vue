<template>
  <v-app class="default-layout">
    <v-main>
      <v-container class="default-layout__container fill-height">
        <v-responsive class="align-center fill-height">
          <router-view class="default-layout__view"/>
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
  .default-layout {
    // to UI looks better if it doesn't grow over the whole width of big screens
    &__container {
      max-width: 900px;
    }

    &__view {
      // give some space around UI so shadows are not cut off
      // and elements don't touch the screen border on mobile devices
      padding: 16px;
    }
  }
</style>
