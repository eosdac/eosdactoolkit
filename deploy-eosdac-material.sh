#!/bin/bash

CONFIG_FILE=""

case "$1" in
	jungle) echo "Deploying for Jungle"
		CONFIG_FILE="config.jungle.json"
		;;
	main) echo "Deploying for Mainnet"
		CONFIG_FILE="config.main.json"
		;;
        mainnet) echo "Deploying for Mainnet"
                CONFIG_FILE="config.main.json"
		;;
	*) echo "Please specify a deployment such as jungle or mainnet"
		exit 1
		;;
esac

echo $CONFIG_FILE

cd ~/eosdactoolkit-dev
git pull
cd eosdac-material
quasar build

if [ -z "$(ls -A dist/spa-mat)" ]; then
   echo "======= ERROR: ======="
   echo "dist/spa-mat empty."
   echo "Build Failed? NOT DEPLOYED"
   echo "======================"
   exit 1
fi

rm dist/deploy/* -rf; cp -r dist/spa-mat/* dist/deploy/; cp "dist/deploy/statics/$CONFIG_FILE" dist/deploy/statics/config.json;

echo "Deploy Complete."
echo "Please test and verify using the correct domain such as members-dev.eosdac.io, members-staging.eosdac.io, or members.eosdac.io"