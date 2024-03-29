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
function loadRenderer(config, out) {
    return new Promise((resolve, reject) => {
        let name, options = {};
        if (typeof config.renderer == "string") {
            name = config.renderer;
        }
        else {
            options = config.renderer.options;
            name = config.renderer.use;
        }
        import(name)
            .then((module) => {
            resolve(module.default(options, out));
        })
            .catch((err) => {
            console.error("Error loading renderer, '" +
                name +
                "' does not exist or it's exported member is not following the reference (https://continuum-ai.de/docs/markdownplus/renderers)." + err.message);
            process.exit(1);
        });
    });
}
export { loadRenderer };
