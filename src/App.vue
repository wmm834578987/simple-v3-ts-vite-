<!--
 * @Author: Mcc
 * @Date: 2024-06-06 09:40:25
 * @LastEditors: mcc 550539422@qq.com
 * @LastEditTime: 2024-06-13 14:58:13
 * @FilePath: \reports\src\App.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by Mcc, All Rights Reserved. 
-->
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
