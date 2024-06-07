<template>
  <el-dialog
    v-model="dialogVisible"
    title="确认"
    width="30%"
    :before-close="handleClose"
    top="40vh"
  >
    <p>
      <el-icon class="warning"><WarningFilled /></el-icon> 有项目为0分，请确认是否继续？
    </p>
    <el-checkbox class="cbox" v-model="checked" @change="handleChange" label="不再提示" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            dialogVisible = false;
            emits('confirm');
          "
        >
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineEmits } from 'vue';
const dialogVisible = ref<boolean>(false);
const emits = defineEmits();
const checked = ref<boolean>(false);
const handleClose = () => {
  return;
};
const handleChange = () => {
  localStorage.setItem('neverShow', checked.value + '');
};
const show = () => {
  dialogVisible.value = true;
};
defineExpose({ show });
</script>

<style lang="less" scoped>
p {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 10px;
}
.warning {
  color: #e6a23c;
  font-size: 24px;
  margin-right: 10px;
}
.cbox {
  position: absolute;
  left: 20px;
}
</style>
