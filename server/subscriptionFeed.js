const alarmStates = [

]

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
    },
  },
  {
    path: [ "PANDA:INENC1", "val" ],
    index: 0,
    interval: 50,
    update: (response, index) => {
      const val = 180*(((index%500)/250)-1);
      response.changes[0][1].value = val;
      if (val > -120 && val < 120) {
        response.changes[0][1].alarm.severity = 0;
      } else if ((val > 120 && val < 160) || (val > -160 && val < -120)) {
        response.changes[0][1].alarm.severity = 1;
      } else {
        response.changes[0][1].alarm.severity = 2;
      }

      //response.changes[0][1].timeStamp.secondsPastEpoch += 180;

      response.changes[0][1].timeStamp.nanoseconds += 5e7;
      if (response.changes[0][1].timeStamp.nanoseconds >= 1e9) {
        response.changes[0][1].timeStamp.nanoseconds = 0;
        response.changes[0][1].timeStamp.secondsPastEpoch += 1;
      }

      return response;
    },
  },
  {
    path: [ "PANDA:INENC1", "a" ],
    index: 0,
    interval: 200,
    update: (response, index) => {
      response.changes[0][1].value = (index%4 < 2) ;
      response.changes[0][1].timeStamp.nanoseconds += 2e8;
      if (response.changes[0][1].timeStamp.nanoseconds >= 1e9) {
        response.changes[0][1].timeStamp.nanoseconds = 0;
        response.changes[0][1].timeStamp.secondsPastEpoch += 1;
      }
      return response;
    },
  },
  {
    path: [ "PANDA:INENC1", "b" ],
    index: 0,
    interval: 200,
    update: (response, index) => {
      response.changes[0][1].value = ((index+1)%4 < 2);
      response.changes[0][1].timeStamp.nanoseconds += 2e8;
      if (response.changes[0][1].timeStamp.nanoseconds >= 1e9) {
        response.changes[0][1].timeStamp.nanoseconds = 0;
        response.changes[0][1].timeStamp.secondsPastEpoch += 1;
      }
      return response;
    },
  },
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

    return subscription.update(response, subscription.index);
  }

  return response;
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