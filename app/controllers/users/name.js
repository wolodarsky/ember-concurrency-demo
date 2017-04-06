import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const DEBOUNCE_MS = 2000;
const GITHUB_TOKEN = "<PUT A VALID GITHUB TOKEN HERE>";

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

  actions: {
    cancel() {
      this.get("loadRepo").cancelAll();
    }
  }
});
