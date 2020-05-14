import * as fs from 'fs';
import LogColor from './LogColor';
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

    console.info(LogColor.lightBlue(`DID: `) + LogColor.yellow(`did:ion:${createOperationData.createOperation.didUniqueSuffix}`));
    console.info('');

    // Save the private signing and recovery keys.
    const recoveryKeyFileName = `${didSuffix}-RecoveryPrivateKey.json`;
    const signingKeyFileName = `${didSuffix}-SigningPrivateKey.json`;
    fs.writeFileSync(recoveryKeyFileName, JSON.stringify(createOperationData.recoveryPrivateKey));
    fs.writeFileSync(signingKeyFileName, JSON.stringify(createOperationData.signingPrivateKey));
    console.info(LogColor.brightYellow(`Recovery private key saved as: ${LogColor.yellow(recoveryKeyFileName)}`));
    console.info(LogColor.brightYellow(`Siging private key saved as: ${LogColor.yellow(signingKeyFileName)}`));
    console.info('');

    console.info(LogColor.lightBlue(`Create request body:`));
    console.info(JSON.stringify(createOperationData.operationRequest, null, 2)); // 2 space indents.
    console.info('');

    console.info(LogColor.lightBlue(`Decoded suffix data:`));
    console.info(createOperationData.createOperation.suffixData);
    console.info('');

    console.info(LogColor.lightBlue(`Decoded delta:`));
    console.info(createOperationData.createOperation.delta);
    console.info('');
  }
}
