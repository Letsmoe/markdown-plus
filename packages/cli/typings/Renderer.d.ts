/**
 * Copyright (c) Continuum-AI Inc. and its affiliates.
 *
 * This source code is license under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Letsmoe
 * @email moritz.utcke@gmx.de
 * @desc The default loader for MarkdownPlus backends.
 */
import { Config } from "./types/config.type.js";
declare type RendererFunction = (content: string, metadata: {
    [key: string]: any;
}, config: Config) => string;
declare function loadRenderer(config: Config, out: string): Promise<RendererFunction>;
export { loadRenderer };
