let loading;
let currentNodePosition;
let currentNodeId;
let deadEndNodes = [];

const setLoading = (payload) => {
  loading = payload;
};

const getLoading = () => loading;

const setCurrentNodePosition = (payload) => {
  currentNodePosition = payload;
};

const getCurrentNodePosition = () => currentNodePosition;

const setCurrentNodeId = (payload) => {
  currentNodeId = payload;
};

const getCurrentNodeId = () => currentNodeId;

const addToDeadEndNodes = (id) => {
  deadEndNodes.push(id);
};

const getDeadEndNodes = () => deadEndNodes;

export {
  setLoading,
  getLoading,
  getCurrentNodePosition,
  setCurrentNodePosition,
  getCurrentNodeId,
  setCurrentNodeId,
  addToDeadEndNodes,
  getDeadEndNodes,
};
