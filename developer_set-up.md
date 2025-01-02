# How to Set-up a Local Development Environment for this Repository

Interested in being a contributor? These instructions are here to help you get this repository set-up on your local machine for development purposes. They include instructions for running the app on your mobile device (Android or iOS). If you have difficulty, the React Native documentation on Setting up the Development Environment [here](https://reactnative.dev/docs/environment-setup), and the Expo documentation on Installation [here](https://docs.expo.dev/get-started/installation/) are likely to be helpful.

As a developer, you will find these steps to be pretty standard. The only part that may be unusual is the .env file that needs to be created.

These instructions assume that you have installed:
* [Node.js](https://nodejs.org/en/)
* [Git](https://git-scm.com/)
* [Watchman](https://facebook.github.io/watchman/docs/install.html) (for macOS users)
## Expo
Development of the Pinball Map App (pbm-react) is done using Expo. **Expo** is a platform for making universal native apps using Javascript and React Native. Expo runs on Android, iOS, and the web (the pbm website does not use Expo).

You'll need two tools to develop using Expo: Expo's command line interface, and Expo's mobile client app:

* The **expo-cli** is a command line app used to initialize and serve React-Native apps like ours.

* **Expo Go** (for iOS), or **Expo** (for Android) is Expo's mobile client app that will allow you to open React Native apps on your mobile device that are served through the expo-cli.

You can proceed with the following steps to get the Expo CLI and the Expo Go app (or the Expo app, for Android) up and running:
* Make an Expo account [here](https//expo.dev/)
* Install the Expo CLI using npm:
    * `npm install -g expo-cli`
    * to verify installation, type `expo whoami` in the terminal.
            If you are not logged-in you will see `Not logged in`, but that also means the installation worked. You can login by typing `expo login`.
* Get the client app on your device.
    * Expo, for Android: [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
    * Expo Go, for iOS: [App Store](https://itunes.com/apps/exponent)
* Open the app on your device. Go to the Profile tab and sign-in with your Expo credentials.

## GitHub
Fork this GitHub repository to your own GitHub account, then clone it to your local machine.
## .env File
Create a file called ”.env”, in  the root directory of the project on your local machine. Open the file, “env_template” in this repo and follow its instructions to populate your newly-created .env file.
## Fire It Up
* `npm install`
* `npm start` (This delegates to `expo start`, so you can type whichever you like.)
* The terminal should now show you a QR code. Scan the QR code with your device using the Camera app (iOS) or the Expo app (Android). This should start the Pinball Map app running on your device using Expo. Note that your device and your computer must be on the same network.

If you are unable to successfully get set-up like this, or if you identify errors in these instructions, we'd love for you to file an issue or open a pull request.

