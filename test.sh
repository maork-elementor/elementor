CURRENT_CHANNEL_VERSION=$(git ls-remote --tags | grep -v "\-rc" | grep "beta" | grep "{{ inputs.CLEAN_PACKAGE_VERSION }}" | tail -n1 | awk -F'beta' '{print $2}')
echo $CURRENT_CHANNEL_VERSION