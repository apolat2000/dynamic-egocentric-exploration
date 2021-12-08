import { findNodeById } from "./utils";

let loading;
let inVR = false;

let currentNodePosition;
let currentNodeId;
let loadingNodeName;
let deadEndNodes = [];
let visitedNodes = [];

const setLoading = (payload) => {
  loading = payload;
};
const getLoading = () => loading;

const setInVR = (payload) => {
  inVR = payload;
};
const getInVR = () => inVR;

const setCurrentNodePosition = (payload) => {
  currentNodePosition = payload;
};
const getCurrentNodePosition = () => {
  return findNodeById(getCurrentNodeId()).__threeObj.position;
};

const setCurrentNodeId = (payload) => {
  currentNodeId = payload;
};
const getCurrentNodeId = () => currentNodeId;

const setLoadingNodeName = (payload) => {
  loadingNodeName = payload;
};
const getLoadingNodeName = () => loadingNodeName;

const addToDeadEndNodes = (id) => {
  deadEndNodes.push(id);
};
const getDeadEndNodes = () => deadEndNodes;

const addToVisitedNodes = (id) => {
  visitedNodes.push(id);
};
const getVisitedNodes = () => visitedNodes;

export {
  setLoading,
  getLoading,
  setInVR,
  getInVR,
  getCurrentNodePosition,
  setCurrentNodePosition,
  getCurrentNodeId,
  setCurrentNodeId,
  setLoadingNodeName,
  getLoadingNodeName,
  addToDeadEndNodes,
  getDeadEndNodes,
  addToVisitedNodes,
  getVisitedNodes,
};
