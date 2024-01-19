import {
  Button,
  Input,
  InputNumber,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import classes from "./ProfileInformation.module.scss";
import { FormEvent, useState } from "react";
import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store/app-store";
import { setNotification } from "../../../store/reducers/notifications/notification-reducer";
import useInput from "../../../hooks/useInput";
import { nameValidator } from "../../../helpers/validators";
import { useSelector } from "react-redux";
import { updateUserInDb } from "../../../store/reducers/user/user-reducer";
import { IUser } from "../../../interfaces/user.interface";

const ProfileInformation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((store: RootState) => store.user);
  const firstName = useInput(nameValidator, user.firstName);
  const lastName = useInput(nameValidator, user.lastName);
  const [age, setAge] = useState<number>(Number(user.age));
  const [avatar, setAvatar] = useState<string>(user.avatar);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleAgeChange = (age: number | null) => {
    if (age) {
      setAge(age);
    }
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleFileUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      dispatch(
        setNotification({
          status: "error",
          message: "You can only upload JPG/PNG file!",
          title: "File upload failed",
        })
      );
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      dispatch(
        setNotification({
          status: "error",
          message: "Image must smaller than 10MB!",
          title: "File upload failed",
        })
      );
      return false;
    }

    getBase64(file).then((avatarAsBase64) => setAvatar(avatarAsBase64));

    return false;
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const userParams: IUser = {
      ...user,
      hasCompletedInitialSettings: true,
      firstName: firstName.value,
      lastName: lastName.value,
      age: String(age),
      avatar,
    };
    dispatch(updateUserInDb(userParams));
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.form}>
        <form onSubmit={handleFormSubmit}>
          <div className={classes.controls}>
            <Upload
              maxCount={1}
              listType="picture-circle"
              fileList={fileList}
              beforeUpload={handleFileUpload}
              onChange={handleChange}
              showUploadList={{ showPreviewIcon: false }}
            >
              {(!(fileList.length > 0) && !avatar.length) && (
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined style={{ color: "#fff" }} />
                  <div style={{ marginTop: 8 }} className={classes.upload}>
                    Upload
                  </div>
                </button>
              )}
              {avatar && <img className={classes.avatar} src={avatar} alt="User avatar"/>}
            </Upload>

            <div className={classes.control}>
              <label className={classes["control-title"]}>First name</label>
              <Input
                placeholder="First name"
                status={firstName.isValid === false ? "error" : undefined}
                onChange={firstName.updateInputValue}
                suffix={
                  !firstName.isValid && firstName.value.length ? (
                    <Tooltip title={firstName.errorMessage}>
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  ) : (
                    <span></span>
                  )
                }
                value={firstName.value}
              />
            </div>
            <div className={classes.control}>
              <label className={classes["control-title"]}>Last name</label>
              <Input
                placeholder="Last name"
                status={lastName.isValid === false ? "error" : undefined}
                onChange={lastName.updateInputValue}
                suffix={
                  !lastName.isValid && lastName.value.length ? (
                    <Tooltip title={lastName.errorMessage}>
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  ) : (
                    <span></span>
                  )
                }
                value={lastName.value}
              />
            </div>
            <div className={classes.control}>
              <label className={classes["control-title"]}>Age</label>
              <InputNumber
                min={18}
                defaultValue={age}
                value={age}
                onChange={handleAgeChange}
              />
            </div>
          </div>

          <Button
            block
            className={classes.btn}
            type="primary"
            htmlType="submit"
            disabled={!firstName.isValid || !lastName.isValid}
          >
            <span className={classes.submit}>Save</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileInformation;
