import React, { useState, useEffect } from 'react';
import { parseDiff, Diff, Hunk, Decoration } from 'react-diff-view';
import axios from 'axios';
import 'react-diff-view/style/index.css';
import './styles.css';

const Appdiff = ({ diffText }) => {
  const files = parseDiff(diffText);

  const renderFile = ({
    oldPath,
    newPath,
    oldRevision,
    newRevision,
    type,
    hunks,
  }) => (
    <div key={oldRevision + '-' + newRevision} className="file-diff">
      <header className="diff-header">
        {oldPath === newPath ? oldPath : `${oldPath} -> ${newPath}`}
      </header>
      <Diff viewType="unified" diffType={type} hunks={hunks}>
        {(hunks) =>
          hunks.map((hunk) => [
            <Decoration key={'deco-' + hunk.content}>
              <div className="hunk-header">{hunk.content}</div>
            </Decoration>,
            <Hunk key={hunk.content} hunk={hunk} />,
          ])
        }
      </Diff>
    </div>
  );
  return <div className="ubuntu">{files.map(renderFile)}</div>;
};

const CodeDiff = () => {
  const [codeDiff, setCodeDiff] = useState('');
  useEffect(() => {
    const getData = async () => {
      const codeRes = await axios.get(
        'http://localhost:5678/projects/2/code_diff/0'
      );
      console.log('data', codeRes.data.code_diff_list[0]);
      setCodeDiff(codeRes.data.code_diff_list[0].diff);
    };
    getData();
  }, []);

  console.log(codeDiff);
  const data = String.raw`diff --git a/requirements.txt b/requirements.txt
index c3f75dc..2cda10e 100644
--- a/requirements.txt
+++ b/requirements.txt
@@ -5,5 +5,5 @@ m3u8
    hello
    def helloWorld
      not much
        byenow
 uvloop
 aiohttp
 cchardet
-aiodns
+aiodnstest
 graphitesender==0.11.1
diff --git a/run.sh b/run.sh
index afc32ae..9e430e1 100755
--- a/run.sh
+++ b/run.sh
@@ -1,6 +1,5 @@
 #!/usr/bin/env bash

-BASEDIR=$(dirname "$0")
 VENV=$BASEDIR/.venv

 test -d "$VENV" || virtualenv -q "$VENV"
`;

  const hey =
    'diff --git a/requirements.txt b/requirements.txt\nindex 100644\n';
  const data2 = hey + codeDiff;
  console.log('data2', data2);

  return (
    <div style={{ marginTop: '10px', fontFamily: 'Ubuntu Mono' }}>
      <Appdiff diffText={data2} />
    </div>
  );
};

export default CodeDiff;
