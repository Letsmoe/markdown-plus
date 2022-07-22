/**
 * Copyright (c) Continuum-AI Inc. and its affiliates.
 *
 * This source code is license under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Letsmoe
 * @email moritz.utcke@gmx.de
 * @desc
 */

interface ASTNode {
	children: ASTNode[];
	type: string;
}


class ASTWalker {
	// The property to get children from a node.
	public propertyChildren: string = "tokens";
	// The property to get a type from a node.
	public propertyType: string = "type";
	private callbacks = {};
	constructor() {}

	public on(type: string, callback: (content: string[], node: any) => string) {
		this.callbacks[type] = callback;
	}

	public visit(node: ASTNode) {
		let type = node[this.propertyType];
		let children = node[this.propertyChildren];

		// Run all children;
		let contents = [];
		if (children && children.length > 0) {
			for (const child of children) {
				contents.push(this.visit(child))
			}
		}

		if (this.callbacks[type]) {
			return this.callbacks[type](contents, node);
		}
	}

	public traverse(ast: any) {
		return this.visit(ast);
	}
}

export { ASTWalker }