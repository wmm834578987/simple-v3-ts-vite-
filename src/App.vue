<template>
  <router-view></router-view>
</template>
<script setup lang="ts"></script>
<style>
@font-face {
  font-family: 'pingfang';
  src: url('./assets/font/PingFangSC.otf');
}
#app {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  overflow-x: hidden;
  background: #ddd;
  font-family: 'pingfang';
}
</style>
