import uniqueId from "lodash/uniqueId";

export const getData = () => {
  return new Array(3).fill({}).map(() => {
    const id = uniqueId();
    return {
      id,
      title: "测试" + id,
      createTime: "2023-01-01",
      totalQuantity: 10012121,
      labelCategory: 1,
      labelCount: 300,
      annotated: 300,
      unannotated: 300,
    };
  });
};
