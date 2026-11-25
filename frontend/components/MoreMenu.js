"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The less-used pages. Closes itself after you pick a link.
export default function MoreMenu({ label, links }) {
  const ref = useRef(null);
  const path = usePathname();
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [path]);
  return (
    <details ref={ref} className="more">
      <summary>{label}</summary>
      <div className="more-menu">
        {links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
      </div>
    </details>
  );
}
