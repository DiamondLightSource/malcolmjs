let subscriptionTimers = {};

const activeSubscriptions = [
  {
    path: [ "PANDA:SEQ1", "inputs" ],
    index: 0,
    interval: 10000,
    update: (response, index) => {
      let updatedResponse = response;
      updatedResponse.changes[0][1].value = index%2 === 0 ? 'expanded' : 'collapsed';
      
      return updatedResponse;
    }
  },
  {
    path: [ "PANDA:SEQ1", "outa" ],
    index: 0,
    interval: 1000,
    update: (response, index) => {
      response.changes[0][1].value = index%2 === 0;
      return response;
    }
  },
  {
    path: [ "PANDA:SEQ1", "outc" ],
    index: 0,
    interval: 3000,
    update: (response, index) => {
      response.changes[0][1].value = index%2 === 0;
      return response;
    }
  }
]

function pathsMatch(a, b) {
  return a.length === b.length && a.every((a, i) => a === b[i]);
}

function sendResponse(socket, message) {
  if (socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify(message))
  }
}

function checkForActiveSubscription(request, response, socket) {
  const matchingUpdate = activeSubscriptions.findIndex(s => pathsMatch(s.path, request.path));

  if (matchingUpdate > -1) {
    let subscription = activeSubscriptions[matchingUpdate];
    const timer = setInterval(() => {
      subscription.index = subscription.index + 1;
      const updatedResponse = subscription.update(response, subscription.index);
      sendResponse(socket, updatedResponse);
    }, subscription.interval);

    if (subscriptionTimers[response.id]) {
      console.log(`timer already exists for ${subscription.path}`)
      clearInterval(subscriptionTimers[response.id]);
    }

    subscriptionTimers[response.id] = timer;
  }
}

function cancelAllSubscriptions() {
  Object.keys(subscriptionTimers).forEach(k => {
    clearInterval(subscriptionTimers[k]);
  })
  subscriptionTimers = {};
}


module.exports = {
  checkForActiveSubscription,
  cancelAllSubscriptions
}