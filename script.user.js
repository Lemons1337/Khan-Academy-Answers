// ==UserScript==
// @name         Khan Answers
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       Lemons
// @match        *://www.khanacademy.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

var text = Response.prototype.text;
Response.prototype.text = function() {
    var promise = text.apply(this, arguments);

    if (this.url.includes('/graphql/getAssessmentItem')) {
        promise.then(res => {
            res = JSON.parse(res);

            var json = JSON.parse(res.data.assessmentItem.item.itemData);
            var widgets = json.question.widgets;

            var answers = [];

            Object.keys(widgets).forEach(key => {
                var { options } = widgets[key];

                var answer;

                if (options.value) {
                    answer = options.value;
                }

                if (options.choices) {
                    answer = options.choices.find(c => c.correct).content;
                }

                if (options.answers) {
                    answer = 'options.answers.map(a => a.value).join(', ');
                }

                if (options.correct) {
                    answer = options.correct.coords;
                }

                if (options.answerForms) {
                    answer = options.answerForms.map(a => a.value).join(', ');
                }

                answers.push(answer);
            });

            console.log('ANSWER:', answers.join(', '));
        });
    }

    return promise;
}
