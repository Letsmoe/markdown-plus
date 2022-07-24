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

import { BackendFunction } from "./types/backend.type.js";
import { Config } from "./types/config.type.js";

function loadBackend(config: Config, out: string): Promise<BackendFunction> {
	return new Promise<BackendFunction>((resolve, reject) => {
		let name: string,
			options: any = {};
		if (typeof config.backend == "string") {
			name = config.backend;
		} else {
			options = config.backend.options;
			name = config.backend.use;
		}

		import(name)
			.then((module) => {
				resolve(module.default(options, out));
			})
			.catch((err) => {
				console.error(
					"Error loading backend, '" +
						name +
						"' does not exist or it's exported member is not following the reference (https://continuum-ai.de/docs/markdownplus/backends)."
				);
				process.exit(1);
			});
	});
}

export { loadBackend };
