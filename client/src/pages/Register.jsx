import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  Link,
  useToast,
} from "@chakra-ui/react";

const Register = () => {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      await registerUser(formData);

      toast({
        title: "¡Cuenta creada!",
        description: "Ahora inicia sesión con tus credenciales",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error en el registro",
        description:
          error.response?.data?.message ||
          "Hubo un problema al crear tu cuenta",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"80vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Crea tu cuenta
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            ¡Únete a la comunidad TOTSPORT! 🏀
          </Text>
        </Stack>

        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          minW={{ base: "90vw", md: "400px" }}
        >
          <Stack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="name" isInvalid={errors.name}>
              <FormLabel>Nombre completo</FormLabel>
              <Input
                type="text"
                placeholder="Tu nombre"
                {...register("name", { required: "El nombre es obligatorio" })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="email" isInvalid={errors.email}>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                type="email"
                placeholder="ejemplo@correo.com"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|es)$/,
                    message: "Email inválido. Debe ser un correo .com o .es",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="password" isInvalid={errors.password}>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="********"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="image">
              <FormLabel>Foto de Perfil (Opcional)</FormLabel>
              <Input
                type="file"
                p={1}
                accept="image/*"
                {...register("image")}
              />
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Creando cuenta..."
                isLoading={isSubmitting}
                size="lg"
                bg={"brand.500"}
                color={"white"}
                type="submit"
                _hover={{
                  bg: "brand.600",
                }}
              >
                Registrarse
              </Button>
            </Stack>

            <Text align={"center"}>
              ¿Ya eres usuario?{" "}
              <Link as={RouterLink} to="/login" color={"brand.500"}>
                Inicia sesión
              </Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;
