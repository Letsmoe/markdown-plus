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
declare class ASTWalker {
    propertyChildren: string;
    propertyType: string;
    private callbacks;
    constructor();
    on(type: string, callback: (content: string[], node: any) => string): void;
    visit(node: ASTNode): any;
    traverse(ast: any): any;
}
export { ASTWalker };
