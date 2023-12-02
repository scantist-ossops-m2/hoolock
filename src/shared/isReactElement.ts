import type { Mapped } from "../types";

const isReactElement =
  /* @__PURE__ */
  (() => {
    const ELEMENT_TYPE =
      typeof Symbol === "function" && Symbol.for
        ? Symbol.for("react.element")
        : 0xeac7;

    function isReactElement(value: any) {
      return (
        typeof value === "object" &&
        value !== null &&
        isReactElement.Object(value)
      );
    }

    isReactElement.Object = function isReactElementObject(object: Mapped) {
      return object.$$typeof === ELEMENT_TYPE;
    };

    return isReactElement;
  })();

export default isReactElement;
