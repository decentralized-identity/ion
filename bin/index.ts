#!/usr/bin/env node
// NOTE: MUST keep the line above so `npm i` will install the CLI correctly across all operating systems.

import * as yargs from 'yargs';
import OperationCommand from './OperationCommand';

// tslint:disable-next-line: no-unused-expression - Invoking `argv` is the way to trigger argument processing in `yargs`...
yargs
  .scriptName('ion') // Make usage help print 'ion' instead 'index.js'.
  .usage('Usage: $0 <command> [options]')
  .demandCommand(1, 'A <command> is not specified.') // Requires a command to be specified.
  .command('operation', 'Generates a new <create|update|recover|deactivate> operation.', (yargs) => {
    yargs
      .usage('Usage: $0 operation <create|update|recover|deactivate> [options]')
      .demandCommand(1, 'An <operation type> is not specified.') // Requires a sub-command (operation type) to be specified.
      .command('create', 'Generates a create operation.', async () => {
        await OperationCommand.handleCreate();
      })
      .command('update', 'Generates an update operation.', () => {
        console.log('To be implemented.');
      })
      .command('recover', 'Generates a recover operation.', () => {
        console.log('To be implemented.');
      })
      .command('deactivate', 'Generates a deactivate operation.', () => {
        console.log('To be implemented.');
      })
      .updateStrings({
        'Commands:': 'Operation type:'
      })
      .wrap(null)
      .strict(); // Requires the sub-command must be one of the explicitly defined sub-commands.
  })
  .command('resolve', 'Resolves an ION DID.', () => {
    console.log('To be implemented.');
  })
  .strict() // Requires the command must be one of the explicitly defined commands.
  .help(false) // Disabling --help option.
  .version(false) // Disabling --version option.
  .argv;
