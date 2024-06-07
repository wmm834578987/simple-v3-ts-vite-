<template>
  <div class="my-table">
    <div class="th">
      <div class="tr" v-for="item in thList" :key="item">{{ item }}</div>
    </div>
    <div class="tb" v-for="item in tbList" :key="item.index">
      <div class="tr">第{{ item.index }}讲</div>
      <div class="tr">
        <div class="context">{{ item.context }}</div>
      </div>
      <div class="tr">
        <img :src="el" alt="" v-for="el in getRate(item.rate1, 'pen')" :key="el" />
      </div>
      <div class="tr">
        <img :src="el" alt="" v-for="el in getRate(item.rate2, 'flower')" :key="el" />
      </div>
      <div class="tr">
        <img :src="el" alt="" v-for="el in getRate(item.rate3, 'sun')" :key="el" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { getImageUrl } from '../assets/js/common';
const props = defineProps(['index', 'count']);
console.log(props);
interface TbList {
  index?: number;
  context?: string;
  rate1: number;
  rate2: number;
  rate3: number;
}
const thList = ref<string[]>(['讲次', '知识点与易错点', '作业完成', '平时表现', '能力检测']);
const tbList = ref<TbList[]>([]);
for (let i = 0; i < props.count; i++) {
  tbList.value.push({
    index: (props.index - 1) * 7 + i + 1,
    context:
      '知识点：量时头对齐，再看数，遇到断尺数格子使用格子尺测量物品 \n易错点：相近干扰选项需满足多个条件时，只考虑一个角度',
    rate1: Math.floor(Math.random() * 7),
    rate2: Math.floor(Math.random() * 7),
    rate3: Math.floor(Math.random() * 7),
  });
}
const getRate = (r: number, type: string): string[] => {
  const list = '000000111111'.slice(6 - r, 12 - r);
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    let res = list[i] === '0' ? getImageUrl(type + '.png') : getImageUrl(type + '-shadow.png');
    arr.push(res);
  }
  return arr;
};
</script>

<style lang="less" scoped>
.my-table {
  width: 100%;
  .th {
    display: flex;
    height: 44px;
    line-height: 44px;
    background-color: #f0c03d;
    border-radius: 20px 20px 0 0;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }
  .tr {
    text-align: center;
    border-right: 1px solid #fff;
    display: flex;
    flex-wrap: wrap;
    padding: 3px;
    box-sizing: border-box;
    flex: 1;
    justify-content: center;
    align-items: center;
    align-content: center;
    &:nth-child(1) {
      flex: 0.5;
    }
    &:nth-child(2) {
      flex: 2.5;
    }
  }
  .tb {
    // display: grid;
    // grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
    display: flex;
    height: 108px;
    line-height: 100px;
    background: #f9f3d3;
    border-bottom: 1px solid #fff;
    &:last-child {
      border-radius: 0 0 20px 20px;
    }
  }
}
img {
  width: 30px;
  height: 30px;
  margin: 3px 0;
}
.context {
  line-height: 25px;
  text-align: left;
  white-space: pre-line;
  word-break: break-all;
  font-size: 14px;
}
</style>
