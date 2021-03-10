# Expo Versioning Util
# It is highly recommended to read the readme to become familiar with
# the expo release channel publishing process.

# Essentially the aim is to make sure expo js bundles that are built are published to
# a release channel linked to a native build that supports it. When native modules are
# added to the project, a new native build and release channel needs to be configured.

# These utils help with detecting a misconfiguration by looking at the hashes of files
# related to native builds.

# Versioning configuration
# There are 5 places where version / release channel configurations need to match.
# 1. app.json -> expo.version is used to define the release channel `prod-${version}`
# 2. ios/habitmobile/Supporting/Expo.plist -> EXUpdatesReleaseChannel
# 3. ios/habitmobile/Info.plist -> CFBundleShortVersionString should match the first 3 digits of the RC.
# 4. ios/habitmobile.xcodeproj/project.pbxproj -> CURRENT_PROJECT_VERSION should match the last digit of the RC.
# 5. android/app/build.gradle -> versionName should should match the first 3 digits of the RC.
#                             -> versionCode should match the last digit of the RC.
# 6. android/app/src/main/AndroidManifest.xml -> expo.modules.updates.EXPO_RELEASE_CHANNEL

import os
import hashlib
import json
import plistlib
import re
import sys
from xml.dom.minidom import parse


def abspath(relpath):
    return '{}/{}'.format(os.getcwd(), relpath)


# List of files whose contents changing would usually indicate a new build is required
EXPO_APP_JSON_PATH = abspath('app.json')
EXPO_PLIST_PATH = abspath('ios/habitmobile/Supporting/Expo.plist')
INFO_PLIST_PATH = abspath('ios/habitmobile/Info.plist')
PROJECT_PBX_PATH = abspath('ios/habitmobile.xcodeproj/project.pbxproj')
GRADLE_BUILD = abspath('android/app/build.gradle')
ANDROID_MANIFEST = abspath('android/app/src/main/AndroidManifest.xml')

HASH_MAP_PATH = abspath('versionHashMap.json')

# Changing the order will change the resulting hash
files_to_hash = [
    EXPO_APP_JSON_PATH,
    EXPO_PLIST_PATH,
    INFO_PLIST_PATH,
    PROJECT_PBX_PATH,
    abspath('ios/Podfile'),
    abspath('ios/Podfile.lock'),
    abspath('ios/habitmobile/AppDelegate.m'),
    GRADLE_BUILD,
    ANDROID_MANIFEST,
    abspath('android/app/build.gradle'),
    abspath('android/app/src/main/java/com/habitualizer/mobile/MainActivity.java'),
    abspath('android/app/src/main/java/com/habitualizer/mobile/MainApplication.java'),
    abspath('android/app/src/main/java/com/habitualizer/mobile/generated/BasePackageList.java'),
]

#######
# UTILS
#######


def file_as_bytes(fname):
    with open(fname, 'rb') as file:
        return file.read()


def hash_files():
    total_file_hash = hashlib.sha512()

    for fname in files_to_hash:
        contents = file_as_bytes(fname)
        total_file_hash.update(contents)

    return total_file_hash.hexdigest()


def load_hash_map():
    # We're going to assume the map exists to prevent overwriting it
    with open(HASH_MAP_PATH, 'rb') as file:
        return json.load(file)


def save_hash_map(hash_map):
    with open(HASH_MAP_PATH, 'w') as file:
        return json.dump(hash_map, file, indent=2)


def get_expo_app_json_version():
    app_json = json.load(open(EXPO_APP_JSON_PATH, 'rb'))

    return app_json['expo']['version']


def ios_pbxproj_value(name):
    matches = []

    with open(PROJECT_PBX_PATH, 'r') as file:
        for line in file:
            if re.search(name, line):
                matches += re.findall('.*=\s?(.*);', line)

    if len(matches) == 0:
        raise Exception('No pbxproj {} found'.format(name))

    build_number = matches[0]

    for match in matches[1:]:
        if match != build_number:
            raise Exception(
                'Inconsistent pbxproj values found for {}'.format(name))

    return build_number


def ios_get_expo_release_channel():
    expo_plist = plistlib.load(open(EXPO_PLIST_PATH, 'rb'))

    return expo_plist['EXUpdatesReleaseChannel']


