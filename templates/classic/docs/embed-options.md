# Embedding Options in Templates

Since Anki does not provide the ability to store data in templates, there are some issues with user preference settings in templates:

- Cannot sync across multiple devices
- Preferences may be lost when restarting Anki on some clients

To resolve these issues, you need to paste the formatted template settings below into the template code. This process involves two steps:

1. Open the card template settings in Anki. The method to access this varies by platform, so please refer to the official user documentation.
2. Find the "Front Template" of this template and paste the formatted template configuration you see on the settings page into the corresponding location. Below is an example image from the Mac version of Anki, other versions may display differently:

![embed-options](../assets/embed-options.png)

These modifications may be overwritten when upgrading the template, so please backup the formatted template settings before upgrading.
