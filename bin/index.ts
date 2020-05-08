#!/usr/bin/env node

// const argv = process.argv;
// console.log(argv);

// if (argv.length !== 3 ||
//     argv[1] !== 'operation' ||
//     argv[2] !== 'create') {

//   const usage =
// `
// Usage: ion <command> [options]

// Commands:
//   ion operation  Generates a new <create|update|recover|deactivate> operation.
//   ion resolve    Resolves an ION DID.
// `;

//   console.log(usage);
//   process.exit();
// }

// import * as util from 'util';
import * as yargs from 'yargs';
import OperationGenerator from '@decentralized-identity/sidetree/dist/tests/generators/OperationGenerator';

// tslint:disable-next-line: no-unused-expression
yargs
  .scriptName('ion') // Make usage help print 'ion' instead 'index.js'.
//   .usage('Usage: $0 <command> [options]')
//   .command('hello [name]', 'welcome ter yargs!', (yargs) => {
//     yargs.positional('name', {
//       type: 'string',
//       default: 'Cambi',
//       describe: 'the name to say hello to'
//     })
//   }, function (argv) {
//     console.log('hello', argv.name, 'welcome to yargs!')
//   })
//   .help()
//   .argv
  .demandCommand(1, 'A <command> is not supplied.')
  .command('operation', 'Generates a new <create|update|recover|deactivate> operation.', (yargs) => {
    // argv =
    yargs
      .usage('usage: $0 operation <create|update|recover|deactivate> [options]')
      .command('create', 'Generates a create operation.', async () => {
        const createOperationData = await OperationGenerator.generateCreateOperation();
        console.info(`DID: did:ion:${createOperationData.createOperation.didUniqueSuffix}`);
        console.info('');

        console.info(`Create request body:`);
        console.info(createOperationData.operationRequest);
        console.info('');

        console.info(`Decoded suffix data:`);
        console.info(createOperationData.createOperation.suffixData);
        console.info('');

        console.info(`Decoded delta:`);
        const delta = createOperationData.createOperation.delta;
        // const decodedDeltaString = util.inspect(delta, false, null, true /* enable colors */)
        // console.info(decodedDeltaString);
        console.info(delta);
        console.info('');
      })
      .command('update', 'Generates an update operation.', () => {
        console.log('parsing update operation command');
      })
      // .help('help')
      .updateStrings({
        'Commands:': 'type:'
      })
      .wrap(null);
    //   .argv

    // checkCommands(yargs, argv, 2)
  })
  .command('resolve', 'Resolves an ION DID.', (yargs) => {
    yargs
    .usage('usage: $0 resolve <did> ');
  })
  // .help('h')
  // .alias('h', 'help')
  .epilog('----')
  .argv;

// const argv = yargs
//   .scriptName('ion') // Make usage help print 'ion' instead 'index.js'.
//   .usage('Usage: $0 <command> [options]')
//   .demandCommand(1, 'A <command> is not supplied.')
//   .command('count', 'Count the lines in a file')
//   .example('$0 count -f foo.js', 'count the lines in the given file')
//   .alias('f', 'file')
//   .nargs('f', 1)
//   .describe('f', 'Load a file')
//   .demandOption(['f'])
//   .help('h')
//   .alias('h', 'help')
//   .epilog('copyright 2019')
//   .argv;

//   console.log(argv.$0);

// yargs
//   .demandCommand(1, 'A <command> is not supplied.')
//   .usage('Usage: $0 <command> [options]')
//   .command({
//     command: 'generate [moduleType] [moduleNames...]',
//     aliases: ['g'],
//     describe: 'Generates a resource',
//     handler: parsed => console.log('your handler goes here', parsed),
//     builder: {
//       moduleType: {
//         demand: true,
//         choices: ['routed', 'stateful'] as const,
//         default: 'routed',
//       },
//       moduleNames: {
//         demand: true,
//         array: true,
//       },
//     },
//   })
//   .help('h')
//   .alias('h', 'help')
//   .parse(process.argv.slice(2))
