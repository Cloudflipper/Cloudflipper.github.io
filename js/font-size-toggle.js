// 字体大小调节功能
(function() {
  // 初始化
  let currentSize = 'normal'; // 'normal', 'large', 'larger'
  const sizes = {
    normal: { scale: 1, label: 'A' },
    large: { scale: 1.15, label: 'A+' },
    larger: { scale: 1.3, label: 'A++' }
  };

  // 从 localStorage 读取保存的字体大小
  const savedSize = localStorage.getItem('fontSizeMode');
  if (savedSize && sizes[savedSize]) {
    currentSize = savedSize;
  }

  // 创建按钮
  function createButton() {
    const btn = document.createElement('div');
    btn.id = 'font-size-toggle';
    btn.innerHTML = sizes[currentSize].label;
    btn.title = '点击调整字体大小';
    document.body.appendChild(btn);

    // 点击事件
    btn.addEventListener('click', function() {
      // 切换大小
      if (currentSize === 'normal') {
        currentSize = 'large';
      } else if (currentSize === 'large') {
        currentSize = 'larger';
      } else {
        currentSize = 'normal';
      }

      // 更新显示
      applyFontSize();
      btn.innerHTML = sizes[currentSize].label;

      // 保存到 localStorage
      localStorage.setItem('fontSizeMode', currentSize);
    });
  }

  // 应用字体大小
  function applyFontSize() {
    const scale = sizes[currentSize].scale;
    document.documentElement.style.fontSize = (16 * scale) + 'px';
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      createButton();
      applyFontSize();
    });
  } else {
    createButton();
    applyFontSize();
  }
})();
