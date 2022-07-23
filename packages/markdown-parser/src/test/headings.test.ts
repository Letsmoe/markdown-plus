import { compile } from "../index.js";
import { assert } from "flake-javascript";

assert(compile("**Nice**") == "<strong>Nice</strong>")
assert(compile("*Bowman*") == "<em>Bowman</em>")
assert(compile("`code`") == "<code>code</code>")
assert(compile("==Very Important==") == "<mark>Very Important</mark>")
assert(compile("~~This is Strikethrough~~") == "<s>This is Strikethrough</s>")
assert(compile("![Some *Alt* Text](https://example.png)") == "<img src=\"https://example.png\" alt=\"Some <em>Alt</em> Text\" />")
assert(compile("[Some *Alt* Text](https://example.png)") == "<a href=\"https://example.png\">Some <em>Alt</em> Text</a>")

assert(compile("H~2~O") == "H<sub>2</sub>O")
assert(compile("X^2^") == "X<sup>2</sup>")

assert(compile("# Heading 1") == "<h1>Heading 1</h1>")
assert(compile("## Heading 2") == "<h2>Heading 2</h2>")
assert(compile("### Heading 3") == "<h3>Heading 3</h3>")
assert(compile("#### Heading 4") == "<h4>Heading 4</h4>")
assert(compile("##### Heading 5") == "<h5>Heading 5</h5>")
assert(compile("###### Heading 6") == "<h6>Heading 6</h6>")
assert(compile("---") == "<hr>")
