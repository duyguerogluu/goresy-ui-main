#!/bin/bash

env_config_location=/usr/share/nginx/html/env-config.js
rm -rf $env_config_location
touch $env_config_location

echo "window.env = {" >> $env_config_location

for varname in REACT_APP_GORESY_BACKEND_URL \
               REACT_APP_GORESY_OAUTH_URL \
               REACT_APP_GORESY_OAUTH_AUTH_HEADER
do
  value=${!varname}
  echo "  $varname: \"$value\"," >> $env_config_location
done

echo "}" >> $env_config_location

nginx -g 'daemon off;'
