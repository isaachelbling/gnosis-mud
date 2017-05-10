'use strict';

module.exports = (srcPath) => {
  const Data = require(srcPath + 'Data');
  const Account = require(srcPath + 'Account');
  const Logger = require(srcPath + 'Logger');

  return {
    event: state => (socket, args) => {
      if (!args || !args.dontwelcome) {
        socket.write('USERNAME: ');
      }

      socket.once('data', name => {
        name = name.toString().trim();

        const invalid = Account.validateName(name);
        if (invalid) {
          socket.write(invalid + '\r\n');
          return socket.emit('login', socket);
        }

        name = name[0].toUpperCase() + name.slice(1);

        let account = Data.exists('account', name);

        // That player account doesn't exist so ask if them to create it
        if (!account) {
          Logger.error(`ACCOUNT DOES NOT EXIST: ${name}`);
          return socket.emit('create-account', socket, name);
        }

        account = state.AccountManager.loadAccount(name);

        if (account.banned) {
          socket.write('THIS ACCOUNT HAS BEEN BANNED.\r\n');
          socket.destroy();
          return;
        }

        return socket.emit('password', socket, { dontwelcome: false, account });
      });
    }
  };
};
