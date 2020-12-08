# SendApp
A React Native App, allows users to share files between different devices.

The [demonstration](https://github.com/liao-victor/SendApp/blob/main/demo.pdf) describes how this app works in detail.

## Tips of installation
* [React Native development environment](https://reactnative.dev/docs/environment-setup) should be set up in advance.
* You can access the built-in command line interface of React Native without installing anything globally using npx, which ships with Node.js. Use it to generate a new project called "send": `npx react-native init send`
* After generating the new project called "send", put all files and folder in this project to the root directory of the project you just generated and overwrite.
* Run `yarn android` on the root directory of the project to test the app. (You can follow [React Native Docs](https://reactnative.dev/docs/environment-setup))
* [Google reCAPTCHA](https://developers.google.com/recaptcha/docs/display) is integrated in this app. Please replace `YOUR_RECAPTCHA_PUBLIC_KEY`([here](/src/App.js#L16)) with your reCAPTCHA public key.
* Please replace `YOUR_WEBSITE_LINK`([here](/src/App.js#L17)) with your server link (e.g. `https://domain.com/`).
