const registry = new Map();
let nextId = 0;

export const registerCallback = (fn) => {
  const id = `nav_cb_${nextId++}`;
  registry.set(id, fn);
  return id;
};

export const invokeCallback = (id, value) => {
  const fn = registry.get(id);
  if (fn) {
    registry.delete(id);
    fn(value);
  }
};
