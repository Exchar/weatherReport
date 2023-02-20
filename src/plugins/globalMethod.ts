// eslint-disable-next-line no-extend-native
// @ts-ignore
// eslint-disable-next-line no-extend-native
Array.prototype.arrDistinctByProp = function (prop: string) {
  console.log(this);
  const arr = this;
  return arr.filter((item, index, self) => self.findIndex((el) => el[prop] == item[prop]) === index);
};

export {};
