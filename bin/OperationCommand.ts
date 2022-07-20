import { IonDid, IonDocumentModel, IonKey, IonRequest } from '@decentralized-identity/ion-sdk';
import * as fs from 'fs';
import LogColor from './LogColor';

/**
 * Class that handles the `operation` CLI command.
 */
export default class OperationCommand {
  /**
   * Handles the `create` sub-command.
   */
  public static async handleCreate () {

    const [recoveryKey, recoveryPrivateKey] = await IonKey.generateEs256kOperationKeyPair();
    const [updateKey, updatePrivateKey] = await IonKey.generateEs256kOperationKeyPair();
    const [signingKey, signingPrivateKey] = await IonKey.generateEs256kDidDocumentKeyPair({id: 'signing-key'});
    const publicKeys = [signingKey];

    const document : IonDocumentModel = {
      publicKeys
    };
    const input = { recoveryKey, updateKey, document };
    const createRequest = IonRequest.createCreateRequest(input);
    const longFormDid = IonDid.createLongFormDid(input);
    const shortFormDid = longFormDid.substring(0, longFormDid.lastIndexOf(':'));
    const didSuffix = shortFormDid.substring(shortFormDid.lastIndexOf(':') + 1);

    console.info(LogColor.lightBlue(`DID: `) + LogColor.yellow(`${shortFormDid}`));
    console.info('');

    // Save all private keys.
    const recoveryKeyFileName = `${didSuffix}-RecoveryPrivateKey.json`;
    const updateKeyFileName = `${didSuffix}-UpdatePrivateKey.json`;
    const signingKeyFileName = `${didSuffix}-SigningPrivateKey.json`;
    fs.writeFileSync(recoveryKeyFileName, JSON.stringify(recoveryPrivateKey));
    fs.writeFileSync(updateKeyFileName, JSON.stringify(updatePrivateKey));
    fs.writeFileSync(signingKeyFileName, JSON.stringify(signingPrivateKey));
    console.info(LogColor.brightYellow(`Recovery private key saved as: ${LogColor.yellow(recoveryKeyFileName)}`));
    console.info(LogColor.brightYellow(`Update private key saved as: ${LogColor.yellow(updateKeyFileName)}`));
    console.info(LogColor.brightYellow(`Signing private key saved as: ${LogColor.yellow(signingKeyFileName)}`));
    console.info('');

    console.info(LogColor.lightBlue(`Create request body:`));
    console.info(JSON.stringify(createRequest, null, 2)); // 2 space indents.
    console.info('');

    console.info(LogColor.lightBlue(`Long-form DID:`));
    console.info(longFormDid);
    console.info('');

    console.info(LogColor.lightBlue(`DID suffix data:`));
    console.info(JSON.stringify(createRequest.suffixData, null, 2));
    console.info('');

    console.info(LogColor.lightBlue(`Document delta:`));
    console.info(JSON.stringify(createRequest.delta, null, 2));
    console.info('');
  }
}
