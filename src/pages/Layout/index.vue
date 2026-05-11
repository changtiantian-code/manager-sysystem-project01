<template>
  <div>
    <el-container>
      <el-header>
        <el-row justify="space-between">
          <el-col :span="9">
            <p>智能学习辅助系统</p>
          </el-col>
          <el-col :span="9" class="right-col">
            <el-button :icon="EditPen" link @click="onEditPassword"
              >修改密码</el-button
            >
            <el-button :icon="SwitchButton" link @click="onOutLogin"
              >退出登录</el-button
            >
          </el-col>
        </el-row>
      </el-header>
      <el-container class="menu-box">
        <el-aside width="200px">
          <el-menu
            :default-active="currentIndex"
            class="el-menu-vertical-demo"
            router
            style="height: 100%"
            active-text-color="#409eff"
          >
            <MenuItem :menus="allRoutes" @onSelectMenu="onSelectMenu" />
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>

    <!-- 修改密码弹框 -->
    <el-dialog
      v-model="dialogs.visible"
      :title="dialogs.title"
      width="30%"
      @close="onClose('cancel')"
    >
      <div class="password-form">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rulesForm"
          label-width="120px"
        >
          <el-form-item label="原始密码" prop="oldPassword">
            <el-input
              v-model="form.oldPassword"
              type="password"
              placeholder="请输入原始密码"
            />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input
              v-model="form.newPassword"
              type="password"
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input
              v-model="form.againPassword"
              type="password"
              placeholder="请再次输新密码"
            />
          </el-form-item>
          <el-form-item>
            <el-row class="btn-row">
              <el-col :span="9">
                <el-button type="primary" @click="onClose('submit')"
                  >保存</el-button
                >
              </el-col>
              <el-col :span="9" style="text-align: right">
                <el-button @click="onClose('cancel')">取消</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <template #footer></template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElButton,
  ElRow,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage
} from "element-plus";
import MenuItem from "@/components/MenuItem.vue";
import { EditPen, SwitchButton } from "@element-plus/icons-vue";
import { useRouter, RouterView } from "vue-router";
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { editPassword } from "@/api/login";
import { useLoginStore  } from "@/stores/login"
import { storeToRefs } from 'pinia'

const router = useRouter();
const loginStore = useLoginStore();

const currentIndex = ref<string>(router.currentRoute.value.path);

const allRoutes = router.options.routes[1].children;
const dialogs = reactive({
  title: "",
  visible: false,
});

const form = reactive({
  oldPassword: "",
  newPassword: "",
  againPassword: "",
});

const formRef = ref<FormInstance>(null);

const rulesForm = reactive<FormRules>({
  oldPassword: [{ required: true, message: "请输入原始密码", trigger: "blur" }],
});

const onClose = (type: string) => {
  switch (type) {
    case "submit":
      submit();
      break;
    case "cancel":
      cancel();
      break;
  }
};

const submit = async () => {
  if (!formRef.value) return;
  
  if (form.newPassword !== form.againPassword) {
    ElMessage.error("两次密码输入不一致");
    return;
  }
  const submitData = {
    oldPassword: form.oldPassword,
    newPassword: form.newPassword,
    againPassword: form.againPassword
  };
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  const { id, username } = storeToRefs(loginStore);   
  const res = await editPassword({
    ...submitData,
    id: id.value,
    username: username.value
  });
  if (res.code === 1) {
    cancel();
    loginStore.logout();
    router.push("/login");
  } else {
    ElMessage.error(res.msg || "修改失败");
  }
};

const cancel = () => {
  if (!formRef.value) return;
  form.oldPassword = "";
  form.newPassword = "";
  form.againPassword = "";
  formRef.value.resetFields();
  dialogs.title = "";
  dialogs.visible = false;
};

const onEditPassword = () => {
  dialogs.title = "修改密码";
  dialogs.visible = true;
};

const onSelectMenu = (index: string) => {
  currentIndex.value = index;
};

const onOutLogin = () => {
  loginStore.logout();
  router.push("/login");
};
</script>


<style lang="scss" scoped>
.right-col {
  text-align: right;
}

.menu-box {
  height: calc(100vh - var(--el-header-height, 60px));
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.btn-row {
  width: 100%;
}
</style>