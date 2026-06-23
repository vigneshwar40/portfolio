import { Component, type ErrorInfo, type ReactNode } from "react";

interface SectionErrorBoundaryProps {
  name: string;
  children: ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

/**
 * Isolates a single page section so a render error inside it doesn't take
 * down the rest of the app (React unmounts the whole tree on an uncaught
 * render error unless something catches it).
 */
class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  state: SectionErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(`[${this.props.name}] section failed to render:`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section-inner py-16 text-center text-sm text-muted-foreground">
          Something went wrong loading this section.
        </div>
      );
    }
    return this.props.children;
  }
}

export default SectionErrorBoundary;
