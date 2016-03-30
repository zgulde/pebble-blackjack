# Blackjack for the Pebble Watch

The base of this application is forked from [pebblejs](https://github.com/pebble/pebblejs).

## Getting Started

[CloudPebble](https://cloudpebble.net/ide/) provides a great IDE experience for
developing on the pebble, but if you (like me) are quite particular about your
editor and workflow, you can do everything locally.

It took me a while to get my development environment setup for the pebble and I
couldn't find a complete guide in any one place so here's my take on it.

Note: all commands are work at the time of writing, but the pebble itself and
pebblejs specifically are under development, so all this is highly subject to
change!

- install the pebble command line tool preferably using brew
    - `brew install pebble/pebble-sdk/pebble-sdk`
- install the pebble sdk
    - view available versions `pebble sdk list`
    - `pebble sdk install <version number>`
    - at the time of writing I'm using the most current, 3.10.1
- go fork [pebblejs](https://github.com/pebble/pebblejs) as it has the base for
  a javascript pebble application
- go change all the things!
    - your code lives in `my_pebble_project/src/js/app.js`
- build the project
    - from the directory your pebble project is in
    - `pebble build`
- test it out in the emulator
    - from the directory your pebble project is in:
    - `pebble install --emulator (aplite|basalt)`
- debug
    - when an emulator is running, `pebble logs` will show all your
      `console.logs` from your app in realtime
- put it on a real watch!
    - connect your watch to your computer via bluetooth
        - you only need to do this once, it's okay if your pebble is not
          connected afterwards
    - find the path to your pebble in `/dev`
        - `ls -1t` will show you the most recently changed items, so it is best to run this immediately after connecting to your pebble
        - we are looking for something like `cu.Pebble777F-SerialPortSe`
        - make note of that path
    - from your pebble project directory
        - `pebble install --serial /dev/<your-pebble>`

I've created an alias for building installing and looking at the logs as that
is a lot to type out. Here's the command you probably want to alias:

    pebble build && pebble install --emulator aplite && pebble logs
    
This will build the project, install it on an emulator and stream the app's
logs to your terminal.
