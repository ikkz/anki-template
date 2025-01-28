# ikkz Templates

For the directly usable version, please download it from the [release](https://github.com/ikkz/anki-template/releases).

> [!TIP]
> Each template has multiple variants available for download, with the filename format being `{template}.{locale}.{field}.apkg`

```
template:
- mcq   : Multiple choice question (6 options)
- mcq_10: Multiple choice question (10 options)
- tf    : True or false
- basic : Basic Q&A
- match : Drag and drop interactive matching

locale:
- zh: 中文
- en: English
- ja: Japanese

field:
- native  : The native Anki field
- markdown: With markdown support, but larger size
```

For suggestions and feedback, please submit them [here](https://github.com/ikkz/anki-template/issues).

## Templates

All of the templates have the following common features:

- Markdown support: see [here](/docs/markdown.md) for details
- After selecting text, you can directly click to ask gpt, search or translate the corresponding text, and customization is also supported
- Support larger question text.
- Support dark mode and light mode.
- Countdown: Give you motivation to learn.

### Multiple Choice

- Support hiding options to avoid potential answer hints
- Support single choice and multiple choice.
- Scrambled question options are restored after showing the answer.
- Obvious answer markers.

#### Fields

Note: When all options are empty, the template will behave as a basic Q&A template

| Field name  | Description                                                                                                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| question    | This is the stem of the question. It supports various content formats in Anki, including bold, formulas, etc.                                                                                                                 |
| optionA...F | This is the content of the question options. Options that are not filled in will not be displayed, and various formats are also supported.                                                                                    |
| answer      | This is the answer to the question. For multiple-choice questions, please write the uppercase letter of the correct answer, for example, A. For multiple-choice questions, write all the correct answer letters, such as ABC. |
| note        | You can fill in detailed explanations, notes, etc., here.                                                                                                                                                                     |

### Match

Drag and drop interactive matching question template.

> [!TIP]
> It is best to disable all swipe gesture controls in Anki's review settings.

#### Fields

Notes for `items`

- Each line starts with a category, followed by two colons separating it from the items under that category
- Each item is separated by two commas

An example:

```
Mammals::Tiger,,Elephant
Birds::Penguin,,Parrot
Reptiles::Cobra,,Crocodile
```

| Field name | Description                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| question   | This is the stem of the question. It supports various content formats in Anki, including bold, formulas, etc. |
| items      | The category and items                                                                                        |
| note       | You can fill in detailed explanations, notes, etc., here.                                                     |

### True or False

#### Fields

Notes for `items`

- All sub-questions should meet the format constriant
- Each sub-question must begin with a line "T===" or "F===", indicating whether the sub-question is true or false
- Pay special attention to ensuring "T/F" is followed by three or more equal signs

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

<img width="609" alt="图片" src="https://github.com/user-attachments/assets/143df030-a8d7-4fdc-9566-927b70aa4921" />

<img width="552" alt="图片" src="https://github.com/user-attachments/assets/b70ee32f-6ad3-4374-9224-8b6d54d57f9a" />

<img width="552" alt="图片" src="https://github.com/user-attachments/assets/3bfadeee-1876-4e3c-90ee-1c6ad53d71d3" />
