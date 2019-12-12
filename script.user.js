// ==UserScript==
// @name         Khan Answers
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       Lemons
// @match        *://www.khanacademy.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

var _fetch = window.fetch;
window.fetch = function(data) {

    var response = _fetch.apply(this, arguments);

    if (data.url.includes('/api/internal/user/exercises')) {
        _fetch.apply(this, arguments).then(res => res.json()).then(data => {
            var json = JSON.parse(data.itemData);
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
                    answer = '[' + options.answers.map(a => a.value).join(', ') + ']';
                }

                if (options.correct) {
                    answer = options.correct.coords;
                }

                answers.push(answer);
            });

            console.log('ANSWER:', answers.join(', '));
        });
    }

    return response;
}
