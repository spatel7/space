var shorten = function(str) {
  str = str.replace("http://", "");
  if (str.length > 32) {
    str = str.slice(0,14) + "..." + str.slice(str.length-14);
  }
  return str;
}