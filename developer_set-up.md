How to Set-up a Local Development Environment for this Repository

These instructions are to help you get this repository set-up on your local machine for development purposes. It includes instructions for running the app on your device (Android or iOS). If you have difficulty, the React Native documentation on Setting up the Development Environment (https://reactnative.dev/docs/environment-setup) and the Expo documentation on Installation (https://docs.expo.dev/get-started/installation/) are likely be helpful.

You probably already have these but if not, you should:
•	Download and install Node.js (https://nodejs.org/en/). Choose the LTS release.
•	Download and install Git (https://git-scm.com/).

Expo CLI is a command line app used to initialize and serve React-Native apps. Expo Go is a mobile app that lets you open apps on your device that are served through Expo CLI. You will need both, so…
•	Make an Expo account:
    o	In your internet browser, go to https://expo.dev/
    o	Select “Create an account” and click the Get Started button
    o	Enter a username, email, and password
•	Install the Expo CLI:
    o	npm install --global expo-cli
    o	to verify installation, type “expo whoami” in the terminal.
            If you are not logged-in you will see “Not logged in”, but that also means the installation worked. You can login by typing expo login.
•	Get the Expo Go app on your device.
    o	For Android: Android Play Store (https://play.google.com/store/apps/details?id=host.exp.exponent)
    o	For iOS App Store (https://itunes.com/apps/exponent)
•	Open the Expo Go app on your device. Go to the Profile tab and sign-in with your Expo credentials.
•	Fork this GitHub repository and clone it to your local machine.
•	Create a file called ”.env”, in  the root directory of the project on your local machine. Open the file, “env_template” in this repo and follow its instructions to populate your newly-created .env file.
•	In the terminal, run “npm install”, then “npm start”.
•	The terminal should now show you a QR code. Scan the QR code with your device and your device should open the Expo Go app will the Pinball Map app running. Note that your device and your computer must be on the same network.
•	You should now have the app running locally and changes you make to the code will be reflected in the app on your device. If you are unable to successfully get set-up like this, or you identify errors in these instructions, feel free to file an issue or open a pull request.
