import clone from "./clone";

describe("clone", () => {
  it("should clone objects", () => {
    const obj = {
      name: "John",
      address: {
        city: "New York",
        country: "USA",
      },
    };
    const clonedObj = clone(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj === obj).toBe(false);
    expect(clonedObj.address === obj.address).toBe(true);
  });

  it("should clone arrays", () => {
    const arr = [[1], [2], [3]];
    const clonedArr = clone(arr);
    expect(clonedArr).toEqual(arr);
    expect(clonedArr === arr).toBe(false);
  });

  it("should clone objects with symbol properties", () => {
    const symbol = Symbol("symbol"),
      symbolObj = {
        foo: "bar",
      };
    const obj = {
      [symbol]: symbolObj,
    };
    const cloned = clone(obj);
    expect(cloned === obj).toBe(false);
    expect(cloned[symbol] === obj[symbol]).toBe(true);
  });

  it("should return the same instance for primitive values", () => {
    expect(clone(null)).toBe(null);
    expect(clone(42)).toBe(42);
    expect(clone("hello")).toBe("hello");
    expect(clone(true)).toBe(true);
  });

  it("should clone dates", () => {
    const date = new Date();
    const clonedDate = clone(date);
    expect(clonedDate instanceof Date).toBe(true);
    expect(clonedDate.getTime()).toBe(date.getTime());
    expect(clonedDate === date).toBe(false);
  });

  it("should clone regexes", () => {
    const regex = /foo/g;
    const clonedRegex = clone(regex);
    expect(clonedRegex.source).toBe(regex.source);
    expect(clonedRegex.flags).toBe(regex.flags);
    expect(clonedRegex === regex).toBe(false);
  });

  it("should clone maps", () => {
    const map = new Map([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
    const clonedMap = clone(map);
    expect(clonedMap instanceof Map).toBe(true);
    expect(clonedMap).toEqual(map);
    expect(clonedMap === map).toBe(false);
  });

  it("should clone sets", () => {
    const set = new Set([1, 2, 3]);
    const clonedSet = clone(set);
    expect(clonedSet instanceof Set).toBe(true);
    expect(clonedSet).toEqual(set);
    expect(clonedSet === set).toBe(false);
  });

  it("should clone custom classes", () => {
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
    const clonedObj = clone(obj);
    expect(clonedObj instanceof Person).toBe(true);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj === obj).toBe(false);
  });

  it("should clone promises", async () => {
    const promise = Promise.resolve(42);
    const clonedPromise = clone(promise);
    expect(clonedPromise instanceof Promise).toBe(true);
    expect(await clonedPromise).toBe(42);
    expect(clonedPromise === promise).toBe(false);
  });

  it("should clone errors", () => {
    const error = new Error("error");
    const clonedError = clone(error);
    expect(clonedError instanceof Error).toBe(true);
    expect(clonedError).toEqual(error);
    expect(clonedError === error).toBe(false);
  });

  it("should not clone React elements", () => {
    const element = {
      $$typeof: Symbol.for("react.element") || 0xeac7,
      type: "div",
      props: {
        children: "Hello",
      },
    };
    const clonedElement = clone(element);
    expect(clonedElement).toEqual(element);
    expect(clonedElement === element).toBe(true);
  });
});
