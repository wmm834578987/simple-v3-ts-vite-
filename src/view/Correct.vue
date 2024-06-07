<template>
  <div id="correct">
    <header>
      <div class="back _primary" @click="back">
        <el-icon><Back /></el-icon>
      </div>
      <div class="kindergarten relative">{{ route.query.kindergarten }}</div>
      <div class="name relative">{{ route.query.name }}</div>
      <div class="add-btn absolute">
        <el-button type="success" @click="doQuickMark">快速打分</el-button>
        <el-button type="primary">新增讲次</el-button>
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
    <el-input
      type="textarea"
      v-model="comment"
      resize="none"
      maxlength="300"
      show-word-limit
      :rows="6"
    ></el-input>
    <el-button class="confirm-btn" type="primary" @click="confirm">确认修改</el-button>
  </div>
  <Confirm ref="confirmRef" @confirm="doSubmit"></Confirm>
  <QuickMark ref="quickMarkRef" @formatMark="formatMark" :tableData="tableData"></QuickMark>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import Confirm from '../components/Confirm.vue';
import QuickMark from '../components/QuickMark.vue';
import type { TableDataCloumn } from '../assets/type/common';
const route = useRoute();
const router = useRouter();

const tableData = ref<TableDataCloumn[]>([]);
const comment = ref<string>('');
const colors = ref<string[]>(['#909399', ' #da9733', '#FF9900']);
const confirmRef = ref<InstanceType<typeof Confirm> | null>(null);
const quickMarkRef = ref<InstanceType<typeof QuickMark> | null>(null);
onMounted(() => {
  getTableData();
});

const back = async () => {
  // const res = await ElMessageBox.confirm('有未保存的数据，是否确认返回？', '提示', {
  //   confirmButtonText: '确认',
  //   cancelButtonText: '取消',
  //   type: 'warning',
  // });
  // if (!res) return;

  router.push('/');
};

const getTableData = () => {
  for (let index = 0; index < 14; index++) {
    tableData.value.push({
      lecture: '第一讲',
      homework: 0,
      manifestation: 0,
      ability: 0,
    });
  }
};
const del = async (val: TableDataCloumn) => {
  console.log(val, '===>val');
  const res = await ElMessageBox.confirm('删除后不可恢复，请谨慎操作！', '是否删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  });
  if (!res) return;
  ElMessage.success('删除成功');
  // const data =await
  getTableData();
};
const confirm = async () => {
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
  doSubmit();
};
const doSubmit = () => {
  console.log('submit is invoke');
  router.push('/');
};
const doQuickMark = () => {
  quickMarkRef.value?.show();
};

const formatMark = (val: TableDataCloumn[]) => {
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
}
#correct {
  width: 100vw;
  height: 100vh;
  padding: 2% 10%;
  box-sizing: border-box;
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
