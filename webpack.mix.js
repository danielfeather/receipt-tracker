// webpack.mix.js

let mix = require('laravel-mix');

mix
    .ts('resources/ts/app.ts', 'public', { configFile: 'resources/tsconfig.json' }).setPublicPath('public')
    .sass('resources/sass/app.scss', 'public/css')
    .sourceMaps()