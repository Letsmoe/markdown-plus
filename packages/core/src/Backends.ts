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

import { BackendFunction, Config } from "./config.type.js";
import { error } from "./console-dispatcher.js";

function loadBackend(config: Config): Promise<BackendFunction> {
	return new Promise<BackendFunction>((resolve, reject) => {
		let name: string, options: any = {};
		if (typeof config.backend == "string") {
			name = config.backend;
		} else {
			options = config.backend.options;
			name = config.backend.use;
		}

		import(name).then(module => {
			resolve(module.default(options));
		}).catch(err => {
			error("Error loading backend, '" + name + "' does not exist or it's exported member is not following the reference (https://continuum-ai.de/docs/markdownplus/backends).", true);
		});
	})
}


export { loadBackend }