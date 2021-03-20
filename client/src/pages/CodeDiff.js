const Diff2html = require('diff2html');

const diff = `diff --git a/about.html b/about.html
index d09ab79..0c20c33 100644
--- a/about.html
+++ b/about.html
@@ -19,7 +19,7 @@
   </div>

   <div id="headerContainer">
-    <h1>About</h1>
+    <h1>About This Project</h1>
   </div>

   <div id="contentContainer">
diff --git a/imprint.html b/imprint.html
index 1932d95..d34d56a 100644
--- a/imprint.html
+++ b/imprint.html
@@ -19,7 +19,7 @@
   </div>

   <div id="headerContainer">
-    <h1>Imprint</h1>
+    <h1>Imprint / Disclaimer</h1>
   </div>

   <div id="contentContainer">`;

const diffJson = Diff2html.parse(diff);
const diffHtml = Diff2html.html(diffJson, { drawFileList: true });
document.getElementById('destination-elem-id').innerHTML = diffHtml;
