import { Environment } from "@gyro-lang/core";
import { defaultConfig } from "./config.js";
import MarkdownPlusCompiler from "./index.js";
let compiler = new MarkdownPlusCompiler(defaultConfig);
compiler.ready = () => {
    const { markdown, html, metadata, deps } = compiler.compile(`
Syntax Cheatsheet
========================================

PHRASE EMPHASIS
---------------
*italic*   **bold**  
_italic_   __bold__

this_text_is_normal  
_this text_is italic_

LINKS
---------------
Inline:
An [example](http://url.com/ "Title")

Reference-style labels (titles are optional):
An [example][id] or [id]. Then, anywhere  
else in the doc, define the link:

  [id]: http://example.com/  "Title"

IMAGES
---------------
Inline (titles are optional):  
![alt text](/path/img.jpg "Title")

Reference-style:  
![alt text][imgid]

  [imgid]: /url/to/img.jpg "Title"

HEADERS
---------------
Setext-style:
Header 1
========

Header 2 {#headers-1-2}
--------

atx-style (closing #'s are optional):

# Header 1 #

## Header 2 ##  {#headers-2-2}

###### Header 6

LISTS
---------------
Ordered, without paragraphs:

1.  Foo
2.  Bar

Unordered, with paragraphs:

*   A list item.

    With multiple paragraphs.

*   Bar

You can nest them:

*   Abacus
    * ass
*   Bastard
    1.  bitch
    2.  bupkis
        * BELITTLER
    3. burper
*   Cunning

BLOCKQUOTES
---------------
> Email-style angle brackets
> are used for blockquotes.

> > And, they can be nested.

> #### Headers in blockquotes
> 
> * You can quote a list.
> * Etc.

CODE SPANS
---------------
\`&lt;code&gt;\` spans are delimited  
by backticks. \`A\` can be code.

You can include literal backticks
like \`\` \`this\` \`\`.

PREFORMATTED CODE BLOCKS
---------------
Indent every line of a code block by at least 4 spaces or 1 tab.

This is a normal paragraph.

    This is a preformatted
    code block.

Fenced code block enables writing code block without indent.

~~~~
This is also preformatted

   code block.
~~~~

HORIZONTAL RULES
---------------
Three or more dashes or asterisks:

---

* * *

- - - -

MANUAL LINE BREAKS
---------------
End a line with two or more spaces:

Roses are red,   
Violets are blue.

- - - - - - - - - - - - - - - - - - - -

Footnotes
---------------
This footnote will appear at the bottom of the document[^1].

The footnote doesn't have to be a number[^nonumber].

[^1]: Told you it'd be here at the bottom.
[^nonumber]: See, not a number.
             Though it does appear as a number in the html's ordered list.

Table
-----------------

|a |b |c
|--|--|--
|1 |2 |3

or

a |b |c
--|--|--
1 |2 |3

alignment

  rigt|left  | center
-----:|:-----|:------:
 0001 | 2    | 003
   4  | 0005 |  6

Definition list
-----------------

term
 : definithion

term
 : definithion
   is here

term
 : definithion

   can have multi paragraph

Auto link
-----------------

http://foo.com/
mailto:foo@bar.com

Encode
-----------------

&amp; &lt; "aaa" \`aaa\` \\

Inline HTML
-----------------

&lt;p>
HTML is represented as is.&lt;br>
&lt;del>The &lt;strong>quick brown fox&lt;/strong> jumps over the lazy dog.&lt;/del>
&lt;/p>

&lt;div>
Regularly Markdown syntax ignored in HTML.&lt;br/>
[Google](http://www.google.co.jp/)
&lt;/div>

&lt;div markdown="1">
Markdow enabled inside HTML when marked by markdown="1" attribute.  
[Google](http://www.google.co.jp/)
&lt;/div>

Auto Resolving
---------------

[[__default.js]]

`, "", new Environment());
    console.log(html);
};
