import cloneDeep from "./cloneDeep";

describe("cloneDeep", () => {
  it("should deep clone objects", () => {
    const obj = {
      name: "John",
      address: {
        city: "New York",
        country: "USA",
      },
    };
    const clonedObj = cloneDeep(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
    expect(clonedObj.address).toEqual(obj.address);
    expect(clonedObj.address).not.toBe(obj.address);
  });

  it("should deep clone arrays", () => {
    const arr = [[1], [2], [3]];
    const clonedArr = cloneDeep(arr);
    expect(clonedArr).toEqual(arr);
    expect(clonedArr).not.toBe(arr);
    expect(clonedArr[0]).toEqual(arr[0]);
    expect(clonedArr[0]).not.toBe(arr[0]);
  });

  it("should deep clone objects with symbol properties", () => {
    const symbol = Symbol("symbol"),
      symbolObj = {
        foo: "bar",
      };
    const obj = {
      [symbol]: symbolObj,
    };
    const cloned = cloneDeep(obj);
    expect(cloned === obj).toBe(false);
    expect(cloned[symbol]).toEqual(symbolObj);
    expect(cloned[symbol] === obj[symbol]).toBe(false);
  });

  it("should return the same instance for primitive values", () => {
    expect(cloneDeep(null)).toBe(null);
    expect(cloneDeep(42)).toBe(42);
    expect(cloneDeep("hello")).toBe("hello");
    expect(cloneDeep(true)).toBe(true);
  });

  it("should clone dates", () => {
    const date = new Date();
    const clonedDate = cloneDeep(date);
    expect(clonedDate instanceof Date).toBe(true);
    expect(clonedDate.getTime()).toBe(date.getTime());
    expect(clonedDate === date).toBe(false);
  });

  it("should clone regexes", () => {
    const regex = /foo/g;
    const clonedRegex = cloneDeep(regex);
    expect(clonedRegex.source).toBe(regex.source);
    expect(clonedRegex.flags).toBe(regex.flags);
    expect(clonedRegex.lastIndex).toBe(regex.lastIndex);
    expect(clonedRegex === regex).toBe(false);
  });

  it("should deep clone maps", () => {
    const map = new Map([
      ["a", { value: 1 }],
      ["b", { value: 2 }],
      ["c", { value: 3 }],
    ]);
    const clonedMap = cloneDeep(map);
    expect(clonedMap).toEqual(map);
    expect(clonedMap).not.toBe(map);
    expect(clonedMap.get("a")).toEqual(map.get("a"));
    expect(clonedMap.get("a")).not.toBe(map.get("a"));
  });

  it("should deep clone sets", () => {
    const set = new Set([{ value: 1 }, { value: 2 }, { value: 3 }]);
    const clonedSet = cloneDeep(set);
    expect(clonedSet).toEqual(set);
    expect(clonedSet).not.toBe(set);
    set.forEach((item) => {
      const clonedItem = Array.from(clonedSet).find(
        (cloned) => cloned.value === item.value
      );
      expect(clonedItem).toEqual(item);
      expect(clonedItem).not.toBe(item); // Compare object references
    });

    // Ensure the sizes of the sets are the same
    expect(clonedSet.size).toBe(set.size);
  });

  it("should deep clone custom classes", () => {
    class Person {
      name: string;
      detail: {
        phone: number;
      };
      constructor(name: string, phone: number) {
        this.name = name;
        this.detail = {
          phone,
        };
      }
    }
    const obj = new Person("John", 1234567890);
    const clonedObj = cloneDeep(obj);
    expect(clonedObj instanceof Person).toBe(true);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
    expect(clonedObj.detail).toEqual(obj.detail);
    expect(clonedObj.detail).not.toBe(obj.detail);
  });

  it("should deep clone errors", () => {
    const error = new Error("foo");
    const clonedError = cloneDeep(error);
    expect(clonedError instanceof Error).toBe(true);
    expect(clonedError.message).toBe(error.message);
    expect(clonedError.stack).toBe(error.stack);
    expect(clonedError === error).toBe(false);
  });

  it("should deep clone promises", async () => {
    const result = { a: 1 };
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, 200);
    });
    const clone = cloneDeep(promise);
    expect(clone === promise).toBe(false);
    expect(clone instanceof Promise).toBe(true);
    const clonedResult = await clone;
    expect(clonedResult).toEqual(result);
    expect(clonedResult === result).toBe(false);
    // expect(clone).resolves.not.toBe(result);
  });

  it("should handle circular references", () => {
    const obj = { a: 1 } as any;
    obj.b = obj;
    const clonedObj = cloneDeep(obj);
    expect(clonedObj === obj).toBe(false);
    expect(clonedObj.a).toBe(1);
    expect(clonedObj === clonedObj.b).toBe(true);
    expect(clonedObj.b === obj.b).toBe(false);
  });
});
