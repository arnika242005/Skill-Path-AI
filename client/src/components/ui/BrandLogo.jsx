const BrandLogo = ({ size = 26, iconOnly = false }) => {
  return (
    <span className="brand-logo-container" style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
      <span className="brand-logo-mark" aria-hidden="true" style={{ display: "inline-flex", lineHeight: 0, flexShrink: 0 }}>
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <rect width="32" height="32" rx="7.5" fill="#121316" />
          <rect
            x="0.75"
            y="0.75"
            width="30.5"
            height="30.5"
            rx="6.75"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />
          <path
            d="M21.5 10.5 C21.5 7.8 19 6.2 16 6.2 C12 6.2 9.5 8.5 9.5 11.8 C9.5 16.2 22.5 15.2 22.5 19.8 C22.5 23.2 20 25.8 16 25.8 C12 25.8 9.8 23.8 9.8 21.2"
            stroke="url(#brandLogoGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="brandLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      {!iconOnly && (
        <span className="logo-wordmark">
          SkillPath<span className="logo-ai-accent">AI</span>
        </span>
      )}
    </span>
  );
};

export default BrandLogo;

