var through = require('through2');
var terser = require('terser');
var PluginError = require('plugin-error');

var PLUGIN_NAME = 'terser';

function gulpUglifyes(option){

  var stream = through.obj(function(file, enc, cb){
    if(file.isStream()){
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }
    if(file.isBuffer()){
      try{
        var str = file.contents.toString('utf8');
        var result = terser.minify({
          'script': str
        }, option);

        // display any terser errors and stop
        if (result.error) {
          this.emit('error', new PluginError(PLUGIN_NAME, result.error.message));
          return cb();
        }

        file.contents = new Buffer(result.code);
        return cb(null, file);
      }catch(err){
        this.emit('error', new PluginError(PLUGIN_NAME, err));
        return cb();
      }
    }
  });

  return stream;
}

module.exports = gulpUglifyes;