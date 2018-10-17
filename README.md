# eosdactoolkit

## Purpose
The DAC toolkit for building and running DACs. This is the member client where the DAC members will interface with the deployed smart contract code. The code is written in javascript using Vue.js and Quasar-framework.js.

## Pre-Requisites
You want to be able to read javascript code and have a basic understanding of frontend web development. If you want to simply change the assets to your DAC's messaging, branding, and images then the processes is not too difficult. The details are in `eosdac-material/README.md`



[Original Design document](https://docs.google.com/document/d/1C4yzFNpK0Iz0Ru0gz28HeLJic5vZWBmVl3wV8czhVS4/edit#).

# Design Document

## Purpose
The purpose of this document is to facilitate the development of our user interface for our DAC Toolkit described here: [DAC Toolkit Technical Design](https://docs.google.com/document/d/1wyg1VrIKI4NJ2Lt2yl5dPK9QfU_H3sfvhINIqCFu-DE/edit?usp=sharing) with code [here](https://github.com/eosdac).

This document is a work in progress and all involved in the project are strongly encouraged to modify it accordingly to add value. Please feel comfortable changing anything here as needed since Google Docs does keep track of version history. If you are going to make major changes, please select “Name current version” from the File -> Version History menu before doing so.

## Team (Discord Handles):
- Dallas#0717 (Smart Contracts)
- MichaelY#8697 (Smart Contract Design)
- Kas#4648 (Front End Dev)
- nano#0716 (Front End Dev)
- nod74#5072 (Design)

- lukestokes#3854 (Coordination)
- blockart#4941 (Rob) (Coordination, Smart Contract Design)
- Morty#1818 (Coordination)

## Requirements
All EOS interactions must display the associated Ricardian Contracts for the actions. 
Coding Framework: [Quasar](https://quasar-framework.org/quasar-play/android/index.html#/showcase)
https://vuejs.org/
UI/UX Framework: [Material Design](https://material.io/design/)

## Mockups:
https://drive.google.com/file/d/1lJmDjKXHYOzOsem7vFmSeAbM9ib8UR_2/view
https://drive.google.com/drive/folders/1slhz2su21eBdSiD-tv8gPIkOcfIf-QOd


## Images/Icons:
https://drive.google.com/drive/folders/1olzPYQIMeGboKwRmmsEr7Hdu4jZtSDJg

## Phases

### Phase 1: Token/Member Contract
https://github.com/eosdac/eosdactoken
The primary concern being the memberreg function. We’ll need to link to the current constitution as part of this action call.

To get the ABI for this:

./cleos.sh get code eosdactokens -c eosdactokens.wast -a eosdactokens.abi

We need to ensure the Ricardian Contracts are shown for all actions.
(need to be rewritten)

We need the constitution converting from word to markdown format so we can reliably hash it client-side (where should it be pulled from? Github? Or shipped with the ui?)

### Phase 2: Custodian Elections Contract
https://github.com/eosdac/daccustodian

### Phase 2.5: Custodian Dashboard
Features…?

### Phase 3: Worker Proposals
https://github.com/eosdac/dacproposals
Additional Functionality:
Discord Integration
Integration with Discord to create our online community.
Design in Progress: https://media.discordapp.net/attachments/441003946664919041/464070590274469898/memberreg.png

### Additional features with current design in progress. 
https://drive.google.com/open?id=12VhC5W4yV274Q3S3uAwHwg9OhG3mMUBU


### Meeting Notes
July 6th
Michael: What is the end goal? What are we delivering ultimately?
Idea: Config, contract for the voting, token
Simple json file config: logo, contracts, etc
http://kazupon.github.io/vue-i18n/guide/pluralization.html
Support English to start. Have pluralized versions of text strings where text substitution is needed.
Point and click about uploading contracts and compiling. May have variables in the contracts which can be swapped. Have different generic options for customizing the contracts. Have 
Save setup tools (airdrop etc) for a separate section / shown when the contracts don't exist
More information on the tech design document for voting screen.

**Action item**: All: Comment on the mockup screens. Comment on the login. Any additional stuff should be put in the mockups.
**Action Item**: Kas: take a look at msig support

https://github.com/eosdac/eosdactoolkit

Drop Tool: could go to it’s own top level.

Path forward:
1. Use the mockups as a starting point
2. First (BEFORE CODING!) Create Github issues for what you want to work on based on the mockup. Assign to yourself so others know who is doing what.
3. Everyone commit to the same repo. Use a dev branch if you’re making a lot of major changes, but ideally, commit early and commit often.

To get proposals
`./cleos.sh get table eosio.msig eoscanadacom proposal`
