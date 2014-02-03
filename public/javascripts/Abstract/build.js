var buildify = require('buildify');

buildify()
  .concat(['jquery.autosize.js','marked.js','StaticVariables.js','jquery.tagsinput.js', 'models.js','helpers.js','drafts.js','remarked.js','pluginConfiguration.js']).wrap('base.js').save('./index.js')
.uglify().save('./index.min.js');
  

