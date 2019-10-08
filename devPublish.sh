#!/bin/sh
# author: Shunfu Sheng

IPADDR="192.168.10.203"
TARGET="/home/aitensor/apps/"

git checkout develop
git pull origin develop:develop
rm -rf ./dist
npm run build:prod
scp -r ./dist aitensor@$IPADDR:$TARGET
ssh -l aitensor $IPADDR "cd $TARGET && rm -rf ./vue && mv ./dist ./vue"
rm -rf ./dist
