let loading;
let currentNodePosition;

const setLoading = (payload) => {
  loading = payload;
};

const getLoading = () => loading;

const setCurrentNodePosition = (payload) => {
  currentNodePosition = payload;
};

const getCurrentNodePosition = () => currentNodePosition;

export {
  setLoading,
  getLoading,
  getCurrentNodePosition,
  setCurrentNodePosition,
};
