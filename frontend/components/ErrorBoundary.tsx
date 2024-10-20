import React, { Component, ErrorInfo, PropsWithChildren } from 'react';
import { View, Text, Button } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Something went wrong.</Text>
          <Button title="Retry" onPress={this.handleRetry} />
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;