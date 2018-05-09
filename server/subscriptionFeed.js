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
    interval: 3000,
    update: (response, index) => {
      response.changes[0][1].value = index%2 === 0;
      return response;
    }
  },
  {
    path: [ "PANDA:SEQ1", "outc" ],
    index: 0,
    interval: 5000,
    update: (response, index) => {
      response.changes[0][1].value = index%2 === 0;
      return response;
    }
  }
]

function pathsMatch(a, b) {
  return a.length === b.length && a.every((a, i) => a === b[i]);
}

function checkForActiveSubscription(request, response, sendMethod) {
  const matchingUpdate = activeSubscriptions.findIndex(s => pathsMatch(s.path, request.path));

  if (matchingUpdate > -1) {
    let subscription = activeSubscriptions[matchingUpdate];
    const timer = setInterval(() => {
      subscription.index = subscription.index + 1;
      const updatedResponse = subscription.update(response, subscription.index);
      sendMethod(updatedResponse);
    }, subscription.interval);

    subscriptionTimers[response.id] = timer;
  }
}

function cancelAllSubscriptions() {
  Object.keys(subscriptionTimers).forEach(k => {
    clearInterval(subscriptionTimers[k]);
  })
}


module.exports = {
  checkForActiveSubscription,
  cancelAllSubscriptions
}