module.exports = calculateTimer = (timerData) => {
  let timer =
    timerData.minutes +
    " " +
    timerData.hour +
    " " +
    timerData.dayOfMonth +
    " " +
    timerData.month +
    " " +
    timerData.dayOfWeek;

  if (timerData.seconds && timerData.seconds.trim() !== "") {
    timer = timerData.seconds + " " + timer;
  }

  console.log(timer);
};
