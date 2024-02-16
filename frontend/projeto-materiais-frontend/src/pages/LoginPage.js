import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  CssVarsProvider,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState();
  const navigate = useNavigate();

  async function fetchLogin(email, password, remember) {
    try {
      const response = await axios.post(
        "https://localhost:7008/api/auth/login",
        {
          email: email,
          password: password,
          rememberMe: remember,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("jwt", response.data);

      setIsLoggedIn(true);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <CssVarsProvider>
        <CssBaseline>
          <Box
            backgroundColor="rgba(22 24 47 / 1)"
            width="100%"
            position="relative"
            sx={{
              px: 6,
              py: 3,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{}}>
              <Typography
                sx={{
                  color: "neutral.50",
                }}
                level="h1"
              >
                LOGO
              </Typography>
            </Box>
            <Box
              className="LoginForm"
              sx={{
                my: "auto",
                mx: "auto",
                py: 5,
                pb: 3,
                display: "flex",
                flexDirection: "column",
                gap: 5,
                width: 400,
                maxWidth: "100%",
                borderRadius: "sm",
                verticalAlign: "middle",
              }}
            >
              <Typography level="h3" sx={{ color: "neutral.50" }}>
                Sign In
              </Typography>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchLogin(email, password, rememberMe);
                }}
              >
                <Stack sx={{ gap: 5 }}>
                  <Stack sx={{ gap: 5 }}>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      startDecorator={<PersonIcon fontSize="small" />}
                      placeholder="E-mail"
                    />
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      startDecorator={<LockIcon fontSize="small" />}
                      placeholder="Password"
                    />
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      size="sm"
                      label="Remember me"
                      sx={{ color: "neutral.50", right: 0 }}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <Link level="title-sm" href="">
                      Forgot your password?
                    </Link>
                  </Box>
                  <Button type="submit" size="lg">
                    Login
                  </Button>
                </Stack>
              </form>
            </Box>
            <Box component="footer" sx={{ display: "flex", mt: "auto" }}></Box>
          </Box>
          <Box
            display="flex"
            width="100%"
            sx={{
              mx: "auto",
              px: 6,
              py: 3,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundImage:
                "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
            }}
          ></Box>
        </CssBaseline>
      </CssVarsProvider>
    </div>
  );
}

export default LoginPage;
