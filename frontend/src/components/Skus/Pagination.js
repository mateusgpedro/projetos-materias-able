import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Typography } from "@mui/joy";
import { useEffect, useState } from "react";

function PaginationButton({
  value,
  isSelected,
  fetchData,
  setCurrentPage,
}) {
  const handleMouseDown = async () => {
    try {
      await fetchData(value, 16);
      setCurrentPage(value);
    } catch (error) {
      console.error("Error fetching skus:", error);
    }
  };

  return (
    <Button
      onMouseDown={handleMouseDown}
      color="neutral"
      size="sm"
      variant={isSelected ? "soft" : "outlined"}
    >
      {value}
    </Button>
  );
}

export default function ({
  totalPages,
  fetchData,
  currentPage,
  setCurrentPage,
}) {
  const [pages, setPages] = useState([]);
  const [prevDisabled, setPrevDisabled] = useState();
  const [nextDisabled, setNextDisabled] = useState();

  const handleMouseDownPrev = async () => {
    try {
      await fetchData(currentPage - 1, 16);
      setCurrentPage(currentPage - 1);
    } catch (error) {
      console.error("Error fetching skus:", error);
    }
  };

  const handleMouseDownNext = async () => {
    try {
      await fetchData(currentPage + 1, 16);
      setCurrentPage(currentPage + 1);
    } catch (error) {
      console.error("Error fetching skus:", error);
    }
  };

  useEffect(() => {
    if (currentPage == 1 && currentPage == totalPages) {
      setPrevDisabled(true);
      setNextDisabled(true);
    } else if (currentPage === 1) {
      setPrevDisabled(true);
      setNextDisabled(false);
    } else if (currentPage === totalPages) {
      setPrevDisabled(false);
      setNextDisabled(true);
    } else {
      setPrevDisabled(false);
      setNextDisabled(false);
    }

    let beforePages = currentPage - 1;
    let afterPages = currentPage + 1;

    const components = [];

    if (currentPage > 2) {
      components.push(
        <PaginationButton
          setCurrentPage={setCurrentPage}
          fetchData={fetchData}
          isSelected={1 === currentPage}
          key={1}
          value={1}
        />
      );
      if (currentPage > 4) {
        components.push(
          <Button key={"ellipsisStart"} variant="plain" disabled={true}>
            ...
          </Button>
        );
      } else if (currentPage > 3) {
        components.push(
          <PaginationButton
            setCurrentPage={setCurrentPage}
            fetchData={fetchData}
            isSelected={2 === currentPage}
            key={2}
            value={2}
          />
        );
      }
    }

    if (currentPage === totalPages) {
      beforePages = beforePages - 3;
    } else if (currentPage === totalPages - 1) {
      beforePages = beforePages - 2;
    } else if (currentPage === totalPages - 2) {
      beforePages = beforePages - 1;
    }

    if (currentPage === 1) {
      afterPages = afterPages + 3;
    } else if (currentPage === 2) {
      afterPages = afterPages + 2;
    } else if (currentPage === 3) {
      afterPages = afterPages + 1;
    }

    for (let index = beforePages; index <= afterPages; index++) {
      if (index > totalPages) {
        continue;
      }

      if (index <= 0) {
        continue;
      }

      components.push(
        <PaginationButton
          setCurrentPage={setCurrentPage}
          fetchData={fetchData}
          isSelected={index === currentPage}
          key={index}
          value={index}
        />
      );
    }

    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 3) {
        components.push(
          <Button key={"ellipsisEnd"} variant="plain" disabled={true}>
            ...
          </Button>
        );
      } else if (currentPage < totalPages - 2) {
        components.push(
          <PaginationButton
            setCurrentPage={setCurrentPage}
            fetchData={fetchData}
            isSelected={totalPages - 1 === currentPage}
            key={totalPages - 1}
            value={totalPages - 1}
          />
        );
      }
      components.push(
        <PaginationButton
          setCurrentPage={setCurrentPage}
          fetchData={fetchData}
          isSelected={totalPages === currentPage}
          key={totalPages}
          value={totalPages}
        />
      );
    }

    setPages(components);
  }, [currentPage, totalPages]);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        onMouseDown={handleMouseDownPrev}
        disabled={prevDisabled}
        color="neutral"
        variant="outlined"
        size="sm"
        startDecorator={<KeyboardArrowLeftIcon fontSize="lg" />}
      >
        <Typography fontSize="0.8rem">Anterior</Typography>
      </Button>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>{pages}</Box>
      <Button
        onMouseDown={handleMouseDownNext}
        disabled={nextDisabled}
        color="neutral"
        variant="outlined"
        size="sm"
        endDecorator={<KeyboardArrowRightIcon fontSize="lg" />}
      >
        <Typography fontSize="0.8rem">Seguinte</Typography>
      </Button>
    </Box>
  );
}
