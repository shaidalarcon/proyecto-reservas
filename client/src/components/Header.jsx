import {
  Box,
  Flex,
  Button,
  Heading,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const navButtonStyle = {
    fontSize: "lg",
    fontWeight: "600",
  };

  return (
    <Box
      as="header"
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex="1000"
      boxShadow="sm"
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        maxW="1200px"
        margin="0 auto"
      >
        <Heading as="h1" size="lg" letterSpacing={"tighter"}>
          <ChakraLink
            as={RouterLink}
            to="/"
            _hover={{ textDecoration: "none", color: "brand.500" }}
          >
            🏀 TOTSPORT
          </ChakraLink>
        </Heading>

        <HStack spacing={4} alignItems="center">
          <Button
            as={NavLink}
            to="/"
            variant="ghost"
            colorScheme="brand"
            {...navButtonStyle}
          >
            Inicio
          </Button>

          {!user && (
            <>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                colorScheme="brand"
                {...navButtonStyle}
              >
                Login
              </Button>

              <Button
                as={RouterLink}
                to="/register"
                colorScheme="brand"
                {...navButtonStyle}
              >
                Registro
              </Button>
            </>
          )}

          {user && (
            <>
              <Button
                as={NavLink}
                to="/dashboard"
                variant="ghost"
                colorScheme="brand"
                {...navButtonStyle}
              >
                Mis Reservas
              </Button>

              <Button
                as={NavLink}
                to="/profile"
                variant="ghost"
                colorScheme="brand"
                {...navButtonStyle}
              >
                Mi Perfil
              </Button>

              {user.role === "admin" && (
                <Button
                  as={NavLink}
                  to="/admin"
                  variant="ghost"
                  colorScheme="red"
                  {...navButtonStyle}
                >
                  Admin
                </Button>
              )}

              <Button
                onClick={logout}
                colorScheme="red"
                size="md"
                fontSize="lg"
                fontWeight="600"
              >
                Salir
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
