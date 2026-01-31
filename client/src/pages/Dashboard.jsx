import { useEffect, useState } from "react";
import {
  getMyReservations,
  deleteReservation,
} from "../services/reservation.service";
import { useAuth } from "../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Stack,
  Badge,
  Button,
  Center,
  Spinner,
  useColorModeValue,
  Flex,
  useToast,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { FaTrash, FaCalendarAlt, FaClock, FaEuroSign } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error("Error al cargar reservas", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm("¿Seguro que quieres cancelar esta reserva?")) return;

    try {
      await deleteReservation(reservationId);
      setReservations(reservations.filter((r) => r._id !== reservationId));
      toast({
        title: "Reserva cancelada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error cancelando reserva:", error);
      toast({
        title: "Error al cancelar",
        description: "No se pudo eliminar la reserva",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getReservationStartDate = (dateString, timeSlot) => {
    const startTime = timeSlot.split(" - ")[0];
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const isPast = (dateString, timeSlot) => {
    const start = getReservationStartDate(dateString, timeSlot);
    const now = new Date();
    return now >= start;
  };

  const canCancel = (dateString, timeSlot) => {
    const start = getReservationStartDate(dateString, timeSlot);
    const now = new Date();
    const deadline = new Date(start.getTime() - 30 * 60000);
    return now < deadline;
  };

  const upcomingReservations = reservations.filter(
    (res) => !isPast(res.date, res.timeSlot)
  );

  const pastReservations = reservations
    .filter((res) => isPast(res.date, res.timeSlot))
    .reverse();

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  const ReservationCard = ({ res, isHistory }) => {
    const cancelable = canCancel(res.date, res.timeSlot);

    return (
      <Box
        bg={cardBg}
        boxShadow={"md"}
        rounded={"xl"}
        overflow={"hidden"}
        position="relative"
        transition="all 0.3s ease"
        opacity={isHistory ? 0.7 : 1}
        filter={isHistory ? "grayscale(100%)" : "none"}
        _hover={{
          transform: isHistory ? "none" : "translateY(-5px)",
          boxShadow: isHistory ? "md" : "xl",
        }}
      >
        <Image
          h={"140px"}
          w={"full"}
          src={res.court?.image}
          objectFit={"cover"}
          alt="Pista"
        />

        <Box p={6}>
          <Flex justify="space-between" align="center" mb={3}>
            <Badge
              px={2}
              py={1}
              colorScheme={isHistory ? "gray" : "green"}
              variant="solid"
              rounded="md"
            >
              {isHistory ? "FINALIZADA" : "ACTIVA"}
            </Badge>
          </Flex>

          <Heading fontSize={"xl"} fontFamily={"heading"} mb={4}>
            {res.court?.name || "Pista no disponible"}
          </Heading>

          <Stack spacing={3} mb={isHistory ? 0 : 6}>
            <Flex align="center" color="gray.600">
              <Icon as={FaCalendarAlt} mr={2} color="brand.500" />
              <Text fontWeight="500">
                {new Date(res.date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </Flex>

            <Flex align="center" color="gray.600">
              <Icon as={FaClock} mr={2} color="brand.500" />
              <Text fontWeight="500">{res.timeSlot}</Text>
            </Flex>

            <Flex align="center" color="gray.600">
              <Icon as={FaEuroSign} mr={2} color="brand.500" />
              <Text fontWeight="bold">{res.totalPrice}€</Text>
            </Flex>
          </Stack>

          {!isHistory && (
            <Tooltip
              label={
                !cancelable
                  ? "No puedes cancelar con menos de 30min de antelación"
                  : ""
              }
              hasArrow
            >
              <Button
                w="full"
                colorScheme="red"
                variant="outline"
                size="sm"
                leftIcon={<FaTrash />}
                onClick={() => handleCancel(res._id)}
                isDisabled={!cancelable}
                _hover={{
                  bg: "red.50",
                  boxShadow: "sm",
                }}
              >
                {cancelable ? "Cancelar Reserva" : "No cancelable"}
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Container maxW="1200px" py={10}>
      <Box mb={8} borderBottom="1px" borderColor="gray.200" pb={4}>
        <Heading as="h2" size="xl" mb={2}>
          Hola, {user?.name} 👋
        </Heading>
        <Text color="gray.600">
          Gestiona tus próximas reservas y consulta tu historial
        </Text>
      </Box>

      <Box mb={10}>
        <Heading as="h3" size="lg" mb={6} color="brand.600">
          Próximas Reservas
        </Heading>

        {upcomingReservations.length === 0 ? (
          <Center
            flexDirection="column"
            py={10}
            bg={cardBg}
            rounded="xl"
            shadow="sm"
            border="1px"
            borderColor="gray.100"
          >
            <Text fontSize="lg" color="gray.400" mb={4}>
              No tienes reservas pendientes
            </Text>
            <Button as={RouterLink} to="/" colorScheme="brand">
              Reservar ahora
            </Button>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {upcomingReservations.map((res) => (
              <ReservationCard key={res._id} res={res} isHistory={false} />
            ))}
          </SimpleGrid>
        )}
      </Box>

      {pastReservations.length > 0 && (
        <Box>
          <Heading as="h3" size="lg" color="gray.500" mb={6}>
            Historial
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {pastReservations.map((res) => (
              <ReservationCard key={res._id} res={res} isHistory={true} />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
