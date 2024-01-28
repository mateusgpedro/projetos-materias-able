import {
  Box,
  Button,
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

export default function SkuTable({ skus }) {
  return (
    <Sheet
      variant="outlined"
      sx={{
        display: "flex",
        width: "100%",
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
          <tr key="codigo">
            <th style={{ width: "10%", verticalAlign: "middle" }}>Código</th>
            <th style={{ width: "45%", verticalAlign: "middle" }}>Nome</th>
            <th style={{ width: "40%", verticalAlign: "middle" }}>
              Locais de enchimento
            </th>
            <th style={{ width: "5%", verticalAlign: "middle" }}></th>
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
              <td></td>
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
                      <MenuItem>
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
