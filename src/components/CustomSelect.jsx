import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * CustomSelect — replaces native <select> with a styled dropdown panel.
 *
 * Props:
 *   value       — current selected value
 *   onChange    — callback(newValue)
 *   options     — [{ value, label, dot?: string (CSS color), icon?: ReactNode }]
 *   placeholder — label shown when no option matches (optional)
 *   minWidth    — e.g. '140px'
 */
const CustomSelect = ({ value, onChange, options, placeholder = 'Select…', minWidth = '130px' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', minWidth, flexShrink: 0 }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          background: open ? 'var(--surface-hover)' : 'var(--surface-2)',
          border: `1px solid ${open ? 'var(--border-strong)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-full)',
          color: selected ? 'var(--text)' : 'var(--text-3)',
          fontWeight: 600,
          fontSize: '14px',
          fontFamily: 'inherit',
          cursor: 'pointer',
          transition: 'all 0.18s ease',
          whiteSpace: 'nowrap',
          textAlign: 'left',
        }}
      >
        {/* Dot if present */}
        {selected?.dot && (
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: selected.dot, flexShrink: 0 }} />
        )}
        {selected?.icon && selected.icon}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={15}
          style={{ flexShrink: 0, color: 'var(--text-3)', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            minWidth: '100%',
            background: 'var(--bg-2)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '6px',
            zIndex: 200,
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            maxHeight: '280px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  background: isSelected ? 'var(--yellow-subtle)' : 'transparent',
                  border: 'none',
                  borderRadius: 'calc(var(--radius-md) - 2px)',
                  color: isSelected ? 'var(--yellow)' : 'var(--text-2)',
                  fontSize: '14px',
                  fontWeight: isSelected ? 700 : 500,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.12s ease, color 0.12s ease',
                }}
                onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text)'; } }}
                onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; } }}
              >
                {opt.dot && (
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                )}
                {opt.icon && opt.icon}
                <span style={{ flex: 1 }}>{opt.label}</span>
                {isSelected && <Check size={13} style={{ flexShrink: 0, color: 'var(--yellow)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
