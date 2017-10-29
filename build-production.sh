#!/usr/bin/env bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

GOOS=linux GOARCH=386 buffalo build
echo '----> compressing binary'
cd bin
tar czf budgetal.tar.gz budgetal
rm budgetal
cd ..
SIZE=$(du -h bin/budgetal.tar.gz | cut -f1)
echo "----> linux 386 binary compressed in bin/budgetal.tar.gz ($SIZE)"
printf "      ${GREEN}Done.${NC}\n"
