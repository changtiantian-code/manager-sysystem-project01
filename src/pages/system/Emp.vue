<template>
  <div class="class-page">
    <div class="class-search-box">
      <el-form :inline="true" :model="form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input
                v-model="form.name"
                placeholder="请输入员工姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别">
              <el-select
                v-model="form.gender"
                placeholder="请选择"
                style="width: 200px"
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
          <el-col :span="6">
            <el-form-item label="入职时间">
              <el-date-picker
                v-model="form.time"
                type="daterange"
                range-separator="到"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                clearable
              />
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
        <el-button :icon="Plus" type="primary" @click="onClick('add')"
          >新增员工</el-button
        >
        <el-button
          :disabled="isDisabled"
          :icon="Minus"
          type="primary"
          @click="onClick('delete', '')"
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
        <el-table-column prop="gender" label="性别" min-width="120">
          <template #default="{ row }">
            <span>{{ row.gender === 1 ? "男" : "女" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="头像" min-width="120">
          <template #default="{ row }">
            <el-image
              style="width: 100px; height: 100px"
              :src="row.image"
              fit="fill"
            />
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="所属部门" min-width="120" />
        <el-table-column prop="zip" label="职位" min-width="120">
          <template #default="{ row }">
            <span>{{ jobType(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zip" label="入职时间" min-width="200">
          <template #default="{ row }">
            <span>{{ formatTime(row.entryDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zip" label="最后操作时间" min-width="200">
          <template #default="{ row }">
            <span>{{ formatTime(row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
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
      <el-pagination
        v-model:currentPage="pages.page"
        v-model:page-size="pages.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.total"
        @size-change="onPageSize"
        @current-change="onPage"
      />

      <el-dialog v-model="dialogs.visible" :title="dialogs.title" width="50%" @close="resetDialogs()">
        <el-form
          ref="dialogFormRef"
          :model="dialogForm"
          :rules="dialogRuleForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="dialogForm.username"
                  placeholder="请输入员工用户名， 2-20个字"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="dialogForm.name"
                  placeholder="请输入员工姓名， 2-20个字"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
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
            <el-col :span="10">
              <el-form-item label="手机号" prop="phone">
                <el-input
                  v-model="dialogForm.phone"
                  placeholder="请输入员工手机号"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="职位">
                <el-select
                  v-model="dialogForm.job"
                  placeholder="请选择"
                  clearable
                  :teleported="false"
                >
                  <el-option
                    v-for="job in jobOption"
                    :key="job.value"
                    :label="job.label"
                    :value="job.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="薪资">
                <el-input
                  v-model="dialogForm.salary"
                  placeholder="请输入员工薪资"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="所属部门">
                <el-select
                  v-model="dialogForm.deptId"
                  placeholder="请选择"
                  clearable
                  :teleported="false"
                >
                  <el-option
                    v-for="dept in deptOption"
                    :key="dept.value"
                    :label="dept.label"
                    :value="dept.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="入职日期">
                <el-date-picker
                  v-model="dialogForm.entryDate"
                  type="date"
                  placeholder="请选择入职时间"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="头像">
                <el-row style="width: 100%">
                  <el-col :span="10">
                    <el-upload
                      ref="empUploadRef"
                      :action="actionUrl"
                      :headers="headers"
                      list-type="picture-card"
                      accept=".jpg, .jpeg, .png"
                      :show-file-list="false"
                      :before-upload="onBeforeUpload"
                      :on-success="onSuccess"
                    >
                      <img
                        class="avatar"
                        v-if="dialogForm.image"
                        :src="dialogForm.image"
                      />
                      <el-icon v-else><Plus /></el-icon>
                    </el-upload>
                  </el-col>
                  <el-col :span="14">
                    <span>图片大小不超过2M</span><br />
                    <span>仅能上传PNG,JPEG,JPG等图片</span><br />
                    <span>建议上传200*200 或 300*300尺寸的照片</span>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="工作经验">
                <el-form
                  ref="exprFormRef"
                  :model="dialogForm"
                  label-width="50px"
                >
                  <div
                    v-for="(item, index) in dialogForm.empExprList"
                    :key="index"
                  >
                    <el-row :gutter="20" style="margin-bottom: 10px">
                      <el-col :span="10">
                        <el-form-item label="时间">
                          <el-date-picker
                            v-model="item.time"
                            type="daterange"
                            range-separator="到"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="7">
                        <el-form-item label="公司">
                          <el-input
                            v-model="item.company"
                            placeholder="请输入公司名称"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="7">
                        <el-form-item label="职位">
                          <el-input
                            v-model="item.job"
                            placeholder="请输入职位"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-form>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="right-col">
              <el-button type="primary" @click="addExpr"
                >添加工作经验</el-button
              >
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
  ElImage,
  ElMessage,
  ElMessageBox,
  ElUpload,
} from "element-plus";
import type { UploadProps, FormInstance } from "element-plus";
import { Plus, Minus } from "@element-plus/icons-vue";
import moment from "moment";
import { ref, reactive, onMounted, computed } from "vue";
import type { Emp, empParamsType } from "@/types/emp";
import type { Dept } from "@/types/dept";
import { getEmpTable, deleteById, deleteByIds, addEmp, getEmp, editEmp } from "@/api/emp";
import { getDeptTable } from "@/api/dept";
import { storeToRefs } from "pinia";
import { genderOption, jobOption } from "@/utils/fakes";
import type { OptionItem } from "@/utils/fakes";
import { addOrEditRes } from "@/utils/ways";
import { useLoginStore } from "../../stores/login";
const loginStore = useLoginStore();
const { token } = storeToRefs(loginStore);

const actionUrl = `http://localhost:8080/upload`;
const headers = {
  token: token.value,
};

const form = reactive({
  name: "",
  gender: "" as string | number,
  time: [] as any[],
});

const tableData = ref<Emp[]>([]);
const selectTable = ref<number[]>([]);
const dialogFormRef = ref<FormInstance>();
const empUploadRef = ref(null);

const dialogs = reactive({
  visible: false,
  title: "",
  type: "",
});

const deptOption = ref<OptionItem[]>([]);
const dialogForm = ref({
  username: "",
  name: "",
  gender: "" as string | number,
  phone: "",
  image: "",
  entryDate: "" as string | Date,
  job: "" as string | number,
  salary: "" as string | number,
  deptId: "" as string | number,
  empExprList: [{ company: "", job: "", time: [] as any[] }],
});

const dialogRuleForm = reactive({
  username: [
    { required: true, message: "请输入员工用户名", trigger: "blur" },
    { min: 2, max: 20, message: "2-20个字", trigger: "blur" },
  ],
  name: [
    { required: true, message: "请输入员工名", trigger: "blur" },
    { min: 2, max: 20, message: "2-20个字", trigger: "blur" },
  ],
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
});

const pages = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

const isDisabled = computed(() => {
  return selectTable.value.length <= 0;
});

onMounted(() => {
  initTable();
});

const onBeforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const type = rawFile.type.split("/")[1];
  const imageTypes = ["jpeg", "jpg", "png"];
  if (!imageTypes.includes(type)) {
    ElMessage.error("仅能上传 PNG、JPEG、JPG 格式图片");
    return false;
  }
  const is2M = rawFile.size / 1024 / 1024 < 2;
  if (!is2M) {
    ElMessage.error("图片大小不能超过 2MB");
    return false;
  }
  // return new Promise((resolve, reject) => {
  //   const img = new Image();
  //   img.onload = () => {
  //     const validSize =
  //       (img.width === 200 && img.height === 200) ||
  //       (img.width === 300 && img.height === 300);
  //     if (validSize) {
  //       resolve();
  //     } else {
  //       ElMessage.error("请上传 200*200 或 300*300 尺寸的照片");
  //       reject(false);
  //     }
  //   };
  //   img.src = URL.createObjectURL(rawFile);
  // })
};

const onSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  if (response.code === 1) {
    dialogForm.value.image = uploadFile.url || "";
  }
};

const addExpr = () => {
  dialogForm.value.empExprList.push({
    company: "",
    job: "",
    time: [],
  });
};

const onClick = (type: string, row: any) => {
  dialogs.type = type;
  switch (type) {
    case "add":
      initDepts();
      add();
      break;
    case "edit":
      initDepts();
      edit(row);
      break;
    case "delete":
      if (row !== "") {
        deleteEmp(row as Emp);
      } else {
        deleteEmps();
      }
      break;
  }
};

const jobType = (row: Emp) => {
  switch (String(row.job)) {
    case "1":
      return "班主任";
    case "2":
      return "讲师";
    case "3":
      return "学工主管";
    case "4":
      return "教研主管";
    case "5":
      return "咨询师";
    default:
      return "--";
  }
};

const formatTime = (time: string | number | Date) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};

const add = () => {
  dialogs.title = "新增员工";
  dialogs.visible = true;
};
const edit = async (row: Emp) => {
  const res = await getEmp(row.id);
  const { code, data } = res;
  if (code === 1) {
    const empExprList = data.empExprList && data.empExprList.length > 0 ? data.empExprList.map((_: any) => {
      return {
        company: _.company,
        job: _.job,
        time: [_.begin, _.end]
      }
    }) : [{ company: "", job: "", time: []}]
    dialogForm.value = {
      ...dialogForm.value,
      ...data,
      entryDate: data.entryDate !== null ? moment(data.entryDate).format("YYYY-MM-DD") : "",
      empExprList: empExprList
    }
    console.log(dialogForm.value, "value");
    
  }
  dialogs.title = "修改员工";
  dialogs.visible = true;
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
const resetDialogs = () => {
  if (!dialogFormRef.value) return;
  dialogFormRef.value.resetFields();
  dialogForm.value.empExprList = [{ company: "", job: "", time: [] }];
  if (empUploadRef.value) {
    (empUploadRef.value as any).clearFiles();
  }
  dialogs.title = "";
  dialogs.type = "";
  dialogs.visible = false;
  initTable();
};

const addDialog = async () => {
  const valid = await dialogFormRef.value?.validate().catch(() => false);
  if (!valid) return;
  let empExprList: any[] = [];
  if (dialogForm.value.empExprList.length > 0) {
    empExprList = dialogForm.value.empExprList.map((_) => {
      return {
        company: _.company,
        job: _.job,
        begin: _.time.length  > 0 ?  moment(_.time[0]).format("yyyy-MM-DD") : "",
        end: _.time.length > 0 ? moment(_.time[1]).format("yyyy-MM-DD") : "",
      };
    })
  }
  const res = await addEmp({
    ...dialogForm.value,
    empExprList
  });
  addOrEditRes({
    type: dialogs.type,
    res: res,
    func: () => resetDialogs(),
  });
};

const editDialog = async () => {
if (!dialogFormRef.value) return;
  const valid = await dialogFormRef.value.validate();
  if (!valid) return;
  let empExprList: any[] = [];
  if (dialogForm.value.empExprList.length > 0) {
    empExprList = dialogForm.value.empExprList.map((_) => {
      return {
        company: _.company,
        job: _.job,
        begin: _.time.length  > 0 ?  moment(_.time[0]).format("yyyy-MM-DD") : "",
        end: _.time.length > 0 ? moment(_.time[1]).format("yyyy-MM-DD") : "",
      };
    })
  }
  const res = await editEmp({
    ...dialogForm.value,
    empExprList
  });
  addOrEditRes({
    type: dialogs.type,
    res: res,
    func: () => resetDialogs(),
  });
};
const deleteEmp = async (row: Emp) => {
  const typeStatus = await ElMessageBox.confirm("确定删除该员工吗？", "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });

  if (typeStatus === "confirm") {
    const res = await deleteById(row.id);
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
  form.gender = "";
  form.time = [];
  pages.page = 1;
  pages.pageSize = 10;
  initTable();
};

const onSelectTable = async (val: Emp[]) => {
  selectTable.value = val.map((_) => _.id);
};

const deleteEmps = async () => {
  const status = await ElMessageBox.confirm("确定删除吗？", "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });

  if (status === "confirm") {
    const ids = selectTable.value.toString();
    const res = await deleteByIds(ids);
    addOrEditRes({
      type: "delete",
      res: res,
    });
  } else {
    ElMessage.info("取消删除！");
  }
  initTable();
};

const initDepts = async () => {
  const res = await getDeptTable();
  const { code, data } = res;
  if (code === 1) {
    deptOption.value = data.map((_) => {
      return {
        value: _.id,
        label: _.name,
      };
    });
  }
};
const initTable = async () => {
  const res = await getEmpTable({
    name: form.name || "",
    gender: form.gender,
    bigin:
      form.time.length > 0
        ? moment(form.time[0]).format("YYYY-MM-DD")
        : moment(new Date()).format("YYYY-MM-DD"),
    end:
      form.time.length > 0
        ? moment(form.time[1]).format("YYYY-MM-DD")
        : moment(new Date()).format("YYYY-MM-DD"),
    page: pages.page,
    pageSize: pages.pageSize,
  });
  const { code, data } = res;
  if (code === 1) {
    tableData.value = data.rows;
    pages.total = data.total;
  }
};
</script>

<style lang="scss" scoped>
.el-table,
.el-pagination {
  margin-top: 20px;
}

.dialog-footer {
  text-align: center;
}
</style>