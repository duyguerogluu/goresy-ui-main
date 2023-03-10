#!/usr/bin/env bash
set -eo pipefail

ENV=dev
HOST=dev-app.goresy.com

source ./ci/functions.sh

configure_ssh "$DEV_SSH_PRIVATE_KEY" $DEV_REMOTE_MACHINE_IP

copy_devops_files_to_remote $DEV_REMOTE_MACHINE_USER $DEV_REMOTE_MACHINE_IP

deploy_service $DEV_REMOTE_MACHINE_USER $DEV_REMOTE_MACHINE_IP $ENV $HOST
