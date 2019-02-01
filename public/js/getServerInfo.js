function copyToClipboard(elementId, classIndex) {
  // Create an auxiliary hidden input
  let aux = document.createElement("input");
  aux.setAttribute("value", document.getElementById(elementId).textContent);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);

  let tooltip = document.querySelectorAll(".tooltiptext")[classIndex];
  tooltip.textContent = "Copied!";
  tooltip.style.visibility = "visible";
  tooltip.style.opacity = "1";

  setTimeout(function() {
    tooltip.style.opacity = "0";
  }, 1200);
}

function convertToNewMapName(oldMapName) {
  maps = {
    Canyon: "Crossing",
    Town: "Hideout",
    Oilfield: "Refinery",
    Mountain: "Summit"
  };

  if (maps[oldMapName]) {
    return maps[oldMapName];
  } else {
    return oldMapName;
  }
}

function createPlayerCounter(data) {
  let divPlayerCounter = document.createElement("div");
  divPlayerCounter.classList.add("has-text-weight-semibold");

  let spanNumPlayers = document.createElement("span");
  spanNumPlayers.classList.add("is-size-1");
  spanNumPlayers.textContent = data.raw.numplayers;

  let spanMaxPlayers = document.createElement("span");
  spanMaxPlayers.classList.add("is-size-5");
  spanMaxPlayers.textContent = " / 9";

  divPlayerCounter.appendChild(spanNumPlayers);
  divPlayerCounter.appendChild(spanMaxPlayers);

  return divPlayerCounter;
}

function createMapGameMode(data) {
  let divMapGameMode = document.createElement("div");

  let spanMap = document.createElement("span");
  let classMap = ["is-size-6", "has-text-weight-semibold"];
  spanMap.classList.add(...classMap);
  spanMap.textContent = convertToNewMapName(data.map);

  let spanSeparator = document.createElement("span");
  spanSeparator.textContent = " - ";

  let spanGameMode = document.createElement("span");
  let classGameMode = ["is-size-7", "has-text-grey"];
  spanGameMode.classList.add(...classGameMode);
  spanGameMode.textContent = data.raw.rules.GameMode_s;

  divMapGameMode.appendChild(spanMap);
  divMapGameMode.appendChild(spanSeparator);
  divMapGameMode.appendChild(spanGameMode);

  return divMapGameMode;
}

function createPlayerList(data) {
  let players = data.players;
  let divPlayerList = document.createElement("div");

  if (players.length > 0) {
    let divDropdown = document.createElement("div");
    let classDropdown = ["dropdown", "is-hoverable"];
    divDropdown.classList.add(...classDropdown);

    let divDropdownTrigger = document.createElement("div");
    divDropdownTrigger.classList.add("dropdown-trigger");

    let a = document.createElement("a");
    let classA = [
      "is-size-6",
      "has-text-link",
      "is-unselectable",
      "has-text-weight-semibold"
    ];
    a.classList.add(...classA);
    a.textContent = "View Player List";

    let divDropdownMenu = document.createElement("div");
    divDropdownMenu.classList.add("dropdown-menu");

    let divDropdownContent = document.createElement("div");
    divDropdownContent.classList.add("dropdown-content");

    divPlayerList.appendChild(divDropdown);
    divDropdown.appendChild(divDropdownTrigger);
    divDropdownTrigger.appendChild(a);

    divDropdown.appendChild(divDropdownMenu);
    divDropdownMenu.appendChild(divDropdownContent);

    for (let i = 0; i < players.length; i++) {
      let divDropdownItem = document.createElement("div");
      divDropdownItem.classList.add("dropdown-item");

      let p = document.createElement("p");
      p.textContent = players[i].name;

      divDropdownItem.appendChild(p);
      divDropdownContent.appendChild(divDropdownItem);
    }

    return divPlayerList;
  } else {
    let divPlayerListNone = document.createElement("div");

    let classPlayerListNone = [
      "is-size-6",
      "has-text-grey",
      "has-text-weight-semibold"
    ];
    divPlayerListNone.classList.add(...classPlayerListNone);

    divPlayerListNone.textContent = "Player List Unavailable";

    divPlayerList.appendChild(divPlayerListNone);

    return divPlayerList;
  }
}

function createServerStatus1(bStatus) {
  let serverStatus1 = document.getElementById("serverStatus1");
  if (bStatus) {
    serverStatus1.classList.add("has-text-success");
    serverStatus1.textContent = "Online";
  } else {
    serverStatus1.classList.add("has-text-danger");
    serverStatus1.textContent = "Offline";
  }
}

function createServerStatus2(bStatus) {
  let serverStatus2 = document.getElementById("serverStatus2");
  if (bStatus) {
    serverStatus2.classList.add("has-text-success");
    serverStatus2.textContent = "Online";
  } else {
    serverStatus2.classList.add("has-text-danger");
    serverStatus2.textContent = "Offline";
  }
}

// fetch("http://localhost:4000/api/serverinfo1", { cache: "no-store" })
fetch("http://instactical.com/api/serverinfo1", {
  cache: "no-store"
})
  .then(function(response) {
    // console.log("response: " + response);
    // console.log("response.status: " + response.status);
    // console.log("response.status: " + response.json());

    if (response.status == 200) {
      return response.json();
    } else {
      throw new Error(
        "Failed all port attempts to connect to retrieve server info."
      );
    }
  })
  .then(data => {
    // let jsonData = JSON.stringify(data);
    createServerStatus1(true);
    let serverInfo1 = document.getElementById("serverInfo1");
    document.getElementById("loadingServer1Info").style.display = "none";
    document.getElementById("loadingServer1Info").style.visibility = "hidden";
    serverInfo1.appendChild(createPlayerCounter(data));
    serverInfo1.appendChild(createMapGameMode(data));
    serverInfo1.appendChild(createPlayerList(data));
  })
  .catch(err => {
    // Put server status to "Offline" and remove "Loading..."
    createServerStatus1(false);
    document.getElementById("loadingServer1Info").style.display = "none";
    document.getElementById("loadingServer1Info").style.visibility = "hidden";
    console.log("Error: " + err.message);
  });

// fetch("http://localhost:4000/api/serverinfo2", { cache: "no-store" })
fetch("http://instactical.com/api/serverinfo2", {
  cache: "no-store"
})
  .then(function(response) {
    if (response.status == 200) {
      return response.json();
    } else {
      throw new Error(
        "Failed all port attempts to connect to retrieve server info."
      );
    }
  })
  .then(data => {
    // let jsonData = JSON.stringify(data);
    createServerStatus2(true);
    let serverInfo2 = document.getElementById("serverInfo2");
    document.getElementById("loadingServer2Info").style.display = "none";
    document.getElementById("loadingServer2Info").style.visibility = "hidden";
    serverInfo2.appendChild(createPlayerCounter(data));
    serverInfo2.appendChild(createMapGameMode(data));
    serverInfo2.appendChild(createPlayerList(data));
  })
  .catch(err => {
    // Put server status to "Offline" and remove "Loading..."
    createServerStatus2(false);
    document.getElementById("loadingServer2Info").style.display = "none";
    document.getElementById("loadingServer2Info").style.visibility = "hidden";
    console.log("Error: " + err.message);
  });
