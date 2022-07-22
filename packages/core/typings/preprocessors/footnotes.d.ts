/**
 * Copyright (c) Continuum-AI Inc. and its affiliates.
 *
 * This source code is license under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Letsmoe
 * @email moritz.utcke@gmx.de
 * @desc A MarkdownPlus extension that implements the footnotes syntax into MarkdownPlus.
 * 	Based upon this Github gist: https://github.com/halbgut/showdown-footnotes/blob/master/src/index.js
 */
/**
 * An extension for MarkdownPlus that adds support for footnotes.
 * The basic syntax looks like this:
 * ```md
 * 	... we can see it clearly here[^1] ...
 *
 * 	[^1]: This is the first footnote.
 * 		That supports multiple lines by adding a tab in front of each following line.
 * ```
 * Once we hit the first footnote description, we insert a horizontal line (<hr>) right above it.
 *
 * @date 7/22/2022 - 9:29:30 PM
 *
 * @export
 * @param {*} options
 * @returns {(content: string) => string}
 */
export default function footnotes(options: any): (content: string) => string;
