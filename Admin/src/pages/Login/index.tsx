import React from "react";
import brandImg2 from "../../assets/LogoCelo.png";
import { LoginForm } from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export const Login: React.FunctionComponent = () => {
  const [showHelperText, setShowHelperText] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [isValidUsername, setIsValidUsername] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const [isRememberMeChecked, setIsRememberMeChecked] = React.useState(false);

  const navigate = useNavigate();

  const handleUsernameChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setUsername(value);
  };

  const handlePasswordChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setPassword(value);
  };

  const onRememberMeClick = () => {
    setIsRememberMeChecked(!isRememberMeChecked);
  };

  const onLoginButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);
    setShowHelperText(!username || !password);
    const payload: { username: string; password: string } = {
      username: username,
      password: password,
    };
    axios
      .post(import.meta.env.VITE_API_ENDPOINT + "/auth/token", payload)
      .then((res) => {
        sessionStorage.setItem("token", res.data.access);
        navigate("/", { replace: true });
      })
      .catch(() =>
        toast.error(
          "Neispravna lozinka ili korisničko ime. Pokušajte ponovo!",
          { position: toast.POSITION.TOP_RIGHT }
        )
      );
  };

  const loginForm = (
    <LoginForm
      showHelperText={showHelperText}
      helperText="Invalid login credentials."
      helperTextIcon={<ExclamationCircleIcon />}
      usernameLabel="Korisničko ime"
      usernameValue={username}
      onChangeUsername={handleUsernameChange}
      isValidUsername={isValidUsername}
      passwordLabel="Lozinka"
      passwordValue={password}
      isShowPasswordEnabled
      onChangePassword={handlePasswordChange}
      isValidPassword={isValidPassword}
      isRememberMeChecked={isRememberMeChecked}
      onChangeRememberMe={onRememberMeClick}
      onLoginButtonClick={onLoginButtonClick}
      loginButtonLabel="Prijavi se"
    />
  );

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", backgroundColor:"#F5EBE0", height:"100vh"}}>
      
      <div style={{backgroundColor:"#ffffff", padding:"40px", borderRadius:"10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)"}}>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:"10px"}}>

        <h1 style={{fontWeight:600}}>Office</h1>
        <img src={brandImg2} alt="fitfiniti" style={{width:"130px", height:"50px"}}/>
        </div>
        {loginForm}
      </div>
      <ToastContainer />
    </div>
  );
};
