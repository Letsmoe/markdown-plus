const s=`<h1 id="summary">Summary</h1>
<p><a href="/index.html">Introduction</a></p>
<h1 id="user-guide">User Guide</h1>
<ul>
<li><a href="/guide/installation.html">Installation</a></li>
</ul>
<h1 id="reference-guide">Reference Guide</h1>
<ul>
<li><a href="/cli/index.html">Command Line Tool</a><ul>
<li><a href="/cli/init.html">init</a></li></ul></li>
<li><a href="/format/README.html">Format</a><ul>
<li><a href="/format/summary.html">SUMMARY.mpp</a></li>
<li><a class="no-reference">Configuration</a><ul>
<li><a href="/format/configuration/general.html">General</a></li>
<li><a href="/format/configuration/preprocessors.html">Preprocessors</a></li>
<li><a href="/format/configuration/renderers.html">Renderers</a></li>
<li><a href="/format/configuration/environment-variables.html">Environment Variables</a></li></ul></li>
<li><a href="/format/theme/README.html">Theme</a><ul>
<li><a href="/format/theme/index-hbs.html">index.hbs</a></li>
<li><a href="/format/theme/syntax-highlighting.html">Syntax highlighting</a></li>
<li><a href="/format/theme/editor.html">Editor</a></li></ul></li>
<li><a href="/format/mathjax.html">MathJax Support</a></li>
<li><a href="/format/markdown.html">Markdown</a></li></ul></li>
<li><a href="/dev/index.html">For Developers</a><ul>
<li><a href="/dev/preprocessors.html">Preprocessors</a></li>
<li><a href="/dev/backends.html">Backends</a></li>
<li><a href="/dev/renderers.html">Renderers</a></li></ul></li>
</ul>
<hr />
<p><a href="/misc/contributors.html">Contributors</a></p>`; document.getElementById("sidebar").innerHTML = s;