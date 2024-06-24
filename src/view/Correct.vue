<template>
  <div id="correct">
    <header>
      <div class="back _primary" @click="back">
        <el-icon>
          <Back />
        </el-icon>
      </div>
      <div class="kindergarten relative">{{ route.query.preschool }}</div>
      <div class="name relative">{{ route.query.userName }}</div>
      <div class="add-btn absolute">
        <el-button type="success" @click="doQuickMark">快速打分</el-button>
        <!-- <el-button type="primary">新增讲次</el-button> -->
      </div>
    </header>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="lecture" label="讲次" width="200" />
      <el-table-column prop="homework" label="作业完成">
        <template #default="{ row }">
          <el-rate v-model="row.homework" :max="6" :colors="colors" />
        </template>
      </el-table-column>
      <el-table-column prop="manifestation" label="平时表现">
        <template #default="{ row }">
          <el-rate v-model="row.manifestation" :max="6" :colors="colors" />
        </template>
      </el-table-column>
      <el-table-column prop="ability" label="能力检测">
        <template #default="{ row }">
          <el-rate v-model="row.ability" :max="6" :colors="colors" />
        </template>
      </el-table-column>
      <el-table-column label="删除讲次">
        <template #default="{ row }">
          <el-button type="danger" @click="del(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="title">老师评语</div>
    <el-input type="textarea" v-model="comment" resize="none" maxlength="220" show-word-limit :rows="6"
      style="height: 20vh"></el-input>
    <el-button class="confirm-btn" type="primary" @click="doConfirm">提交</el-button>
  </div>
  <Confirm ref="confirmRef" @confirm="doSubmit"></Confirm>
  <QuickMark ref="quickMarkRef" @formatMark="formatMark" :tableData="tableData"></QuickMark>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import Confirm from '../components/Confirm.vue';
import QuickMark from '../components/QuickMark.vue';
import type { Result, ListResult } from '../assets/type/common';
const route = useRoute();
const router = useRouter();
import api from '../api';
const { selectCorrectScore, deleteCorrectScore, correctScore } = api;
const tableData = ref<ListResult[]>([]);
const comment = ref<string>('');
const colors = ref<string[]>(['#909399', ' #da9733', '#FF9900']);
const confirmRef = ref<InstanceType<typeof Confirm> | null>(null);
const quickMarkRef = ref<InstanceType<typeof QuickMark> | null>(null);
export interface TempResult {
  correctList: ListResult[];
  comments: string;
  userId: number;
  preschool: string;
  userName: string;
}
const tempResult = ref<TempResult>({
  correctList: [],
  comments: '',
  userId: 0,
  preschool: '',
  userName: '',
});
onMounted(() => {
  getTableData();
});

const back = async () => {
  let flag = false;
  tableData.value.forEach((el: ListResult) => {
    tempResult.value.correctList.forEach((item: ListResult) => {
      if (el.id === item.id) {
        if (
          el.homework !== item.score1 ||
          el.manifestation !== item.score2 ||
          el.ability !== item.score3
        ) {
          flag = true;
        }
      }
    });
  });
  if (tempResult.value.comments != comment.value) {
    flag = true;
  }
  if (flag) {
    try {
      await ElMessageBox.confirm('请确认已提交保存？', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '不保存',
        type: 'warning',
        center: true,
        showClose: false
      });
      // 执行保存的相关操作 
      doSubmit()
    } catch (error) {
      console.log(error)
      if (error === 'cancel') {
        // 用户点击了“取消”按钮或关闭了对话框，执行相应的操作  
        router.push('/');
      } else {
        // 处理其他类型的错误  
        console.error('发生错误:', error);
      }
    }
  } else {
    router.push('/');
  }
};

const getTableData = async () => {
  const res = (await selectCorrectScore({ userId: route.query.id as string })) as Result;
  console.log(res, 'res');
  if (res.code === '10000') {
    res.data.correctList.forEach((el: ListResult) => {
      el.lecture = el.lectureName;
      el.homework = el.score1;
      el.manifestation = el.score2;
      el.ability = el.score3;
    });
    tableData.value = res.data.correctList;
    tempResult.value = res.data;
    comment.value = res.data.comments;
  } else {
    ElMessage.error('获取信息失败');
  }
};
const del = async (val: ListResult) => {
  console.log(val.id, '===>val');
  const result = await ElMessageBox.confirm('删除后不可恢复，请谨慎操作！', '是否删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  });
  if (!result) return;
  console.log()
  const res = (await deleteCorrectScore({ id: val.id })) as Result;
  if (res.code === '10000') {
    ElMessage.success('删除成功');
    getTableData();
  } else {
    ElMessage.error(res.msg || '删除失败');
  }
};
const doConfirm = async () => {
  let flag = false;
  let neverShow: boolean = localStorage.getItem('neverShow') === 'true';
  for (let i = 0; i < tableData.value.length; i++) {
    let el = tableData.value[i];
    if (el.ability === 0 || el.homework === 0 || el.manifestation === 0) {
      flag = true;
      break;
    }
  }
  if (flag && !neverShow) {
    confirmRef.value?.show();
    return;
  }
  //const textL = comment.value.length
  if (!comment.value || /^\s*$/.test(comment.value)) {
    return ElMessage.warning('老师评语不能为空');
  }
  doSubmit();
};
const doSubmit = async () => {
  tempResult.value.correctList = tableData.value;
  tempResult.value.comments = comment.value;
  console.log(tempResult.value.correctList, 'tempResult.value.correctList');
  console.log('submit is invoke');
  tempResult.value.correctList.forEach((el: ListResult) => {
    el.score1 = el.homework;
    el.score2 = el.manifestation;
    el.score3 = el.ability;
  });

  const res = (await correctScore(tempResult.value)) as Result;
  console.log(res, '====>res');
  if (res.code === '10000') {
    try {
      // 显示成功消息  
      ElMessage.success('修改成功');

      // 等待一段时间（可选），以便用户可以看到消息  
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒  

      // 执行路由跳转  
      router.push('/');
    } catch (error) {
      // 处理错误...  
      console.error('修改失败:', error);
      // 可以选择性地显示一个错误消息  
      ElMessage.error('修改失败，请重试！');
    }
  } else {
    ElMessage.error(res.msg || '修改失败');
  }
};
const doQuickMark = () => {
  quickMarkRef.value?.show();
};

const formatMark = (val: ListResult[]) => {
  tableData.value = val;
};
</script>

<style lang="less" scoped>
:deep(.el-table) {
  height: 55vh;
  overflow: auto;
}

:deep(.el-textarea__inner) {
  font-size: 24px;
  height: 18vh;
}

#correct {
  width: 80vw;
  height: 100vh;
  padding: 2% 10%;
  margin: 0 auto;
  background: #fff;

  header {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;

    .back {
      cursor: pointer;
      font-size: 24px;
    }

    .kindergarten {
      left: 100px;
      font-size: 26px;
      font-weight: 700;
    }

    .name {
      font-size: 22px;
      left: 150px;
      font-weight: 500;
    }

    .add-btn {
      right: 20px;
    }
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    margin: 30px 0 10px 0;
  }
}

.confirm-btn {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
}
</style>
