import { Spin } from 'antd';
import styled from 'styled-components';

const SpinnerContainer = styled.div<{ fullScreen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message = 'Loading...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <SpinnerContainer fullScreen={fullScreen} className={fullScreen ? 'fixed inset-0 bg-white' : 'py-12'}>
      <Spin size="large" tip={message} />
    </SpinnerContainer>
  );
}
