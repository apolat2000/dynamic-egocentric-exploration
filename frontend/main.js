let loading = false;

document.getElementById("starting-web-page-submit").addEventListener(
  "click",
  async function (event) {
    event.preventDefault();

    const inputValue =
      document.getElementById("starting-web-page-input").value ||
      "https://apolat2000.github.io/";

    loading = true;

    document.getElementById("starting-web-page-submit").disabled = true;
    document.getElementById("starting-web-page-input").disabled = true;
    document.getElementById("starting-form-wrapper").style.display = "none";
    document.getElementById("loader-wrapper").style.display = "block";
    document.getElementById("starting-web-page-input").value = "";

    const apiResponse = await (
      await apiConnector(inputValue, "get-neighboring-web-pages-as-graph")
    ).json();

    if (!apiResponse.success) {
      window.alert(apiResponse.msg);
      document.getElementById("starting-web-page-submit").disabled = false;
      document.getElementById("starting-web-page-input").disabled = false;
      document.getElementById("loader-wrapper").style.display = "none";
      document.getElementById("starting-form-wrapper").style.display = "block";
      return;
    }

    document.getElementById("loader-wrapper").style.display = "none";

    loading = false;
  },
  false
);

function apiConnector(webPageURL, endpointURL) {
  return fetch(`http://10.101.249.13:8000/${endpointURL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ webPageURL }),
  });
}
