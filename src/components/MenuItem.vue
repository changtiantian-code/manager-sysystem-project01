<template>
  <div class="menu-item-box">
    <template v-for="menu in menus">
      <el-sub-menu
        :key="menu.path"
        :index="menu.path"
        v-if="menu.children && menu.children.length > 0"
      >
        <template #title>{{ menu.meta?.name }}</template>
        <MenuItem :menus="menu.children"  @onSelectMenu="onSelectMenu" />
      </el-sub-menu>
      <el-menu-item :index="menu.path" v-else @click="onSelectMenu">
        <template #title>{{ menu.meta?.name }}</template>
      </el-menu-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ElMenuItem, ElSubMenu } from "element-plus";
import { toRefs } from "vue";

const props = defineProps(["menus"]);
const emit = defineEmits(["onSelectMenu"]);
const { menus } = toRefs(props);

const onSelectMenu = (index: any) => {
  emit("onSelectMenu", index)
}
</script>

<style lang="scss" scoped>
</style>