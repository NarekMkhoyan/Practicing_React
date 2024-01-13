import { notification } from "antd";
import { INotification } from "../../interfaces/notification.inerface";
import { ArgsProps } from "antd/es/notification";
import { useSelector } from "react-redux";
import { Fragment, useCallback, useEffect } from "react";
import { RootState } from "../../store/app-store";

const Notification = () => {
  const notificationState = useSelector(
    (state: RootState) => state.notification
  );

  const [api, contextHolder] = notification.useNotification();

  const openNotification = useCallback(
    (notification: INotification) => {
      const showNotification = (notification: INotification) => {
        const notificationParams: ArgsProps = {
          message: notification.title,
          description: notification.message,
          placement: "bottomRight",
        };

        switch (notification.status) {
          case "info":
            api.info(notificationParams);
            break;
          case "success":
            api.success(notificationParams);
            break;
          case "error":
            api.error(notificationParams);
            break;
          case "warning":
            api.warning(notificationParams);
            break;
        }
      };

      showNotification(notification);
    },
    [api]
  );

  useEffect(() => {
    if (notificationState.notification) {
      openNotification(notificationState.notification);
    }
  }, [notificationState, openNotification]);

  return <Fragment>{contextHolder}</Fragment>;
};

export default Notification;
