<template>
  <div class="class-page">
    <div class="table-box">
      <div class="btn-div">
        <el-button :icon="Plus" type="primary" @click="onClick('add')"
          >新增部门</el-button
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
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column prop="name" label="部门名称" />
        <el-table-column
          prop="updateTime"
          label="最后操作时间"
          :formatter="formatData"
        />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-link
              class="link-right"
              type="warning"
              @click="onClick('edit', row)"
              >编辑</el-link
            >
            <el-link type="warning" @click="onClick('delete', row)"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        v-model="dialogs.visible"
        :title="dialogs.title"
        width="40%"
        @close="onClose('close')"
      >
        <el-form ref="formRef" :inline="true" :model="form" :rules="rulesForm">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model.trim="form.name" placeholder="请输入部门名称" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="onClose('cancel')">取消</el-button>
            <el-button type="primary" @click="onClose('submit')"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElTable,
  ElTableColumn,
  ElMessageBox,
  ElMessage,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import moment from "moment";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import type { AddDeptType, Dept } from "@/types/dept";
import { addDept, getDeptTable, deleteDept, getDeptById, editDept } from "@/api/dept";
import { addOrEditRes } from "@/utils/ways"

const form = reactive<AddDeptType>({
  name: "",
});

const rulesForm = reactive<FormRules>({
  name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
});

const tableData = ref<Dept[]>([]);
const formRef = ref<FormInstance>(null);

const dialogs = reactive<{
  title: string;
  visible: boolean;
  type: string;
  row: Partial<Dept>;
}>({
  title: "",
  visible: false,
  type: "",
  row: {}
});

onMounted(() => {
  initTable();
});

const formatData = (row: Dept, column: any) => {
  const date = (row as any)[column.property];
  return date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : "";
};

const onClose = (type: string) => {
  switch (type) {
    case "close":
    case "cancel":
      close();
      break;
    case "submit":
      submit();
      break;
    default:
      break;
  }
};

const submit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (!valid) return;
  try {
    if (dialogs.type === "add") {
      const addRes = await addDept(form);
      addOrEditRes({
        type: dialogs.type,
        res: addRes,
        func: () => close()
      })
    } else if (dialogs.type === "edit") {
      const editRes = await editDept({
        id: dialogs.row?.id,
        name: form.name
      })
      addOrEditRes({
        type: dialogs.type,
        res: editRes,
        func: () => close()
      })
    }
  } catch (e) {
    if (e instanceof Error) {
      ElMessage.error(e.message);
    } else {
      ElMessage.error(String(e));
    }
  }
  initTable();
};



const close = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
  dialogs.title = "";
  dialogs.visible = false;
};

const onClick = (type: string, row?: Dept) => {
  dialogs.type = type;
  switch (type) {
    case "add":
      add();
      break;
    case "edit":
      edit(row);
      break;
    case "delete":
      deleteById(row);
      break;
  }
};

const add = () => {
  dialogs.title = "新建部门";
  dialogs.visible = true;
};
const edit = async (row: Dept) => {
  const res = await getDeptById(row.id);
  const { code, data } = res;
  if (code === 1) {
    dialogs.row = data;
    form.name = data.name;
    dialogs.title ="修改部门";
    dialogs.visible = true;
  }  
};
const deleteById = async (row: Dept) => {
  const status = await ElMessageBox.confirm(`确定删除部门：${row.name}?`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  if (status === "confirm") {
    const res = await deleteDept(row.id);
    addOrEditRes({
        type: dialogs.type,
        res: res,
      })
    initTable();
  } else {
    ElMessage.info("取消删除！");
  }
};

const initTable = async () => {
  try {
    const res = await getDeptTable();
    const { code, data } = res;
    if (code === 1) {
      tableData.value = data;
    }
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message);
    } else {
      ElMessage.error(String(error));
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table,
.el-pagination {
  margin-top: 20px;
}
</style>