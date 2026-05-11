<template>
  <div class="class-page">
    <div class="class-search-box">
      <el-form :inline="true" :model="form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input
                v-model="form.name"
                placeholder="请输入学员姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最高学历">
              <el-select
                v-model="form.degree"
                placeholder="请选择"
                style="width: 200px"
                :teleported="false"
              >
                <el-option
                  v-for="item in degreeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属班级">
              <el-select
                v-model="form.clazzId"
                placeholder="请选择"
                style="width: 200px"
                clearable
                filterable
                remote
                reserve-keyword
                :remote-method="onRemoteMethod"
                :teleported="false"
              >
                <el-option
                  v-for="item in classOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="btn-col">
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
        <el-button :icon="Plus" type="primary" @click="onClass('add')"
          >添加学员</el-button
        >
        <el-button :icon="Minus" :disabled="isDeleteDisabled" type="primary" @click="onClass('deletes')"
          >批量删除</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="400"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        @selection-change="onSelectTable"
      >
        <el-table-column type="selection" min-width="55" />
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="no" label="学号" min-width="120" />
        <el-table-column prop="clazzName" label="班级" min-width="200" />
        <el-table-column prop="gender" label="性别" min-width="60">
          <template #default="{ row }">
            <span v-if="row.gender === 1">男</span>
            <span v-if="row.gender === 2">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="degree" label="最高学历" min-width="80">
          <template #default="{ row }">
            <span>
              {{ degreeOption.find((_) => _.value === row.degree)?.label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="violationCount"
          label="违纪次数"
          min-width="120"
        />
        <el-table-column
          prop="violationScore"
          label="违纪扣分"
          min-width="120"
        />
        <el-table-column prop="updateTime" label="最后操作时间" min-width="200">
          <template #default="{ row }">
            <span>{{ formatTime(row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="180">
          <template #default="{ row }">
            <el-link
              class="link-right"
              type="warning"
              @click="onClass('edit', row)"
              >编辑</el-link
            >
            <el-link
              class="link-right"
              type="warning"
              @click="onClass('violation', row)"
              >违纪</el-link
            >
            <el-link
              class="link-right"
              type="warning"
              @click="onClass('delete', row)"
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
        @size-change="onPage"
        @current-change="onPageSize"
      />

      <el-dialog
        v-model="dialogs.visible"
        :title="dialogs.title"
        width="50%"
        @close="resetDialogs()"
      >
        <el-form
          ref="dialogFormRef"
          :model="dialogForm"
          :rules="dialogRuleForm"
          label-width="100px"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="dialogForm.name"
                  placeholder="请输入姓名"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学号" prop="no">
                <el-input
                  v-model="dialogForm.no"
                  placeholder="请输入学号"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select
                  v-model="dialogForm.gender"
                  placeholder="请选择"
                  clearable
                  :teleported="false"
                >
                  <el-option
                    v-for="gender in genderOption"
                    :key="gender.value"
                    :label="gender.label"
                    :value="gender.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input
                  v-model="dialogForm.phone"
                  placeholder="请输入员工手机号"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="身份证号">
                <el-input
                  v-model="dialogForm.idCard"
                  placeholder="请输入身份证号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否院校学员">
                <el-select
                  v-model="dialogForm.isCollege"
                  placeholder="请选择"
                  clearable
                  :teleported="false"
                >
                  <el-option
                    v-for="collect in collectOption"
                    :key="collect.value"
                    :label="collect.label"
                    :value="collect.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系地址">
                <el-input
                  v-model="dialogForm.address"
                  placeholder="请输入联系地址"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最高学历">
                <el-select v-model="dialogForm.degree" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in degreeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="毕业时间" class="date-box">
                <el-date-picker
                  v-model="dialogForm.gradutionDate"
                  type="date"
                  placeholder="请选择毕业时间"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属班级">
                <el-select 
                v-model="dialogForm.clazzId" 
                placeholder="请选择"
                clearable
                filterable
                remote
                reserve-keyword
                :remote-method="onRemoteMethod"
                :teleported="false"
                >
                  <el-option
                    v-for="item in classOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
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
  ElSelect,
  ElOption,
  ElMessageBox,
  ElMessage,
} from "element-plus";
import { Plus, Minus } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, computed } from "vue";
import {
  getStudentTable,
  deleteStudentById,
  deleteStudentByIds,
  violationStudentById,
  addStudent,
  getStudentById,
  editStudent,
} from "@/api/student";
import { getClass } from "@/api/class";
import {
  genderOption,
  jobOption,
  degreeOption,
  collectOption,
} from "@/utils/fakes";
import { formatTime, addOrEditRes } from "@/utils/ways";
import type { FormInstance, FormRules } from "element-plus";
import type { Student, StudentParamsType } from "@/types/student";
import type { Class } from "@/types/class";
import { log } from "echarts/types/src/util/log.js";
import { debug } from "console";

const isDeleteDisabled = computed(() => {
  return selectTable.value.length === 0
})
const form = reactive({
  name: "",
  degree: "" as string | number,
  clazzId: "" as string | number,
});

const tableData = ref<Student[]>([]);
const classOption = ref<Class[]>([]);
const dialogFormRef = ref<FormInstance>();
const selectTable = ref<Student[]>([]);

let dialogForm = reactive({
  name: "",
  no: "",
  gender: "" as string | number,
  phone: "",
  degree: "" as string | number,
  clazzId: "" as string | number,
  idCard: "",
  isCollege: "" as string | number,
  address: "",
  gradutionDate: "",
});

const dialogRuleForm = reactive({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  no: [{ required: true, message: "请输入学号", trigger: "blur" }],
  gender: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value === 1 || value === 2) {
          callback();
        } else {
          callback(new Error("请选择"));
        }
      },
      trigger: "change",
    },
  ],
  phone: [
    { required: true, message: "请输入员工手机号", trigger: "blur" },
    {
      trigger: "blur",
      validator: (_rule: any, value: any, callback: any) => {
        const reg = /^1[3-9]\d{9}$/;
        if (!value) {
          callback(new Error("请输入手机号"));
        } else if (!reg.test(value)) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      },
    },
  ],
  degree: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  clazzId: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
  ],
});

