// ==UserScript==
// @name         Khan Answers
// @namespace    http://tampermonkey.net/
// @version      0.1
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
                var options = widgets[key].options;

                var answer;

                if (options.choices) {
                    answer = options.choices.find(a => a.correct).content;
                } else if (options.answers) {
                    answer = JSON.stringify(options.answers.map(a => a.value));
                } else if (options.correct) {
                    answer = options.correct.coords;
                }

                answers.push(answer);
            });

            console.log('ANSWER:', answers.join(', '));
        });
    }

    return response;
}
