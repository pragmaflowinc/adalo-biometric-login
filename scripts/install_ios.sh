#!/bin/bash
set -e
set -x

name=$PROJECT_NAME

if grep -q "<key>NSFaceIDUsageDescription" ios/$name/Info.plist; then
  echo "Biometrics already supported, nothing to do here."
else
  plutil -insert NSFaceIDUsageDescription -string 'Enabling Face ID allows you quick and secure access to your account.' ios/$name/Info.plist
fi


echo "configured iOS settings"