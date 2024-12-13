# Anki Templates

This repository contains all the Anki templates I made.

For the directly usable version, please download it from the [release](https://github.com/ikkz/anki-template/releases).

For suggestions and feedback, please submit them [here](https://github.com/ikkz/anki-template/issues).

## Templates

All of the templates have the following common features:

- Support larger question text.
- After selecting text, you can directly click to search or translate the corresponding text
- Support dark mode and light mode.
- Countdown: Give you motivation to learn.

### Multiple Choice

- Support single choice and multiple choice.
- Scrambled question options are restored after showing the answer.
- Obvious answer markers.

#### Fields

| Field name  | Description                                                                                                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| question    | This is the stem of the question. It supports various content formats in Anki, including bold, formulas, etc.                                                                                                                 |
| optionA...F | This is the content of the question options. Options that are not filled in will not be displayed, and various formats are also supported.                                                                                    |
| answer      | This is the answer to the question. For multiple-choice questions, please write the uppercase letter of the correct answer, for example, A. For multiple-choice questions, write all the correct answer letters, such as ABC. |
| note        | You can fill in detailed explanations, notes, etc., here.                                                                                                                                                                     |

### True or False

#### Fields

Notes for `items`

- All sub-questions should be in an unordered list format
- Each sub-question must begin with "T:" or "F:", indicating whether the sub-question is true or false
- Pay special attention to ensuring "T/F" is followed by an English half-width colon

| Field name | Description                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| question   | This is the stem of the question. It supports various content formats in Anki, including bold, formulas, etc. |
| items      | The sub-questions                                                                                             |
| note       | You can fill in detailed explanations, notes, etc., here.                                                     |

### Basic

A Simple Q&A Template

#### Fields

| Field name | Description                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| question   | This is the stem of the question. It supports various content formats in Anki, including bold, formulas, etc. |
| answer     | This is the answer to the question, and various formats are also supported                                    |
| note       | You can fill in detailed explanations, notes, etc., here.                                                     |

## Screenshots

<img width="632" alt="image" src="https://github.com/user-attachments/assets/edce65fd-2560-47db-a6e5-ffe7dcd00a02">

<img width="627" alt="image" src="https://github.com/user-attachments/assets/04147c87-ea2a-4d24-a7fe-566265533be9">
