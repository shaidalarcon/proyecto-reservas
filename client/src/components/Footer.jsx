import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Heading,
  Flex,
} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("gray.900", "gray.900")}
      color={useColorModeValue("gray.400", "gray.400")}
    >
      <Container maxW={"6xl"} py={10}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
          gap={6}
        >
          <Stack
            spacing={2}
            align={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
          >
            <Heading size="md" color="white" letterSpacing="tight">
              🏀 TOTSPORT
            </Heading>
            <Text fontSize={"sm"} maxW={"sm"}>
              Tu club deportivo de confianza. Las mejores pistas al mejor
              precio.
            </Text>
          </Stack>

          <Stack direction={"row"} spacing={6}>
            <Link
              href={"#"}
              fontSize={"sm"}
              _hover={{ color: "brand.500", textDecoration: "none" }}
            >
              Aviso Legal
            </Link>
            <Link
              href={"#"}
              fontSize={"sm"}
              _hover={{ color: "brand.500", textDecoration: "none" }}
            >
              Privacidad
            </Link>
            <Link
              href={"#"}
              fontSize={"sm"}
              _hover={{ color: "brand.500", textDecoration: "none" }}
            >
              Contacto
            </Link>
          </Stack>
        </Flex>
      </Container>

      <Box borderTopWidth={1} borderStyle={"solid"} borderColor={"gray.800"}>
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          align={{ base: "center", md: "center" }}
        >
          <Text fontSize="xs">
            © {new Date().getFullYear()} TOTSPORT. Todos los derechos
            reservados.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
