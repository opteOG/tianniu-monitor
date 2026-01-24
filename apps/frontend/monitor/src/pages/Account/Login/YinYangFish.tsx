/**
 * 阴阳鱼组件 - 用于登录页面装饰
 * 采用简约现代的设计风格，象征平衡与和谐
 */
export function YinYangFish() {
  return (
    <div className="relative opacity-30 hover:opacity-40 transition-opacity duration-500">
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
        <defs>
          <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* 背景光晕 */}
        <circle cx="100" cy="100" r="90" fill="url(#centerGlow)" opacity="0.3" />

        {/* 阴阳鱼主体 */}
        <g transform="translate(100, 100)">
          {/* 外圆 - 更明显的边框 */}
          <circle cx="0" cy="0" r="80" fill="none" stroke="url(#fishGradient)" strokeWidth="3" opacity="0.9" filter="url(#glow)" />

          {/* 阴鱼 - 更清晰的形状 */}
          <path
            d="M 0,-80 Q 40,-40 0,0 Q -40,40 0,80 Q 40,40 0,0 Q -40,-40 0,-80 Z"
            fill="#3b82f6"
            fillOpacity="0.5"
            stroke="#1e40af"
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* 阳鱼 - 更清晰的形状 */}
          <path
            d="M 0,-80 Q -40,-40 0,0 Q 40,40 0,80 Q -40,40 0,0 Q 40,-40 0,-80 Z"
            fill="#60a5fa"
            fillOpacity="0.4"
            stroke="#2563eb"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* 鱼眼 - 更明显 */}
          <circle cx="25" cy="-25" r="8" fill="#1e40af" opacity="1" filter="url(#glow)" />
          <circle cx="-25" cy="25" r="8" fill="#dbeafe" opacity="1" filter="url(#glow)" />
          <circle cx="25" cy="-25" r="3" fill="#ffffff" opacity="0.8" />
          <circle cx="-25" cy="25" r="3" fill="#1e40af" opacity="0.8" />

          {/* 装饰性波纹 - 更明显的层次 */}
          <circle cx="0" cy="0" r="50" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
          <circle cx="0" cy="0" r="65" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
          <circle cx="0" cy="0" r="75" fill="none" stroke="#93c5fd" strokeWidth="0.8" opacity="0.3" />
        </g>

        {/* 旋转装饰 */}
        <g transform="translate(100, 100)" className="animate-spin" style={{ animationDuration: '20s' }}>
          <circle cx="0" cy="-85" r="4" fill="#60a5fa" opacity="0.8" />
          <circle cx="0" cy="85" r="4" fill="#3b82f6" opacity="0.8" />
          <circle cx="-85" cy="0" r="4" fill="#93c5fd" opacity="0.6" />
          <circle cx="85" cy="0" r="4" fill="#1e40af" opacity="0.6" />
        </g>
      </svg>
    </div>
  )
}
