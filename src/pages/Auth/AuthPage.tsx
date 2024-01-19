import { Route, Routes, useMatch, useNavigate } from "react-router-dom";
import AuthForm from "../../components/Auth/AuthForm";
import classes from "./AuthPage.module.scss";
import { useDispatch } from "react-redux";
import { signIn, signUp } from "../../store/reducers/auth/auth-reducer";
import { IUser } from "../../interfaces/user.interface";

const AuthPage = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const matchesSignUp = useMatch("/auth/signup");

  const handleSignUp: (userCredentials: {
    email: string;
    password: string;
  }) => void = (userCredentials: { email: string; password: string }) => {
    dispatch(signUp(userCredentials)).then(
      (signUpResult: { payload: string | null }) => {
        if (signUpResult.payload) {
          navigate(`/profile/${signUpResult.payload}/information`);
        }
      }
    );
  };

  const handleSignIn: (userCredentials: {
    email: string;
    password: string;
  }) => void = (userCredentials: { email: string; password: string }) => {
    dispatch(signIn(userCredentials)).then(
      (signInResult: { payload: Partial<IUser> | null }) => {
        const currentUser = signInResult.payload;
        if (currentUser) {
          console.log(signInResult.payload);
          if (currentUser.hasCompletedInitialSettings) {
            navigate(`/`);
          } else {
            navigate(`/profile/${currentUser.id}/information`);
          }
        }
      }
    );
  };

  return (
    <div className={classes['auth-wrapper']}>
      <div className={classes.auth}>
        <div className={`${classes.title} mb-medium`}>
          {!!matchesSignUp ? "Sign Up" : "Sign In"}
        </div>
        <Routes>
          <Route
            path="/signin"
            element={
              <AuthForm
                isSignUp={!!matchesSignUp}
                onAuthFormSubmit={handleSignIn}
              />
            }
          ></Route>
          <Route
            path="/signup"
            element={
              <AuthForm
                isSignUp={!!matchesSignUp}
                onAuthFormSubmit={handleSignUp}
              />
            }
          ></Route>
        </Routes>
      </div>
    </div>
  );
};

export default AuthPage;
