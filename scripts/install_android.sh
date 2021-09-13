#!/bin/bash
set -e
set -x

cd android/app

# AndroidManifest
cd src/main
cat <<EOF > /tmp/adalo-bio-sed
/android.permission.INTERNET/a\\
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />\
    <uses-permission android:name="android.permission.USE_FINGERPRINT" />\\
EOF
cat AndroidManifest.xml
sed -i.bak "$(cat /tmp/adalo-bio-sed)" AndroidManifest.xml
cat AndroidManifest.xml

echo "configured Android settings"