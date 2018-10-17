#Purpose
A frontend user interface to the eosDAC Member Client web application.

# Technical Details
The member's client uses **Vue.js** and **Quasar** as the frontend framework to create a Single Page Application which then connects to the EOS mainnet or Jungle testnet (depending on the configuration file). In order to change the Member Client to interface with your DAC, you want to follow the instructions and general guidelines below.

## How to Install

**1. Install Vue-Cli**
```
yarn global add vue-cli
```

**2. Install Quasar-Cli**
```
# Node.js >= 8.9.0 is required.
yarn global add quasar-cli
```

**3. Clone Repo**
```
git clone https://github.com/eosdac/eosdactoolkit.git
```

**4. Install modules using yarn (npm seems to have issues with quasar)**
```
# in project directory
yarn install
```

**5a. Copy the config file you want to use (jungle or mainnet)**
```
cp src/statics/config.jungle.json src/statics/config.json
```
**5b. Or use the included deploy script**

The deploy script copies the desired config file and deploys to a build folder for serving files via nginx.

To deploy a specific tag for the mainnet:
```
./deploy-eosdac-material.sh mainnet v0.1.0
```
To deploy master for jungle testnet:
```
./deploy-eosdac-material.sh jungle master
```
You can also use it locally to copy the desired config and run quasar dev
```
./deploy-eosdac-material.sh jungle master true
```

**6. Run dev server with material theme**
```
quasar dev
```

[Quasar Docs](https://quasar-framework.org/guide/index.html)

## What to Change
Since eosDAC is making this open source software for the use of creating other DACs, DACs will need to know what to change in order to edit the software for their needs. The main folders you will want to change for your DAC's branding, messaging, and assets are:
- `src/statics`
- `src/i18n`
- `src/statics/config.json`

`statics` is the main repository where you will want to change branding assets. Replace the files and retain the file names, so you do not have to go through the other areas of the code to update the file names. You will also need to update the `i18n` directory for proper messaging and translations of the messaging for the DAC's written content. The `config.json` file aligns with the proper deployed smart contract and you will need to change this file and the templates towards your DAC's smart contract.

Other files may need to be changed by your team if you want to adjust the content layout or page structure such as the pages, plugins, or components. The design is done in https://material.io/design/

# Author
The eosDAC Team. Join us on our Discord channel #5-tech-and-development if you have any questions. https://discord.io/eosdac
