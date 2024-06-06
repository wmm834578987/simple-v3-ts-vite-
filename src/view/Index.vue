<template>
  <div id="index">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="幼儿园">
        <el-select v-model="form.kindergarten" placeholder="请选择幼儿园">
          <el-option
            :label="item.key"
            :value="item.value"
            v-for="item in kindergartenList"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否批改">
        <el-select v-model="form.correct" placeholder="请选择是否批改">
          <el-option label="全部" value="all" />
          <el-option label="已批改" value="1" />
          <el-option label="未批改" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="index" label="序号" width="100" />
      <el-table-column prop="kindergarten" label="幼儿园" width="300" />
      <el-table-column prop="name" label="姓名" width="150" />
      <el-table-column prop="avatar" label="头像" width="200">
        <template #default="{ row }">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :show-file-list="false"
            action="#"
            :on-change="fileChange"
            :auto-upload="false"
            accept=".png,.jpg"
          >
            <img
              class="avatar"
              v-if="row.avatar"
              :src="row.avatar"
              @click="storeCurrent(row)"
              alt=""
              srcset=""
            />

            <img
              class="avatar"
              v-else
              :src="defaultImg"
              @click="storeCurrent(row)"
              alt=""
              srcset=""
            />
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="correct" label="批改成绩">
        <template #default="{ row }">
          <el-button :type="row.has ? 'danger' : 'primary'" @click="correct(row)">
            {{ row.has ? '已批改' : '批改' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="preview" label="预览与导出">
        <template #default="{ row }">
          <el-button type="success" @click="preview(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNum"
      :page-size="pageSize"
      layout="total, prev, pager, next,jumper"
      :total="total"
      @current-change="pageNumChange"
      small
      class="pagination"
    />
    <el-dialog v-model="dialogVisible" title="图象裁剪" width="50%" top="5vh">
      <VuePictureCropper
        :boxStyle="{
          width: '100%',
          height: '100%',
          backgroundColor: '#f8f8f8',
          margin: 'auto',
        }"
        :img="updatedImg"
        :options="{
          viewMode: 1,
          dragMode: 'crop',
          aspectRatio: 10 / 10,
        }"
        style="height: 80vh"
      ></VuePictureCropper>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="getCroppedImage"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { UploadProps, UploadUserFile, UploadRawFile, UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';
import { getImageUrl, getFileExtension } from '../assets/js/common';
import { LocationQueryRaw, useRouter } from 'vue-router';
interface TableColumn {
  kindergarten: string;
  name: string;
  avatar: string;
  index?: number;
  has: string | number | boolean;
}
const router = useRouter();
const fileList = ref<UploadUserFile[]>([]);
const currentFile = ref<UploadUserFile>();
const dialogVisible = ref<boolean>(false);
const kindergartenList = ref([
  { key: '全部', value: 'all' },
  { key: '学田', value: '1' },
  { key: '学士府', value: '2' },
  { key: '龚路', value: '3' },
]);
const tableData = ref<TableColumn[]>([]);
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
onMounted(() => {
  getTableData();
});
const row = ref<TableColumn>({
  kindergarten: '',
  name: '',
  avatar: '',
  has: false,
});
const form = ref({
  kindergarten: 'all',
  name: '',
  correct: 'all',
});

const defaultImg = ref<string>(getImageUrl('transparent.png'));
const updatedImg = ref<string>('');

const fileChange: UploadProps['onChange'] = (file: UploadFile) => {
  const { size, name } = file;
  if (size && size > 3 * 1024 * 1024) {
    return ElMessage.error('图片不能超过3M');
  }
  if (getFileExtension(name) !== 'png' && getFileExtension(name) !== 'jpg') {
    return ElMessage.error('图片格式不正确，请上传PNG或者JPG格式图片');
  }
  currentFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    let img = new Image();
    img.src = e.target?.result as string;
    img.onload = () => {
      updatedImg.value = img.src;
      dialogVisible.value = true;
    };
  };
  reader.readAsDataURL(file.raw as UploadRawFile);
};

const storeCurrent = (current: TableColumn) => {
  console.log(current, 'current');
  row.value = current;
};
const uploadFile = (file: UploadRawFile) => {
  console.log(file);
};
const getCroppedImage = async () => {
  if (!cropper) return;
  const base64 = cropper.getDataURL();
  const blob: Blob | null = await cropper.getBlob();
  if (!blob) return;
  const file = (await cropper.getFile({
    fileName: currentFile.value?.name,
  })) as UploadRawFile;
  uploadFile(file);
  row.value.avatar = base64;
  dialogVisible.value = false;
  //   console.log({ base64, blob, file });
};
const onSubmit = () => {
  getTableData();
};

const getTableData = async () => {
  tableData.value = [];
  let param = { ...form.value, pageNum: pageNum.value, pageSize: pageSize.value };
  console.log(param);
  for (let index = 0; index < 10; index++) {
    let obj = {
      kindergarten: '学田幼儿园',
      name: 'ber ber',
      avatar: '',
      index: (pageNum.value - 1) * pageSize.value + index + 1,
      has: index % 2 == 0,
    };
    tableData.value.push(obj);
  }
  total.value = 134;
};

const pageNumChange = (val: number) => {
  pageNum.value = val;
  getTableData();
};

const correct = (val: TableColumn) => {
  router.push({
    path: '/correct',
    query: val as unknown as LocationQueryRaw,
  });
};

const preview = (val: TableColumn) => {
  router.push({
    path: '/report',
    query: val as unknown as LocationQueryRaw,
  });
};
</script>

<style lang="less" scoped>
:deep(.el-select) {
  width: 200px;
}

:deep(.el-table) {
  height: 85vh;
  overflow: auto;
}
:deep(.el-form) {
  display: flex;
  justify-content: flex-end;
}
#index {
  width: 100vw;
  height: 100vh;
  padding: 2% 10%;
  box-sizing: border-box;
  .avatar {
    width: 80px;
    height: 80px;
  }
  .pagination {
    position: fixed;
    right: 10%;
    bottom: 20px;
  }
}
</style>
