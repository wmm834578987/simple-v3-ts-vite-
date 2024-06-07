<template>
  <el-dialog v-model="dialogVisible" v-if="dialogVisible" title="快速打分" width="50%" top="7vh">
    <ul>
      <li class="item header">
        <div></div>
        <div>作业完成</div>
        <div>平时表现</div>
        <div>能力检测</div>
      </li>
      <li class="item">
        <div>全部</div>
        <el-input-number
          :min="0"
          :max="6"
          @change="handleChange(MARK['homework'])"
          v-model="form.homework"
        ></el-input-number>
        <el-input-number
          :min="0"
          :max="6"
          @change="handleChange(MARK['manifestation'])"
          v-model="form.manifestation"
        ></el-input-number>
        <el-input-number
          :min="0"
          :max="6"
          @change="handleChange(MARK['ability'])"
          v-model="form.ability"
        ></el-input-number>
      </li>
      <el-divider />
      <li v-for="(item, index) in data" :key="index" class="item">
        <div>{{ item.lecture }}</div>
        <el-input-number :min="0" :max="6" v-model="item.homework"></el-input-number>
        <el-input-number :min="0" :max="6" v-model="item.manifestation"></el-input-number>
        <el-input-number :min="0" :max="6" v-model="item.ability"></el-input-number>
      </li>
    </ul>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { TableDataCloumn, MARK } from '../assets/type/common';
const props = defineProps(['tableData']);
const emits = defineEmits();
const data = ref<TableDataCloumn[]>([]);

const form = ref<TableDataCloumn>({
  homework: 0,
  manifestation: 0,
  ability: 0,
  lecture: '',
});

const dialogVisible = ref<boolean>(false);
const handleChange = (type: MARK) => {
  data.value.forEach((el: TableDataCloumn) => {
    el[type] = form.value[type];
  });
};
const show = () => {
  data.value = JSON.parse(JSON.stringify(props.tableData));
  form.value.ability = 0;
  form.value.manifestation = 0;
  form.value.homework = 0;
  dialogVisible.value = true;
};
const confirm = () => {
  dialogVisible.value = false;
  emits('formatMark', data.value);
};
defineExpose({ show });
</script>

<style lang="less" scoped>
.item {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 2fr;
  gap: 10px 80px;
  margin-bottom: 10px;
}
.header {
  font-size: 18px;
}
</style>
