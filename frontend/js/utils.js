import {
  frameGraphAttributeAppend,
  nodeResolution,
  linkWidth,
} from "./derived";
import { urlRegex, promptMessages } from "./constants";
import {
  setLoading,
  getLoading,
  setCurrentNodePosition,
  getCurrentNodePosition,
  getCurrentNodeId,
  setCurrentNodeId,
  setLoadingNodeName,
  getLoadingNodeName,
  addToDeadEndNodes,
  getDeadEndNodes,
  addToVisitedNodes,
  getVisitedNodes,
  setCurrentGraph,
  getCurrentGraph,
  setEgocentricMovementIntervalId,
  getEgocentricMovementIntervalId,
  initTimer,
  getTimeDifference,
  incrementBackendElapsedTime,
} from "./store/runtime";
import {
  getNodeSize,
  getExploratoryInterface,
  getLinkColor,
  getLinkOpacity,
  getDefaultURL,
} from "./store/settings";

const linkHasCurrentNodeAsSource = ({ source, target }) => {
  return getCurrentNodeId() === source;
};

const linkHasCurrentNodeAsTarget = ({ source, target }) => {
  return getCurrentNodeId() === target;
};

const linkIsConnectedToCurrentNode = ({ source, target }) => {
  return (
    linkHasCurrentNodeAsSource({ source, target }) ||
    linkHasCurrentNodeAsTarget({ source, target })
  );
};

const nodeIsChildOfCurrentNode = (id) => {
  return getCurrentGraph().links.some(
    (e) => e.target === id && e.source === getCurrentNodeId()
  );
};

const nodeObjectHandler = (node) => {
  const geometry = new THREE.SphereGeometry(
    getNodeSize(),
    nodeResolution(),
    nodeResolution()
  );
  let material;
  if (getDeadEndNodes().includes(node.id) /* is dead end */)
    material = new THREE.MeshBasicMaterial({ color: 0xff0000 /* red */ });
  else if (node.id === getCurrentNodeId() /* is current node */)
    material = new THREE.MeshBasicMaterial(
      getExploratoryInterface() === "free"
        ? { color: 0x00ff00 /* green */ }
        : { visible: false }
    );
  else if (
    getExploratoryInterface() !== "free" &&
    nodeIsChildOfCurrentNode(node.id)
  )
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 /* green */ });
  else if (getVisitedNodes().includes(node.id))
    material = new THREE.MeshBasicMaterial({
      color: 0x999900 /* yellow */,
    });
  else material = new THREE.MeshBasicMaterial({ color: 0x778899 /* gray */ });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

const linkObjectHandler = (link) => {
  let geometry;
  let material;
  if (getExploratoryInterface() === "free") {
    geometry = new THREE.CylinderGeometry(linkWidth(), linkWidth(), 2, 2);
    material = new THREE.MeshLambertMaterial({
      color: getLinkColor(),
      opacity: getLinkOpacity(),
      transparent: true,
      visible:
        !linkHasCurrentNodeAsSource(link) ||
        getExploratoryInterface() === "free",
    });
  } else {
    geometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 2);
    material = new THREE.MeshLambertMaterial({
      color: getLinkColor(),
      opacity: getLinkOpacity(),
      transparent: true,
      visible:
        !linkHasCurrentNodeAsSource(link) ||
        getExploratoryInterface() === "free",
    });
  }
  return new THREE.Mesh(geometry, material);
};

const moveCameraToPosition = ({ x, y, z }) => {
  const rig = document.getElementById("camera-rig");
  rig.setAttribute(
    "animation",
    `property: position; dur: 800; to: ${x} ${y} ${z}; easing: linear;`
  );
  setTimeout(() => {
    rig.setAttribute("position", ` ${x} ${y} ${z}`);
  }, 800);
  return;
};

const moveForwards = () => {
  const camera = document.getElementById("camera");
  const rig = document.getElementById("camera-rig");
  const {
    x: posX,
    y: posY,
    z: posZ,
  } = new THREE.Vector3().setFromMatrixPosition(camera.object3D.matrixWorld);
  const rot = camera.getAttribute("rotation");
  rig.setAttribute(
    "animation",
    `property: position; dur: 200; to: ${posX - rot.y / 10} ${
      posY + rot.x / 10
    } ${posZ}; easing: linear;`
  );
  setTimeout(() => {
    rig.object3D.position.set(posX - rot.y / 10, posY + rot.x / 10, posZ);
  }, 200);
};

