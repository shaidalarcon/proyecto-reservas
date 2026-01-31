import { Flex, Box } from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box flex="1" as="main" bg="gray.50">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
