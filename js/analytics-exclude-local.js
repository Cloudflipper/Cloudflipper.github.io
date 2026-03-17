// 访问统计 - 排除本机访问
(function() {
  'use strict';

  // 检测是否为本机
  function isLocalhost() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' ||
           hostname === '127.0.0.1' ||
           hostname === '[::1]' ||
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.') ||
           hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
  }

  // 检测是否为本机标记（用于部署后的本机访问）
  function isMarkedAsLocal() {
    return localStorage.getItem('exclude_analytics') === 'true';
  }

  // 如果是本机，阻止 busuanzi 脚本加载
  if (isLocalhost() || isMarkedAsLocal()) {
    console.log('本机访问，已排除统计');

    // 阻止 busuanzi 脚本加载
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.tagName === 'SCRIPT' &&
              node.src &&
              node.src.includes('busuanzi')) {
            node.remove();
            console.log('已阻止 busuanzi 统计脚本');
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // 提供手动标记/取消标记的功能
  window.excludeAnalytics = function() {
    localStorage.setItem('exclude_analytics', 'true');
    console.log('已标记为本机，刷新后生效');
  };

  window.includeAnalytics = function() {
    localStorage.removeItem('exclude_analytics');
    console.log('已取消本机标记，刷新后生效');
  };

  // 在控制台提示
  if (isLocalhost() || isMarkedAsLocal()) {
    console.log('%c提示：当前为本机访问，已排除统计', 'color: #1890ff; font-weight: bold;');
    console.log('如需恢复统计，请在控制台输入: includeAnalytics()');
  } else {
    console.log('%c提示：如需在部署后也排除本机访问统计', 'color: #52c41a; font-weight: bold;');
    console.log('请在控制台输入: excludeAnalytics()');
  }
})();
