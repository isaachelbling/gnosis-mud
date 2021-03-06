'use strict';

/**
 * Account creation event
 */
module.exports = (srcPath) => {
  const Account = require(srcPath + 'Account');
  const EventUtil = require(srcPath + 'EventUtil');

  return {
    event: (state) => (socket, name) => {
      const write = EventUtil.genWrite(socket);
      const say = EventUtil.genSay(socket);

      let newAccount = null;
      write(`CONFIRM USERNAME: ${name} <cyan>[y/n]</cyan> `);

      socket.once('data', data => {
        data = data.toString('').trim();

        data = data.toLowerCase();
        if (data === 'y' || data === 'yes') {
          say('CREATING ACCOUNT...');
          newAccount = new Account({
            username: name
          });

          return socket.emit('change-password', socket, {
            account: newAccount,
            nextStage: 'create-player'
          });
        } else if (data && data === 'n' || data === 'no') {
          // say("Let's try again!");

          return socket.emit('login', socket);
        }

        return socket.emit('create-account', socket, name);
      });
    }
  };
};
