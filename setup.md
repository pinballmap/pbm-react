# How to Set-up a Local Development Environment for this Repository

Interested in being a contributor? These instructions are here to help you get this repository set-up on your local machine for development purposes. They include instructions for running the app on your mobile device (Android or iOS). If you have difficulty, the React Native documentation on Setting up the Development Environment [here](https://reactnative.dev/docs/environment-setup), and the Expo documentation on Installation [here](https://docs.expo.dev/get-started/installation/) are likely to be helpful.

As a developer, you will find these steps to be pretty standard. The only part that may be unusual is the .env file that needs to be created.

These instructions assume that you have installed:

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

## Expo

Development of the Pinball Map App (pbm-react) is done using Expo. **Expo** is a platform for making universal native apps using Javascript and React Native. Expo runs on Android, iOS, and the web (the pbm website does not use Expo).

You'll need the expo cli tool to develop using Expo:

- The **expo-cli** is a command line app used to initialize and serve React-Native apps like ours.

You can proceed with the following steps to get the Expo CLI up and running:

- Make an Expo account [here](https://expo.dev/)
- Install the Expo CLI using npm:
  - `npm install -g expo-cli`
  - to verify installation, type `expo whoami` in the terminal.
    If you are not logged-in you will see `Not logged in`, but that also means the installation worked. You can login by typing `expo login`.
- Get the client app on your device.
  - Expo, for Android: [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - Expo Go, for iOS: [App Store](https://itunes.com/apps/exponent)
- Open the app on your device. Go to the Profile tab and sign-in with your Expo credentials.

## GitHub

Fork [this](https://github.com/pinballmap/pbm-react.git) GitHub repository to your own GitHub account, then clone it to your local machine.

You will want to work against the `master` branch to ensure that you are working against the most recent code.

## .env File

Create a file called ”.env”, in the root directory of the project on your local machine. Open the file, “env_template” in this repo and follow its instructions to populate your newly-created .env file.

You may be able to get away with not setting up many of these depending on which functionality you want to work on.

<details>
  <summary>.env Key Details</summary>

### MapBox API key

This drives the mapping visuals within the app. This is probably the most necessary API key out of this bunch.
Instructions for obtaining the necessary keys are [here](https://docs.mapbox.com/help/getting-started/access-tokens/)

`MAPBOX_DOWNLOAD` is considered the secret key and will start with `sk.`

`MAPBOX_PUBLIC` is considered the public key and will start with `pk.`

### Google Maps API Key

`GOOGLE_MAPS_KEY`

Instructions for obtaining a maps API key are [here](https://developers.google.com/maps/documentation/embed/get-api-key).:

### IFPA API

`IFPA_API_KEY`

Request an IFPA API Key [here](https://www.ifpapinball.com/api/request_api_key.php).

### Pinball Maps API

No key is needed, but you may want to switch between the produciton and staging servers if there's a risk that you may damage data.

Production: `API_URL='https://pinballmapstaging.herokuapp.com/api/v1'`
Staging: `API_URL='https://www.pinballmap.com/api/v1'`

### Sentry Auth Token

`SENTRY_AUTH_TOKEN`

</details>

## Fire It Up

- `npm install` - Install all necessary dependencies
- `npx expo run` - Build and run a local build
  - Choose the platform you want to run. It may take some time to build.
  - You can also run a platform directly with `npx expo run:ios` or `npx expo run:android`
  - More details on local dev client builds are [here](https://docs.expo.dev/guides/local-app-development/#local-builds-with-expo-dev-client)
- or review [here](https://docs.expo.dev/develop/development-builds/create-a-build/) for instructions on EAS builds.

If you are unable to successfully get set-up like this, or if you identify errors in these instructions, we'd love for you to file an issue or open a pull request.

## Possible Problems

If you receive an error upon launching the app that says something along th elines of `you are using the bare workflow, where runtime policy versions are not supported.` you will need to adjust your [app.config.js](./app.config.js). Try replacing

```
runtimeVersion: {
  policy: "sdkVersion",
},
```

with

```
runtimeVersion: "1.0.0",
```
