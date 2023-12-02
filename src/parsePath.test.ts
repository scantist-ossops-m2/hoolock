import parsePath from "./parsePath";

// const createA

describe("parsePath", () => {
  const itParses = (name: string, path: string, keys: string[]) => {
    test(name, () => {
      expect(parsePath(path)).toEqual(keys);
    });
  };

  itParses("simple", "abc", ["abc"]);

  itParses("dot", "abc.def", ["abc", "def"]);

  itParses("bracket", "abc[def]", ["abc", "def"]);

  itParses("opening bracket", "[abc]def", ["abc", "def"]);

  itParses("bracket quote", 'abc["def"]', ["abc", "def"]);
  itParses("bracket singlequote", "abc['def']", ["abc", "def"]);

  // Quotes following dots is not valid object path syntax
  itParses("dot quote", 'abc."def"', ["abc", '"def"']);

  itParses("bracket quote escaped", 'abc["de\\"f"]', ["abc", 'de"f']);

  itParses("enquoted dot key", 'abc["def.ghi"]', ["abc", "def.ghi"]);

  itParses("enquoted bracket key", 'abc["def[ghi]"]', ["abc", "def[ghi]"]);

  itParses("broken bracket key", "abc[def.ghi[jkl]", ["abc[def", "ghi", "jkl"]);

  itParses("broken quotes", "abc[def\"ghi].j'k'l.mno", [
    "abc",
    'def"ghi',
    "j'k'l",
    "mno",
  ]);

  itParses(
    "long complex path",
    'abc.def[ghi].jkl["m\\"no"].pqr[stu].vwx["yz[abc]"]',
    ["abc", "def", "ghi", "jkl", 'm"no', "pqr", "stu", "vwx", "yz[abc]"]
  );
});
