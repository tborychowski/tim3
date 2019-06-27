const { series, src, watch } = require('gulp');
const runElectron = require('gulp-run-electron');



function electron () {
	return src('./').pipe(runElectron());
}

function watchTask () {
	watch('page.css', runElectron.rerun);
	watch('page.js', runElectron.rerun);
	watch('index.js', runElectron.rerun);

}


exports.default = series(electron, watchTask);
