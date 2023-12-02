import testModules from "./test/testModules";

const test = async () => {
  const result = await testModules();
  result.print();
};

export default test;
