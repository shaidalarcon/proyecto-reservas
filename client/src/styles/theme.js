import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      500: "#2196f3",
      600: "#1e88e5",
      900: "#0d47a1",
    },
  },

  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Roboto', sans-serif`,
  },

  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
});

export default theme;
