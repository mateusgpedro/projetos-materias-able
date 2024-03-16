import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Breadcrumbs, CssBaseline, CssVarsProvider } from "@mui/joy";

function Header({ linkItems }) {
  return (
    <Breadcrumbs size="xs" separator={<KeyboardArrowRight fontSize="small" />}>
      {linkItems}
    </Breadcrumbs>
  );
}

export default Header;
