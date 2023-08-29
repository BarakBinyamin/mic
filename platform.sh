#!/bin/bash
platform=`uname -m`
if  [[ "${platform}"  =~ "x86_64" ]]; then
    echo "linux/amd64"
elif [[ "${platform}" =~ "arm64" ]]; then
    echo "linux/arm64"
elif [[ "${platform}" =~ "armv7l" ]]; then
    echo "linux/armv7l"
else
    exit "Unkown"
fi
