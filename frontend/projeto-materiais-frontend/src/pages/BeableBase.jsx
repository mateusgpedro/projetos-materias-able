import Sidebar from "../components/Sidebar";
import {Box, CssBaseline, CssVarsProvider, Sheet} from "@mui/joy";

export default function BeableBase({children, indexSelected, setIsLoggedIn}) {
    return (
        <Sheet style={{ display: "flex", height: "100vh" }}>
            <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={indexSelected}/>
            <CssVarsProvider>
                <CssBaseline>
                    <Box
                        sx={{
                            ml: "var(--Sidebar-width)",

                            display: "flex",
                            flexGrow: 1,
                            flexDirection: "column",
                            px: 5,
                            py: 3.5,
                        }}
                    >
                        {children}
                    </Box>
                </CssBaseline>
            </CssVarsProvider>
        </Sheet>
    );
}