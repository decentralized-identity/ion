
const fs = require('fs-extra');
const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const mergeStreams = require('merge-stream');
const nunjucksRender = require('gulp-nunjucks-render');
const axios = require('axios');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt({ linkify: true });
const encoder = require('@root/encoding');

const root = 'ion/';
const compiledJS = root + 'js/compiled/';
const compiledCSS = root + 'css/compiled/';

var assets = {
  js: {
    'web-components': [
      'detail-box.js',
      'modal-overlay.js',
      'notice-bar.js',
      'slide-panels.js',
      'tab-panels.js'
    ].map(name => root + 'js/web-components/' + name),
    body: [
      root + 'js/particles.js',
      root + 'js/global.js'
    ],
    charts: [
      'node_modules/highcharts/highstock.js',
      'node_modules/highcharts/modules/data.js'
    ]
  },
  css: {
    'head': [
      root + 'css/custom-elements.css',
      root + 'css/global.css'
    ]
  }
};

var code;

const getRepoInfo = async () => {
  code = {
    repo: {},
    release: {},
    version: ''
  };
  try {
    await axios.all([
      axios.get('https://api.github.com/repos/decentralized-identity/ion'),
      axios.get('https://api.github.com/repos/decentralized-identity/ion/releases'),
      axios.get('https://api.github.com/repos/decentralized-identity/ion/contents/install-guide.md')
    ]).then(axios.spread(function (repo, releases, guide) {
      code.repo = repo.data;
      code.releases = releases.data;
      code.latest_version = releases.data[0].tag_name;
      code.guide = markdown.render(encoder.base64ToStr(guide.data.content));
    })).catch(function(e){
      console.log(e)
    })
    return code;
  } catch (error) {
    console.log(error);
    return code;
  }
};

const repoFetch = getRepoInfo();

async function compileJS(){
  return new Promise(async resolve => {
    await fs.ensureDir(compiledJS);
    mergeStreams(
      ...Object.keys(assets.js).map(file => {
        return gulp.src(assets.js[file])
                   .pipe(terser())
                   .pipe(concat(file + '.js'))
                   .pipe(gulp.dest(compiledJS))
      })
    ).on('finish', () => resolve())
  });
}

async function compileCSS(){
  return new Promise(async resolve => {
    await fs.ensureDir(compiledCSS);
    mergeStreams(
      ...Object.keys(assets.css).map(file => {
        return gulp.src(assets.css[file])
                   .pipe(cleanCSS())
                   .pipe(concat(file + '.css'))
                   .pipe(gulp.dest(compiledCSS))
      })
    ).on('finish', () => resolve())
  });
}

async function renderTemplates() {
  return gulp.src(root + 'templates/pages/**/*.html')
    .pipe(nunjucksRender({
      path: [root + 'templates', root + 'templates/partials', root + 'templates/pages'],
      data: {
        code: code || await getRepoInfo()
      }
    }))
    .pipe(gulp.dest('./ion'))
};

gulp.task('build', gulp.series(compileCSS, compileJS, renderTemplates));

gulp.task('watch', () => {
  gulp.watch([root + 'js/**/*', '!' + root + 'js/compiled/**/*'], compileJS);
  gulp.watch([root + 'css/**/*', '!' + root + 'css/compiled/**/*'], compileCSS);
  gulp.watch([root + 'templates/**/*'], gulp.parallel(renderTemplates));
});

repoFetch.then(r => gulp.parallel('build')());