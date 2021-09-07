# Definitions

## Abbreviations
In alphabetic order:\
ACDC = Authentic Chained Data Container Task Force
BX = [Bidirectional model transformation](#bidirectional-model-transformation)
CAS = Content Addressable Storage 
DID = [Decentralized Identity](#decentralized-identity) or Digital Identity dependent of the context.\
DIF = Decentralized Identity Foundation\
DDO = DID Document, look up W3D DID standardization for more info\
DHT = Distributed Hash Table\
DIF = Decentralized Identity Foundation, https://identity.foundation\
DKMI = Decentralized Key Mangement Infrastructure\
IPFS = [Inter Planetary File System](#inter-planetary-file-system)
JWK = [JSON Web Key](#json-web-key)
IPv4 = standard Internet Protocol, version 4\
PKI = [Public Key Infrastructure](#public-key-infrastructure)\
PR = Pull Request; github terminology\
SSI = [Self Sovereign Identity](#self-sovereign-identity)\
VC = Verifiable Credential, look up W3D DID standardization for more info\
WASM = [WebAssembly](#WebAssembly)

## Definitions in alphabetic order

Terminology specific for Sidetree can be found [here](https://identity.foundation/sidetree/spec/#terminology). The following definitions are specificly listed to support the [Question and Answers](Q-and-A.md) on a simpler level, and to be able to put Sidetree in relation to other fields of interest.


#### Authentic Chained Data Container Task Force
Or ACDC. The purpose of the Authentic Chained Data Container (ACDC) Task Force  is to draft a TSS (ToIP Standard Specification) that defines the standard requirements for the semantics of Authentic Provenance Chaining of Authentic Data Containers. [See more](https://wiki.trustoverip.org/display/HOME/ACDC+%28Authentic+Chained+Data+Container%29+Task+Force)

#### Agent
A representative for an _identity_. MAY require the use of a _wallet_. MAY support _transfer_

#### Agency
Agents can be people, edge computers and the functionality within [`wallets`](#digital-identity-wallet). The service an agent offers is agency.

#### Bidirectional model transformation
Or `BX`. Keeping a system of models mutually consistent (model synchronization) is vital for model-driven engineering. In a typical scenario, given a pair of inter-related models, changes in either of them are to be propagated to the other to restore consistency. This setting is often referred to as bidirectional model transformation (BX). Delta-based is the way to go for Side-tree.
[Source and more info](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.386.7739&rep=rep1&type=pdf)

#### Claim
An assertion of the truth of something, typically one which is disputed or in doubt. A set of claims might convey personally identifying information: ½name, address, date of birth and citizenship, for example. ([Source](https://www.identityblog.com/?p=352)).

#### Content-addressable hash
Content addressing is a way to find data in a network using its content rather than its location. The way we do is by taking the content of the content and hashing it. Try uploading an image to IPFS and get the hash using the below button. In the IPFS ecosystem, this hash is called Content Identifier, or CID.
#### Controller
The entity that has the ability to make changes to an _identity_, _cryptocurrency_ or v_erifiable credential_. 

The controller of an `autonomous identifier` is the entity (person, organization, or autonomous software) that has the capability, as defined by derivation, to make changes to an `Event Log`. This capability is typically asserted by the control of a single inception key. In DIDs this is typically asserted by the control of set of cryptographic keys used by software acting on behalf of the controller, though it may also be asserted via other mechanisms. In Sidetree an AID has one single controller. Note that a DID may have more than one controller, and the DID `subject` can be the DID controller, or one of them.

#### Cryptocurrency
A digital asset designed to work as a medium of exchange wherein individual coin ownership records are stored in a digital ledger or computerized database using strong cryptography to secure transaction record entries, to control the creation of additional digital coin records. See [more](https://en.wikipedia.org/wiki/Cryptocurrency)

#### Decentralized Identity
DID; Decentralized identity is a technology that uses cryptography to allow individuals to create and control their own unique identifiers. They can use these identifiers to obtain `Verifiable Credentials` from trusted organisations and, subsequently, present elements of these credentials as proof of claims about themselves. In this model, the individual takes ownership of their own identity and need not cede control to centralized service providers or companies.

#### Delta-based
Delta-based (vs. _state-based_) is a notion that is hard to grasp. See it simplified as _"keeping Sidetree data internally consistent and in sync"_.

The Sidetree protocol defines a core set of `DID PKI` state change operations, structured as **delta-based** Conflict-Free Replicated Data Types.\
Given pairs of inter-related models (nodes / peers) in Sidetree, changes in either of them are to be propagated to the other to restore consistency; also called [BX](#bidirectional-model-transformation).\
Propagation operations use deltas as input and output rather than compute them internally. Such frameworks (in our case a **tree-oriented**) have been built for the _asymmetric_ BX case, in which one model in the pair is a view of the other and hence does not contain any new information. In practice, however, it is often the case that two models share some information but each of them contains something new not present in the other; we call this case _symmetric_ `BX`.

[Source and more info](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.386.7739&rep=rep1&type=pdf)

#### Deterministic Ruleset (of Sidetree)
Which guarantees only one `fork` of a DID’s state history can ever be valid.\
To better understand this, read this [section](https://identity.foundation/sidetree/spec/#late-publishing) that illustrates a DID owner, Alice, creating forks by creating and anchoring operations in the past that she does not expose to the network. Known as _Late Publishing_ of a DID operation. 

#### Entropy
Unpredictable information. Often used as a _secret_ or as input to a _key_ generation algorithm.[More](https://en.wikipedia.org/wiki/Entropy_(information_theory))

The term entropy is also used to describe the degree of unpredictability of a message. Entropy is then measured in bits. The degree or strength of randomness determines how difficult it would be for someone else to reproduce the same large random number. This is called _collision resistance_. 

#### Entity
Entities are not limited to natural persons but may include groups, organizations, software agents, things, and even data items. 

#### Identity
A unique entity. Typically represented with a unique identifier.

#### Inter Planetary File System 
Also IPFS; is a distributed system for storing and accessing files, websites, applications, and data. [More info](https://docs.ipfs.io/concepts/what-is-ipfs/#decentralization)

#### JSON Web Key
A JSON Web Key (JWK) is a JavaScript Object Notation (JSON) data structure that represents a cryptographic key. [More info](https://tools.ietf.org/html/rfc7517).\
The following **example** JWK declares that the key is an Elliptic Curve key, it is used with the P-256 Elliptic Curve, and its x and y coordinates are the base64url-encoded values shown.  A key identifier is also provided for the key:
```
     {"kty":"EC",
      "crv":"P-256",
      "x":"f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
      "y":"x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
      "kid":"Public key used in JWS spec Appendix A.3 example"
     }
```

#### Key
A mechanism for granting or restricing access to something. MAY be used to issue and prove, MAY be used to transfer and control over _identity_ and _cryptocurrency_. [More](https://en.wikipedia.org/wiki/Key_(cryptography))

#### Normative
In general, we call a theory “normative” if it, in some sense, tells you what you should do - what action you should take. If it includes a usable procedure for determining the optimal action in a given scenario. [Souce](https://www.quora.com/What-is-the-difference-between-normative-and-non-normative?share=1).

#### Non-normative
A theory is called non-normative if it does not do that. In general, the purpose of non-normative theories is not to give answers, but rather to describe possibilities or predict what might happen as a result of certain actions.
[Souce](https://www.quora.com/What-is-the-difference-between-normative-and-non-normative?share=1).

#### Payload
The term 'payload' is used to distinguish between the 'interesting' information in a chunk of data or similar, and the overhead to support it. It is borrowed from transportation, where it refers to the part of the load that 'pays': for example, a tanker truck may carry 20 tons of oil, but the fully loaded vehicle weighs much more than that - there's the vehicle itself, the driver, fuel, the tank, etc. It costs money to move all these, but the customer only cares about (and pays for) the oil, hence, 'pay-load'. [source](https://softwareengineering.stackexchange.com/questions/158603/what-does-the-term-payload-mean-in-programming).

Now payload in `Sidetree`. The payload could be one of the following cryptographical building blocks in Sidetree:
- a content digest hash 
- a root hash of a Merkletree
- a public key
Note that the Sidetree never puts raw data or privacy sensitive data in its JSON files.\
_(@henkvancann)_

#### Public Key Infrastructure
A public key infrastructure (PKI) is a set of roles, policies, hardware, software and procedures needed to create, manage, distribute, use, store and revoke digital certificates and manage public-key encryption. [Wikipedia].(https://en.wikipedia.org/wiki/Public_key_infrastructure)

#### Race condition
A race condition or race hazard is the condition of an electronics, software, or other system where the system's substantive behavior is dependent on the sequence or timing of other uncontrollable events. It becomes a bug when one or more of the possible behaviors is undesirable. [Source](https://en.wikipedia.org/wiki/Race_condition).

#### Root of trust
Replace human basis-of-trust with cryptographic root-of-trust. With verifiable digital signatures from asymmetric key cryptography we may not trust in “what” was said, but we may trust in “who” said it.\
The root-of-trust is consistent attribution via verifiable integral non-repudiable statements.

#### Secret
Information controlled by an identity. MAY be used to derive _key_s.

#### Self Sovereign Identity
SSI is a new model for Internet-scale digital identity based on an emerging set of protocols, cutting edge cryptography and open standards. Technological and social movements have come together that make SSI possible.\
[Source](https://livebook.manning.com/book/self-sovereign-identity/chapter-1/v-8/14).\
Decentralisation of the `root-of-trust` and `verifiable credentials` come into play and delivers  “user-centric identity”: more control and self-determination of individuals, individuals machines and combinations of these, that identify as one.\
_(@henkvancann)_

#### Subject
A digital subject: A person or thing represented or existing in the digital realm which is being described or dealt with. ([Source](https://www.identityblog.com/?p=352)).

#### Transfer
The process of changing the _controller_ of _cryptocurrency_, _identity_ or _verifiable credential_. MAY require the use of a _key_.

#### Transferable identifier
And identifier of which you can rotate its controlling private key. When the private key for a transferable identifier become exposed to potential compromise then control over the identifier may be transferred to a new key-pair to maintain security.

#### Trust-over-IP
It's a term related to the effort of a foundation. The Trust over IP Foundation is an independent project hosted at Linux Foundation to enable the trustworthy exchange and verification of data between any two parties on the Internet. [More](https://trustoverip.org/about/faq/).

#### Validator
a _validator_ is anybody that wants to estblish control-authority over an identifier, created by the controller of the identifier. Validators verify the log, they apply duplicity detection or they leverage somebody else's duplicity detection or apply any other logic so they can say "Yes these are events I can trust".

During validation of virtual credentials for example, a `verifier` checks to see if a `verifiable credential` (VC) has been signed by the controller of this VC using the applicable verification method.

#### Verifiable Credential
VC; A data model for conveying claims made by an issuer about a subject. See [vc-data-model](https://www.w3.org/TR/vc-data-model/) for more.

#### W3C DID
The W3C consortium Decentralized ID standardization. [More](https://w3c.github.io/did-core/).

#### WebAssembly
WASM, or just WA) is an _open standard_ that defines a portable binary-code format for executable programs, and a corresponding textual assembly language, as well as interfaces for facilitating interactions between such programs and their host environment.\
The main goal of WebAssembly is to enable high-performance applications on web pages, but the format is designed to be executed and integrated in other environments as well, including standalone ones. [More info](https://en.wikipedia.org/wiki/WebAssembly).

#### (Digital Identity) Wallet
In our context it is software and sometimes hardware that serves as a key store and functionality. Keys can be private keys and public keys, hashes and pointers. Functionality can be signing, invoices (receive), send, virtual credentials, delegation, etc. This is the [`agency`](#agency) part of a wallet. \
[More about digital ID Wallets](https://www.thalesgroup.com/en/markets/digital-identity-and-security/government/identity/digital-identity-services/digital-id-wallet)\
[More about cryto Wallets](https://cryptocurrencyfacts.com/what-is-a-cryptocurrency-wallet/).
