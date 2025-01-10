# How to Set-up a Local Development Environment for this Repository

Interested in being a contributor? These instructions are here to help you get this repository set-up on your local machine for development purposes. They include instructions for running the app on your mobile device (Android or iOS). If you have difficulty, the React Native documentation on Setting up the Development Environment [here](https://reactnative.dev/docs/environment-setup), and the Expo documentation on Installation [here](https://docs.expo.dev/get-started/installation/) are likely to be helpful.

As a developer, you will find these steps to be pretty standard. The only part that may be unusual is the .env file that needs to be created.

These instructions assume that you have installed:

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

## Expo

Development of the Pinball Map App (pbm-react) is done using Expo. **Expo** is a platform for making universal native apps using Javascript and React Native. Expo runs on Android, iOS, and the web (the pbm website does not use Expo).

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

The Google Maps key is used for geocoding some searches (and when submitting new locations). Instructions for obtaining a Google Maps API key are [here](https://developers.google.com/maps/documentation/embed/get-api-key).:

### IFPA API

`IFPA_API_KEY`

The IFPA key is used for the Events screen. Request an IFPA API Key [here](https://www.ifpapinball.com/api/request_api_key.php).

### Pinball Maps API

No key is needed. If your development process involves editing data (adding/removing machines, leaving comments, etc.) then do not use the production API endpoints. Instead, use the staging server. The staging server is not always turned on, so please ask us to turn it on.

Staging: `API_URL='https://pbmstaging.com/api/v1'`
Production: `API_URL='https://www.pinballmap.com/api/v1'`

### Sentry Auth Token

`SENTRY_AUTH_TOKEN`

</details>

## Fire It Up

### Local Dev Build

<details>
  <summary>Build on your local machine.</summary>

- `npm install` - Install all necessary dependencies
- `npx expo run` - Build and run a local build
  - Choose the platform you want to run. It may take some time to build.
  - You can also run a platform directly with `npx expo run:ios` or `npx expo run:android`
  - More details on local dev client builds are [here](https://docs.expo.dev/guides/local-app-development/#local-builds-with-expo-dev-client)
  </details>

or rather than `npx expo run` you can use Expo's EAS to build a Development Build. This creates a build in the cloud for free.

### EAS

<details>
  <summary>Build in the cloud using EAS.</summary>
- `npx expo install expo-dev-client` - Install the expo dev client
- `eas build` - Begin the build process
- Select a platform and wait for the build to complete. You should see a link in your terminal. This link will take you to the build details.
- More details on EAS builds are [here](https://docs.expo.dev/develop/development-builds/create-a-build/)
</details>

If you are unable to successfully get set-up like this, or if you identify errors in these instructions, we'd love for you to file an issue or open a pull request.

## Possible Problems

### Bare Workflow Error

If you receive an error upon launching the app that says something along the lines of `you are using the bare workflow, where runtime policy versions are not supported.` you will need to adjust your [app.config.js](./app.config.js). Try replacing

```
runtimeVersion: {
  policy: "sdkVersion",
},
```

with

```
runtimeVersion: "1.0.0",
```

Please don't commit this change.

### EAS Errors

If you are receiving errors when trying to perform an EAS build.

- Make some changes in [app.config.js](./app.config.js).
  1. Change the owner property to your expo user name.
  2. Delete the expo.extra.eas projectId. A new one should be generated when you build next.

Please don't commit these changes.
