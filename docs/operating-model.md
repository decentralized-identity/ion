# ION Operating Model

## Foundational Principles

"We reject kings, presidents, and voting. We believe in rough consensus and running code."

In the spirit of David Clark's famous quote from the early days of IETF, we believe ION is a shared utility that no person, entity, or group should own or control. We, as a community of engineers, organizations, and anonymous individuals, endeavor to foster an open environment for development and coordination among all who seek to contribute. We, as a community, will always strive to evaluate every contribution on its merit. We, as a community, believe in the rights and liberties of individuals, and we are committed to ensuring our work here reflects that.

## ION's Relationship with Sidetree

ION is an implementation of the Sidetree specification's protocols, another active work item in the [DIF](https://github.com/decentralized-identity). ION utilizes the core components of the Sidetree reference implementation within it to maximize shared code and interop. 

## Development and Decisions

We, as a community, will assess all proposals from the community via an open process, and we ask that you:

1. File issues in GitHub and strongly advocate for your positions - we assume the good intentions of all who contribute, and encourage vigorous debate.
2. Join our Sidetree/ION development meetings - you can do this by becoming a member/contributor of DIF (this ensures code remains open and patent-free).
3. Participate in the DIF Sidetree Working Group to help guide direction and development - this will allow you to participate in clarifying consensus.

## ION Releases
* What drives releases: the developers of the Sidetree specification and reference implementation will continue to evolve the protocols it defines, and ION will pull from those efforts as the ION community determines. ION may also work on its own feature updates, which will be pulled into releases as they are developed, tested, and agreed upon by the community.
* How often will releases happen: we will strive for releases roughly twice annually, but this is a target that can be modified with a consensus of the community or a need for more urgent upgrades.
* How will operators be notified of releases: we will leverage DIF channels (social media, GitHub notifications, email, etc.) to spread the word about releases and other high-impact developments.

### ION Versioning
ION follows the Semantic Versioning scheme.
* Major number

  A change to the major number denotes a foundational change or milestone to how ION functions. We do not anticipate an increment to this number anytime soon.

* Minor number

  All node operators must upgrade as soon as possible whenever there is a minor release. Changes include planned soft-forks, critical vulnerability fixes etc.
  
* Patch number

  A patch release is elective to node operators. Changes include new features, performance improvements, minor bug fixes.
