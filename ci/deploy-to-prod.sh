#!/usr/bin/env bash
set -eo pipefail

ENV=prod
HOST=app.goresy.com

source ./ci/functions.sh

configure_ssh "$PROD_SSH_PRIVATE_KEY" $PROD_REMOTE_MACHINE_IP

copy_devops_files_to_remote $PROD_REMOTE_MACHINE_USER $PROD_REMOTE_MACHINE_IP

deploy_service $PROD_REMOTE_MACHINE_USER $PROD_REMOTE_MACHINE_IP $ENV $HOST
