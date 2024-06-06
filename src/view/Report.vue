<template>
  <div id="index">
    <div class="back _primary" @click="back">
      <el-icon><Back /></el-icon>
    </div>
    <el-button type="primary" class="export-btn" @click="exportImg">导出所有图片</el-button>
    <div class="table-part" :id="`part${item + 1}`" v-for="item in getPages()" :key="item">
      <div class="profile-box">
        <img src="../assets/img/sun.png" class="profile" alt="" />
        <img class="decoration" src="../assets/img/decoration.png" />
        <div class="name-input">
          <div class="name-input-item"><span>姓名</span> {{ route.query.name }}</div>
          <div class="name-input-item"><span>幼儿园</span> {{ route.query.kindergarten }}</div>
        </div>
      </div>
      <div class="name"></div>
      <CommonTable
        :index="item"
        :count="item == getPages() ? (total % 7 == 0 ? 7 : total % 7) : 7"
        class="table"
      ></CommonTable>
    </div>
    <div id="part1">
      <div class="title-common">
        <img src="../assets/img/ability.png" alt="" srcset="" />
      </div>
      <div id="charts"></div>
      <div class="profile-box avatar">
        <img src="../assets/img/sun.png" class="profile" alt="" />
        <img class="decoration" src="../assets/img/decoration.png" />
        <div class="name-input">
          <div class="name-input-item"><span>姓名</span> {{ route.query.name }}</div>
          <div class="name-input-item"><span>幼儿园</span> {{ route.query.kindergarten }}</div>
        </div>
      </div>
      <div class="title-common child2">
        <img src="../assets/img/advice.png" alt="" srcset="" />
      </div>
      <el-input type="textarea" class="advice" resize="none" disabled v-model="advice"></el-input>
      <div class="title-common child3">
        <img src="../assets/img/comment.png" alt="" srcset="" />
      </div>
      <el-input
        type="textarea"
        class="advice comment"
        resize="none"
        disabled
        v-model="comment"
      ></el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
import { toPng } from 'html-to-image';
import { downloadImage } from '../assets/js/common';
import CommonTable from '../components/CommonTable.vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const advice = ref<string>('');
const comment = ref<string>('');
const total = ref<number>(14);
onMounted(() => {
  console.log(route.query);
  init();
});

const init = () => {
  let myChart = echarts.init(document.getElementById('charts'));
  let option = {
    title: {
      text: '',
    },

    radar: {
      // shape: 'circle',
      indicator: [
        { max: 36, name: '专注力' },
        { max: 36, name: '记忆力' },
        { max: 36, name: '动手能力' },
        { max: 36, name: '观察能力' },
        { max: 36, name: '识图能力' },
        { max: 36, name: '表达能力' },
        { max: 36, name: '计算能力' },
        { max: 36, name: '推理能力' },
      ],
      startAngle: 22.5, // 设置雷达图旋转角度
      name: {
        color: '#000', // 设置周围文字颜色为蓝色
      },
    },
    series: [
      {
        name: '',
        type: 'radar',
        data: [
          {
            value: [26, 22, 14, 27, 8, 16, 4, 34],
            name: '',
            areaStyle: {
              color: '#f2deaa',
            },
            lineStyle: {
              color: '#f2be5d',
              width: 2,
            },
            itemStyle: {
              color: '#f47134', // 设置连接点颜色为黑色
            },
          },
        ],
      },
    ],
  };
  myChart.setOption(option);
};

const getPages = (): number => {
  return Math.ceil(total.value / 7);
};

const exportImg = async () => {
  for (let i = 0; i < getPages() + 1; i++) {
    let el = document.querySelector(`#part${i + 1}`) as HTMLDivElement;
    const img = await toPng(el);
    let { kindergarten, name } = route.query;
    console.log(i, '====。i');
    downloadImage(
      img,
      `${kindergarten as string}(${name})` + `_${i + 1}_${getPages() + 1}` + '.png'
    );
  }
};
const back = () => {
  router.push('/');
};
</script>

<style lang="less" scoped>
.decoration {
  width: 32px;
  height: 32px;
}
#index {
  width: 100vw;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  #part1 {
    width: 770px;
    height: 1080px;
    background: url('../assets/img/bg1.png') no-repeat;
    background-size: 100% 100%;
    margin-bottom: 10px;
    position: relative;
    #charts {
      width: 600px;
      height: 400px;
      position: absolute;
      top: 400px;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .title-common {
      position: absolute;
      left: 70px;
      top: 200px;
      img {
        height: 30px;
      }
    }
    .child2 {
      top: 570px;
    }
    .child3 {
      top: 760px;
    }
    .avatar {
      left: 9%;
      top: 8%;
    }

    .advice {
      width: 83%;
      margin: 0 auto;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 612px;
      :deep(.el-textarea__inner) {
        height: 120px;
        font-size: 24px;
        box-shadow: none;
        border: 3px solid #f0c03d;
        background-color: #fff;
      }
    }
    .comment {
      top: 800px;
      :deep(.el-textarea__inner) {
        height: 210px;
        font-size: 24px;
        box-shadow: none;
        border: 3px solid #f0c03d;
      }
    }
    .username {
      top: 113px;
      width: 70%;
      left: 52%;
      :deep(.el-input__wrapper) {
        height: 60px;
        font-size: 24px;
        border: none;
        box-shadow: none;
        background: #f9f3d3;
        border-radius: 10px;
        padding-left: 50px;
      }
    }
  }
  .profile-box {
    position: relative;
    z-index: 5;
    left: 10px;
    .profile {
      position: absolute;
      z-index: 9;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: yellow;
    }
    .decoration {
      position: absolute;
      z-index: 10;
    }
    .name-input {
      position: absolute;
      width: 500px;
      margin: 0 auto;
      position: absolute;
      z-index: 4;
      left: 10%;
      top: 24px;
      height: 60px;
      font-size: 22px;
      line-height: 60px;
      background: #f9f3d3;
      border-radius: 10px;
      padding-left: 50px;
      display: flex;
      .name-input-item {
        margin-right: 40px;
        span {
          font-size: 20px;
          color: #bbb;
          margin-right: 10px;
        }
      }
    }
  }
  .table-part {
    width: 770px;
    height: 1080px;
    background: url('../assets/img/bg2.png') no-repeat;
    background-size: 100% 100%;
    margin-bottom: 10px;
    position: relative;
    padding-top: 5.5%;
    padding-left: 55px;
    box-sizing: border-box;
  }

  .table {
    width: 92%;
    margin-top: 15%;
  }
}
.export-btn {
  position: fixed;
  right: 20%;
  top: 20px;
}

.back {
  position: fixed;
  top: 20px;
  left: 20%;
  font-size: 30px;
  cursor: pointer;
}
</style>
