# Syntax
This document defines the exact syntax Markdown Plus (`mdp` for short) supports.
mdp is heavily inspired by the CommonMark standard for Markdown but adds extra flavor to the original design patterns.

## Code Execution
Since mdp is compiled and then transpiled to HTML or Markdown it can add some extra features that were not originally implemented in the Markdown syntax.
One of these features is the ability to run code right inside an mdp context meaning you can save time writing.

### Variable Definition
mdp follows a very simple design pattern inspired by HTML.
```
{#define VARIABLE_NAME VALUE}
```
There are only two types of how a code block can be inserted. Self closing tags (void tags) like in HTML are valid when there is no content in between the executed command and the end of mentioned command.
However, if you want to use markdown between any of these tags **they must not be self-closing**!
Take a look at our [[grammar]] to get a feel for how the original design came to be.

### Data types
Data types are an important part of any programming language and can therefore come in different varieties.
```
{#define SOME_ARRAY [1, 
					 2, 
					 "This array may contain any other datatype", 
					 ["Even nested Arrays"]]}
```

### Loops
The base part of every language are loops, mdp supports "normal" for loops as well as while loops allowing you to write a plethora of different things way simpler than any other way.
```
{#each item SOME_ARRAY}
	- This will log each {{item}} as part of a list.
{/each}
```
Basic forEach loop.
```
{#for i (< i 10)}
	## Written this heading {{i}} times.
{/for}
```
Basic for loop over 10 iterations. If you use this syntax while **i** is not currently defined in the context, it will automatically call `{#set i 0}` to simplify the code for you.
```
{#while i < 10}
	- This might seem complicated at first glance but will make more sense later on. Trust me!
	
	{#set i {#+ i 1}}
{/while}
```
> Why would we use such complicated syntax?

You might ask yourself this question while looking at the code above.
The answer is:
> It's not actually complicated, it actually is the most simple syntax especially to learn coding with.

The syntax is inspired by [lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) and while some might consider the family of lisp outdated, some might even say lisp stands for "Lots of irritating stupid parentheses", the syntax introduced is among the simplest imaginable since it follows a repeating pattern.

As you can see, each code block begins with `{#` and ends either with `{/COMMAND_NAME}` or `}` making it quite simple to understand, meaning the syntax simply can be seen as:

```
{#COMMAND_NAME ARG_1 ARG_2 ...}
	OPTIONAL_BODY
{/COMMAND_NAME}
```

### Imports and Exports
Imports and exports are a key part of what's missing from current Markdown and was only introduced with Markdown Preprocessors meaning their implementation is quite different among different libraries and utilities.
```
{#import "IMPORT_URL" *|"IMPORT_NAME" ... /}
```
Importing from a resource is straightforward, mostly you'd use a relative path from where you want the resource to be imported, the required module can either define an export or can simply be included into the current context.
```
{#export "EXPORT_NAME"}
```
EXPORT_NAME can stand for any defined variable or the name of a section in the current module context.

### Conditionals
```
{#if {
	{#is i}
	{}
}}
```