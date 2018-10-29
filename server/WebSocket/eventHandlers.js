const users = {};

const login = (connection, data) => {
  console.log('User logged in: ' + data.name)
  if (users[data.name]) {
    sendTo(connection, {
      type: "login",
      success: false
    });
  } else {
    users[data.name] = connection;
    connection.name = data.name;

    sendTo(connection, {
      type: "login",
      success: true
    });
  }
}

const offer = (connection, data) => {
  console.log('Sending offer to: ' + data.name);

  let conn = users[data.name];

  if (conn !== null) {
    connection.otherName = data.name;

    sendTo(conn, {
      type: 'offer',
      offer: data.offer,
      name: connection.name
    })
  }
}

const answer = (connection, data) => {
  console.log('Sending answer to: ', + data.name);
  let conn = users[data.name];

  if (conn !== null) {
    connection.otherName = data.name;
    sendTo(conn, {
      type: 'answer',
      answer: data.answer
    })
  }
}

const sendTo = (connection, message) => {
  connection.send(JSON.stringify(message));
}

module.exports.login = login;
module.exports.offer = offer;
module.exports.answer = answer;
