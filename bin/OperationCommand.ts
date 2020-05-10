import * as chalk from 'chalk';
import * as fs from 'fs';
import OperationGenerator from '@decentralized-identity/sidetree/dist/tests/generators/OperationGenerator';

/**
 * Class that handles the `operation` CLI command.
 */
export default class OperationCommand {
  /**
   * Handles the `create` sub-command.
   */
  public static async handleCreate () {
    const createOperationData = await OperationGenerator.generateCreateOperation();
    const didSuffix = createOperationData.createOperation.didUniqueSuffix;

    console.info(chalk.hex('#75b0eb')(`DID: `) + chalk.yellow(`did:ion:${createOperationData.createOperation.didUniqueSuffix}`));
    console.info('');

    // Save the private signing and recovery keys.
    const recoveryKeyFileName = `keys${didSuffix}-RecoveryPrivateKey.json`;
    const signingKeyFileName = `keys${didSuffix}-SigningPrivateKey.json`;
    fs.writeFileSync(recoveryKeyFileName, JSON.stringify(createOperationData.recoveryPrivateKey));
    fs.writeFileSync(signingKeyFileName, JSON.stringify(createOperationData.signingPrivateKey));
    console.info(`Recovery private key saved as: ${chalk.yellow(recoveryKeyFileName)}`);
    console.info(`Siging private key saved as: ${chalk.yellow(signingKeyFileName)}`);

    console.info(chalk.hex('#75b0eb')(`Create request body:`));
    console.info(createOperationData.operationRequest);
    console.info('');

    console.info(chalk.hex('#75b0eb')(`Decoded suffix data:`));
    console.info(createOperationData.createOperation.suffixData);
    console.info('');

    console.info(chalk.hex('#75b0eb')(`Decoded delta:`));
    const delta = createOperationData.createOperation.delta;
    // const decodedDeltaString = util.inspect(delta, false, null, true /* enable colors */)
    // console.info(decodedDeltaString);
    console.info(delta);
    console.info('');
  }
}
