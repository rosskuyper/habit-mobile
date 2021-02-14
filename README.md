# Habit Mobile

## Versioning and Expo Release Channels

Expo allows us to send over the air updates to our JS bundles, letting us deploy some updates without having to submit native app builds. This is great for features and fixes alike, as the need to add native modules becomes less and less frequent.

Conceptually the implication are pretty simple: each javascript bundle is only compatible with a specific native build, and so once we add native modules to the app, the new JS bundles will almost certainly not work in the older versions of the app.

Expo doesn't handle this for us out of the box, and so we need to use their Release Channel process to manage this. The implementation and its ins and outs aren't as simple as the concept though, so it's crucial that we're careful here.

1. Each build is configured, natively, to pull new JS bundles from a specific release stage. This cannot be changed once the build is compiled.
1. Because we want a given JS build to go only to a single native build, we need to make sure this release stage is incremented with _every_ native build.
1. When merging to master, we must make sure the release channel published to is incremented accordingly and matches the right native build we're trying to target.

A simple versioning strategy will help us here:

| iOS Version(s) | iOS Build | Release Channel | Status              |
| -------------- | --------- | --------------- | ------------------- |
| 1.0.0          | 1-8       | default         | _obsolete build_    |
| 1.0.0          | 9         | default         | In beta             |
| 1.0.0          | 10        | prod-v1.0.0.10  | In beta             |
| 1.0.0          | 11        | prod-v1.0.0.11  | (not yet submitted) |
| 1.1.0          | 1         | prod-v1.1.0.1   | (future version)    |

This will let us very quickly determine which releaseChannel a user is on based on what native version they have installed.

In-app we will also attempt to output the commit hash associated with the expo build, where possible. Because the inital native build is done through expo this value will not be set at this stage, but will get updated for the user when the bundle is replaced by expo.

| iOS Version | iOS Build | Release Channel | Commit                      |
| ----------- | --------- | --------------- | --------------------------- |
| 1.0.0       | 10        | prod-v1.0.0.10  | base <--- intial install    |
| 1.0.0       | 11        | prod-v1.0.0.11  | ced1010                     |
| 1.0.0       | 11        | prod-v1.0.0.11  | d3659fd                     |
| 1.0.0       | 11        | prod-v1.0.0.11  | a40d367                     |
| 1.0.0       | 12        | prod-v1.0.0.12  | base <--- native app update |
| 1.0.0       | 12        | prod-v1.0.0.12  | d3140b2                     |

### Incrementing builds and release channels

**New Native Build**

1. Increment `EXUpdatesReleaseChannel` key in `ios/habitmobile/Supporting/Expo.plist`
1. Increment `expo.modules.updates.EXPO_RELEASE_CHANNEL` in `android/app/src/main/AndroidManifest.xml` (has no effect right now, but good to keep up to date).
1. Increment `version` in `app.json`. This should just be the version + build combo. E.g. `1.0.0.12`.
1. Increment the build version and number in Xcode.
1. Verify that all the versions correspond correctly.
1. Submit to app stores.
1. Create PR and merge. Expo publish will **also** run in CI so it's **vital** that `app.json` has been incremented. Hash checks are in place to ensure this is done, however.

| XCode Version Number | XCode Build Number | Release Channel | app.json Version |
| -------------------- | ------------------ | --------------- | ---------------- |
| 1.0.0                | 12                 | prod-v1.0.0.12  | 1.0.0.12         |
| 1.1.0                | 1                  | prod-v1.1.0.1   | 1.0.0.1          |
| 2.0.0                | 13                 | prod-v2.0.0.13  | 2.0.0.13         |

**New Non-Native Build**
As long as the versions were incremented consistently, there's nothing to do here. Just make sure the native modules you have match those of the build version / release channel in your branch.
