const path = require('path');
const resolve = require('resolve');
const pkgUp = require('pkg-up');

const _require = require('babel-plugin-variable-path-resolver'),
      resolvePath = _require.resolvePath;

const _require2 = require('babel-core'),
      OptionManager = _require2.OptionManager;

function getPlugins(file) {
  try {
    const manager = new OptionManager();
    const result = manager.init({
      babelrc: true,
      filename: file
    });

    return result.plugins.filter(plugin => {
      const plug = OptionManager.memoisedPlugins.find(item => item.plugin === plugin[0]);
      return plug && plug.plugin && plug.plugin.key === 'variable-path-resolver';
    });
  } catch (err) {
    console.error('[eslint-import-resolver-variable-path]', err);
    return [];
  }
}

function stripWebpack(src) {
  let source = src;

  // strip loaders
  const finalBang = source.lastIndexOf('!');
  if (finalBang >= 0) {
    source = source.slice(finalBang + 1);
  }

  // strip resource query
  const finalQuestionMark = source.lastIndexOf('?');
  if (finalQuestionMark >= 0) {
    source = source.slice(0, finalQuestionMark);
  }

  return source;
}

exports.interfaceVersion = 2;

/**
 * Find the full path to 'source', given 'file' as a full reference path.
 *
 * resolveImport('./foo', '/Users/ben/bar.js') => '/Users/ben/foo.js'
 * @param  {string} source - the module to resolve; i.e './some-module'
 * @param  {string} file - the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @param  {object} options - the resolver options
 * @return {object}
 */
exports.resolve = (source, file, opts) => {
  const options = opts || {};
  if (resolve.isCore(source)) return { found: true, path: null };

  const projectRootDir = path.dirname(pkgUp.sync(file));

  try {
    const instances = getPlugins(file);

    const pluginOpts = instances.reduce((config, plugin) => ({
      cwd: plugin[1] && plugin[1].cwd ? plugin[1].cwd : config.cwd,
      envName: plugin[1] && plugin[1].envName ? plugin[1].envName : config.envName,
      root: config.root.concat(plugin[1] && plugin[1].root ? plugin[1].root : []),
      alias: Object.assign(config.alias, plugin[1] ? plugin[1].alias : {}),
      vars: Object.assign(config.vars, plugin[1] ? plugin[1].vars : {}),
      extensions: plugin[1] && plugin[1].extensions ? plugin[1].extensions : config.extensions
    }), {
      cwd: options.cwd || projectRootDir,
      root: options.root || [],
      alias: options.alias || {},
      envName: options.envName || {},
      vars: options.vars || {},
      extensions: options.extensions || ['.js', '.jsx', '.es', '.es6', '.mjs']
    });

    const finalSource = stripWebpack(source);
    const src = resolvePath(finalSource, file, pluginOpts);

    const extensions = options.extensions || pluginOpts.extensions;

    return {
      found: true,
      path: resolve.sync(src || source, Object.assign({}, options, {
        extensions,
        basedir: path.dirname(file)
      }))
    };
  } catch (e) {
    return { found: false };
  }
};