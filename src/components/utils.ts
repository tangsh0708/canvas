import { timeSlice } from "./timeUtils";

const radius = 10;
const theta = 30;
const headlen = 10;
export function drawCircle(ctx, x, y, number) {
  ctx.beginPath();
  ctx.moveTo(number ? x + radius : x + 5, y);
  ctx.arc(x, y, number ? radius : 5, 0, Math.PI * 2, false);
  ctx.stroke();
  ctx.textAlign = "center";
  if (number) {
    ctx.fillText(number, x, y + radius / 2);
  }
}

export function drawArrow(
  ctx,
  fromX,
  fromY,
  toX,
  toY,
  width,
  color,
  timerA,
  timerB,
  normalHeight,
  work,
  free
) {
  width = typeof width != "undefined" ? width : 1;
  // 计算各角度和对应的P2,P3坐标
  let angle;
  if (fromY !== toY) {
    if (fromY >= normalHeight - radius && fromY <= normalHeight + radius) {
      angle = (Math.atan2(0, fromX - toX) * 180) / Math.PI;
    } else {
      angle = (Math.atan2(fromY - toY, 0) * 180) / Math.PI;
    }
  } else {
    angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI;
  }
  let angle1 = ((angle + theta) * Math.PI) / 180,
    angle2 = ((angle - theta) * Math.PI) / 180,
    topX = headlen * Math.cos(angle1),
    topY = headlen * Math.sin(angle1),
    botX = headlen * Math.cos(angle2),
    botY = headlen * Math.sin(angle2);
  ctx.save();
  ctx.beginPath();
  let arrowX = fromX - topX,
    arrowY = fromY - topY;
  ctx.moveTo(arrowX, arrowY);
  ctx.moveTo(fromX, fromY);
  if (fromY !== toY) {
    if (fromY >= normalHeight - radius && fromY <= normalHeight + radius) {
      ctx.lineTo(fromX, toY);
      if (toX - fromX > timerA) {
        ctx.lineTo(fromX + timerA, toY);
        drawLine(fromX + timerA, toY, toX, ctx, free);
      } else {
        ctx.lineTo(toX, toY);
      }
      ctx.fillText(work, fromX + (toX - fromX) / 2, toY - 10);
      if (timerB !== 0 && timerB) {
        ctx.fillText(timerB, fromX + (toX - fromX) / 2, toY + 20);
      }
    } else {
      if (toX - fromX > timerA) {
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(fromX + timerA, fromY);
        drawLine(fromX + timerA, fromY, toX, ctx, timerB);
        ctx.moveTo(toX, fromY);
        ctx.lineTo(toX, toY);
      } else {
        ctx.beginPath();
        ctx.setLineDash([5, 10]);
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, fromY);
        ctx.moveTo(toX, fromY);
        ctx.lineTo(toX, toY);
        ctx.closePath();
      }
      ctx.fillText(work, fromX + (toX - fromX) / 2, fromY - 10);
      if (timerB) {
        ctx.fillText(timerB, fromX + (toX - fromX) / 2, fromY + 20);
      }
    }
  } else {
    if (free) {

      // ctx.lineTo(fromX + timerA, toY);
      drawLine(fromX + timerA, fromY, toX, ctx, free);
    } else {
      // ctx.lineTo(toX, fromY)
      ctx.lineTo(toX, toY);
    }
    ctx.fillText(work, fromX + (toX - fromX) / 2, toY - 10);
    if (timerB) {
      ctx.fillText(timerB, fromX + (toX - fromX) / 2, toY + 20);
    }
  }
  arrowX = toX + topX;
  arrowY = toY + topY;
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(toX, toY);
  arrowX = toX + botX;
  arrowY = toY + botY;
  ctx.lineTo(arrowX, arrowY);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.textAlign = "center";

  ctx.stroke();
  ctx.restore();
}

export function drawDash(ctx, fromX, fromY, toX, toY) {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.setLineDash([5, 10]);
  ctx.moveTo(toX, toY);
  ctx.closePath();
}

function drawLine(startX, y, endX, ctx, timerB) {
  let index = 1;
  for (let i = startX; i <= endX; i = i + (endX - startX) / timerB) {
    index++;
    ctx.lineTo(i, index % 2 == 0 ? y + 3 : y - 3);
  }
}
