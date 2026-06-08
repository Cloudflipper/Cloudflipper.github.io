// 自定义TOC配置，忽略details标签内的标题
(function() {
  // 等待tocbot初始化后执行
  if (typeof tocbot !== 'undefined') {
    // 重新初始化tocbot，添加ignoreSelector
    const originalInit = tocbot.init;
    tocbot.init = function(options) {
      options = options || {};
      // 忽略details标签内的所有标题
      options.ignoreSelector = options.ignoreSelector
        ? options.ignoreSelector + ', details *'
        : 'details *';
      return originalInit.call(this, options);
    };
  }
})();
