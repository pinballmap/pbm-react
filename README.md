[![Build Status](https://travis-ci.org/bpoore/pbm-react.svg?branch=master)](https://travis-ci.org/bpoore/pbm-react)

This repo is the codebase for the [Pinball Map app](https://www.pinballmap.com/app). The code for the [Pinball Map website is here](https://github.com/pinballmap/pbm). If you have an app issue, please use this repo; if you have a website issue, please use that one!

<p align="center">
<img src="https://github.com/pinballmap/pbm-react/blob/master/app/assets/images/t-shirt-logo.png" alt="Pinball Map App Logo" width="300" style="margin: 0 auto;text-align: center;display: block;"/>
</p>

## Overview of 5+ releases
(prior to version 5, we were using different code bases for the app):

Release dates are approximate, given that review times vary between the App Store and Play Store.

### 5.2.17
January 11, 2023

- Bug fix: Couldn't get rid of the "zoom in further" message
- Added animation when heart/unhearting locations

### 5.2.16
January 9, 2023

- Bug fix: Issue when searching for cities that don't have states (like in Finland, Denmark, Romania)

### 5.2.15
January 7, 2023

- Added the heart/save icon to the List & Saved screens for easier hearting
- Minor design tweaks
- Performance improvements (flashlist instead of flatlist)

### 5.2.14
January 3, 2023

- Bug fixes (phone number crash; edit location info text)
- Minor design tweaks (button adjustments on map; text on Contact screen)

### 5.2.13
December 7, 2022

- Bux fixes (notably, some broken ipdb links)
- Changed external website linking behavior to fix a crash issue
- Minor design updates, especially to dark mode
- Added some "how to search by machine" text to the Search screen

### 5.2.12
November 23, 2022

- Some design updates ("Review location submission", "Review location info" screens; moved Resources and Podcast to links in the About screen; Added a "check email to confirm account" message for new users; and more)
- Added crash reporter
- Link to operator's website if they have one
- Many behind the scenes package updates (react navigation, Expo SDK, etc.)

### 5.2.11
March 24, 2022

- Show backglass image (from OPDB) on machine screen
- Note whether or not an operator receives machine comments
- Add contributor rank and badge to user profile
- Updated the FAQ
- Bug fixes and stuff

### 5.2.10
February 8, 2022

- Refined the City search so that it pulls up all results in that city
- Design updates (increased text contrast, revised colors)
- Fixed a scrolling issue on the Events page
- Fixed an issue on Android where commas weren't being added when entering a high score

### 5.2.9
December 20, 2021

- Fixed a bug where you couldn't remove an operator from a location
- Added Kosovo to list of countries in Submit Location form
- Other minor enhancements

### 5.2.8
November 11, 2021

- "Last updated" wasn't always showing the correct info
- Some design updates
- Code enhancements and performance improvements

### 5.2.7
September 29, 2021

- Updated theme colors, as well as redesigned some elements, especially on the Location Details screen
- Replaced system fonts with custom fonts
- Android: Fixed bug with heart map marker icons not always displaying correctly
- Fixed issue with search not geocoding correctly
- Fixed issue with search keyboard being dismissed at wrong times
- Code enhancements and performance improvements (lots of behind the scenes updates, like how we store secrets, and where the root of the app is, etc)

### 5.2.6
September 5, 2021

- Fixed that bug more better with the "my location" button on some devices
- Fixed issue with deep links not always working correctly

### 5.2.5
August 30, 2021

- Fixed a bug with the "my location" button on some devices
- Fixed/tweaked some design things

### 5.2.4
August 18, 2021

- Update the "country" picker in the Location Suggestion form
- Fixed a bug in how that country field is processed
- Minor design tweaks, including a new splash screen logo

### 5.2.3
August 12, 2021

- Added an option in the Settings page for using Miles or Kilometers as the distance unit
- On iOS, Show the number of machines at your Saved locations on the map (the heart icon)
- Styled the Events page (missed this in the 5.2.0 update), and added a more descriptive message when Events cannot be fetched from the IFPA calendar

### 5.2.2
July 28, 2021

- Fixed a bug: when submitting multiple locations in a row, sometimes the 2nd+ locations weren't submitting correctly (but the user probably wouldn't know).

### 5.2.1
July 15, 2021

- Adjusted deep links
- Fixed a couple button styles

### 5.2.0
July 8, 2021

- Universal links (aka deep links), so a url hyperlink will open up that location on the app
- Added "share" button on location details screen, so you can text app links to friends
- When Filtering by machine, you can choose "all versions of that machine" (e.g Pro, Premium, etc) or just that one version
- Performance improvement on map: map does not auto-refresh results when you pan/zoom. Now, you'll see a "Search this area" button to refresh the results
- On iOS, show number of machines on the dots on the map. And places with more machines have slightly larger dots
- On Android, the map dots use the default google maps style (for better performance)
- Added "stale" text to locations that haven't been updated in over two years
- Redesigned colors/styles
- Redesigned the location details screen so it is a single tab. All the tools (add machine, confirm lineup, etc) are found upon clicking the Tools button
- Display a Message of the Day on the map screen. It will only display when we have something new to say. The message can also be found on the About page
- Updated the FAQ
- Added a "Resources" page
- Lots of bug fixes and code enhancements

### 5.1.5
Mar 30, 2020

- New Settings page where you can manually choose either dark or light mode
- Redesigned dark mode
- Show commas on long number while entering high scores
- Disabled OTA updates (accidentally sent one out last week, sorry)
- Misc fixes

### 5.1.3
Feb 7, 2020

- New feature! Recently Search History. When you click the search bar, you'll see your last 10 searches.
- Fixed a bug where the scrollbar was showing up in the middle of the screen on some devices.
- Misc bug fixes and code enhancements.

### 5.1.2
Dec 31, 2019

- Bug fix: Sometimes when you search for a city, the map would go to that city and then a second later jump back to the previous extent. This has been fixed.
- Some navigation updates.
- General code updates and maintenance.

### 5.1.1
Dec 23, 2019

- Dark Mode (Android) (for devices that have this mode)
- Improved gesture navigation (e.g. swipe right to go back)
- Misc bug fixes and code updates

### 5.1.0
Nov 14, 2019

- Support for Dark Mode (iOS)
- New Filter on the “machine filter” for only listing machines that aren’t currently show in the map extent
- Ignore “The” when sorting machine names in machine list
- Many bug fixes and code enhancements

### 5.0.6
Sept 28, 2019

- Fixed blog and podcast screens (on Android).

### 5.0.5
Sept 25, 2019

- Minor bug fixes
- Code maintenance

### 5.0.4
Aug 30, 2019

- Resolving intermittent DNS-related issue.

### 5.0.3
Aug 20, 2019

- Removed the link to our Patreon page, per the app store (iOS) guidelines.
- Updated the 5.5" device screenshots in the (iOS) app store.

### 5.0.2
Jul 26, 2019

- Fixed: Added the city name to the Saved locations list

### 5.0.1
June 22, 2019

- Type “region” in the search bar to see a list of regions!
- Sort the Location List by number of machines
- Increase the “max zoom”, especially if you have a filter applied
- Make panning/zooming a little smoother
- Brighter Recent Activity icons
- Fixed the map marker jumping when two locations are really close together
- Added city name to location list items
- Turn off autocorrect on search field
- More gesture navigation
- Updated the FAQ
- Fix issue with special characters when searching or typing in passwords
- Additional design adjustments and bug fixes

### 5.0.0
Jun 17, 2019

React Native app released.

- It’s all just ONE BIG MAP now. No more switching between regions.
- But you can still search for a region and pull up all the locations in it! The search also autocompletes for cities that definitely have machines.
- A RECENT ACTIVITY feed, which shows all map edits within 30 miles of wherever you’re searching.
- SAVE your favorite locations and quickly see a list of your favorites.
- FILTER map results by machine, location type, operator, and/or number of machines.
- See nearby events.
- And it’s faster and better and more fun to use!
