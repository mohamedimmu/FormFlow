import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 4.5
        A2.5 2.5 0 0 1 14.5 7
        A2.5 2.5 0 0 1 12 9.5
        A2.5 2.5 0 0 1 9.5 7
        A2.5 2.5 0 0 1 12 4.5 z" fill="currentColor" stroke="none"/>
      <path d="M8 12h8" />
      <path d="M8 16h8" />
    </svg>
  );
}
