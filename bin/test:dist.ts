import testModules from "./test/testModules";
import testTreeshaking from "./test/testTreeshaking";

export default async () => {
  const r1 = await testModules(),
    r2 = await testTreeshaking();

  r1.print();
  r2.print();
};
