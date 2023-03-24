export const postData = jest.fn(() => Promise.resolve());
export const getData = jest.fn(() => Promise.resolve());

export const getCurrentLocation = jest.fn((success) => {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      success ? resolve("resolved!") : reject("rejected"),
    );
  });
});
