#!/bin/bash

configure_ssh() {
  private_key=$1
  remote_machine_ip=$2

  eval $(ssh-agent -s)

  # Add the SSH key stored in $private_key variable to the agent store
  echo "$private_key" | tr -d '\r' | ssh-add -
  mkdir -p ~/.ssh
  ssh-keyscan $remote_machine_ip >> ~/.ssh/known_hosts
  chmod 644 ~/.ssh/known_hosts
}

copy_devops_files_to_remote() {
  remote_machine_user=$1
  remote_machine_ip=$2

  # Clone DevOps Repository
  apk add git
  git clone https://gitlab-ci-token:${CI_JOB_TOKEN}@gitlab.com/goresy-dev-team/goresy-devops.git

  IMAGE_TAG=$CI_COMMIT_REF_NAME-$CI_COMMIT_SHORT_SHA
  tmp_dir=/tmp/$IMAGE_TAG
  ssh $remote_machine_user@$remote_machine_ip "mkdir -p $tmp_dir"
  
  # Copy repo files to the remote server
  scp -rp goresy-devops $remote_machine_user@$remote_machine_ip:$tmp_dir
}

deploy_service() {
  remote_machine_user=$1
  remote_machine_ip=$2
  env=$3
  host=$4

  IMAGE_TAG=$CI_COMMIT_REF_NAME-$CI_COMMIT_SHORT_SHA

  # Connect to remote server with ssh and deploy the service
  ssh $remote_machine_user@$remote_machine_ip \
      CI_BUILD_TOKEN=$CI_BUILD_TOKEN \
      IMAGE_TAG=$IMAGE_TAG \
      ENV=$ENV \
      HOST=$HOST \
      /bin/bash <<'EOF'
set -eo pipefail

tmp_dir=/tmp/$IMAGE_TAG

trap 'rm -rf $tmp_dir' EXIT
pushd $tmp_dir/goresy-devops

# Deploy the service.
./deploy-service.sh --docker-username=gitlab-ci-token \
                  --docker-password=$CI_BUILD_TOKEN \
                  --service=goresy-ui \
                  --image-tag=$IMAGE_TAG \
                  --env=$ENV \
                  --host=$HOST
popd
EOF
}
