# detect platform
unamestr=`uname`
if [ "$unamestr" = 'Darwin' ]; then
    brew install leveldb wget node
elif [ "$unamestr" = 'Linux' ]; then
    apt-get -y update
    apt-get install -y zip git vim htop bzip2 curl libleveldb-dev nodejs npm
    sudo ln -s /usr/bin/nodejs /usr/bin/node
    apt-get install -y s3cmd
    ulimit -n 1000000
fi

npm install