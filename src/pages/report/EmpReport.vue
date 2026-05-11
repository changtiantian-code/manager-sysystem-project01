<template>
  <div class="report-page">
    <el-row :gutter="20" justify="center">
      <el-col :span="12">
        <el-card>
          <div ref="empJobRef" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div ref="empGenderRef" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElRow, ElCol, ElCard } from "element-plus";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import * as echarts from "echarts";
import { getEmpJob, getEmpGender } from "@/api/report"

const empJobOption = reactive({
  title: {
    text: "员工职位统计",
    left: "center",
  },
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [],
      type: "bar",
    },
  ],
});

const empGenderOption = reactive({
  title: {
    text: "员工性别统计",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      type: "pie",
      radius: "50%",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

const empJobRef = ref<HTMLElement | null>(null);
const empGenderRef = ref<HTMLElement | null>(null);
let empJobChart: echarts.ECharts | null = null;
let empGenderChart: echarts.ECharts | null = null;

onMounted(() => {
  initEmpJob();
  initEmpGender();
  window.addEventListener('resize', resizeFunc);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeFunc);
})

const resizeFunc = () => {
  empJobChart?.resize();
  empGenderChart?.resize();
}
const initEmpJob = async () => {
  const res = await getEmpJob();
  if (res.code === 1 && empJobRef.value) {
    empJobOption.xAxis.data = res.data.jobList as any;
    empJobOption.series[0].data = res.data.jobLevelList as any;
    empJobChart = echarts.init(empJobRef.value);
    empJobChart.setOption(empJobOption);
  }
};
const initEmpGender = async () => {
  const res = await getEmpGender();
  if (res.code === 1 && empGenderRef.value) {
    empGenderOption.series[0].data = res.data as any;
    empGenderChart = echarts.init(empGenderRef.value);
    empGenderChart.setOption(empGenderOption);
  }
  
};
</script>