const apiConnector = (webPageURL, currentGraph, currentTimer, endpointURL) => {
  return fetch(`http://localhost:8000/${endpointURL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      webPageURL,
      currentGraph,
      currentTime: currentTimer,
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
    `nodes: ${nodes}; links: ${links}; ${frameGraphAttributeAppend()}`
  );
};

const clickHandler = async (node) => {
  if (getLoading()) {
    return;
  }

  setCurrentNodeId(node.id);

  if (getDeadEndNodes().includes(node.id)) return;

  if (getExploratoryInterface() !== "free")
    clearInterval(getEgocentricMovementIntervalId());

  // already visited
  if (readNodesAndLinks().links.some((e) => e.source === node.id)) {
    if (getExploratoryInterface() === "free")
      document
        .querySelector("#forcegraph-tooltip")
        .setAttribute(
          "value",
          promptMessages.get("nothingNew").replace("#", node.name)
        );

    setTimeout(function () {
      const nodePosition = getCurrentNodePosition();
      setCurrentNodePosition(nodePosition);
      if (getExploratoryInterface() !== "free")
        moveCameraToPosition(nodePosition);
    }, 1);
    return;
  }

  setLoading(true);
  setLoadingNodeName(node.name);

  document
    .querySelector("#forcegraph-tooltip")
    .setAttribute(
      "value",
      promptMessages.get("loading").replace("#", getLoadingNodeName())
    );

  document.getElementById("loader-wrapper").style.display = "block";
  document.getElementById("usage-blocker").style.display = "block";

  const apiResponse = await (
    await apiConnector(
      node.url,
      readNodesAndLinks(),
      getTimeDifference(),
      "get-neighboring-web-pages-as-graph"
    )
  ).json();

  incrementBackendElapsedTime(apiResponse.elapsedTime);

  setCurrentGraph({ nodes: apiResponse.nodes, links: apiResponse.links });

  document.getElementById("loader-wrapper").style.display = "none";
  document.getElementById("usage-blocker").style.display = "none";

  setLoadingNodeName(null);
  setLoading(false);

  if (apiResponse.msg === "cantNavigate" || apiResponse.msg === "deadEnd") {
    document
      .querySelector("#forcegraph-tooltip")
      .setAttribute(
        "value",
        promptMessages.get(apiResponse.msg).replace("#", node.name)
      );
    addToDeadEndNodes(node.id);
    findNodeById(node.id).__threeObj.material.color = new THREE.Color(0xff0000);
    return;
  }

  addToVisitedNodes(node.id);

  setNodesAndLinks({ nodes: apiResponse.nodes, links: apiResponse.links });

  if (getExploratoryInterface() !== "free")
    setEgocentricMovementIntervalId(
      window.setInterval(
        () =>
          moveCameraToPosition(
            getCurrentNodePosition() || { x: 0, y: 0, z: 0 }
          ),
        800
      )
    );

  return;
};

const findNodeById = (id) => {
  return document
    .getElementById("forcegraph")
    .getAttribute("forcegraph")
    .nodes.find((e) => e.id == id);
};

const hoverHandler = (node) => {
  if (getLoading())
    document
      .querySelector("#forcegraph-tooltip")
      .setAttribute(
        "value",
        promptMessages.get("loading").replace("#", getLoadingNodeName())
      );
  else
    document
      .querySelector("#forcegraph-tooltip")
      .setAttribute("value", node ? node.name : "");
};

const submitURLHandler = async () => {
  const inputValue =
    document.getElementById("starting-web-page-input").value || getDefaultURL();

  if (!inputValue.match(urlRegex)) {
    window.alert("Bad webPageURL.");
    document.getElementById("starting-web-page-input").value = "";
    return;
  }

  document.getElementById("starting-web-page-submit").disabled = true;
  document.getElementById("starting-web-page-input").disabled = true;
  document.getElementById("starting-form-wrapper").style.display = "none";
  document.getElementById("loader-wrapper").style.display = "block";
  document.getElementById("starting-web-page-input").value = "";

  initTimer();

  const apiResponse = await (
    await apiConnector(
      inputValue,
      readNodesAndLinks(),
      getTimeDifference(),
      "get-neighboring-web-pages-as-graph"
    )
  ).json();

  setCurrentGraph({ nodes: apiResponse.nodes, links: apiResponse.links });

  if (!apiResponse.success) {
    window.alert(promptMessages.get(apiResponse.msg));
    document.getElementById("starting-web-page-submit").disabled = false;
    document.getElementById("starting-web-page-input").disabled = false;
    document.getElementById("loader-wrapper").style.display = "none";
    document.getElementById("starting-form-wrapper").style.display = "block";
    document.getElementById("usage-blocker").style.display = "block";
    return;
  }

  addToVisitedNodes(apiResponse.webPageId);

  setNodesAndLinks({
    nodes: apiResponse.nodes,
    links: apiResponse.links,
  });

  setCurrentNodeId(apiResponse.webPageId);

  document.getElementById("starting-modal").style.display = "none";
  document.getElementById("usage-blocker").style.display = "none";

  if (apiResponse && getExploratoryInterface() !== "free") {
    setEgocentricMovementIntervalId(
      window.setInterval(
        () =>
          moveCameraToPosition(
            getCurrentNodePosition() || { x: 0, y: 0, z: 0 }
          ),
        800
      )
    );
  }
};

export {
  readNodesAndLinks,
  setNodesAndLinks,
  hoverHandler,
  clickHandler,
  submitURLHandler,
  moveCameraToPosition,
  moveForwards,
  nodeObjectHandler,
  linkObjectHandler,
  findNodeById,
};
