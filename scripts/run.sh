#!/bin/bash
bash scripts/build.sh >/dev/null
node build/main.js
rm -rf build
