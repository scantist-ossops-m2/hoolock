import isPropertyKey from "./isPropertyKey";
import iterateProperties from "./iterateProperties";
import returnInitialArgument from "./returnInitialArgument";

type Setter<T extends object = Record<PropertyKey, any>> = (
  target: T & Record<PropertyKey, any>,
  value: any,
  key: PropertyKey,
  keyOverride?: PropertyKey
) => void;

export interface TransformProperty {
  key: PropertyKey;
  value: any;
  source: object;
  target: object;
}

export type TransformResult<T extends object = {}> = T extends any[]
  ? any[] & Record<PropertyKey, any>
  : Record<PropertyKey, any>;

declare namespace TransformRule {
  export interface _ {
    /**
     * If set to `true`, the property will be completely omitted from the result.
     */
    skip?: boolean;
    /**
     * Provide the original (or a new) value to set on the transformed object.
     */
    value?: any;
    /**
     * Optionally provide a new key for the property. Will default to the original key.
     */
    key?: PropertyKey;
  }

  export interface Skip extends _ {
    skip: true;
  }

  export interface Keep extends _ {
    skip?: false;
    value: any;
  }
}

export type TransformRule = TransformRule.Skip | TransformRule.Keep | boolean;

export type TransformCallback<P extends TransformProperty = TransformProperty> =
  (property: P) => TransformRule | void | undefined;

export type TransformPropertyCreator<
  P extends TransformProperty = TransformProperty,
> = (property: TransformProperty, sourcePath: PropertyKey[]) => P;

const arraySetter: Setter<any[]> = (target, value, key, keyOverride) => {
  if (isPropertyKey(keyOverride)) {
    target[keyOverride] = value;
  } else {
    target.push(value);
  }
};
const objectSetter: Setter = (target, value, key, keyOverride) => {
  target[isPropertyKey(keyOverride) ? keyOverride : key] = value;
};

const ruleSave = (property: TransformProperty): TransformRule._ => ({
  skip: false,
  value: property.value,
});

const getRule = (
  property: TransformProperty,
  transformer: TransformCallback
): TransformRule._ => {
  const result = transformer(property);
  switch (typeof result) {
    case "boolean": {
      if (result === false) return { skip: true };
      break;
    }
    case "object": {
      if (result !== null) return result;
      break;
    }
  }
  return ruleSave(property);
};

function transform(
  transformer: TransformCallback,
  createProperty: TransformPropertyCreator,
  target: object,
  source: object,
  currentPath: PropertyKey[]
) {
  const copy = (key: PropertyKey, value: any, setter: Setter) => {
    const prop = createProperty(
        {
          key,
          value,
          source,
          target,
        },
        currentPath
      ),
      rule = getRule(prop, transformer);
    if (rule.skip) return;
    setter(
      target,
      "value" in rule ? rule.value : prop.value,
      prop.key,
      rule.key
    );
  };
  let propertiesCallback: (name: string | symbol, value: any) => void;
  if (Array.isArray(source)) {
    const set = new Set<string | symbol>();
    source.forEach((value, i) => {
      copy(i, value, arraySetter);
      set.add(i.toString());
    });
    propertiesCallback = (name, value) =>
      !set.has(name) && copy(name, value, objectSetter);
  } else {
    propertiesCallback = (name, value) => copy(name, value, objectSetter);
  }
  iterateProperties(source, propertiesCallback);
  return target;
}

function transformObject(
  transformer: TransformCallback,
  target: object,
  source: object
): TransformResult;
function transformObject<P extends TransformProperty>(
  transformer: TransformCallback<P>,
  target: object,
  source: object,
  createProperty: TransformPropertyCreator<P>,
  path: PropertyKey[]
): TransformResult;
function transformObject(
  transformer: TransformCallback,
  target: object,
  source: object,
  ...custom: [TransformPropertyCreator, PropertyKey[]] | []
): TransformResult {
  const [createProperty, path] =
    custom.length === 2 ? custom : [returnInitialArgument, []];
  return transform(transformer, createProperty, target, source, path);
}

export default transformObject;
