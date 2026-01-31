import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { getCourtById, updateCourt } from "../services/court.service";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Heading,
  Image,
  useToast,
  useColorModeValue,
  Center,
  HStack,
  Textarea,
} from "@chakra-ui/react";

const EditCourt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm();
  const [currentImage, setCurrentImage] = useState("");

  const bgBox = useColorModeValue("white", "gray.700");
  const bgPage = useColorModeValue("gray.50", "gray.800");

  useEffect(() => {
    const loadData = async () => {
      try {
        const court = await getCourtById(id);
        reset(court);
        setCurrentImage(court.image);
      } catch (error) {
        toast({ title: "Error cargando datos", status: "error" });
        console.error("Error cargando datos de la pista:", error);
      }
    };
    loadData();
  }, [id, reset, toast]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("sport", data.sport);
    formData.append("price", data.price);
    formData.append("description", data.description || "");

    if (data.image && typeof data.image !== "string" && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      await updateCourt(id, formData);
      toast({ title: "Pista actualizada", status: "success", duration: 3000 });
      navigate("/admin");
    } catch (error) {
      const serverError = error.response?.data;

      const errorMessage =
        typeof serverError === "object" && serverError?.message
          ? serverError.message
          : serverError;

      const finalMessage =
        typeof errorMessage === "string"
          ? errorMessage
          : "No se pudo actualizar la pista. Revisa los datos";

      toast({
        title: "Error",
        description: finalMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH={"80vh"} align={"center"} justify={"center"} bg={bgPage} py={12}>
      <Box
        maxW={"md"}
        w={"full"}
        bg={bgBox}
        boxShadow={"xl"}
        rounded={"lg"}
        p={8}
      >
        <Stack spacing={8}>
          <Heading fontSize={"2xl"} textAlign="center">
            Editar Pista
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={6}>
              <Center flexDirection="column">
                <Image
                  src={currentImage}
                  alt="Pista"
                  boxSize="180px"
                  objectFit="cover"
                  borderRadius="2xl"
                  shadow="md"
                  mb={5}
                  fallbackSrc="https://via.placeholder.com/200?text=Pista+sin+imagen"
                />

                <Button
                  as="label"
                  htmlFor="image-upload"
                  cursor="pointer"
                  size="sm"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  color="gray.700"
                  fontWeight="semibold"
                  shadow="sm"
                  px={6}
                  _hover={{ bg: "gray.100", borderColor: "gray.400" }}
                  _active={{ bg: "gray.200" }}
                >
                  Cambiar Foto
                </Button>

                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  {...register("image", {
                    onChange: (e) => handleFileChange(e),
                  })}
                />
              </Center>

              <FormControl>
                <FormLabel fontWeight="semibold">Nombre</FormLabel>
                <Input type="text" {...register("name", { required: true })} />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Deporte</FormLabel>
                <Select {...register("sport", { required: true })}>
                  <option value="Baloncesto">Baloncesto</option>
                  <option value="Fútbol">Fútbol</option>
                  <option value="Fútbol Sala">Fútbol Sala</option>
                  <option value="Pádel">Pádel</option>
                  <option value="Tenis">Tenis</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Precio (€/hora)</FormLabel>
                <Input
                  type="number"
                  {...register("price", { required: true })}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Descripción</FormLabel>
                <Textarea
                  placeholder="Detalles de la pista"
                  resize="vertical"
                  {...register("description")}
                />
              </FormControl>

              <HStack spacing={4} pt={6}>
                <Button
                  w="full"
                  bg="gray.100"
                  color="gray.700"
                  border="1px solid"
                  borderColor="gray.200"
                  fontWeight="semibold"
                  _hover={{ bg: "gray.200", borderColor: "gray.300" }}
                  onClick={() => navigate("/admin")}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  bg={"brand.500"}
                  color={"white"}
                  fontWeight="semibold"
                  _hover={{ bg: "brand.600" }}
                  w="full"
                  shadow="md"
                >
                  Guardar Cambios
                </Button>
              </HStack>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Flex>
  );
};

export default EditCourt;
