'use client';

import React from 'react';

export default function BoldText({ children }) {
  const text = children == null ? '' : String(children);
  const parts = text.split(/(\*\*[\s\S]+?\*\*|##[\s\S]+?##)/g);

  return parts.map((part, index) => {
    if (/^\*\*[\s\S]+?\*\*$/.test(part) || /^##[\s\S]+?##$/.test(part)) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
