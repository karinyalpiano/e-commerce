import { createContext, useContext, useEffect, useState } from 'react'

const ToastCtx = createContext(null)

let idSeq = 1
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function toast(message, opts = {}) {
    const id = idSeq++
    setToasts(t => [...t, { id, message, type: opts.type || 'info', timeout: opts.timeout ?? 2500 }])
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id))
    }, opts.timeout ?? 2500)
  }

  useEffect(() => {
    function onCustom(e) {
      const { message, type, timeout } = e.detail || {}
      toast(message, { type, timeout })
    }
    window.addEventListener('app:toast', onCustom)
    return () => window.removeEventListener('app:toast', onCustom)
  }, [])

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="toasts">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
