# Version Files

Version Files builder for Angular build facade.

## Description

Keeping user-agent clients up to date with the latest Angular application code can be difficult due to caching and the nature of single-page apps.

The most common approach is polling on the client side to determine if there are any updates available.

This package generates a `version.ts` file and a `version.json` file source from the version in your `package.json`.

The `version.ts` file is an ES Module and should be imported into your code base. This way the application knows its current version.

The `version.json` file should be deployed with the application assets to the server to indicate which version of the application is currently deployed.

The developer can then poll against the `version.json` file on the server and compare its version to the version exposed by the `version.ts` in the application. If they differ then the application knows an update is available and can prompt the user or reload the app.

## Requirements

v0.1.x works with Angular CLI < 8.0.0
v0.2.x works with Angular CLI >= 8.0.0
v0.3.x works with Angular CLI >= 12.0.0

## Usage

1. In the root of your Angular application:

   ```bash
   npm i -D @wiredviews/angular-version-builder
   ```

2. In your _angular.json_ add the following to _architect_ section of the relevant project:

   ```bash
   "version-files": {
     "builder": "@wiredviews/angular-version-builder:files",
     "options": {
        "tsOutputPath": "src/environments/version.ts",
        "jsonOutputPath": "src/version.json"
     }
   },
   ```

3. Run: `ng run [relevant-project]:version-files`
   Where _[relevant-project]_ is the project to which you've added the target

## Options

Both of these values are relative to the workspace root

- `tsOutputPath` - path to the typescript module containing your application version which you can import into your application to be deployed with it
- `jsonOutputPath` - path to the json file that contains the your application version that is deployed on the server

## Credits

Inspiration from [https://medium.com/dailyjs/angular-cli-6-under-the-hood-builders-demystified-f0690ebcf01](https://medium.com/dailyjs/angular-cli-6-under-the-hood-builders-demystified-f0690ebcf01)
