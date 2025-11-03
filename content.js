// 密码强度检测函数
function checkPasswordStrength(password) {
  // 检查长度
  const hasMinLength = password.length > 8;
  
  // 检查是否包含小写字母
  const hasLowerCase = /[a-z]/.test(password);
  
  // 检查是否包含大写字母
  const hasUpperCase = /[A-Z]/.test(password);
  
  // 检查是否包含数字
  const hasNumbers = /\d/.test(password);
  
  // 检查是否包含特殊符号（更全面的特殊符号集合）
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>\-_+=\[\]{}|;:'"<>,./?`~!@#$%^&*()]/u.test(password);
  
  // 返回密码强度检测结果
  return {
    isValid: hasMinLength && hasLowerCase && hasUpperCase && hasNumbers && hasSpecialChars,
    hasMinLength,
    hasLowerCase,
    hasUpperCase,
    hasNumbers,
    hasSpecialChars
  };
}

// 创建密码强度提示元素
function createStrengthIndicator(inputElement) {
  // 检查是否已经存在提示元素
  let indicator = inputElement.nextElementSibling;
  if (indicator && indicator.classList.contains('password-strength-indicator')) {
    return indicator;
  }
  
  // 创建新的提示元素
  indicator = document.createElement('div');
  indicator.className = 'password-strength-indicator';
  // 添加CSS样式（确保只添加一次）
  if (!document.getElementById('password-strength-styles')) {
    const style = document.createElement('style');
    style.id = 'password-strength-styles';
    style.textContent = `
      .password-valid { border: 2px solid #2e7d32 !important; }
      .password-invalid { border: 2px solid #c62828 !important; }
      .password-strength-indicator {
        /* 强制换行显示的样式 */
        display: block !important;
        clear: both !important;
        float: none !important;
        position: static !important;
        width: auto !important;
        min-width: 200px;
        max-width: 100%;
        margin-top: 15px !important;
        margin-bottom: 10px !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        line-height: 1.4;
        color: #333;
        background-color: #f5f5f5;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        overflow: visible;
        z-index: 9999;
        word-break: break-word;
        white-space: normal;
      }
      
      /* 专门针对密码输入框后的提示元素，确保强制换行 */
      input[type="password"] + .password-strength-indicator {
        display: block !important;
        position: static !important;
        transform: none !important;
        left: auto !important;
        right: auto !important;
        top: auto !important;
        bottom: auto !important;
        float: none !important;
        white-space: normal;
        word-wrap: break-word;
      }
      
      /* 防止与父容器样式冲突 */
      .password-strength-indicator::before,
      .password-strength-indicator::after {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  indicator.style.cssText = `
    display: block;
    font-size: 12px;
    margin-top: 5px;
    padding: 5px;
    border-radius: 3px;
    background-color: #f5f5f5;
  `;
  
  // 插入到输入框后面
  inputElement.parentNode.insertBefore(indicator, inputElement.nextSibling);
  return indicator;
}

// 更新密码强度提示
function updateStrengthIndicator(inputElement, strength) {
  const indicator = createStrengthIndicator(inputElement);
  
  if (!strength.isValid) {
    let message = '密码不符合要求，请检查：';
    const issues = [];
    
    if (!strength.hasMinLength) issues.push('长度需大于8');
    if (!strength.hasLowerCase) issues.push('缺少小写字母');
    if (!strength.hasUpperCase) issues.push('缺少大写字母');
    if (!strength.hasNumbers) issues.push('缺少数字');
    if (!strength.hasSpecialChars) issues.push('缺少特殊符号');
    
    message += issues.join('，');
    indicator.textContent = message;
    indicator.style.backgroundColor = '#ffebee';
    indicator.style.color = '#c62828';
  } else {
    indicator.textContent = '密码强度符合要求';
    indicator.style.backgroundColor = '#e8f5e9';
    indicator.style.color = '#2e7d32';
  }
}

// 处理表单提交事件
function handleFormSubmit(event) {
  const form = event.target;
  const passwordInputs = form.querySelectorAll('input[type="password"]');
  
  let hasWeakPassword = false;
  
  passwordInputs.forEach(input => {
    const password = input.value;
    const strength = checkPasswordStrength(password);
    
    if (!strength.isValid) {
      hasWeakPassword = true;
      updateStrengthIndicator(input, strength);
      input.style.border = '2px solid #c62828';
    }
  });
  
  // 如果发现弱密码，可以选择阻止表单提交
  // 这里只做提示，不阻止提交
  if (hasWeakPassword) {
    // 可以在这里添加提示信息
    console.log('检测到不符合强度要求的密码');
  }
}

// 处理密码输入事件
function handlePasswordInput(event) {
  const input = event.target;
  const password = input.value;
  
  if (password.length > 0) {
    const strength = checkPasswordStrength(password);
    updateStrengthIndicator(input, strength);
    
    // 根据密码强度改变输入框边框颜色（添加类而不是直接修改样式，减少样式冲突）
    if (strength.isValid) {
      input.classList.add('password-valid');
      input.classList.remove('password-invalid');
    } else {
      input.classList.add('password-invalid');
      input.classList.remove('password-valid');
    }
  } else {
    // 清除提示
    const indicator = input.nextElementSibling;
    if (indicator && indicator.classList.contains('password-strength-indicator')) {
      indicator.remove();
    }
    input.classList.remove('password-valid', 'password-invalid');
  }
}

// 监听页面上的所有密码输入框
function observePasswordInputs() {
  // 获取当前页面的所有密码输入框
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  
  passwordInputs.forEach(input => {
    // 确保只添加一次监听器
    if (!input.hasAttribute('data-password-checked')) {
      input.setAttribute('data-password-checked', 'true');
      // 添加输入事件监听
      input.addEventListener('input', handlePasswordInput);
      
      // 获取父表单并添加提交事件监听
      const form = input.closest('form');
      if (form && !form.hasAttribute('data-password-form-checked')) {
        form.setAttribute('data-password-form-checked', 'true');
        form.addEventListener('submit', handleFormSubmit);
      }
    }
  });
}

// 使用MutationObserver监听页面变化，处理动态加载的密码输入框
function setupMutationObserver() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      // 检查是否有新的节点被添加
      if (mutation.addedNodes.length > 0) {
        // 对于每个添加的节点，检查是否包含密码输入框
        mutation.addedNodes.forEach(node => {
          // 确保节点是元素节点
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查该节点是否是密码输入框
            if (node.tagName === 'INPUT' && node.type === 'password' && !node.hasAttribute('data-password-checked')) {
              node.setAttribute('data-password-checked', 'true');
              node.addEventListener('input', handlePasswordInput);
              
              const form = node.closest('form');
              if (form && !form.hasAttribute('data-password-form-checked')) {
                form.setAttribute('data-password-form-checked', 'true');
                form.addEventListener('submit', handleFormSubmit);
              }
            } else {
              // 检查该节点的子元素中是否有密码输入框
              const passwordInputs = node.querySelectorAll('input[type="password"]');
              passwordInputs.forEach(input => {
                if (!input.hasAttribute('data-password-checked')) {
                  input.setAttribute('data-password-checked', 'true');
                  input.addEventListener('input', handlePasswordInput);
                  
                  const form = input.closest('form');
                  if (form && !form.hasAttribute('data-password-form-checked')) {
                    form.setAttribute('data-password-form-checked', 'true');
                    form.addEventListener('submit', handleFormSubmit);
                  }
                }
              });
            }
          }
        });
      }
    });
  });
  
  // 开始观察整个文档
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 添加清理函数，避免内存泄漏
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });
}

// 初始化插件
function init() {
  observePasswordInputs();
  setupMutationObserver();
}

// 当页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}