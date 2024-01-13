import { Button, Input, Tooltip } from "antd";
import { FormEvent, Fragment } from "react";
import {
  MailOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import classes from "./AuthForm.module.scss";
import { Link } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { emailValidator, passwordValidator } from "../../helpers/validators";

interface IAuthFormProps {
  isSignUp: boolean;
  onAuthFormSubmit: (userCredentials: {
    email: string;
    password: string;
  }) => void;
}

const AuthForm: React.FC<IAuthFormProps> = ({ isSignUp, onAuthFormSubmit }) => {
  const email = useInput(emailValidator);
  const password = useInput(passwordValidator);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    onAuthFormSubmit({ email: email.value, password: password.value });
  };

  return (
    <Fragment>
      <form onSubmit={handleFormSubmit}>
        <Input
          placeholder="Email"
          prefix={<MailOutlined />}
          className="mb-medium"
          status={email.isValid === false ? "error" : undefined}
          onChange={email.updateInputValue}
          suffix={
            !email.isValid &&
            email.value.length && (
              <Tooltip title={email.errorMessage}>
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            )
          }
        />
        <Input
          placeholder="Password"
          prefix={<LockOutlined />}
          className="mb-medium"
          status={password.isValid === false ? "error" : undefined}
          onChange={password.updateInputValue}
          suffix={
            !password.isValid &&
            password.value.length && (
              <Tooltip title={password.errorMessage}>
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            )
          }
        />

        <div className={classes.actions}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!email.isValid || !password.isValid}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <Button type="link">
            {isSignUp && (
              <Link to="/auth/signin">Already have an account? Sign in</Link>
            )}
            {!isSignUp && (
              <Link to="/auth/signup">Don't have an account yet? Sign up</Link>
            )}
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default AuthForm;
