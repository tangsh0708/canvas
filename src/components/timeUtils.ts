import dayjs from 'dayjs'
let newArr: any[] = []
export function timeDeal(startTime, endTime, type: string) {
  const difference = Number(dayjs(endTime).diff(dayjs(startTime), type, true).toFixed(0)) + 1;
  return difference
}

export function timeSlice(startTime: any, endTime: any, timer: number = 1, array: any[]) {
  newArr = array;
  const dayLength = dayjs(startTime).daysInMonth()
  const newDate = dayjs(dayjs(startTime).format('YYYY-MM') + '-' + dayLength).format('YYYY-MM-DD')
  const newDateTime = new Date(newDate).getTime();
  if (new Date(endTime).getTime() > newDateTime) {
    newArr.push({
      year: dayjs(startTime).format('YYYY'),
      month: dayjs(startTime).format('MM'),
      day: timeDeal(startTime, newDate, 'day')
    });
    timeSlice(dayjs(newDateTime).add(timer, 'day').format('YYYY-MM-DD'), endTime, timer, newArr);
  } else {
    newArr.push({
      year: dayjs(startTime).format('YYYY'),
      month: dayjs(startTime).format('MM'),
      day: timeDeal(startTime, endTime, 'day')
    });
  }
  return newArr
}