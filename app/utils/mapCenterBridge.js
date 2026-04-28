let _getBounds = null;

export const registerGetBounds = (fn) => {
  _getBounds = fn;
};

export const getMapBounds = () => _getBounds?.() ?? null;
