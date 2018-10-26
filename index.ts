(async () => {
  const a = await Promise.all([
    new Promise((resolve, reject) => {
      resolve(0);
      //   reject(1);
    }),
    new Promise((resolve, reject) => {
      resolve(0);
    }),
    new Promise((resolve, reject) => {
      resolve(0);
      //   reject(1);
    }),
    new Promise((resolve, reject) => {
      resolve(0);
    }),
  ]);
  console.log(a);
})();
