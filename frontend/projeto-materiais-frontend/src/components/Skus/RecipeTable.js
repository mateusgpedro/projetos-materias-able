import { Sheet, Table, Typography } from "@mui/joy";

export default function RecipeTable({ recipe }) {
  return (
    <Sheet
      variant="outlined"
      sx={{
        mt: 3,
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
          <tr>
            <th style={{ width: "20%", verticalAlign: "middle" }}>Código</th>
            <th style={{ width: "30%", verticalAlign: "middle" }}>
              Descrição Material
            </th>
            <th style={{ width: "20%", verticalAlign: "middle" }}>
              Quantidade
            </th>
            <th style={{ width: "15%", verticalAlign: "middle" }}>Quebra</th>
            <th style={{ width: "15%", verticalAlign: "middle" }}>Custo</th>
          </tr>
        </thead>
        <tbody>
          {recipe?.recipeMaterials.map((material) => (
            <tr key={material.materialId}>
              <td>
                <Typography fontSize="0.725rem">{material.code}</Typography>
              </td>
              <td>
                <Typography fontSize="0.725rem">{material.name}</Typography>
              </td>
              <td>
                <Typography fontSize="0.725rem">{material.amount}</Typography>
              </td>
              <td>
                <Typography fontSize="0.725rem">{}</Typography>
              </td>
              <td>
                <Typography fontSize="0.725rem">{}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
