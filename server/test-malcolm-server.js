const WebSocket = require("ws");
const fs = require("fs");
const dataLoader = require("./loadCannedData");
const subscriptionFeed = require("./subscriptionFeed");

let settings = JSON.parse(fs.readFileSync("./server/server-settings.json"));

let pathIndexedMessages = dataLoader.loadDatabyPath("./server/canned_data/");
let subscriptions = [];
let subscribedPaths = {};

const port = 8000;
const io = new WebSocket.Server({ port });

io.on("connection", function(socket) {
  socket.on("message", message => {
    try {
      message = JSON.parse(message);
      handleMessage(socket, message);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("close", () => handleDisconnect());
  socket.on("error", (err) => {
    subscriptionFeed.cancelAllSubscriptions();
    subscriptions = [];
    subscribedPaths = {};
    console.log("errored");
    console.log(err);
  });
});


console.log("listening on port ", port);

function resetServer() {
  pathIndexedMessages = dataLoader.loadDatabyPath("./server/canned_data/");
  handleDisconnect();
}

function handleMessage(socket, message) {
  let simplifiedMessage = message;
  const originalId = message.id;
  delete simplifiedMessage.id;
  if (simplifiedMessage.typeid.indexOf("Unsubscribe") > -1) {
    handleUnsubscribe(socket, originalId);
  } else if (simplifiedMessage.typeid.indexOf("Put") > -1) {
    let response;
    let labelResponse = undefined;

    if (pathIndexedMessages[JSON.stringify(simplifiedMessage.path)]) {
      pathIndexedMessages[JSON.stringify(simplifiedMessage.path)].changes[0][1].value = simplifiedMessage.value;
      if (subscribedPaths[JSON.stringify(simplifiedMessage.path)]) {
        response = {
          id: parseInt(subscribedPaths[JSON.stringify(simplifiedMessage.path)]),
          typeid: "malcolm:core/Delta:1.0",
          changes: [
            [
              ["value"],
              pathIndexedMessages[JSON.stringify(simplifiedMessage.path)].changes[0][1].value
            ]
          ]
        };
        const tags = pathIndexedMessages[JSON.stringify(simplifiedMessage.path)].changes[0][1].meta.tags;
        if (tags !== undefined) {
          console.log(tags)
          const ind = tags.findIndex(val => (typeof val === "string" && val.indexOf("linkedvalue:") !== -1));
          if (ind !== -1) {
            tags[ind] = "";
            response.changes[1] = [["meta", "tags"], tags];
          }
        }
        console.log(response)
        sendResponse(socket, response);

        // update the block meta as well if it is the label being modified
        if (simplifiedMessage.path[simplifiedMessage.path.length - 1] === "label") {
          const blockMeta = pathIndexedMessages[JSON.stringify([simplifiedMessage.path[0], "meta"])];
          blockMeta.changes[0][1].label = simplifiedMessage.value;

          labelResponse = {
            //...blockMeta,
            typeid: "malcolm:core/Delta:1.0",
            changes: [
              [
                ["label"],
                simplifiedMessage.value
              ]
            ],
            id: parseInt(subscribedPaths[JSON.stringify([simplifiedMessage.path[0], "meta"])])
          };

          sendResponse(socket, labelResponse);
        }
      }

      response = { id: originalId, typeid: "malcolm:core/Return:1.0" };
    } else if (pathIndexedMessages[JSON.stringify([...simplifiedMessage.path].slice(0, -1))]) {
      // the last token in the path was something else

      const shortenedPath = JSON.stringify([...simplifiedMessage.path].slice(0, -1));
      let update = simplifiedMessage.value;

      // if it was the layout table then we need to update the rows
      if (simplifiedMessage.path[simplifiedMessage.path.length - 2] === "layout") {
        let originalTable = pathIndexedMessages[shortenedPath].changes[0][1].value;

        for (let i = 0; i < simplifiedMessage.value.mri.length; i++) {
          const matchingRow = originalTable.mri.findIndex(mri => mri === simplifiedMessage.value.mri[i]);
          if (matchingRow > -1) {
            originalTable.name[matchingRow] = simplifiedMessage.value.name[i];
            originalTable.visible[matchingRow] = simplifiedMessage.value.visible[i];
            originalTable.x[matchingRow] = simplifiedMessage.value.x[i];
            originalTable.y[matchingRow] = simplifiedMessage.value.y[i];
          }
        }

        update = originalTable;
      }

      const lastToken = simplifiedMessage.path.slice(-1);
      pathIndexedMessages[shortenedPath].changes[0][1][lastToken] = update;

      sendPutResponse(shortenedPath, lastToken, socket);
      response = { id: originalId, typeid: "malcolm:core/Return:1.0" };
    } else {
      response = buildErrorMessage(originalId, message);
    }
    sendResponse(socket, response);

    // if (labelResponse) {
    //   sendResponse(socket, labelResponse)
    // }

  } else if (pathIndexedMessages.hasOwnProperty(JSON.stringify(simplifiedMessage.path))) {
    let response = Object.assign({ id: originalId }, pathIndexedMessages[JSON.stringify(simplifiedMessage.path)]);

    if (simplifiedMessage.typeid.indexOf("Subscribe") > -1) {
      if (Object.keys(subscribedPaths).some(path => subscribedPaths[path] === originalId.toString())) {
        response = buildErrorMessage(originalId, "duplicate subscription ID on client");
        console.log(`duplicate subscription ID on client (id=${originalId})`);
      } else {
        subscriptions.push(originalId.toString());
        subscribedPaths[JSON.stringify(simplifiedMessage.path)] = originalId.toString();
        response = subscriptionFeed.checkForActiveSubscription(simplifiedMessage, response, socket);
      }
    }

    sendResponse(socket, response);

  } else {
    sendResponse(socket, buildErrorMessage(originalId, message));
  }
}

function sendPutResponse(jsonPath, changedProperty, socket) {
  if (subscribedPaths[jsonPath]) {
    response = {
      id: parseInt(subscribedPaths[jsonPath]),
      typeid: "malcolm:core/Delta:1.0",
      changes: [
        [
          ["value"],
          pathIndexedMessages[jsonPath].changes[0][1][changedProperty]
        ]
      ]
    };

    sendResponse(socket, response);
  }
}

function sendResponse(socket, message) {
  setTimeout(() => {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, Math.ceil(settings.delay));
}

function handleDisconnect() {
  console.log("client disconnected");
  subscriptionFeed.cancelAllSubscriptions();
  subscriptions = [];
  subscribedPaths = {};
}

function buildErrorMessage(id, message) {
  const errorResponse = {
    typeid: "malcolm:core/Error:1.0",
    id,
    message: "There was no canned response to the message: " + JSON.stringify(message)
  };
  return errorResponse;
}

function buildReturnMessage(id, value) {
  const response = {
    typeid: "malcolm:core/Return:1.0",
    id,
    value
  };
  return response;
}

function handleUnsubscribe(socket, id) {
  const index = subscriptions.indexOf(id.toString());
  if (index > -1) {
    subscriptions.splice(index, 1);
    sendResponse(socket, buildReturnMessage(id, null));
  } else {
    sendResponse(socket, {
      typeid: "malcolm:core/Error:1.0",
      id,
      message: "The id: " + id + " is not currently being subscribed"
    });
  }
}

module.exports = {
  resetServer
};