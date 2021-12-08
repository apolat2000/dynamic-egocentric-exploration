import {
  frameGraphAttributeAppend,
  urlRegex,
  explorationType,
  promptMessages,
  nodeSize,
} from "./constants";
import {
  setLoading,
  getLoading,
  setCurrentNodePosition,
  getCurrentNodePosition,
  getCurrentNodeId,
  setCurrentNodeId,
  addToDeadEndNodes,
  getDeadEndNodes,
} from "./state";

const nodeObjectHandler = (node) => {
  let geometry = new THREE.SphereGeometry(nodeSize, nodeSize, nodeSize);
  let material;
  if (getDeadEndNodes().includes(node.id))
    material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  else if (node.id === getCurrentNodeId())
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  else material = new THREE.MeshBasicMaterial({ color: 0x778899 });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

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

  setCurrentNodeId(node.id);

  if (getDeadEndNodes().includes(node.id)) return;

  let theNode;

  // already visited
  if (readNodesAndLinks().links.some((e) => e.source === node.id)) {
    if (explorationType === "free")
      document
        .querySelector("#forcegraph-tooltip")
        .setAttribute(
          "value",
          promptMessages.get("nothingNew").replace("#", node.name)
        );

    theNode = findNodeByName(node.name);

    setTimeout(function () {
      const nodePosition = theNode.__threeObj.position;
      setCurrentNodePosition(nodePosition);
      if (explorationType !== "free") moveCameraToPosition(nodePosition);
    }, 500);
    return;
  }

  setLoading(true);

  document
    .querySelector("#forcegraph-tooltip")
    .setAttribute(
      "value",
      promptMessages.get("loading").replace("#", node.name)
    );

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
      .setAttribute(
        "value",
        promptMessages.get("cantNavigate").replace("#", node.name)
      );
    addToDeadEndNodes(node.id);
  }

  document.getElementById("loader-wrapper").style.display = "none";
  document.getElementById("usage-blocker").style.display = "none";

  setLoading(false);

  setNodesAndLinks({ nodes: apiResponse.nodes, links: apiResponse.links });

  theNode = findNodeByName(node.name);

  setTimeout(function () {
    const nodePosition = theNode.__threeObj.position;
    setCurrentNodePosition(nodePosition);
    if (explorationType !== "free") moveCameraToPosition(nodePosition);
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
    window.alert(promptMessages.get(apiResponse.msg));
    document.getElementById("starting-web-page-submit").disabled = false;
    document.getElementById("starting-web-page-input").disabled = false;
    document.getElementById("loader-wrapper").style.display = "none";
    document.getElementById("starting-form-wrapper").style.display = "block";
    document.getElementById("usage-blocker").style.display = "block";
    return;
  }

  setNodesAndLinks({
    nodes: apiResponse.nodes,
    links: apiResponse.links,
  });

  setCurrentNodeId(apiResponse.nodes[0].id);

  document.getElementById("starting-modal").style.display = "none";
  document.getElementById("usage-blocker").style.display = "none";

  setLoading(false);
  if (explorationType !== "free") {
    window.setInterval(
      () =>
        moveCameraToPosition(getCurrentNodePosition() || { x: 0, y: 0, z: 0 }),
      1000
    );
  }
};

const moveCameraToPosition = (position) => {
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
  nodeObjectHandler,
};
