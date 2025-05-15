import { notification } from 'antd';

export type AppNotificationType = 'success' | 'info' | 'warning' | 'error';

function useAppNotification() {
   const [notificationApi, contextHolder] = notification.useNotification();

  return { notificationApi, contextHolder }
}

export default useAppNotification