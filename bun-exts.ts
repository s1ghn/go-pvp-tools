import { plugin } from "bun";

plugin({
    name: "sveltekit-env",

    setup(build) {
        build.module("$app/environment", () => {
            return {
                exports: {
                    browser: false,
                    dev: false,
                },
                loader: "object",
            };
        });
    },
});