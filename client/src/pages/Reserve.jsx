import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createReservation } from "../services/reservation.service";
import { getCourtById } from "../services/court.service";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useColorModeValue,
  FormErrorMessage,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";

const ALL_TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
];

const Reserve = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const bgFlex = useColorModeValue("gray.50", "gray.800");
  const bgBox = useColorModeValue("white", "gray.700");

  const [court, setCourt] = useState(location.state?.court || null);
  const [loading, setLoading] = useState(!location.state?.court);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const selectedDate = watch("date");

  const getAvailableSlots = () => {
    if (!selectedDate) return ALL_TIME_SLOTS;

    const today = new Date();
    const dateSelected = new Date(selectedDate);

    today.setHours(0, 0, 0, 0);
    dateSelected.setHours(0, 0, 0, 0);

    if (dateSelected > today) {
      return ALL_TIME_SLOTS;
    }

    if (dateSelected.getTime() === today.getTime()) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      return ALL_TIME_SLOTS.filter((slot) => {
        const startHourStr = slot.split(" - ")[0];
        const [slotHour, slotMinute] = startHourStr.split(":").map(Number);

        if (slotHour > currentHour) return true;
        if (slotHour === currentHour && slotMinute > currentMinutes)
          return true;

        return false;
      });
    }

    return [];
  };

  const availableSlots = getAvailableSlots();

  useEffect(() => {
    if (!court) {
      const fetchCourt = async () => {
        try {
          const data = await getCourtById(id);
          setCourt(data);
        } catch (error) {
          console.error(error);
          toast({
            title: "Error",
            description: "No se pudo cargar la pista",
            status: "error",
          });
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchCourt();
    }
  }, [id, court, navigate, toast]);

  const onSubmit = async (data) => {
    try {
      const reservationPayload = {
        court: id,
        date: data.date,
        timeSlot: data.timeSlot,
        totalPrice: court.price,
      };

      await createReservation(reservationPayload);

      toast({
        title: "¡Reserva confirmada!",
        description: "Te esperamos en la pista",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al reservar",
        description: error.response?.data?.message || "Error desconocido",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Flex minH={"80vh"} align={"center"} justify={"center"} bg={bgFlex} p={4}>
      <Box
        maxW={"md"}
        w={"full"}
        bg={bgBox}
        boxShadow={"xl"}
        rounded={"lg"}
        p={8}
      >
        <Stack spacing={6}>
          <Box textAlign="center">
            <Heading fontSize={"2xl"}>Confirmar Reserva</Heading>
            <Text color={"brand.500"} fontWeight="bold" fontSize="xl" mt={2}>
              {court.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {court.sport} • {court.price}€ / hora
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={errors.date}>
                <FormLabel>Fecha</FormLabel>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("date", { required: "Selecciona una fecha" })}
                />
                <FormErrorMessage>
                  {errors.date && errors.date.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.timeSlot}>
                <FormLabel>Horario</FormLabel>
                <Select
                  placeholder={
                    availableSlots.length > 0
                      ? "-- Elige hora --"
                      : "No hay horas disponibles hoy"
                  }
                  {...register("timeSlot", { required: "Selecciona una hora" })}
                  isDisabled={availableSlots.length === 0}
                >
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.timeSlot && errors.timeSlot.message}
                </FormErrorMessage>
              </FormControl>

              <Box
                bg="gray.50"
                p={3}
                borderRadius="md"
                textAlign="center"
                mt={2}
              >
                <Text fontSize="sm" color="gray.500">
                  Precio Total
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  {court.price}€
                </Text>
              </Box>

              <Stack spacing={3} mt={4}>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Reservando..."
                  bg={"brand.500"}
                  color={"white"}
                  _hover={{ bg: "brand.600" }}
                  size="lg"
                  w="full"
                >
                  Confirmar Reserva
                </Button>
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Reserve;
