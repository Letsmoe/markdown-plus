# Grammar
A grammar is what defines a programming language completely, this is what we came up with...

```
<letter> = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"

<nonzerodigit> = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<digit> = "0" | <nonzerodigit>
<number> = <nonzerodigit> | <digit>
<newline> = "\n"
<tab> = "\t"
<whitespace> = "\s"
<asterisk> = "*"
<backslash> = "\"
<backtick> = "`"
<other> = "@" | "$" | "%" | "^" | "&" | "?" | "'" | "," | ";" | ":"
<special> = "\" | "`" | "*" | "_" | "{" | "}" | "[" | "]" | "(" | ")" | "#" | "+" | "-" | "." | "!"

<alphanum> = <digit> | <letter>
<escaped> = <backslash> <special>
<unicode> = "&" alphanum alphanum alphanum alphanum ";"

<char> = unicode | alphanum | escaped | whitespace | tab | other
<string> = "<char>+ <newline>*"
```