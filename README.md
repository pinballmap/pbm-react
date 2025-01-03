This repo is the codebase for the [Pinball Map app](https://www.pinballmap.com/app). The code for the [Pinball Map website is here](https://github.com/pinballmap/pbm). If you have an app issue, please use this repo; if you have a website issue, please use that one!

If you want to contribute to the development of the Pinball Map React Native app, start by following the setup instructions [here](setup.md).

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P411XZAM)

<p align="center">
<img src="https://github.com/pinballmap/pbm-react/blob/master/app/assets/images/t-shirt-logo.png" alt="Pinball Map App Logo" width="300" style="margin: 0 auto;text-align: center;display: block;"/>
</p>

## Overview of 5+ releases

(prior to version 5, we were using different code bases for the app):

Release dates are approximate, given that review times vary between the App Store and Play Store.

### 5.3.26

December 21, 2024

- iOS: add dark and tinted icons.
- Performance improvements (e.g. Enable react native new architecture (fabric) and upgrade to Expo SDK 52).
- Some design tweaks.

### 5.3.25

November 2, 2024

- Fix top margin issue on map screen.
- Increase contrast on map screen items in dark mode.
- Change Insider Connected button colors.
- Bug fix on machine comment screen to account for small devices with large text.

### 5.3.24

September 12, 2024

- Just a small fix on the machine details screen, as well as a couple minor tweaks.

### 5.3.23

August 27, 2024

- Fix sometimes scroll bug on the location description form on the edit location details screen.

### 5.3.22

August 24, 2024

- Add button descriptions on location details screen.
- Change location confirmation action.
- Some design tweaks.

### 5.3.21

August 20, 2024

- Fix some bad/broken links on the About screen.

### 5.3.20

August 19, 2024

- Include country code prefix on non-US phone numbers in location submission form.

### 5.3.19

July 16, 2024

- Some minor design fixes.
- Log the app version in more places to help us troubleshoot.

### 5.3.18

June 18, 2024

- Bug fix for when a keyboard covers up an text input.

### 5.3.17

June 5, 2024

- Okay, added back the "sort by updated" option in the Location List, and also revised the words in that group of buttons to be comprised of fewer letters and thus fit better within the buttons when people set their phone's system font to jumbo.
- Fewer radius options on the Events screen. 5 was excessive.

### 5.3.16

May 28, 2024

- Users can edit or delete their own machine comments. Recent/Location Activity feeds will retain a log of the original comment.
- No more "location tools" icon/section on the Location Details screen. Now all the icons (share/edit/confirm/etc) are displayed more prominently.
- More design accommodations for people using large system fonts.
- Updated the About page.
- Fix to multiline text input issues.

### 5.3.15

May 16, 2024

- Add ability to "Clear All" from Recent Search History.
- A deleted location will now be removed from Recent Search History if you click on it.
- Updated the FAQ.
- Various design tweaks and other things.

### 5.3.14

April 3, 2024

- Bug fix: scrollbar issue on location details screen.
- Remove IPDB links on machine details screen (too many missing machines; not getting updated), and replace with Kineticist links (contains a host of useful info and links).
- Slight improvement to app startup time.

### 5.3.13

March 27, 2024

