<script setup lang="ts">
import { drawCircle, drawArrow } from "./utils";
import { onMounted, reactive } from "vue";
import { timeSlice, timeDeal } from "./timeUtils";
import dayjs from "dayjs";
const baseFontSize = 12;
const startX = 20;
interface configVo {
  size?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  width: number;
  height: number;
}
const config = reactive({
  size: 101, // 刻度尺总刻度数，（100个间隔需要101个刻度线）
  x: 20, // 刻度尺x坐标位置,单位px
  y: 0, // 刻度尺y坐标位置,单位px
  w: 10, // 刻度线的间隔,单位px
  h: 10, // 刻度线基础长度,单位px
  width: 1000, // 刻度尺宽度(写长20px是为了最后一个刻度值能被显示出来)
  height: 40, // 刻度尺高度
});
let w = 10;
const draw = (
  ctx: CanvasRenderingContext2D,
  config: configVo,
  down: boolean = true
) => {
  const size = config.size;
  const y = config.y || 0;
  w = config.width / (size - 1) || 10;
  const h = config.h || 10;
  // 画之前清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 设置画笔属性
  ctx.strokeStyle = "#aaa"; // 画笔颜色
  ctx.lineWidth = 1; // 画笔大小
  ctx.font = baseFontSize + ""; //字体大小
  // 画横线
  for (let i = 0; i < size; i = i + state.listQuery.diff) {
    // 开始一条路径
    ctx.beginPath();
    // 移动到指定位置
    ctx.moveTo(startX + i * w, down ? baseFontSize + y : h);
    ctx.lineTo(startX + i * w, down ? baseFontSize + h : h * 2); // 刻度线短（1h）
    ctx.textAlign = "center";
    ctx.fillText(
      i + 1 + "",
      startX + i * w,
      down ? baseFontSize : baseFontSize + h * 2
    );
    ctx.stroke();
  }
};
let yearList = [];
const drawLine = (
  ctx: CanvasRenderingContext2D,
  config: configVo,
  down: boolean = true
) => {
  // 画之前清空画布
  // ctx.clearRect(0, 0, config.width, config.height);
  // 设置画笔属性
  ctx.strokeStyle = "#333"; // 画笔颜色
  ctx.lineWidth = 1; // 画笔大小
  ctx.font = "12"; //字体大小

  ctx.beginPath();
  ctx.moveTo(startX, down ? baseFontSize + config.h : config.h);
  ctx.lineTo(config.width + startX, down ? baseFontSize + config.h : config.h);
  ctx.stroke();
  ctx.closePath();
  if (yearList.length > 0) {
    ctx.beginPath();
    ctx.moveTo(startX, down ? baseFontSize + config.h : 0);
    ctx.lineTo(startX, down ? baseFontSize + config.h + config.h : config.h);
    ctx.stroke();
    ctx.closePath();
    let x = 0;
    for (let i = 0; i < yearList.length; i++) {
      ctx.beginPath();
      x = x + yearList[i].day;
      ctx.moveTo(startX + (x - 1) * w, down ? baseFontSize + config.h : 0);
      ctx.lineTo(
        startX + (x - 1) * w,
        down ? baseFontSize + config.h + config.h : config.h
      );
      ctx.stroke();
      ctx.beginPath();
      // ctx.moveTo(i == 0 ? startX : startX + (x - 1) * w, down ? baseFontSize + config.h : 0)
      // ctx.lineTo(startX + (x - 1) * w, down ? baseFontSize + config.h : 0)
      ctx.textAlign = "center";
      ctx.fillText(
        yearList[i].year + "-" + yearList[i].month,
        (i * config.width) / yearList.length + (yearList[i].day * w) / 2,
        down ? baseFontSize + config.h + config.h : config.h - 1
      );
      ctx.closePath();
    }
  }
};
const radius = 10;
let canvas = null;
let context = null;
let canvasTwo = null;
let ctx = null;
let canvasCenter = null;
let ctxCenter = null;
const state = reactive({
  listQuery: {
    time: [],
    startTime: "",
    endTime: "",
    diff: 3,
  },
  tableData: [
        { id: 1, workIndex: '1.1', workName: '工作A', workTime: 59, freeTime: 0, totalCountTime: 0,startTime: '2021-01-01', endTime: '2021-02-28', afterWork: [16, 18, 19], isMainWork: true, children: [
            { id: 2, workIndex: '1.1.1', workName: '工作1', workTime: 7, freeTime: 0, totalCountTime: 0, startTime: '2021-01-01', endTime: '2021-01-07', afterWork: [4, 7, 6, 8, 9, 13], isMainWork: true, children: null},
            { id: 4, workIndex: '1.1.2', workName: '工作2', workTime: 30, freeTime: 10, totalCountTime: 10, startTime: '2021-01-08', endTime: '2021-02-06', afterWork: [15], isMainWork: false, children: null},
            { id: 100, workIndex: '1.1.3', workName: '工作3', workTime: 40, freeTime: 0, totalCountTime: 0, startTime: '2021-01-08', endTime: '2021-02-16', afterWork: [15], isMainWork: true, children: [
                { id: 7, workIndex: '1.1.3.1', workName: '工作3-1', workTime: 20, freeTime: 0, totalCountTime: 0, startTime: '2021-01-08', endTime: '2021-01-27', afterWork: [12], isMainWork: true, children: null },
                { id: 6, workIndex: '1.1.3.2', workName: '工作3-2', workTime: 20, freeTime: 0, totalCountTime: 0, startTime: '2021-01-08', endTime: '2021-01-27', afterWork: [12], isMainWork: true, children: null },
                { id: 8, workIndex: '1.1.3.3', workName: '工作3-3', workTime: 7, freeTime: 0, totalCountTime: 3, startTime: '2021-01-08', endTime: '2021-01-14', afterWork: [10], isMainWork: false, children: null },
                { id: 9, workIndex: '1.1.3.4', workName: '工作3-4', workTime: 15, freeTime: 5, totalCountTime: 8, startTime: '2021-01-08', endTime: '2021-01-22', afterWork: [11], isMainWork: false, children: null},
                { id: 10, workIndex: '1.1.3.5', workName: '工作3-5', workTime: 13, freeTime: 0, totalCountTime: 3, startTime: '2021-01-15', endTime: '2021-01-27', afterWork: [11], isMainWork: false, children: null},
                { id: 11, workIndex: '1.1.3.6', workName: '工作3-6', workTime: 10, freeTime: 0, totalCountTime: 0, startTime: '2021-01-28', endTime: '2021-02-03', afterWork: [14], isMainWork: false, children: null},
                { id: 12, workIndex: '1.1.3.7', workName: '工作3-7', workTime: 10, freeTime: 0, totalCountTime: 0, startTime: '2021-01-28', endTime: '2021-02-06', afterWork: [14], isMainWork: true, children: null},
                { id: 14, workIndex: '1.1.3.8', workName: '工作3-8', workTime: 10, freeTime: 0, totalCountTime: 0, startTime: '2021-02-07', endTime: '2021-02-16', afterWork: [15], isMainWork: true, children: null},
              ] },
            { id: 13, workIndex: '1.1.4', workName: '工作4', workTime: 25, freeTime: 15, totalCountTime: 15, startTime: '2021-01-08', endTime: '2021-02-01', afterWork: [15], isMainWork: false, children: null},
            { id: 15, workIndex: '1.1.5', workName: '工作5', workTime: 12, freeTime: 0, totalCountTime: 0, startTime: '2021-02-17', endTime: '2021-02-28', afterWork: [16, 18, 19], isMainWork: true, children: null},
          ] },
        { id: 16, workIndex: '1.2', workName: '工作B', workTime: 20, freeTime: 0, totalCountTime: 13, startTime: '2021-03-01', endTime: '2021-03-20', afterWork: [17], isMainWork: false, children: null },
        { id: 17, workIndex: '1.3', workName: '工作C', workTime: 28, freeTime: 13, totalCountTime: 13, startTime: '2021-03-21', endTime: '2021-04-17', afterWork: [20], isMainWork: false, children: null },
        { id: 19, workIndex: '1.4', workName: '工作D', workTime: 61, freeTime: 0, totalCountTime: 0, startTime: '2021-03-01', endTime: '2021-04-30', afterWork: [20], isMainWork: true, children: null },
        { id: 18, workIndex: '1.5', workName: '工作E', workTime: 45, freeTime: 16, totalCountTime: 16, startTime: '2021-03-01', endTime: '2021-04-14', afterWork: [20], isMainWork: false, children: null },
        { id: 20, workIndex: '1.6', workName: '工作F', workTime: 31, freeTime: 0, totalCountTime: 0, startTime: '2021-05-01', endTime: '2021-05-31', afterWork: null, isMainWork: true, children: null },
  ],
  dataList: [],
  hasDrawList: [],
});
const init = () => {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  context = canvas.getContext("2d") as CanvasRenderingContext2D;
  draw(context, config, true);
  drawLine(context, config, true);
  canvasTwo = document.getElementById("canvasTwo") as HTMLCanvasElement;
  ctx = canvasTwo.getContext("2d") as CanvasRenderingContext2D;
  draw(ctx, config, false);
  drawLine(ctx, config, false);
  canvasCenter = document.getElementById("canvasCenter") as HTMLCanvasElement;
  ctxCenter = canvasCenter.getContext("2d") as CanvasRenderingContext2D;
  ctxCenter.clearRect(0, 0, canvasCenter.width, canvasCenter.height);
  // drawFunTwo(canvasCenter, ctxCenter)
  // drawFunTow()
  // drawAllCircle();
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  dealData(state.tableData)
  const array = newArray.filter((item: any) => {
    return !item.children
  })

  array.map((item: any, index: number) => {
    if (index == 0) {
      pushArrayFun(item)
    }
  })
  state.dataList = []
  state.dataList.push(array[0])
  drawMainLine(canvasCenter, ctxCenter);
};
const pushArrayFun = (testArray) => {
  testArray.totalTime = dayjs(testArray.startTime).diff('2021-01-01', 'day') + testArray.workTime + testArray.freeTime
  testArray.newChildren = []
  if (testArray.afterWork && testArray.afterWork.length > 0) {
    testArray.afterWork.map((afterItem: any) => {
      const findIndex = newArray.findIndex((fIndex: any) => {
        return fIndex.id == afterItem
      })
      if (findIndex !== -1) {
          if (afterItem.id > newArray[findIndex].id) {
              const temp = afterItem.id
              afterItem.id = newArray[findIndex].id
              newArray[findIndex].id = temp
          }
          testArray.newChildren.push(newArray[findIndex])
        pushArrayFun(newArray[findIndex])
      }
    })
  }
}
const newArray = []
const dealData = (data: any) => {
  data.forEach((item: any) => {
    newArray.push(item)
    if (item.children && item.children.length > 0) {
      dealData(item.children)
    }
  })
}
const drawMainLine = (canvasCenter, ctxCenter) => {
  const h = canvasCenter.height;
  ctxCenter.strokeStyle = "#333"; // 画笔颜色
  ctxCenter.lineWidth = 1; // 画笔大小
  drawCircle(ctxCenter, startX, h / 2, 1);
  drawArrow(ctxCenter, startX + radius, h / 2, startX + (state.dataList[0].totalTime - 1) * w - radius, h / 2, 1, '#333', 0, 0, h / 2, '', 0);
  drawFun(state.dataList, h);
};
let newIndex = 0
const drawFun = (value: any, h) => {
  const smallHeight = 50;
  let count = 0;
  value.forEach((item: any) => {
      if (item.isMainWork) {
        count++;
        item.height = h / 2 + smallHeight * (count - 1);
        ctxCenter.clearRect(startX + (item.totalTime - 1) * w - radius, item.height - radius, radius * 2, radius * 2)
        drawCircle(
          ctxCenter,
          startX + (item.totalTime - 1) * w,
          item.height,
          item.id,
        );
        if (item.newChildren && item.newChildren.length > 0) {
          const notMainWorkArray = item.newChildren.filter((item: any) => {
            return !item.isMainWork;
          });
          const mainWorkArray = item.newChildren.filter((item: any) => {
            return item.isMainWork;
          });
          mainWorkArray.map((child: any, childIndex: number) => {
            child.newH = item.height + childIndex * smallHeight;
            if (child.newH == item.height) {
              if (child.newH == h / 2) {
                drawArrow(
                  ctxCenter,
                  startX + (item.totalTime - 1) * w + radius,
                  item.height,
                  startX + (child.totalTime - 1) * w - radius,
                  h / 2,
                  1,
                  "#333",
                  child.workTime * w,
                  child.workTime,
                  h / 2,
                  child.workName,
                  child.freeTime
                );
              } else {
                drawArrow(
                  ctxCenter,
                  startX + (item.totalTime - 1) * w,
                  item.height - radius,
                  startX + (child.totalTime - 1 - child.workTime) * w,
                  h / 2 + radius,
                  1,
                  "#333",
                  0,
                  0,
                  h / 2,
                  '',
                  child.freeTime
                );
              }
            } else {
              drawArrow(
                ctxCenter,
                startX + (item.totalTime - 1) * w,
                item.height + radius,
                startX + (child.totalTime - 1) * w - radius,
                child.newH,
                1,
                "#333",
                child.workTime * w,
                child.workTime,
                h / 2,
                child.workName,
                child.freeTime
              );
            }
          });
          notMainWorkArray.map((notMainChild: any, index: number) => {
            newIndex++
            notMainChild.newH =
              (index + 1) % 2 == 0
                ? ((index + 1) / 2 >= 1 ? (index + 1) / 2 + 1 : 1) * smallHeight +
                  item.height
                : -1 *
                    ((index + 1) / 2 >= 1 ? (index + 1) / 2 + 1 : 1) *
                    smallHeight +
                  h / 2;
            drawCircle(
              ctxCenter,
              startX + (notMainChild.totalTime - 1) * w,
              notMainChild.newH,
              notMainChild.id
            );
            if (notMainChild.newH > h / 2) {
              drawArrow(
                ctxCenter,
                startX + (item.totalTime - 1) * w,
                h / 2 + radius,
                startX + (notMainChild.totalTime - 1) * w - radius,
                notMainChild.newH,
                1,
                "#333",
                notMainChild.workTime * w,
                notMainChild.workTime,
                h / 2,
                notMainChild.workName,
                notMainChild.freeTime
              );
            } else {
              drawArrow(
                ctxCenter,
                startX + (item.totalTime - 1) * w,
                h / 2 - radius,
                startX + (notMainChild.totalTime - 1) * w - radius,
                notMainChild.newH,
                1,
                "#333",
                notMainChild.workTime * w,
                notMainChild.workTime,
                h / 2,
                notMainChild.workName,
                notMainChild.freeTime
              );
            }
          });
          mainWorkArray.map((item: any) => {
            item.newChildren.map((newItem: any) => {
              if (item.id === newItem.id) {
                newItem.newH = item.height;
              }
            });
          });
          notMainWorkArray.map((item: any) => {
            item.newChildren.map((newItem: any) => {
              if (item.id === newItem.id) {
                newItem.newH = item.newH;
              }
            });
          });
          drawFun(item.newChildren, h);
        }
      } else {
        if (item.newChildren && item.newChildren.length > 0) {
          item.newChildren.forEach((newItem: any) => {
            newItem.newH = item.newH;
            if (!newItem.isMainWork) {
              if (newItem.newH < h / 4) {
                  console.log(newItem, 'test')
                drawArrow(
                  ctxCenter,
                  startX + (item.totalTime - 1) * w + radius,
                  item.newH,
                  startX + (newItem.totalTime - 1) * w,
                  h / 2 - radius,
                  1,
                  "#333",
                  newItem.workTime * w,
                    newItem.workTime,
                  h / 2,
                  newItem.workName,
                  newItem.freeTime
                );
              } else {
                drawCircle(
                    ctxCenter,
                    startX + (newItem.totalTime - 1) * w,
                    item.newH,
                    newItem.id
                );
                drawArrow(
                    ctxCenter,
                    startX + (item.totalTime - 1) * w + radius,
                    item.newH,
                    startX + (newItem.totalTime - 1) * w - radius,
                    item.newH,
                    1,
                    "#333",
                    newItem.workTime * w,
                    newItem.workTime,
                    h / 2,
                    newItem.workName,
                    newItem.freeTime
                );
              }
            } else {
              if (item.newH > h / 2) {
                drawArrow(
                  ctxCenter,
                  startX + (item.totalTime - 1) * w,
                  item.newH - radius,
                  startX + (newItem.totalTime - 1 - newItem.workTime) * w,
                  h / 2 + radius,
                  1,
                  "#333",
                  0,
                  0,
                  h / 2,
                  '',
                  newItem.freeTime
                );
              } else {
                      drawArrow(
                        ctxCenter,
                        startX + (item.totalTime - 1) * w,
                        item.newH + radius,
                        startX + (newItem.totalTime - 1  - newItem.workTime) * w,
                        h / 2 - radius,
                        1,
                        "#333",
                        0,
                        0,
                        h / 2,
                        '',
                        newItem.freeTime
                      );

              }
            }
          });
          drawFun(item.newChildren, h)
        }
      }
    // }
  });
};
onMounted(() => {
  state.listQuery.time = ["2021-01-01", "2021-05-31"];
  handleTimeChange(state.listQuery.time);
});
// 页面滚动
// const mouseWheel = (e: any) => {
//   if (e.wheelDelta || e.detail) {
//     if (e.wheelDelta > 0 || e.detail < 0) {     //当鼠标滚轮向上滚动时
//       console.log("向上")
//     }
//     if (e.wheelDelta < 0 || e.detail > 0) {     //当鼠标滚轮向下滚动时
//       console.log("向下")
//     }
//   }
// }

