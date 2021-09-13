#!/bin/bash
set -e
set -x

plutil -insert NSFaceIDUsageDescription -string 'Enabling Face ID allows you quick and secure access to your account.' info.plist

echo "configured iOS settings"