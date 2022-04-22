# LeavingTime Service

## Explanation

A simple service to automatically sends my best options to leave for school every morning. The service will be scheduled every morning at 6am by a cron job. It will then fetch my timetable for the day from [WebUntis](https://webuntis.com/). The service then will figure out if I have cancelled classes or in general the starting time of my school day. With that information it will find out the best time to leave with the [HafasClient](https://github.com/public-transport/hafas-client) and send them to me via [Discord](https://discord.com/).

## Config

The application is config based. There will be multiple configs.

### Global Config

`ltime.config.json`

The global config should hold information just as the Discord App Token and maybe other configurations.

### Individual Config

`_name_.ltime.json`

Each config item will be run after the other, so you can make configuration for multiple people. These config will hold information such as Untis Credentials, Discord User ID's and Locations of the school and starting point.
