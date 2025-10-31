/* ==== [BLOCK: ErrorBoundary] BEGIN ==== */
import React from "react"

type State = { hasError: boolean; message?: string }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(err: any) { return { hasError: true, message: String(err?.message ?? err) } }
  componentDidCatch(err: any, info: any) { /* no-op logging for now */ }

  render() {
    if (this.state.hasError) {
      return (
        <div className="panel p-4 text-sm">
          <div className="font-semibold mb-1">Noe gikk galt i visningen</div>
          <div className="text-slate-500">Feilmelding: {this.state.message ?? "Ukjent"}</div>
        </div>
      )
    }
    return this.props.children
  }
}
/* ==== [BLOCK: ErrorBoundary] END ==== */
