/* ============================================================
   main.js — Tilt 效果 + 打字机 + 弹窗 + 侧边导航
   背景已改为 SVG 国风山水，纯 CSS 动画驱动
   ============================================================ */

// ─── 侧边圆点导航 ────────────────────────────────────────────────
function initSideNav() {
  const dots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('section[data-section]');

  if (!dots.length || !sections.length) return;

  // 点击圆点跳转
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 滚动时高亮
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        dots.forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`.nav-dot[data-section="${entry.target.dataset.section}"]`);
        if (dot) dot.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

// ─── Tilt 效果 ────────────────────────────────────────────────────
function initTilt() {
  const cards = document.querySelectorAll('.bento-card, .project-card, .timeline-item');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// ─── 打字机效果 ───────────────────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const texts = ['嵌入式工程师', '机器人爱好者', 'AI 探索者', '热爱造物者'];
  let ti = 0, ci = 0, deleting = false;
  function tick() {
    const cur = texts[ti];
    if (!deleting) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; setTimeout(tick, 400); return; }
    }
    setTimeout(tick, deleting ? 60 : 100);
  }
  tick();
}

// ─── 弹窗 ─────────────────────────────────────────────────────────
function initModal() {
  const projectData = {
    ros: {
      title: '智能机器人系统',
      desc: '基于华为昇腾 NPU + STM32 + ROS2 的全栈机器人项目，实现 SLAM 建图导航与视觉目标识别。',
      tags: ['ROS2', 'SLAM', 'STM32', '华为昇腾', 'Python'],
      detail: '搭建了完整的机器人软硬件栈：STM32 底盘控制 + 激光雷达 SLAM 建图 + 深度相机目标检测，通过昇腾 NPU 加速推理，整体延迟控制在 50ms 以内。'
    },
    sorting: {
      title: 'RT-Thread 视觉分拣系统',
      desc: '基于 RT-Thread RTOS 的嵌入式视觉分拣平台，集成颜色识别与机械臂控制。',
      tags: ['RT-Thread', 'OpenCV', 'RTOS', '机械臂'],
      detail: '在 Cortex-M 平台上运行 RT-Thread，实现多任务实时调度，OpenMV 完成颜色/形状识别，串口协议控制四自由度机械臂精准分拣。'
    },
    sensor: {
      title: '高精度传感器系统',
      desc: '多传感器融合采集系统，支持温湿度、气压、加速度等多路数据高精度同步采集。',
      tags: ['STM32', 'I2C', 'SPI', 'FreeRTOS'],
      detail: '设计了统一的传感器驱动抽象层，通过 FreeRTOS 任务调度实现多路传感器并行采集，数据通过 CAN 总线上传至上位机。'
    },
    mcu: {
      title: 'STM32 智能采集系统',
      desc: '基于 STM32 的低功耗智能数据采集终端，支持 LoRa 无线传输与本地存储。',
      tags: ['STM32', 'LoRa', '低功耗', 'SD卡'],
      detail: '针对野外部署场景优化功耗，睡眠电流 < 10μA，LoRa 传输距离 > 5km，SD 卡本地缓存保证断网时数据不丢失。'
    },
    rul: {
      title: '滚动轴承剩余寿命预测',
      desc: '基于深度学习的工业轴承 RUL 预测模型，融合 CNN + LSTM 提取时频特征。',
      tags: ['深度学习', 'CNN', 'LSTM', 'Python', 'PyTorch'],
      detail: '使用 CWRU 数据集训练，提出了"时域+频域"双通道特征融合网络，在测试集上 RMSE 比传统方法降低 23%，已集成到工厂预测性维护平台。'
    }
  };

  const modal = document.getElementById('project-modal');
  if (!modal) return;
  const overlay = modal.querySelector('.modal-overlay');
  const closeBtn = modal.querySelector('.modal-close');

  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.project;
      const data = projectData[key];
      if (!data) return;
      document.getElementById('modal-tag').textContent = data.tags[0];
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.desc;
      document.getElementById('modal-detail').textContent = data.detail;
      document.getElementById('modal-tags').innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
      modal.classList.add('active');
    });
  });

  const close = () => modal.classList.remove('active');
  closeBtn && closeBtn.addEventListener('click', close);
  overlay && overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => e.key === 'Escape' && close());
}

// ─── 初始化 ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSideNav();
  initTilt();
  initTypewriter();
  initModal();
});
