import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

const App = ({ msg }) => (
  <main>
    <h1>{msg}</h1>
    <p>{msg}</p>
  </main>
);
App.propTypes = {
  msg: PropTypes.string.isRequired,
};

Meteor.startup(() => {
  ReactDOM.render(
    <App msg="Simple demo"/>,
    document.getElementById('react-root'),
  );
});
