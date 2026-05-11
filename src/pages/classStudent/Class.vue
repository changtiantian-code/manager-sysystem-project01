<template>
  <div class="class-page">
    <div class="class-search-box">
      <el-form :inline="true" :model="form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="班级名称">
              <el-input
                v-model="form.name"
                placeholder="请输入班级名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="结课时间">
              <el-date-picker
                v-model="form.time"
                type="daterange"
                range-separator="到"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="btn-col">
            <el-form-item>
              <el-row :gutter="20" justify="end">
                <el-col :span="9">
                  <el-button type="primary" @click="onForm('search')"
                    >查询</el-button
                  >
                </el-col>
                <el-col :span="9">
                  <el-button @click="onForm('reset')">清空</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-box">
      <div class="btn-div">
        <el-button :icon="Plus" type="primary" @click="onClass('add', {} as Class)"
          >新建班级</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="400"
        border
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column
          fixed="left"
          label="序号"
          type="index"
          :index="onIndex"
          min-width="70"
        />
        <el-table-column prop="name" label="班级名称" min-width="200" />
        <el-table-column prop="classroom" label="班级教室" width="120" />
        <el-table-column prop="teacherName" label="班主任" width="120" />
        <el-table-column prop="begin" label="开课时间" min-width="200">
          <template #default="{ row }">
            <span>{{ formatTime(row.begin) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="end" label="结课时间" min-width="200"
          ><template #default="{ row }">
            <span>{{ formatTime(row.end) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <span v-if="row.status === 1">未开班</span>
            <span v-if="row.status === 2">在读</span>
            <span v-if="row.status === 3">已结业</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastOperateTime"
          label="最后操作时间"
          min-width="200"
        >
          <template #default="{ row }">
            <span>{{ formatTime(row.lastOperateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="{ row }">
            <el-link
              type="warning"
              class="link-right"
              @click="onClass('edit', row)"
              >编辑</el-link
            >
            <el-link type="warning" @click="onClass('delete', row)"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="pages.page"
        v-model:page-size="pages.pageSize"
        :page-sizes="[100, 200, 300, 400]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.total"
        @size-change="onPageSize"
        @current-change="onPage"
      />

      <el-dialog
        v-model="dialogs.visible"
        :title="dialogs.title"
        width="30%"
        @close="onDialog('cancel')"
      >
        <el-form
          ref="dialogFormRef"
          :model="dialogForm"
          :rules="dialogRuleForm"
          label-width="100px"
        >
          <el-form-item label="班级名称" prop="name">
            <el-input
              v-model="dialogForm.name"
              placeholder="请输入班级名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="班级教室" prop="classroom">
            <el-input
              v-model="dialogForm.classroom"
              placeholder="请输入班级教师"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="开课时间" prop="begin">
            <el-date-picker
              v-model="dialogForm.begin"
              type="datetime"
              placeholder="请选择开课时间"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="结课时间" prop="end">
            <el-date-picker
              v-model="dialogForm.end"
              type="datetime"
              placeholder="请选择结课时间"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="班主任">
            <el-select
              v-model="dialogForm.teacherName"
              placeholder="请选择"
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="master in masterOption"
                :key="master.value"
                :label="master.label"
                :value="master.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="学科" prop="subject">
            <el-select
              v-model="dialogForm.subject"
              placeholder="请选择"
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="sub in subjectOption"
                :key="sub.value"
                :label="sub.label"
                :value="sub.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="onDialog('submit')"
              >保存</el-button
            >
            <el-button @click="onDialog('cancel')">取消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ElButton,
  ElRow,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElLink,
  ElMessageBox,
  ElMessage,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, watch } from "vue";
import { getMaster } from "@/api/emp";
import { getTable, deleteClassById, addClass, getClassById, editClass } from "@/api/class";
import type { Class, classType } from "@/types/class";
import type { OptionItem } from "@/utils/fakes";
import moment from "moment";
import { addOrEditRes } from "@/utils/ways";
import { subjectOption } from "@/utils/fakes";
import type { FormInstance, FormRules } from "element-plus";

const form = reactive({
  name: "",
  time: [] as any[],
});

const tableData = ref<Class[]>([]);
const dialogFormRef = ref<FormInstance>();

const pages = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

const dialogs = reactive({
  type: "",
  title: "",
  visible: false,
});

let dialogForm = reactive({
  id: undefined as number | undefined,
  name: "",
  classroom: "",
  begin: "" as string | Date,
  end: "" as string | Date,
  teacherName: "",
  subject: "" as string | number,
});
const dialogRuleForm = reactive<FormRules>({
  name: [{ required: true, message: "请输入班级名称", trigger: "blur" }],
  classroom: [{ required: true, message: "请输入班级名称", trigger: "blur" }],
  subject: [{ required: true, message: "请选择", trigger: "change" }],
  begin: [
    {
      type: "date",
      required: true,
      message: "请选择开课时间",
      trigger: "change",
    },
  ],
  end: [
    {
      type: "date",
      required: true,
      message: "请选择结课时间",
      trigger: "change",
    },
  ],
});
const masterOption = ref<OptionItem[]>([]);
onMounted(() => {
  initTable();
});


const onIndex = (index: number) => {
  return index + 1 + (pages.page - 1) * pages.pageSize;
};

const formatTime = (time: string | number | Date) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};

const onClass = (type: string, row: Class) => {
  dialogs.type = type;
  switch (type) {
    case "add":
      initMaster();
      add();
      break;
    case "edit":
      initMaster();
      edit(row);
      break;
    case "delete":
      deleteClass(row);
      break;
  }
};

const onDialog = (type: string) => {
  switch (type) {
    case "submit":
      if (dialogs.type === "add") {
        addDialog();
      } else {
        editDialog();
      }
      break;
    case "cancel":
      resetDialog();
      break;
  }
};

const addDialog = async () => {
  if (!dialogFormRef.value) return;
  const valid = await dialogFormRef.value.validate();
  if (!valid) return;
  const res = await addClass({
    ...dialogForm,
    begin: moment(dialogForm.begin).format("YYYY-MM-DD HH:mm:ss"),
    end: moment(dialogForm.end).format("YYYY-MM-DD HH:mm:ss"),
  });
  addOrEditRes({
    type: dialogs.type,
    res: res,
    func: () => resetDialog(),
  });
};

const editDialog = async () => {
  if (!dialogFormRef.value) return;
  const valid = await dialogFormRef.value.validate();
  if (!valid) return;
  const res = await editClass({
    ...dialogForm,
    begin: moment(dialogForm.begin).format("YYYY-MM-DD HH:mm:ss"),
    end: moment(dialogForm.end).format("YYYY-MM-DD HH:mm:ss"),
  });
  addOrEditRes({
    type: dialogs.type,
    res: res,
    func: () => resetDialog(),
  });
};

const resetDialog = () => {
  dialogForm.teacherName = "";
  if (dialogFormRef.value) {
    dialogFormRef.value.resetFields();
  }
  dialogs.title = "";
  dialogs.type = "";
  dialogs.visible = false;
  initTable();
};

const initMaster = async () => {
  const res = await getMaster();
  const { code, data } = res;
  if (code === 1) {
    masterOption.value = data.map((_: any) => {
      return {
        value: _.name,
        label: _.name,
      };
    });
  }
};

const add = () => {
  dialogs.title = "新建班级";
  dialogs.visible = true;
};
const edit = async (row: Class) => {
  const res = await getClassById(row.id);
  if (res.code === 1) {
    dialogForm = reactive({...res.data});
  }
  dialogs.title = "编辑班级";
  dialogs.visible = true;
};
const deleteClass = async (row: Class) => {
  const status = await ElMessageBox.confirm(
    `确定删除该班级：${row.name}?`,
    "",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  );
  if (status === "confirm") {
    const res = await deleteClassById(row.id);
    addOrEditRes({
      type: "delete",
      res: res,
    });
    initTable();
  } else {
    ElMessage.info("取消删除！");
  }
};

const onPage = (page: number) => {
  pages.page = page;
  initTable();
};
const onPageSize = (pageSize: number) => {
  pages.page = 1;
  pages.pageSize = pageSize;
  initTable();
};

const onForm = (type: string) => {
  switch (type) {
    case "search":
      search();
      break;
    case "reset":
      reset();
      break;
  }
};
const search = () => {
  initTable();
};
const reset = () => {
  form.name = "";
  form.time = [];
  pages.page = 1;
  pages.pageSize = 10;
  initTable();
};

const initTable = async () => {
  const params = {
    name: form.name,
    begin:
      form.time.length > 0
        ? moment(form.time[0]).format("YYYY-MM-DD HH:mm:ss")
        : "",
    end:
      form.time.length > 0
        ? moment(form.time[1]).format("YYYY-MM-DD HH:mm:ss")
        : "",
    page: pages.page,
    pageSize: pages.pageSize,
  };
  const res = await getTable(params);
  const { code, data } = res;
  if (code === 1) {
    tableData.value = data.rows;
    pages.total = data.total;
  }
  console.log(res, "res");
};
</script>

<style lang="scss" scoped>
.el-table,
.el-pagination {
  margin-top: 20px;
}
</style>