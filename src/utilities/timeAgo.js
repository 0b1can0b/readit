const timeAgo = (time) => {
  let time_ago = new Date() / 1000 - time;
  let time_text = "s";
  if (time_ago >= 60) {
    time_ago = time_ago / 60;
    time_text = "m";
    if (time_ago >= 60) {
      time_ago = time_ago / 60;
      time_text = "h";
      if (time_ago >= 24) {
        time_ago = time_ago / 24;
        time_text = "d";
        if (time_ago >= 30.437) {
          time_ago = time_ago / 30.437;
          time_text = "M";
          if (time_ago >= 12) {
            time_ago = time_ago / 12;
            time_text = "Y";
          }
        }
      }
    }
  }
  return `${time_ago.toFixed(2)}${time_text}`;
};

export default timeAgo;
