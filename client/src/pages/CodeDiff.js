import React, { Component } from 'react';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import fetch from 'unfetch';
import { TITLE, PAST, CURRENT } from './constants';
import 'react-gh-like-diff/dist/css/diff2html.min.css';

class App extends Component {
  state = {
    past: '',
    current: '',
    diffString: '',
  };

  componentDidMount() {
    fetch(PAST)
      .then((response) => response.text())
      .then((past) => this.setState({ past }));

    fetch(CURRENT)
      .then((response) => response.text())
      .then((current) => this.setState({ current }));

    // const diffString =
    //   '@@ -1,32 +1,3 @@\n import json\n \n import urllib.parse\n-from interface.gitlab_interface import GitLab\n-from interface.gitlab_project_interface import GitLabProject\n-\n-\n-from random import randint\n-from typing import Optional\n-from flask import Flask, request, jsonify\n-from flask_cors import CORS, cross_origin\n-import pymongofrom random import randint\n-from typing import Optional\n-from flask import Flask, request, jsonify\n-from flask_cors import CORS, cross_origin\n-import pymongofrom random import randint\n-from typing import Optional\n-from flask import Flask, request, jsonify\n-from flask_cors import CORS, cross_origin\n-import pymongofrom random import randint\n-from typing import Optional\n-from flask import Flask, request, jsonify\n-from flask_cors import CORS, cross_origin\n-import pymongofrom random import randint\n-from typing import Optional\n-from flask import Flask, request, jsonify\n-from flask_cors import CORS, cross_origin\n-import pymongofrom random import randint\n-from typing import Optional\n-from flask import Flask, request, jsonify\n-from flask_cors import CORS, cross_origin\n-import pymongo\n';
    // this.setState({ diffString });
  }

  render() {
    const diffString = `diff --git a/sample.js b/sample.js
    index 0000001..0ddf2ba
    --- a/sample.js
    +++ b/sample.js
    @@ -1 +1 @@
    -console.log("Hello World!")
    -console.log("Hello 1World!")
    -console.log("Hello 22World!")
    +console.log("Hello from Diff2Html!")`;
    return (
      <div>
        <ReactGhLikeDiff
          options={{
            originalFileName: TITLE,
            updatedFileName: TITLE,
            inputFormat: 'diff',
            outputFormat: 'line-by-line',
            showFiles: true,
            matching: 'none',
            matchWordsThreshold: 0.25,
            matchingMaxComparisons: 2500,
            maxLineSizeInBlockForComparison: 200,
            maxLineLengthHighlight: 10000,
            renderNothingWhenEmpty: false,
          }}
          past={this.state.past}
          current={this.state.current}
        />
        <ReactGhLikeDiff
          options={{
            originalFileName: TITLE,
            updatedFileName: TITLE,
            inputFormat: 'diff',
            outputFormat: 'line-by-line',
            showFiles: true,
            matching: 'none',
            matchWordsThreshold: 0.25,
            matchingMaxComparisons: 2500,
            maxLineSizeInBlockForComparison: 200,
            maxLineLengthHighlight: 10000,
            renderNothingWhenEmpty: false,
          }}
          diffString={diffString}
        />
      </div>
    );
  }
}

export default App;
