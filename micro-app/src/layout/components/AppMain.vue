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
  /* position: relative; */

  /* 84 = navbar + tags-view = 50 +34 */

  /* height: 100%; */
  /* padding: 16px; */
  height: calc(100% - 34px);
  /* margin: 8px; */
  margin-bottom: 0;
  background-color: #fff;
  /* border-radius: 2px; */
  /* margin-top: 43px; */

  overflow-x: auto;
}
</style>
