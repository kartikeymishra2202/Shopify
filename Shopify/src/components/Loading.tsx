export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      
      <div className="relative flex items-center justify-center rounded-xl bg-white/80 p-4 shadow-lg">
        <svg
          className="h-8 w-8"
          fill="hsl(228, 97%, 42%)"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <circle cx="12" cy="3" r="1">
              <animate
                id="spinner_7Z73"
                begin="0;spinner_tKsu.end-0.5s"
                attributeName="r"
                calcMode="spline"
                dur="0.6s"
                values="1;2;1"
                keySplines=".27,.42,.37,.99;.53,0,.61,.73"
              />
            </circle>
            <circle cx="16.5" cy="4.21" r="1">
              <animate
                begin="spinner_7Z73.begin+0.1s"
                attributeName="r"
                dur="0.6s"
                values="1;2;1"
              />
            </circle>
            <circle cx="7.5" cy="4.21" r="1">
              <animate
                begin="spinner_9Qlc.begin+0.1s"
                attributeName="r"
                dur="0.6s"
                values="1;2;1"
              />
            </circle>
            <animateTransform
              attributeName="transform"
              type="rotate"
              dur="6s"
              values="360 12 12;0 12 12"
              repeatCount="indefinite"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