def ios_get_bundle_short_version():
    info_plist = plistlib.load(open(INFO_PLIST_PATH, 'rb'))

    # Usually the info plist will pull the value from the pbxproj marketing version
    if info_plist['CFBundleShortVersionString'] == '$(MARKETING_VERSION)':
        return ios_pbxproj_value('MARKETING_VERSION')

    return info_plist['CFBundleShortVersionString']


def gradle_value(name):
    matches = []

    with open(GRADLE_BUILD, 'r') as file:
        for line in file:
            # grade values are always just `{name} {value}`
            # but the search term might appear elsewhere
            parts = line.strip().split(' ')
            parts = list(filter(len, parts))

            if len(parts) != 2:
                continue

            if parts[0] == name:
                matches.append(parts[1].replace('"', ''))

    if len(matches) == 0:
        raise Exception('No gradle value for "{}" found'.format(name))

    value = matches[0]

    for match in matches[1:]:
        if match != value:
            raise Exception(
                'Inconsistent gradle values found for {}'.format(name))

    return value


def android_get_expo_release_channel():
    manifest = parse(ANDROID_MANIFEST)

    nodes = manifest.getElementsByTagName('meta-data')

    for node in nodes:
        if node.getAttribute('android:name') == 'expo.modules.updates.EXPO_RELEASE_CHANNEL':
            return node.getAttribute('android:value')

    raise Exception('Expo release channel not found in Android Manifest')


def validate_version():
    app_json_version = get_expo_app_json_version()

    ios_expo_release_channel = ios_get_expo_release_channel()
    ios_bundle_short_version = ios_get_bundle_short_version()
    ios_build_number = ios_pbxproj_value('CURRENT_PROJECT_VERSION')

    android_expo_release_channel = android_get_expo_release_channel()
    android_version_name = gradle_value('versionName')
    android_version_code = gradle_value('versionCode')

    # First make sure the app_json_version matches the ios expo release channel
    if 'prod-v{}'.format(app_json_version) != ios_expo_release_channel:
        raise Exception("app.json <-> ios expo release channel mismatch. {} vs {}".format(
            app_json_version, ios_expo_release_channel))

    # Validate the ios bundle short version
    if '.'.join(app_json_version.split('.')[0:3]) != ios_bundle_short_version:
        raise Exception("app.json <-> ios bundle short version mismatch. {} vs {}".format(
            app_json_version, ios_bundle_short_version))

    # Validate ios build number
    if app_json_version.split('.')[3] != ios_build_number:
        raise Exception("app.json <-> ios bundle number mismatch. {} vs {}".format(
            app_json_version, ios_build_number))

    # Now we can just validate the android values against the known-consistent ios values
    if android_expo_release_channel != ios_expo_release_channel:
        raise Exception("android <-> ios expo release channel mismatch. {} vs {}".format(
            android_expo_release_channel, ios_expo_release_channel))

    if android_version_name != ios_bundle_short_version:
        raise Exception("android <-> ios version mismatch. {} vs {}".format(
            android_version_name, ios_bundle_short_version))

    if android_version_code != ios_build_number:
        raise Exception("android <-> ios build number mismatch. {} vs {}".format(
            android_version_code, ios_build_number))

    return app_json_version


#############
# CLI Methods
#############


def validate():
    version = validate_version()

    print("Version consistency check passed for: {} ".format(version))

    hash_map = load_hash_map()
    file_hash = hash_files()

    if version not in hash_map:
        raise Exception(
            "File hash for {} not found, cannot validate.".format(version))

    if hash_map[version] == file_hash:
        print("File hash consistency check successful.")
        print(file_hash)
    else:
        raise Exception("File hash check failed. Expecting {}. Found {}.".format(
            hash_map[version], file_hash))


def generate_hash():
    version = validate_version()

    print("Generating new hash for {}".format(version))

    hash_map = load_hash_map()
    file_hash = hash_files()

    hash_map[version] = file_hash

    save_hash_map(hash_map)

    print(file_hash)


def main():
    if len(sys.argv) <= 1:
        raise Exception("Please provide a command (validate, generate-hash)")

    command = sys.argv[1]

    if command == 'validate':
        return validate()

    elif command == 'generate-hash':
        return generate_hash()

    raise Exception("Unknown command {}".format(command))


# runit
main()
