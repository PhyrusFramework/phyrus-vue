<template>
  <div
    class="dropdown"
    :class="{ disabled: disabled }"
    @click="toggleDropdown"
    @focusout="hideDropdown"
    tabindex="0"
  >
    <div class="mark">
      <div :style="{color: color}">{{ mark }}</div>
      <svg
        v-if="showArrow"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-chevron-down"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
    <transition name="fade">
      <div class="panel" :style="{ width: width, height: height }" v-if="show">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script src="./dropdown.js"></script>
<style scoped src="./dropdown.css"></style>