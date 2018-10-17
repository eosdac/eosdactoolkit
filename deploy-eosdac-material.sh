#!/bin/bash

echo " "
echo " "
echo "===================== eosDAC Member Client Deploy Script ====================="
echo " "
echo "Usage: ./deploy-eosdac-material.sh jungle 1.0.0"
echo "This example will deploy the 1.0.0 tag configured for the jungle testnet"
echo " "
echo "For local testing, add a true at the end like so:"
echo "./deploy-eosdac-material.sh mainnet master true"
echo "This example will run master locally configured for the production mainnet"
echo " "
echo "=============================================================================="
echo " "
echo " "

CONFIG_FILE=""
LOCAL_DEV=false

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

if [ -z "$2" ]
  then
    echo "Please specify the branch or tag you'd like to deploy."
fi

if [[ "$3" == "true" ]]
  then
    echo "Local build, will run quasar dev."
    LOCAL_DEV=true
fi


echo "Copying $CONFIG_FILE to config.json"
cp "eosdac-material/src/statics/$CONFIG_FILE" eosdac-material/src/statics/config.json;

git checkout .
git checkout master
if ! git pull
then
   echo "======= ERROR: ======="
   echo "Looks like the repo is dirty?"
   echo "NOT DEPLOYED"
   echo "======================"
   exit 1
fi
git fetch --tags
git checkout "$2"
git pull
cd eosdac-material

if $LOCAL_DEV ;
then
  quasar dev
else
  quasar build
  if [ -z "$(ls -A dist/spa-mat)" ]; then
     echo "======= ERROR: ======="
     echo "dist/spa-mat empty."
     echo "Build Failed? NOT DEPLOYED"
     echo "======================"
     exit 1
  fi

  rm dist/deploy/* -rf; cp -r dist/spa-mat/* dist/deploy/;

  echo "Deploy Complete."
  echo "Please test and verify using the correct domain such as members-dev.eosdac.io, members-staging.eosdac.io, or members.eosdac.io"
fi