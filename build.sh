#! /bin/bash

WINDOWS_OS=$(uname -a | grep -i mingw)
UBUNTU_OS=$(uname -a | grep -i ubuntu)
MAC_OS=$(uname -a | grep -i darwin)
BREW_FOUND=$(brew --version)
NODE_EXISTS=$(node --version)
YARN_FOUND=$(yarn --version)
NG_FOUND=$(ng --version)

install_homebrew () {
    if [ -z "$BREW_FOUND" ]; then
        echo "Homebrew not found"
        echo "Installing homebrew"
        /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    else
        echo "Homebrew found"
    fi
}

install_nodejs_ubuntu () {
    if [ -z "$NODE_EXISTS" ]; then
        echo "Nodejs not found"
        echo "Installing nodejs for ubuntu"
        curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "Nodejs found"
    fi
}

install_nodejs_mac () {
    if [ -z "$NODE_EXISTS" ]; then
        echo "Nodejs not found"
        echo "Installing nodejs for mac"
        brew install node
    else
        echo "Nodejs found"
    fi
}

install_yarn () {
    if [ -z "$YARN_FOUND" ]; then
        echo "Yarn not found"
        echo "Installing yarn"
        sudo npm i -g yarn
    else
        echo "Yarn found"
    fi
}

install_angular_cli () {
    if [ -z "$NG_FOUND" ]; then
        echo "Angular cli not found"
        echo "Installing angular cli"
        sudo yarn global add @angular/cli
    else
        echo "Angular cli found"
    fi
}

install_node_modules () {
    cd marta && yarn install
    cd ../Backend && yarn install
}

if [ -n "$WINDOWS_OS" ]; then
    if [ -z "$NODE_EXISTS" ]; then
        echo "Nodejs not found"
        echo "Please install nodejs for windows and run script again"
    else
        echo "Nodejs found"
        install_yarn
        install_angular_cli
        install_node_modules
    fi
elif [ -n "$UBUNTU_OS" ]; then
    install_nodejs_ubuntu
    install_yarn
    install_angular_cli
    install_node_modules
elif [ -n "$MAC_OS" ]; then
    install_homebrew
    install_nodejs_mac
    install_yarn
    install_angular_cli
    install_node_modules
else
    echo "Unknown OS"
    echo "Aborting build"
fi
