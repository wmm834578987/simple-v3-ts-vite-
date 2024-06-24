<template>
  <div id="index">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="幼儿园">
        <el-select v-model="form.preschool" placeholder="请选择幼儿园" @change="getTableData">
          <el-option :label="item" :value="item" v-for="item in kindergartenList" :key="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="是否批改">
        <el-select v-model="form.isCorrect" placeholder="请选择是否批改" @change="getTableData">
          <el-option label="全部" value="全部" />
          <el-option label="已批改" value="1" />
          <el-option label="未批改" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.userName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="index" label="序号" width="100" />
      <el-table-column prop="preschool" label="幼儿园" width="300" />
      <el-table-column prop="userName" label="姓名" width="150" />
      <el-table-column prop="profilePic" label="头像" width="200">
        <template #default="{ row }">
          <el-upload v-model:file-list="fileList" class="upload-demo" :show-file-list="false" action="#"
            :on-change="fileChange" :auto-upload="false" accept=".png,.jpg">
            <el-image class="avatar" :src="row.profilePic" @click="storeCurrent(row)" alt="" srcset="" lazy>
              <template #error>
                <div class="image-slot">
                  <img :src="defaultImg" class="avatar" alt="" srcset="" @click="storeCurrent(row)" />
                </div>
              </template>
            </el-image>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="correct" label="批改成绩">
        <template #default="{ row }">
          <el-button :type="row.isCorrect ? 'danger' : 'primary'" @click="correct(row)">
            {{ row.isCorrect ? '已批改' : '批改' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="preview" label="预览与导出">
        <template #default="{ row }">
          <el-button type="success" @click="preview(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination v-model:current-page="pageNum" :page-size="pageSize" layout="total, prev, pager, next,jumper"
        :total="total" @current-change="pageNumChange" small />
    </div>

    <el-dialog v-model="dialogVisible" title="图象裁剪" width="50%" top="5vh">
      <VuePictureCropper :boxStyle="{
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f8f8',
        margin: 'auto',
      }" :img="updatedImg" :options="{
  viewMode: 1,
  dragMode: 'crop',
  aspectRatio: 10 / 10,
}" style="height: 80vh"></VuePictureCropper>
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
import type { UploadProps, UploadUserFile, UploadRawFile, UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';
import { getImageUrl, getFileExtension } from '../assets/js/common';
import { LocationQueryRaw, useRouter } from 'vue-router';
import { TableColumn, Result } from '../assets/type/common';
import api from '../api';
const { selectPreschoolList, selectPreschoolUserList, uploadProfilePic } = api;
const router = useRouter();
const fileList = ref<UploadUserFile[]>([]);
const currentFile = ref<UploadUserFile>();
const dialogVisible = ref<boolean>(false);
const kindergartenList = ref<string[]>([]);
const tableData = ref<TableColumn[]>([]);
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
onMounted(() => {
  getPreschoolList();
  getTableData();
});
const row = ref<TableColumn>({
  preschool: '',
  userName: '',
  profilePic: '',
  isCorrect: '',
  id: 0,
});
const form = ref({
  preschool: '全部',
  userName: '',
  isCorrect: '全部',
});

const defaultImg = ref<string>(getImageUrl('transparent.png'));
const updatedImg = ref<string>('');

const fileChange: UploadProps['onChange'] = (file: UploadFile) => {
  const { size, name } = file;
  if (getFileExtension(name) !== 'png' && getFileExtension(name) !== 'jpg') {
    return ElMessage.error('图片格式不正确，请上传PNG或者JPG格式图片');
  }
  if (size && size > 3 * 1024 * 1024) {
    return ElMessage.error('图片不能超过3M');
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
const uploadFile = async (file: UploadRawFile) => {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('userId', row.value.id + '');
  console.log(row.value.id, 'res');
  const res = (await uploadProfilePic(formData)) as Result;
  console.log(res, 'res');
  if (res.code === '10000') {
    getTableData();
    dialogVisible.value = false;
  } else {
    ElMessage.error('上传图象失败');
  }
};
const getCroppedImage = async () => {
  if (!cropper) return;
  const file = (await cropper.getFile({
    fileName: currentFile.value?.name,
  })) as UploadRawFile;
  console.log(file, 'file');
  uploadFile(file);
};
const onSubmit = () => {
  getTableData();
};

const getPreschoolList = async () => {
  const res = (await selectPreschoolList({})) as Result;
  console.log(res, '====>res');
  if (res.code === '10000') {
    kindergartenList.value = res.data;
    kindergartenList.value.unshift('全部');
  } else {
    ElMessage.error('获取幼儿园信息失败');
  }
};

const getTableData = async () => {
  const { isCorrect, preschool, userName } = form.value;
  let param = {
    userName,
    isCorrect: isCorrect === '全部' ? '' : isCorrect,
    preschool: preschool === '全部' ? '' : preschool,
    page: pageNum.value,
    limit: pageSize.value,
  };
  const res = (await selectPreschoolUserList(param)) as Result;
  console.log(res);
  if (res.code === '10000') {
    tableData.value = res.data.data;
    tableData.value.forEach((el, index) => {
      el.index = (pageNum.value - 1) * pageSize.value + index + 1;
      el.profilePic = el.profilePic + '?' + 'cb=' + Math.random();
    });
    total.value = res.data.count;
  } else {
    ElMessage.error('获取数据失败');
  }
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
  width: 80vw;
  height: 100vh;
  padding: 2% 5%;
  //box-sizing: border-box;
  margin: 0 auto;
  background: #fff;

  .avatar {
    width: 80px;
    height: 80px;
  }

  .pagination {
    display: flex;
    justify-content: end;
    margin-top: 15px;
  }
}
</style>
