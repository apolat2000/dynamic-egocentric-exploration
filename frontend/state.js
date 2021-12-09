import { findNodeById } from "./utils";

let loading;
let inVR = false;
let forwardMovementIntervalId;

let egocentricMovementIntervalId;

let currentNodePosition;
let currentNodeId;

let loadingNodeName;

let deadEndNodes = [];
let visitedNodes = [];

let currentGraph = { nodes: [], links: [] };

const setLoading = (payload) => {
  loading = payload;
};
const getLoading = () => loading;

const setInVR = (payload) => {
  inVR = payload;
};
const getInVR = () => inVR;

const setCurrentGraph = (payload) => {
  currentGraph = payload;
};
const getCurrentGraph = () => currentGraph;

const setForwardMovementIntervalId = (payload) => {
  forwardMovementIntervalId = payload;
};
const getForwardMovementIntervalId = () => forwardMovementIntervalId;

const setEgocentricMovementIntervalId = (payload) => {
  egocentricMovementIntervalId = payload;
};
const getEgocentricMovementIntervalId = () => egocentricMovementIntervalId;

const setCurrentNodePosition = (payload) => {
  currentNodePosition = payload;
};
const getCurrentNodePosition = () =>
  findNodeById(getCurrentNodeId()).__threeObj.position;

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

const getNVisitedNodes = () => visitedNodes.length;

export {
  setLoading,
  getLoading,
  setInVR,
  getInVR,
  setForwardMovementIntervalId,
  getForwardMovementIntervalId,
  setEgocentricMovementIntervalId,
  getEgocentricMovementIntervalId,
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
  getNVisitedNodes,
  setCurrentGraph,
  getCurrentGraph,
};
