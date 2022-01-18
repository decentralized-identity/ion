# ION Design Document

# Transaction and Operation Rate Throttling

# Proof-of-Fee
## Normalized Fee
## Value Locking Algorithm

If you want to write transactions containing more than 100 operations, you are required to lock some BTC for exactly 4500 blocks using a time locked transaction.

The formula to calculate the required lock amount can be calculated using:

```
requiredLockedBtc = numberOfOpsPerTransactionDesired x estimatedNormalizedFee x normalizedFeeToPerOperationFeeMultiplier x valueTimeLockAmountMultiplier
```

where the following are constants:

```
normalizedFeeToPerOperationFeeMultiplier = 0.001
valueTimeLockAmountMultiplier = 60000
```

For instance, if you would like to write batches of 1000-operation transactions, substituting constant values and estimated normalized fee of `0.000011` you'll get:

```
1000 x 0.000011 x 0.001 x 60000 = 0.66 BTC
```

This means you will need to lock 0.66 BTC in order for transactions of 1000 operations to be accepted by ION.
