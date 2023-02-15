CURRENT_CHANNEL_VERSION=$(git ls-remote --tags | grep -v "\-rc" | grep "beta" | grep "3.10.2" | tail -n1 | awk -F'beta' '{print $2}')

echo $CURRENT_CHANNEL_VERSION