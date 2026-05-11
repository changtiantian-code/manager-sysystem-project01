<template>
  <div class="report-page">
    <el-row :gutter="20" justify="center">
      <el-col :span="12">
        <el-card>
          <div ref="classNumRef" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div ref="stuDregeeRef" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElRow, ElCol, ElCard } from "element-plus";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import * as echarts from "echarts";
import { getClassNum, getStuDregee } from "@/api/report"

const classNumOption = reactive({
  title: {
    text: "班级人数统计",
    left: "center",
  },
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      interval: 0,
      rotate: -45,
      margin: 5,
    }
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

const stuDregeeOption = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  title: {
    text: "学员学历统计",
    left: "center",
  },
  series: [
    {
      type: "pie",
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
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

const classNumRef = ref<HTMLElement | null>(null);
const stuDregeeRef = ref<HTMLElement | null>(null);
let classNumChart: echarts.ECharts | null = null;
let stuDregeeChart: echarts.ECharts | null = null;

onMounted(() => {
  initClassNum();
  initStuDregee();
  window.addEventListener('resize', resizeFunc);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeFunc);
})

const resizeFunc = () => {
  classNumChart?.resize();
  stuDregeeChart?.resize();
}
const initClassNum = async () => {
  const res = await getClassNum();
  if (res.code === 1 && classNumRef.value) {
    classNumOption.xAxis.data = res.data.map((item: any) => item.name) as any;
    classNumOption.series[0].data = res.data.map((item: any) => item.value) as any;
    classNumChart = echarts.init(classNumRef.value);
    classNumChart.setOption(classNumOption);
  }
};
const initStuDregee = async () => {
  const res = await getStuDregee();
  if (res.code === 1 && stuDregeeRef.value) {
    stuDregeeOption.series[0].data = res.data as any;
    stuDregeeChart = echarts.init(stuDregeeRef.value);
    stuDregeeChart.setOption(stuDregeeOption);
  }
  
};
</script>