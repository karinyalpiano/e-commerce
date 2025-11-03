import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('UI ErrorBoundary caught:', error, info)
    this.setState({ info })
  }
  render() {
    if (this.state.hasError) {
      return (
        <section className="page">
          <h2>Ops, algo deu errado</h2>
          <div className="empty">
            <p>Houve um erro na interface. Veja o console do navegador (F12 → Console) para detalhes.</p>
            <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error)}</pre>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}
