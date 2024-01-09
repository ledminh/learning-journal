interface ArrowTipProps {
  disabled?: boolean;
}

export const LeftArrowTip = ({ disabled }: ArrowTipProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6${disabled ? " text-gray-400" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={disabled ? 1 : 2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
};

export const RightArrowTip = ({ disabled }: ArrowTipProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6${disabled ? " text-gray-400" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        d="M9 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={disabled ? 1 : 2}
      />
    </svg>
  );
};
