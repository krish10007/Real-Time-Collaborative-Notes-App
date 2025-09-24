import React from "react";

type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  State
> {
  constructor(props: {}) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    // log to console as well
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24 }}>
          <h1 style={{ color: "#b91c1c" }}>Something went wrong</h1>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
            {String(this.state.error && this.state.error.stack)}
          </pre>
          <p style={{ marginTop: 12 }}>
            Copy the error above and paste it here so I can debug further.
          </p>
        </div>
      );
    }

    return this.props.children as React.ReactElement | null;
  }
}
