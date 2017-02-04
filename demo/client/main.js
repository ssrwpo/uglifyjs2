import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

const App = () => (
  <main>
    <h1>Demo</h1>
    <p>Simple demo</p>
  </main>
)

Meteor.startup(() => {
  ReactDOM.render(<App />, document.getElementById('react-root'));
});
