# Daylight alarm clock
Let there be light when you have to wake up!
RasPi project to make an LED-Strip daylight alarm clock.
- Light on/off, and dimming via pwm
- set alarm time => the light will start dimming from 0% to 100% 20min befor the alarm time.
- sleep timer => turns the light off after specified time. Starts dimming 10min befor the time is up.

To controll the  LEDs i use a Node.JS Express REST API with a Rect App which is serverd from the same Express server.
I also implemented an socket.io connection to display changes in realtime.
Because of the REST API you can use any frontend you like.

Used Hardware:
- Raspberry Pi Zero W
- 12V single color led stripe
- 12V power brick
- Step Down Module to power the Pi 12V -> 5V
- MosFET Modul controll the 12V current of the Stripe.

## Wiring up the hardeware

=> comming soon

## Set-up the RPi Zero W
I asume you have installed Raspberry Pi OS on the Pi. (for help go to https://www.raspberrypi.org/documentation/)
For the following steps you need to open the terminal or login via SSH.

If your Pi is connected via WLAN the first thing we should do is disable the wlan sleep mode.

To do this permanently add
```
wireless-power off
```
to the /etc/network/interfaces file
it should look something like this:

```
allow-hotplug wlan0
iface wlan0 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
wireless-power off

allow-hotplug wlan1
iface wlan1 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
wireless-power off
```

To set-up the server on a freshly installed pi the following steps should do it.
First install git and the pigpio C library which we need to controll the GPIO-Pins
```
sudo apt-get update
sudo apt-get install git pigpio
```
Because of the older ARM Architecture (ARM 6l) of the Pi Zero we need use an unofficial build of Node.JS
to download Node version 15.12 use the command:
```
curl -o https://unofficial-builds.nodejs.org/download/release/v15.12.0/node-v15.12.0-linux-armv6l.tar.gz
```
next you need to unpack the tar.gz with:
```
tar -xzf node-v15.12.0-linux-armv6l.tar.gz
```
the last step is to transfer the folder to the right location:
```
sudo cp -r node-v15.12.0-linux-armv6l/* /usr/local/
```
now Node should be installed on the Pi. To Verify that all is installed correctly use
```
npm -v
node -v
git --version
```
Then istall pm2 which we will use to deamonize the node process:
```
sudo npm i -g pm2
```
if all is set-up correctly you need clone the repository:
```
git clone https://github.com/maxdollinger/daylight-alarm-clock.git
```
now there should ne an directory "daylight-alarm-clock". To open it:
```
cd daylight-alarm-clock
```
Befor you start the server you can do a basic configuration of the server in the ecosystem.config.js.
But you don't need to.
```
PORT => set the port on which the server will be available
IPFILTER => if set to true only allows requests from ip's which are part of the network specified at IPV4 and IPV6
IPV4 => ipv4 networkpart of the allowed adresses e.g. "192.168.1"
IPV6 => ipv6 networkpart of the allowed adresses e.g. "2001:0db8:85a3:08d3"
```
Now you can start the the server with pm2.
```
sudo pm2 start
```
this will start pm2 and uses the ecosystem.config.js file for configuration.
Verify that the server is running with:
```
sudo pm2 list
```
If there is an entrie alarm_clock with the status "online" you can controll the led-strip from any device in your network.

Just open your browser and type http://*(ip/hostname of the pi) If you changed the port you need to add the port at the end http://*(ip/hostname of the pi):*(Port)
Then you should see the react web app to controll the pi.

## API Endpoints

#### /led
GET: sends the current settings of the led as JSON e.g. of the key pwm has the value 0 the light is off.
```
{ pwm: 0 }
```

PUT: toggles the light on/off sent data is ignored

POST: expects an object with the key "brightness" and a value between 0 and 255
```
{ brightness: 255}
```

#### /alarm
GET: sends the status of the alarm-clock
```
{   
    // alarm time and date in ms till the 01.01.1970 00:00:00 UTC
    time: 1616686969435,
    // indicates if the alarm is on or off
    status: 'off',
}
```

PUT: toggles the alarm on/off

POST: expects an object with the key "time" and value with the alarm time in ms till the 01.01.1970 00:00:00 UTC => e.g. Date.now() in JS
```
{
    time: 1616686969435,
}
```

#### /sleep-timer
GET: sends the status of the sleep timer
```
{
    //after what time the light will be off in ms
    time: 1800000,
    status: 'off',
}
```

PUT: toggles the sleep timer on/off

POST: expects an object with the key "time" and a value with the time in after wich the light will be off in ms.
```
{
    time: 1800000,
}
```

## Socket.io
emmits three events: 
'led', 'alarm', 'sleepTimer' and sends the same data as the api endpoints on GET
