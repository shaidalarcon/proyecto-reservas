import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createCourt } from "../services/court.service";
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
  useToast,
  useColorModeValue,
  Image,
  Center,
  HStack,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";

const CreateCourt = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [previewImage, setPreviewImage] = useState(null);

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1593012370132-c4390ff79e92?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const bgBox = useColorModeValue("white", "gray.700");
  const bgPage = useColorModeValue("gray.50", "gray.800");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("sport", data.sport);
    formData.append("price", data.price);
    formData.append("description", data.description || "");

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      await createCourt(formData);
      toast({
        title: "¡Pista creada con éxito!",
        status: "success",
        duration: 3000,
      });
      navigate("/admin");
    } catch (error) {
      const errorMsg = error.response?.data || "Error al crear la pista";
      toast({
        title: "No se pudo crear",
        description:
          typeof errorMsg === "string" ? errorMsg : "Revisa los datos",
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
            Nueva Pista
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={6}>
              <Center flexDirection="column">
                <Image
                  src={previewImage || DEFAULT_IMAGE}
                  alt="Vista previa"
                  boxSize="180px"
                  objectFit="cover"
                  borderRadius="2xl"
                  shadow="md"
                  mb={5}
                  fallbackSrc={DEFAULT_IMAGE}
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
                  {previewImage ? "Cambiar Foto" : "Seleccionar Foto"}
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

              {/* CAMPOS */}
              <FormControl isInvalid={errors.name}>
                <FormLabel fontWeight="semibold">Nombre</FormLabel>
                <Input
                  type="text"
                  placeholder="Ej: Pista Central"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.sport}>
                <FormLabel fontWeight="semibold">Deporte</FormLabel>
                <Select
                  placeholder="Selecciona..."
                  {...register("sport", {
                    required: "Debes seleccionar un deporte",
                  })}
                >
                  <option value="Baloncesto">Baloncesto</option>
                  <option value="Fútbol">Fútbol</option>
                  <option value="Fútbol Sala">Fútbol Sala</option>
                  <option value="Pádel">Pádel</option>
                  <option value="Tenis">Tenis</option>
                </Select>
                <FormErrorMessage>
                  {errors.sport && errors.sport.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.price}>
                <FormLabel fontWeight="semibold">Precio (€/hora)</FormLabel>
                <Input
                  type="number"
                  placeholder="0"
                  {...register("price", { required: "Indica un precio" })}
                />
                <FormErrorMessage>
                  {errors.price && errors.price.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">
                  Descripción (Opcional)
                </FormLabel>
                <Textarea
                  placeholder="Si lo dejas vacío, se usará la descripción por defecto"
                  resize="vertical"
                  {...register("description")}
                />
              </FormControl>

              {/* BOTONES */}
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
                  isLoading={isSubmitting}
                  loadingText="Creando..."
                >
                  Crear Pista
                </Button>
              </HStack>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Flex>
  );
};

export default CreateCourt;
