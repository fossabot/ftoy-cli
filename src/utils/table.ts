export function generateTable(matrixLike: any[]): string {
  const matrix: any[][] = matrixLike.filter((e) => Array.isArray(e));
  const [header, ...body] = matrix;
  const maxTabNums: number[] = header.map((title: string, index: number) => {
    const col = body.map((e) => e[index]);
    const tabNums = col.map(calTabNum);
    return Math.max(...tabNums);
  });
  const spliter = "-".repeat(maxTabNums.reduce((a, b) => a + b, 0) * 8);
  const combine = [
    "",
    spliter,
    header.reduce((prev, cur, index) => {
      return prev + cur + "\t".repeat(maxTabNums[index]);
    }, ""),
    spliter,
    ...body.map((row) => {
      return row.reduce((prev, cur, index) => {
        return prev + cur + "\t".repeat(maxTabNums[index] - calTabNum(cur) + 1);
      }, "");
    }),
    spliter,
    "",
  ].join("\n");
  return combine;
}

export function calTabNum(target: string = "") {
  const length = getShowLength(String(target));
  return Math.floor(length / 8) + 1;
}

export function getShowLength(target: string = "") {
  const res = target.match(/[^\x00-\xff]/gi) || "";
  return target.length + res.length;
}
