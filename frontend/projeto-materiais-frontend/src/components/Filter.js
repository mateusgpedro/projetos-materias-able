import { Box, FormControl } from "@mui/joy";

function Filters({ items }) {
  return (
    <Box
      sx={{
        gap: 2,
        display: "flex",
        flexDirection: "row",
        py: 2,
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {items}
    </Box>
  );
}

export default Filters;
