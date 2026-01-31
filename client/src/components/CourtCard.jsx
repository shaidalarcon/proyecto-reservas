import {
  Box,
  Image,
  Badge,
  Text,
  Button,
  Stack,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const CourtCard = ({ court }) => {
  const { user } = useAuth();
  const bg = useColorModeValue("white", "gray.800");
  const imageSrc = court.image;

  return (
    <Box
      maxW={"445px"}
      w={"full"}
      bg={bg}
      boxShadow={"md"}
      rounded={"xl"}
      p={6}
      overflow={"hidden"}
      position="relative"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "xl",
      }}
      role="group"
    >
      <Box
        h={"220px"}
        bg={"gray.100"}
        mt={-6}
        mx={-6}
        mb={6}
        pos={"relative"}
        overflow="hidden"
      >
        <Image
          src={imageSrc}
          objectFit={"cover"}
          w="100%"
          h="100%"
          alt={court.name}
          fallbackSrc="https://via.placeholder.com/400x220?text=No+Image"
          transition="transform 0.3s ease"
          _groupHover={{ transform: "scale(1.1)" }}
        />

        <Flex
          pos="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bg="blackAlpha.800"
          opacity="0"
          visibility="hidden"
          transition="all 0.3s ease"
          alignItems="center"
          justifyContent="center"
          p={6}
          _groupHover={{
            opacity: 1,
            visibility: "visible",
          }}
        >
          <Text
            color="white"
            fontSize="md"
            textAlign="center"
            fontWeight="medium"
          >
            {court.description
              ? court.description
              : "Disfruta de nuestras pistas de máxima calidad"}
          </Text>
        </Flex>
      </Box>

      <Stack spacing={3}>
        <Flex justifyContent="space-between" alignItems="center">
          <Badge
            colorScheme="teal"
            borderRadius="full"
            px={3}
            py={1}
            textTransform="uppercase"
            fontSize="xs"
            letterSpacing="wide"
          >
            {court.sport}
          </Badge>

          <Text fontWeight="800" fontSize="lg" color="gray.700">
            {court.price}€{" "}
            <Box as="span" fontSize="sm" fontWeight="normal" color="gray.500">
              / hora
            </Box>
          </Text>
        </Flex>

        <Box>
          <Text
            fontSize={"2xl"}
            fontFamily={"heading"}
            fontWeight={700}
            lineHeight="tight"
          >
            {court.name}
          </Text>
        </Box>
      </Stack>

      <Box mt={6}>
        <Button
          as={Link}
          to={user ? `/reserve/${court._id}` : "/login"}
          state={
            user
              ? { court: court }
              : { from: `/reserve/${court._id}`, court: court }
          }
          w={"full"}
          size="lg"
          colorScheme="brand"
          rounded={"lg"}
          fontSize="md"
          fontWeight="bold"
          boxShadow={"sm"}
          _hover={{
            bg: "brand.600",
            boxShadow: "md",
          }}
        >
          Reservar Ahora
        </Button>
      </Box>
    </Box>
  );
};

export default CourtCard;
