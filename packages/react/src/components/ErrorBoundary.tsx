import { Component, ErrorInfo, ReactNode, ComponentType } from 'react';
import { getTransport } from '@tianniu-monitor/monitor-core';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** 发生错误时的降级 UI */
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  /** 错误回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** 自定义上报标签 */
  tags?: Record<string, string>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * React 错误边界组件
 * 用于捕获子组件树中的渲染错误
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 保存错误信息到 state
    this.setState({ errorInfo });

    // 获取传输实例
    const transport = getTransport();
    
    // 上报错误
    if (transport) {
      transport.send({
        event_type: 'error',
        type: 'react_error',
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        path: window.location.pathname,
        ...this.props.tags
      });
    }

    // 调用用户自定义回调
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (typeof fallback === 'function') {
        return fallback(this.state.error!, this.state.errorInfo!);
      }
      return fallback || null;
    }

    return this.props.children;
  }
}

/**
 * ErrorBoundary 高阶组件
 * @param WrappedComponent 需要包裹的组件
 * @param errorBoundaryProps ErrorBoundary 的 props
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithErrorBoundary.displayName = `WithErrorBoundary(${name})`;

  return ComponentWithErrorBoundary;
}
