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
class ASTWalker {
    constructor() {
        // The property to get children from a node.
        this.propertyChildren = "tokens";
        // The property to get a type from a node.
        this.propertyType = "type";
        this.callbacks = {};
    }
    on(type, callback) {
        this.callbacks[type] = callback;
    }
    visit(node) {
        let type = node[this.propertyType];
        let children = node[this.propertyChildren];
        // Run all children;
        let contents = [];
        if (children && children.length > 0) {
            for (const child of children) {
                contents.push(this.visit(child));
            }
        }
        if (this.callbacks[type]) {
            return this.callbacks[type](contents, node);
        }
    }
    traverse(ast) {
        return this.visit(ast);
    }
}
export { ASTWalker };
