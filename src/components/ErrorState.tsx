import { Result, Button } from 'antd';
import styled from 'styled-components';

const ErrorContainer = styled.div``;

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  fullScreen?: boolean;
}

export default function ErrorState({
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  onRetry,
  showRetry = true,
  fullScreen = false,
}: ErrorStateProps) {
  return (
    <ErrorContainer className={fullScreen ? 'fixed inset-0 flex items-center justify-center bg-white' : 'py-12'}>
      <Result
        status="error"
        title={title}
        subTitle={message}
        extra={
          showRetry && onRetry ? (
            <Button type="primary" onClick={onRetry}>
              Try Again
            </Button>
          ) : null
        }
      />
    </ErrorContainer>
  );
}
