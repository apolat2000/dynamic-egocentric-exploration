const frameGraphAttributeAppend =
  "node-auto-color-by: group; node-rel-size: 8; link-directional-arrow-length: 1.5; link-directional-arrow-rel-pos: 1; on-node-hover: node => hoverHandler(node); on-node-click: node => clickHandler(node)";

document
  .getElementById("forcegraph")
  .setAttribute("forcegraph", frameGraphAttributeAppend);

let loading = false;

const urlRegex = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
);

function readNodesAndLinks() {
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
}

function setNodesAndLinks(newGraph) {
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
}

const hoverHandler = (node) => {
  document
    .querySelector("#forcegraph-tooltip")
    .setAttribute("value", node ? node.name : "");
};

const clickHandler = async (node) => {
  document
    .querySelector("#forcegraph-tooltip")
    .setAttribute("value", `Clicked on ${node.name}!`);

  // already visited
  if (readNodesAndLinks().links.some((e) => e.source === node.id)) {
    return;
  }

  loading = true;
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

  loading = false;

  if (apiResponse.success)
    setNodesAndLinks({ nodes: apiResponse.nodes, links: apiResponse.links });
};

document.getElementById("starting-web-page-submit").addEventListener(
  "click",
  async function (event) {
    event.preventDefault();

    const inputValue =
      document.getElementById("starting-web-page-input").value ||
      "https://apolat2000.github.io/";

    if (!inputValue.match(urlRegex)) {
      window.alert("Bad webPageURL.");
      document.getElementById("starting-web-page-input").value = "";
      return;
    }

    loading = true;

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

    loading = false;
    setNodesAndLinks({ nodes: apiResponse.nodes, links: apiResponse.links });
  },
  false
);

function apiConnector(webPageURL, currentGraph, endpointURL) {
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
}
