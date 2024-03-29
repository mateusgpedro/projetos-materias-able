import {
  Box,
  Button,
  Chip,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

export default function SkuTable({ skus }) {
  const navigate = useNavigate();
  const handleViewRecipe = async (skuCode) => {
    navigate(`/skus/recipe?c=${skuCode}`);
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        display: { xs: "none", sm: "initial" },
        width: 1,
        borderRadius: "sm",
        overflow: "auto",
      }}
    >
      <Table
        size="sm"
        stickyHeader
        sx={{
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
          "--TableCell-paddingY": "4px",
          "--TableCell-paddingX": "8px",
        }}
      >
        <thead>
          <tr key="header">
            <th style={{ width: "15%", verticalAlign: "middle" }}>Código</th>
            <th style={{ width: "35%", verticalAlign: "middle" }}>Nome</th>
            <th style={{ width: "43%", verticalAlign: "middle" }}>
              Locais de enchimento
            </th>
            <th style={{ width: "7%", verticalAlign: "middle" }}></th>
          </tr>
        </thead>
        <tbody>
          {skus.map((sku) => (
            <tr key={sku.code}>
              <td>
                <Typography fontSize="0.725rem">{sku.code}</Typography>
              </td>
              <td>
                <Typography fontSize="0.725rem">{sku.name}</Typography>
              </td>
              <td>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                  {sku.linhasNome?.map((linha, index) => (
                    <Chip key={index} variant="soft" size="sm" color="primary">
                      {linha}
                    </Chip>
                  ))}
                </Box>
              </td>
              <td style={{ textAlign: "center" }}>
                <Box>
                  <Dropdown>
                    <MenuButton
                      variant="plain"
                      size="sm"
                      sx={{
                        maxWidth: "30px",
                        maxHeight: "30px",
                        minWidth: "30px",
                        minHeight: "30px",
                      }}
                    >
                      <MoreVertIcon />
                    </MenuButton>
                    <Menu
                      sx={{
                        minWidth: "120px",
                        minHeight: "40px",
                      }}
                      size="sm"
                    >
                      <MenuItem onMouseDown={() => handleViewRecipe(sku.code)}>
                        <Typography fontSize="0.8rem">Ver Receita</Typography>
                      </MenuItem>
                    </Menu>
                  </Dropdown>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
