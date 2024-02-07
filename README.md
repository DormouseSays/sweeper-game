# Minesweeper Clone in React with esbuild

This is a sample project to test esbuild and linting settings in react apps.

I wrote both a recursive and iterative algorithm to open squares around an empty square that's clicked, and the iterative option worked much better. Optimizing the recursize function is left as future work.

## React config

Apparently create-react-app no longer supports a plain React app, only frameworks. So this is a minimal configuration for a plain React app using esbuild.

## esbuild config

this will add hot reloading:
https://clevertech.biz/insights/how-to-setup-your-react-project-with-es-build-from-scratch

## Future Work

* add unit test coverage
* add SASS or SCSS
* use localStorage to track setting preferences and high scores
* add other media types (audio?) to test build process
* trap right click to use for flagging squares
* add currency to gamify repeated playing. Purchase some kind of powerups?