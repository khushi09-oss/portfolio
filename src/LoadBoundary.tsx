import { Component, createRef, type ReactNode } from "react";

export class LoadBoundary extends Component<
  {
    children: ReactNode;
    panel?: boolean;
    onClose?: () => void;
  },
  { failed: boolean }
> {
  state = { failed: false };
  private heading = createRef<HTMLHeadingElement>();

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.heading.current?.focus();
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const Container = this.props.panel ? "aside" : "main";
    const Heading = this.props.panel ? "h2" : "h1";
    return (
      <Container
        id={this.props.panel ? undefined : "main"}
        className={this.props.panel ? "hand-panel" : "page-width missing-page"}
      >
        <p className="eyebrow">CONNECTION INTERRUPTED</p>
        <Heading ref={this.heading} tabIndex={-1}>
          {this.props.panel
            ? "Hand controls couldn't open."
            : "The lab couldn't open."}
        </Heading>
        <p>Reload to try again, or keep exploring the portfolio.</p>
        <button className="button primary" onClick={() => location.reload()}>
          Reload page
        </button>
        {this.props.panel ? (
          <button className="text-button" onClick={this.props.onClose}>
            Continue without gestures
          </button>
        ) : (
          <a className="inline-link" href="/work/recollia">
            Explore my work
          </a>
        )}
      </Container>
    );
  }
}
