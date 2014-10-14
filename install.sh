apt-get -y update

apt-get install -y zip git vim htop bzip2 curl libleveldb-dev nodejs npm
sudo ln -s /usr/bin/nodejs /usr/bin/node
npm install
apt-get install -y s3cmd

ulimit -n 1000000
