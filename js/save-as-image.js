// 页面保存为图片功能
(function() {
  // 创建按钮
  function createButton() {
    // 只在文章页面显示按钮
    const isPostPage = document.querySelector('.post-content') ||
                      document.querySelector('article.post-content') ||
                      document.querySelector('.markdown-body');

    if (!isPostPage) {
      return; // 不是文章页面，不创建按钮
    }

    const btn = document.createElement('div');
    btn.id = 'save-image-btn';
    btn.innerHTML = '📷';
    btn.title = '保存页面为图片';
    document.body.appendChild(btn);

    // 点击事件
    btn.addEventListener('click', function() {
      savePageAsImage();
    });
  }

  // 保存页面为图片
  async function savePageAsImage() {
    const btn = document.getElementById('save-image-btn');

    // 显示加载状态
    btn.innerHTML = '⏳';
    btn.classList.add('loading');

    // 在外部声明以便在catch块中也能访问
    const navbar = document.querySelector('nav.navbar') || document.querySelector('.navbar');
    let navbarOriginalStyle = null;

    try {
      // 动态加载 html2canvas
      if (typeof html2canvas === 'undefined') {
        await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      }

      // 隐藏不需要截图的元素
      const elementsToHide = [
        document.getElementById('save-image-btn'),
        document.getElementById('font-size-toggle'),
        document.querySelector('footer'),
        document.querySelector('.scroll-top-button'),
        document.getElementById('scroll-top-button')
      ].filter(Boolean);

      elementsToHide.forEach(el => {
        if (el) el.style.display = 'none';
      });

      // 确保导航栏在顶部
      if (navbar) {
        navbarOriginalStyle = {
          position: navbar.style.position,
          top: navbar.style.top,
          left: navbar.style.left,
          transform: navbar.style.transform
        };
        navbar.style.position = 'absolute';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.transform = 'none';
      }

      // 滚动到页面顶部
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 100));

      // 获取主内容区域的位置和宽度
      const mainContent = document.querySelector('.col-lg-8') ||
                         document.querySelector('#board') ||
                         document.querySelector('main');

      const mainRect = mainContent ? mainContent.getBoundingClientRect() : null;
      const mainLeft = mainRect ? mainRect.left : 0;
      const mainWidth = mainRect ? mainRect.width : document.body.offsetWidth;

      // 截取整个页面从header开始
      const fullCanvas = await html2canvas(document.body, {
        backgroundColor: window.getComputedStyle(document.body).backgroundColor || '#dce6f0',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      });

      // 恢复隐藏的元素
      elementsToHide.forEach(el => {
        if (el) el.style.display = '';
      });

      // 恢复导航栏样式
      if (navbar && navbarOriginalStyle) {
        navbar.style.position = navbarOriginalStyle.position;
        navbar.style.top = navbarOriginalStyle.top;
        navbar.style.left = navbarOriginalStyle.left;
        navbar.style.transform = navbarOriginalStyle.transform;
      }

      // 裁剪出与主内容区域等宽的部分
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scale = 2; // 与html2canvas的scale保持一致

      canvas.width = mainWidth * scale;
      canvas.height = fullCanvas.height;

      // 从完整canvas中裁剪出主内容区域
      ctx.drawImage(
        fullCanvas,
        mainLeft * scale, 0, // 源图的起始位置
        mainWidth * scale, fullCanvas.height, // 源图的宽高
        0, 0, // 目标位置
        canvas.width, canvas.height // 目标宽高
      );

      // 转换为图片并下载
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const title = document.title.replace(/[^\w\s-]/g, '').trim() || 'page';
        const timestamp = new Date().getTime();

        link.href = url;
        link.download = `${title}-${timestamp}.png`;
        link.click();

        URL.revokeObjectURL(url);

        // 恢复按钮
        btn.innerHTML = '📷';
        btn.classList.remove('loading');

        // 显示成功提示
        showMessage('图片已保存！');
      });

    } catch (error) {
      console.error('保存图片失败:', error);

      // 确保恢复所有隐藏的元素
      const elementsToRestore = [
        document.getElementById('save-image-btn'),
        document.getElementById('font-size-toggle'),
        document.querySelector('footer'),
        document.querySelector('.scroll-top-button'),
        document.getElementById('scroll-top-button')
      ].filter(Boolean);

      elementsToRestore.forEach(el => {
        if (el) el.style.display = '';
      });

      // 恢复导航栏样式
      if (navbar && navbarOriginalStyle) {
        navbar.style.position = navbarOriginalStyle.position;
        navbar.style.top = navbarOriginalStyle.top;
        navbar.style.left = navbarOriginalStyle.left;
        navbar.style.transform = navbarOriginalStyle.transform;
      }

      btn.innerHTML = '📷';
      btn.classList.remove('loading');
      showMessage('保存失败，请重试');
    }
  }

  // 加载外部脚本
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // 显示消息提示
  function showMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'save-image-message';
    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => {
      msg.classList.add('show');
    }, 10);

    setTimeout(() => {
      msg.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(msg);
      }, 300);
    }, 2000);
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }
})();