const handleTimeChange = (val: any) => {
  if (val) {
    state.listQuery.startTime = val[0];
    state.listQuery.endTime = val[1];
    yearList = timeSlice(val[0], val[1], 1, []);
    config.size = timeDeal(val[0], val[1], "day");
    newIndex = 0;
    init();
  }
};
const handleDiffChange = () => {
  newIndex = 0;
  ctxCenter.clearRect(0, 0, canvasCenter.width, canvasCenter.height)
  init();
};
</script>

<template>
  <div>
    <el-form ref="ruleForm" :model="state.listQuery" :inline="true">
      <el-form-item label="工期时间：">
        <el-date-picker
          v-model="state.listQuery.time"
          type="daterange"
          @change="handleTimeChange"
          value-format="YYYY-MM-DD"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="间隔">
        <el-input-number
          v-model="state.listQuery.diff"
          :controls="true"
          :min="1"
          :max="10"
          @change="handleDiffChange"
        ></el-input-number>
      </el-form-item>
    </el-form>
  </div>
  <div>
    <div>
      <canvas id="canvas" width="1040" height="40" style="padding: 20px"></canvas>
      <canvas
      id="canvasCenter"
      width="1040"
      height="440"
      style="padding: 0 20px"
    ></canvas>
      <canvas
      id="canvasTwo"
      width="1040"
      height="40"
      style="padding: 20px"
    ></canvas>
    </div>
      <el-table :data="state.tableData" row-key="id" style="width: 100%" height="100%" :tree-props="{ children: 'children' }">
          <el-table-column label="序号"  type="index" width="60"></el-table-column>
          <el-table-column label="工作编码" prop="workIndex" width="120"></el-table-column>
          <el-table-column label="工作名称" prop="workName" width="120"></el-table-column>
          <el-table-column label="基准工期" prop="workTime" width="120"></el-table-column>
          <el-table-column label="计划开始时间" prop="startTime" width="120"></el-table-column>
          <el-table-column label="计划结束日期" prop="endTime" width="120"></el-table-column>
          <el-table-column label="紧前工作" prop="workName" width="120"></el-table-column>
          <el-table-column label="紧后工作" prop="afterWork" width="120">
              <template #default="row">
                  <span v-if="row.afterWork">{{ row.afterWork.join(',') }}</span>
              </template>
          </el-table-column>
          <el-table-column label="自由时差" prop="freeTime" width="120"></el-table-column>
          <el-table-column label="总时差" prop="totalCountTime" width="120"></el-table-column>
      </el-table>
  </div>
</template>

<style scoped></style>