- Show backglass image (if available) when adding a machine to location, to try and help users know they have the right version.
- Include a "scroll to top" button on the location details screen.
- Show "Added on" date for machines on the location details screen. (Thank you [@unitof](https://github.com/unitof))
- Fixed some issues with text input design.
- Bug fix for when a City that no longer has locations is in your Recent Search History.

### 5.3.12

February 23, 2024

- Fixed minor bug on About page (Thank you [@ErikGraciosa](https://github.com/ErikGraciosa)).
- A couple small design tweaks and package updates.

### 5.3.11

February 8, 2024

- Fix the "and x more machines" text on the Saved locations list.
- New map marker icon colors, and other map screen design tweaks.
- Design adjustments on the location details screen to better manage people using large system fonts.
- Tucking some of the location details behind a location details button in order to clean up the location details screen.
- Other behind the scenes maintenance updates.

### 5.3.10

February 8, 2024

- The same as 5.3.11 above, but the markers were a little tough to click due to the dropshadow radius (overlapping other markers). So, adjusted and re-submitted (5.3.10 was only published on the iOS app store).

### 5.3.9

December 30, 2023

- The location labels on the map can now dynamically position themselves around the marker.
- Bug fix: If you search for locations that have the exact same name, the "recent search history" was only showing one of them.
- When users have location services turned off, do not bug about turning it on every time they open the app. And remember where they were last time they used the map.

### 5.3.8

December 5, 2023

- Show number of machines on the mini-map on the location details screen.
- Don't show "machines in this area" option when adding a machine to a location.

### 5.3.7

November 16, 2023

- Changed the mini-map on the location details screen to be a link to open the main map centered on that venue.

### 5.3.6

November 7, 2023

- Made it so the map doesn't unnecessarily "auto refresh" results when you go to it after viewing a location
- Fixed (or at least improved) issue with the user location marker getting in the way of clicking map markers

### 5.3.5

November 3, 2023

- New map marker styles, as well as location name labels becoming visible as you zoom
- Map markers with more machines will appear above those with fewer
- Fix bug where setting distance unit to km was resetting back to miles
- Require users to confirm account via email before logging in after account creation

### 5.3.4

October 6, 2023

- Fixed the splash screen bug
- Added a "none found" message when the map is showing an area (or filtered search) that contains no locations
- Updated the FAQ

### 5.3.3

October 4, 2023

- (iOS-only release): Attempt to fix a bug that caused the splash screen to get stuck on cold starts.

### 5.3.2

August 16, 2023

- Fixed the "zoom in" message being above the map callout bottom sheet.
- Added the "Directions" button to the lil mini map on the location details screen.
- Replaced the "tools" and "more" icons with a hamburger menu icon.

### 5.3.1

August 7, 2023

- Fixed issue with the map unnecessarily moving when you go back from a location
- and an issue when going back from the Filter screen
- Lil design tweaks

### 5.3.0

August 29, 2023

- Switched map library to RNMapbox. This results in better map performance; fixes a bug when displaying lots of markers; and allows us to use custom markers in Android (previously not used due to performance issues).
- Show the map marker callouts in a bottom sheet, rather than floating near the marker. More standardized, and looks nicer.
- Majorly adjusted how the map display markers. There are no longer results "off the screen" to the left and right. So the "List" more accurately shows what is on the map. This saves resources and allows us to:
- Tweak the "max zoom" limits. You can zoom further out now. These limits differ depending on if you are filtering results, and what you are filtering.
- Added ability to select more than one filter item in Recent Activity.
- Added a Stern Insider Connected flag on eligible machines. If a machine has IC, no need to comment saying so - just tag it!
- Removed PT Sans font in favor of more Nunito weights. And tweaked some colors.
- Tablets can switch between portrait and landscape orientation.
- Bug fixes!

### 5.2.28

May 15, 2023

- Bug fix: Fixed problem when sorting on the Saved screen.
- Minor dark mode color tweaks.

### 5.2.27

April 29, 2023

- Fix IPDB links

### 5.2.26

April 26, 2023

- Fix: When you go "back" to the Activity screen, results will not automatically refresh (so you don't lose where you were scrollin' to)
- Design tweaks: especially to Dark Mode. Kinda toned down some colors.
- Changed the "Filter by Number of Machines" options. Now 2+, 5+, 10+, 20+. And you can zoom out further when filtering more.

### 5.2.25

April 13, 2023

- Bug fix: Fix issue with some phone numbers not opening your call app.

### 5.2.24

April 11, 2023

- Feature: Added Google Places autocomplete to the Submit Location form. Start typing in a venue name, choose one, and many of the form's fields will be filled in!
- Various bug fixes (deep linking, etc.)

### 5.2.23

March 30, 2023

- Bug fix: Fixed an issue where the splash screen was getting stuck trying to obtain your current location.

### 5.2.22

March 24, 2023

- Bug fixes: better error handling. One example is when you click on a location name in your "Recent Search History" but that location has since been deleted - now you get a simple error message.

### 5.2.21

March 19, 2023

- Minor update: adjusted some text and design

### 5.2.20

March 15, 2023

- Include "Last Updated" text under the machines listed on Location Details screen
- Minor color tweaks

### 5.2.19

March 08, 2023

- Bug fixes: mostly related to the splash screen

### 5.2.18

March 05, 2023

- Feature: Added a button on Location Details for viewing all the updates/activity at that location. Shows machines added, removed, machines comments, high scores, and line-up confirmations.
- Feature: Added radius options to the Recent Activity screen, so you can see recent updates that are further away (helpful for rural or more sparse areas)
- Feature? Cool animation when you click the "heart" icon to favorite a location (and un-favorite)
- Bug Fix: Couldn't add phone numbers on Android on the Location Submission form
- Bug Fix: Issue when backspacing in the "Country" search field in the Location Submission form
- Bug Fix: After submitting a location, the app wasn't properly navigating you out of that screen, so users sometimes thought the submission didn't go through
- Design update: Replaced Lato font with PT Sans
- Design update: Redesigned Location Details, Location List, and Machine Details screens
- Design update: Tweaked colors (higher contrasts to be more accessible, added purple, etc.) and other things
- Design update: Do not display most recent machine comment under each machine on the Location Details screen (instead, all comments can be viewed by clicking the machine)
- Misc: Added little notes in some places to help guide users (on Machine Comment form and Edit Location Details screen)
- Misc: Many other tweaks and bug fixes and performance improvements

### 5.2.17

January 11, 2023

- Bug fix: Couldn't dismiss the "zoom in more" message

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
