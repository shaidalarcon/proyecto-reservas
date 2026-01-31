import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourts } from "../services/court.service";
import CourtCard from "../components/CourtCard";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Button,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";

const Home = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await getAllCourts();
        setCourts(data);
      } catch (error) {
        console.error("Error cargando pistas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  return (
    <Box>
      <Box
        w="full"
        h={{ base: "300px", md: "450px" }}
        backgroundImage="url('https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=1170&auto=format&fit=crop')"
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="blackAlpha.600"
        >
          <Flex
            height="100%"
            align="center"
            justify="center"
            direction="column"
            textAlign="center"
            px={4}
          >
            <Heading color="white" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
              Reserva tu pista
            </Heading>
            <Text
              color="gray.200"
              fontSize={{ base: "lg", md: "xl" }}
              maxW="700px"
              mb={6}
            >
              El mejor club de la ciudad. Pádel, Tenis y mucho más al alcance de
              un clic.
            </Text>

            <Button
              as={Link}
              to={user ? "/dashboard" : "/register"}
              size="lg"
              colorScheme="brand"
              fontWeight="bold"
            >
              {user ? "Ir a Mis Reservas" : "Únete al Club"}
            </Button>
          </Flex>
        </Box>
      </Box>

      <Container maxW="1200px" py={12}>
        <Heading as="h2" size="xl" mb={8} textAlign="center" color="gray.700">
          Nuestras Pistas Disponibles
        </Heading>

        {loading ? (
          <Center h="200px">
            <Spinner size="xl" color="brand.500" />
          </Center>
        ) : (
          <>
            {courts.length === 0 ? (
              <Center h="100px">
                <Text color="gray.500" fontSize="lg">
                  No hay pistas disponibles en este momento
                </Text>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                {courts.map((court) => (
                  <CourtCard key={court._id} court={court} />
                ))}
              </SimpleGrid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Home;
