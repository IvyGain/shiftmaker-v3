// API endpoint configuration
export const API_CONFIG = {
  // モックAPIかリアルAPIかを環境変数で切り替え
  USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || 
                process.env.LARK_APP_ID === 'cli_a1b2c3d4e5f6g7h8', // 仮のIDの場合はモック使用

  // API endpoints
  endpoints: {
    auth: {
      login: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ? '/api/auth/login-mock' : '/api/auth/login'
    },
    admin: {
      slots: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ? '/api/admin/slots-mock' : '/api/admin/slots',
      wishes: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ? '/api/admin/wishes-mock' : '/api/admin/wishes',
      finalize: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ? '/api/admin/finalize-mock' : '/api/admin/finalize'
    },
    employee: {
      wishes: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ? '/api/wishes-mock' : '/api/wishes',
      calendar: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ? '/api/calendar/view-mock' : '/api/calendar/view'
    }
  }
};

// クライアントサイドでのAPI endpoint取得
export const getApiEndpoint = (category: keyof typeof API_CONFIG.endpoints, action: string) => {
  const useMock = localStorage?.getItem('use_mock_api') === 'true' || 
                  !localStorage?.getItem('use_mock_api'); // デフォルトはモック使用
  
  if (useMock) {
    switch (category) {
      case 'auth':
        return action === 'login' ? '/api/auth/login-mock' : `/api/auth/${action}`;
      case 'admin':
        if (action === 'slots') return '/api/admin/slots-mock';
        if (action === 'wishes') return '/api/admin/wishes-mock';
        if (action === 'finalize') return '/api/admin/finalize-mock';
        return `/api/admin/${action}`;
      case 'employee':
        if (action === 'wishes') return '/api/wishes-mock';
        if (action === 'calendar') return '/api/calendar/view-mock';
        return `/api/${action}`;
      default:
        return `/api/${action}`;
    }
  } else {
    // Real API endpoints
    switch (category) {
      case 'auth':
        return `/api/auth/${action}`;
      case 'admin':
        return `/api/admin/${action}`;
      case 'employee':
        if (action === 'wishes') return '/api/wishes';
        if (action === 'calendar') return '/api/calendar/view';
        return `/api/${action}`;
      default:
        return `/api/${action}`;
    }
  }
};