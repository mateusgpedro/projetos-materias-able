import { Box, FormControl } from "@mui/joy";

function Filters({ items, fetchSkus, searchName, searchLinha }) {
  const getSkus = async (event) => {
    console.log(searchLinha);
    event.preventDefault();
    await fetchSkus(searchName, searchLinha, 1, 16);
  };

  return (
    <Box
      sx={{
        py: 2,
      }}
    >
      <form
        onSubmit={getSkus}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          gap: 5,
          alignItems: "end",
        }}
      >
        {items}
      </form>
    </Box>
  );
}

export default Filters;
