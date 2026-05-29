"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var vite_plugin_angular_1 = require("@analogjs/vite-plugin-angular");
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, vite_plugin_angular_1.default)()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        include: ['src/**/*.spec.ts'],
    },
});