const dialogs = reactive({
  type: "",
  title: "",
  visible: false,
});
const pages = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  initTable();
});

const onClass = (type: string, row?: Student) => {
  dialogs.type = type;
  switch (type) {
    case "add":
      add();
      break;
    case "edit":
      edit(row);
      break;
    case "violation":
      violation(row);
      break;
    case "delete":
      deleteById(row);
      break;
    case "deletes":
      deleteByIds();
      break;
  }
};

const violation = async (row: Student) => {
  const status = await ElMessageBox.confirm("确定要记违纪吗？", "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });

  if (status === "confirm") {
    const res = await violationStudentById(row.id);
    console.log(res, 1);
  } else {
    ElMessage.info("取消删除！");
  }

  initTable();
};
const add = () => {
  dialogs.title = "新建学员";
  dialogs.visible = true;
};
const edit = async (row: Student) => {
  const res = await getStudentById(row.id);
  if (res.code === 1) {
    dialogForm = reactive(res.data)
    console.log(dialogForm, 1);
    dialogs.title = "修改学员";
    dialogs.visible = true;
  }
};
const deleteById = async (row: Student) => {
  const status = await ElMessageBox.confirm("确定删除该学员吗？", "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });

  if (status === "confirm") {
    const res = await deleteStudentById(row.id);
    addOrEditRes({
      type: "delete",
      res: res,
    });
  } else {
    ElMessage.info("取消删除！");
  }

  initTable();
};
const deleteByIds = async () => {
  const status = await ElMessageBox.confirm("确定删除吗？", "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });

  if (status === "confirm") {
    const ids = selectTable.value.map((_) => _.id);
    const res = await deleteStudentByIds(ids);
    addOrEditRes({
      type: "delete",
      res: res,
    });
  } else {
    ElMessage.info("取消删除！");
  }

  initTable();
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
      resetDialogs();
      break;
  }
};

const addDialog = async () => {
  if (!dialogFormRef.value) return;
  const valid = await dialogFormRef.value.validate();
  if (!valid) return;
  dialogForm.gradutionDate = formatTime(dialogForm.gradutionDate);
  const res = await addStudent(dialogForm);
  addOrEditRes({
    type: dialogs.type,
    res: res,
    func: () => {
      resetDialogs();
      initTable();
    },
  });
};

const editDialog = async () => {
  if (!dialogFormRef.value) return;
  const valid =  await dialogFormRef.value.validate();
  if (!valid) return;
  dialogForm.gradutionDate = dialogForm.gradutionDate ? formatTime(dialogForm.gradutionDate) : "";
  const res = await editStudent(dialogForm);
  addOrEditRes({
    type: dialogs.type,
    res: res,
    func: () => {
      resetDialogs();
      initTable();
    },
  });
};

const resetDialogs = () => {
  if (!dialogFormRef.value) return;
  dialogForm.degree = "";
  dialogForm.gender = "";
  dialogForm.idCard = "";
  dialogForm.isCollege = "";
  dialogForm.name = "";
  dialogForm.no = "";
  dialogForm.gradutionDate = "";
  dialogForm.clazzId = "";
  dialogForm.address = "";
  dialogForm.phone = "";
  dialogFormRef.value.resetFields();
  dialogs.title = "";
  dialogs.type = "";
  dialogs.visible = false;
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
  form.degree = "";
  form.clazzId = "";
  pages.page = 1;
  pages.pageSize = 10;
  initTable();
};
const onSelectTable = (val) => {
  selectTable.value = val;
};

const onRemoteMethod = async (key: string) => {
  if (key !== "") {
    const res = await getClass(key);
    if (res.code === 1) {
      classOption.value = res.data;
    }
  }
};
const initTable = async () => {
  const params = {
    name: form.name,
    degree: form.degree,
    clazzId: form.clazzId,
    page: pages.page,
    pageSize: pages.pageSize,
  };
  const res = await getStudentTable(params);
  const { code, data } = res;
  if (code === 1) {
    pages.total = data.total;
    tableData.value = data.rows;
  }
};
</script>

<style scoped>
.el-table,
.el-pagination {
  margin-top: 20px;
}

.date-box .el-date-editor.el-input,
.date-box .el-date-editor.el-input__wrapper {
  width: var(--el-input-width) !important;
}
</style>