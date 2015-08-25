# Speaker object

## Usage
### Define a new question

```js
speaker.addQuestionType('dipartimento').ask(function (telegramId, telegramBot, question) {
     var message = "Di quale dipartimento fai parte?";
     for (var i = 1; i < dipartimenti.length; i++) {
         message += '\n' + i + ') ' + dipartimenti[i].name;
     }
     telegramBot.sendMessage(telegramId, message);
}).response(function (msg, telegramBot, question) {
     question.resolve(parseInt(msg.text));
});
```

### Ask a question

```js
function getDipartimento() {
    return new Promise(function (resolve, reject) {
        speaker.ask('dipartimento', telegramId, telegramBot, resolve, reject);
    });
}
```
