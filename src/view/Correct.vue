<template>
  <div id="correct">
    <header>
      <div class="back _primary" @click="back">返回</div>
      <div class="kindergarten relative">{{ route.query.kindergarten }}</div>
      <div class="name relative">{{ route.query.name }}</div>
      <el-button class="add-btn absolute" type="primary">新增讲次</el-button>
    </header>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="lecture" label="讲次" width="200" />
      <el-table-column prop="homework" label="作业完成">
        <template #default="{ row }">
          <el-input-number v-model="row.homework" :min="0" :max="6" />
        </template>
      </el-table-column>
      <el-table-column prop="manifestation" label="平时表现">
        <template #default="{ row }">
          <el-input-number v-model="row.manifestation" :min="0" :max="6" />
        </template>
      </el-table-column>
      <el-table-column prop="ability" label="能力检测">
        <template #default="{ row }">
          <el-input-number v-model="row.ability" :min="0" :max="6" />
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
const route = useRoute();
const router = useRouter();
interface TableDataCloumn {
  lecture: string;
  homework: string | number;
  manifestation: string | number;
  ability: string | number;
}
const tableData = ref<TableDataCloumn[]>([]);
const comment = ref<string>('');

onMounted(() => {
  getTableData();
});

const back = async () => {
  const res = await ElMessageBox.confirm('有未保存的数据，是否确认返回？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  });
  if (!res) return;
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
  const res = await ElMessageBox.confirm('将要删除此课件，请确认是否删除？', '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  });
  if (!res) return;
  ElMessage.success('删除成功');
  // const data =await
  getTableData();
};

const confirm = () => {};
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
