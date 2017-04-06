import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const DEBOUNCE_MS = 1000;
const GITHUB_TOKEN = "fbd98cf9087bdeed96a190b227347046a17d3a9c";

export default Ember.Controller.extend({

  loadRepo: task(function * (repo) {
    yield timeout(DEBOUNCE_MS);

    let url = `https://api.github.com/repos/${repo}/languages?access_token=${GITHUB_TOKEN}`;
    let json = yield this.get('getJSON').perform(url);

    return {"repo": repo, "languages": json};
  }).restartable(),

  getJSON: task(function * (url) {
    let xhr;
    try {
      xhr = Ember.$.getJSON(url);
      return yield xhr;

    } finally {
      xhr.abort();
    }
  }),
});
