<template>
  <el-row class="login-page" justify="space-evenly">
    <el-col :span="9">
      <img src="@/assets/images/loginBg.png" alt="login-bg" class="login-bg" />
    </el-col>
    <el-col :span="9" class="login-box">
      <el-card class="box-card" gradient>
        <p>智能学习辅助系统</p>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rulesForm"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item>
            <el-row class="login-btn-box" justify="space-evenly">
              <el-col :span="9">
                <el-button type="primary" @click="onSubmit">登录</el-button>
              </el-col>
              <el-col :span="9">
                <el-button @click="onReset">取消</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {
  ElRow,
  ElCol,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
} from "element-plus";
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { LoginType } from "@/types/login";
import { login } from "@/api/login";
import { useLoginStore } from "@/stores/login"
import { useRouter, RouterView } from "vue-router";

const router = useRouter();
const formRef = ref<FormInstance>();
const loginStore = useLoginStore();
const form = reactive<LoginType>({
  username: "",
  password: "",
});
const rulesForm = reactive<FormRules<LoginType>>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const onSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  const res = await login(form);
  const { msg, code, data } = res;
  if (code === 1) {
    loginStore.setUserInfo(data);
    router.push("/home");
  } else {
    ElMessage.error(msg);
    onReset();
  }
};

const onReset = () => {
  if (!formRef.value) return;
  form.username = "";
  form.password = "";
  formRef.value.resetFields();
};
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  padding: 20px;
  .login-box {
    vertical-align: middle;
    margin: auto 0;
  }
  .box-card {
    p {
      text-align: center;
    }
    .login-btn-box {
      display: flex;
      width: 100%;
    }
  }
}
</style>