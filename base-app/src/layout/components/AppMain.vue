<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AppMain'
})
</script>

<style scoped>
.app-main {
  position: relative;

  /* 84 = navbar + tags-view = 50 +34 */
  /* height: calc(100vh - 66px); */
  /* padding: 16px; */
  padding-top: 0;
  overflow-y: hidden;
}
</style>
