import { frameGraphAttributeAppend, urlRegex } from "./constants";
import {
  setLoading,
  getLoading,
  setCurrentNodePosition,
  getCurrentNodePosition,
} from "./state";

const apiConnector = (webPageURL, currentGraph, endpointURL) => {
  return fetch(`http://10.101.249.13:8000/${endpointURL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      webPageURL,
      currentGraph,
    }),
  });
};

const readNodesAndLinks = () => {
  const el = document.getElementById("forcegraph");
  const attr = el.getAttribute("forcegraph");
  const links = attr.links.map((e) => ({
    source: e.source.id,
    target: e.target.id,
  }));
  const nodes = attr.nodes.map((e) => ({ url: e.url, name: e.name, id: e.id }));
  return {
    nodes,
    links,
  };
};

const setNodesAndLinks = (newGraph) => {
  const nodes = JSON.stringify(
    newGraph.nodes.map((e) => ({ url: e.url, name: e.name, id: e.id }))
  );
  const links = JSON.stringify(
    newGraph.links.map((e) => ({ source: e.source, target: e.target }))
  );
  const el = document.getElementById("forcegraph");
  el.setAttribute(
    "forcegraph",
    `nodes: ${nodes}; links: ${links}; ${frameGraphAttributeAppend}`
  );
};

const clickHandler = async (node) => {
  if (getLoading()) {
    return;
  }

  let theNode;

  document
    .querySelector("#forcegraph-tooltip")
    .setAttribute("value", `Clicked on ${node.name}!`);

  // already visited
  if (readNodesAndLinks().links.some((e) => e.source === node.id)) {
    theNode = findNodeByName(node.name);

    setTimeout(function () {
      const nodePosition = theNode.__threeObj.position;
      setCurrentNodePosition(nodePosition);
      moveCameraToPosition(nodePosition);
    }, 500);
    return;
  }

  setLoading(true);

  document.getElementById("loader-wrapper").style.display = "block";
  document.getElementById("usage-blocker").style.display = "block";

  const apiResponse = await (
    await apiConnector(
      node.url,
      readNodesAndLinks(),
      "get-neighboring-web-pages-as-graph"
    )
  ).json();

  if (apiResponse.errorCode === 0) {
    document
      .querySelector("#forcegraph-tooltip")
      .setAttribute("value", apiResponse.msg);
  }

  document.getElementById("loader-wrapper").style.display = "none";
  document.getElementById("usage-blocker").style.display = "none";

  setLoading(false);

  if (apiResponse.success)
    setNodesAndLinks({ nodes: apiResponse.nodes, links: apiResponse.links });

  theNode = findNodeByName(node.name);

  setTimeout(function () {
    const nodePosition = theNode.__threeObj.position;
    setCurrentNodePosition(nodePosition);
    moveCameraToPosition(nodePosition);
  }, 500);

  return;
};

const findNodeByName = (name) => {
  return document
    .getElementById("forcegraph")
    .getAttribute("forcegraph")
    .nodes.find((e) => e.name == name);
};

const hoverHandler = (node) => {
  document
    .querySelector("#forcegraph-tooltip")
    .setAttribute("value", node ? node.name : "");
};

const submitURLHandler = async (event) => {
  event.preventDefault();

  const inputValue =
    document.getElementById("starting-web-page-input").value ||
    "https://apolat2000.github.io/";

  if (!inputValue.match(urlRegex)) {
    window.alert("Bad webPageURL.");
    document.getElementById("starting-web-page-input").value = "";
    return;
  }

  setLoading(true);

  document.getElementById("starting-web-page-submit").disabled = true;
  document.getElementById("starting-web-page-input").disabled = true;
  document.getElementById("starting-form-wrapper").style.display = "none";
  document.getElementById("loader-wrapper").style.display = "block";
  document.getElementById("starting-web-page-input").value = "";

  const apiResponse = await (
    await apiConnector(
      inputValue,
      readNodesAndLinks(),
      "get-neighboring-web-pages-as-graph"
    )
  ).json();

  if (!apiResponse.success) {
    window.alert(apiResponse.msg);
    document.getElementById("starting-web-page-submit").disabled = false;
    document.getElementById("starting-web-page-input").disabled = false;
    document.getElementById("loader-wrapper").style.display = "none";
    document.getElementById("starting-form-wrapper").style.display = "block";
    document.getElementById("usage-blocker").style.display = "block";
    return;
  }

  document.getElementById("starting-modal").style.display = "none";
  document.getElementById("usage-blocker").style.display = "none";

  setLoading(false);
  window.setInterval(
    () =>
      moveCameraToPosition(getCurrentNodePosition() || { x: 0, y: 0, z: 0 }),
    1000
  );

  setNodesAndLinks({ nodes: apiResponse.nodes, links: apiResponse.links });
};

const moveCameraToPosition = (position) => {
  console.log("hey");
  const camera = document.getElementById("camera");
  //   const currentNodePosition = getCurrentNodePosition();
  //   if (!currentNodePosition) {
  //     return;
  //   }
  camera.setAttribute("position", `${position.x} ${position.y} ${position.z}`);
  return;
};

export {
  readNodesAndLinks,
  setNodesAndLinks,
  hoverHandler,
  clickHandler,
  submitURLHandler,
  moveCameraToPosition,
};
