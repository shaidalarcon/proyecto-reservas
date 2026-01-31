import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
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

const Login = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      await login(data);

      if (location.state?.from) {
        navigate(location.state.from, {
          state: { court: location.state.court },
          replace: true,
        });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description:
          error.response?.data?.message || "Credenciales incorrectas",
        status: "error",
        duration: 4000,
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
          <Heading fontSize={"4xl"}>Inicia Sesión</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            para reservar tu pista favorita
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
            <FormControl id="email" isInvalid={errors.email}>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                type="email"
                placeholder="tu@email.com"
                {...register("email", { required: "El email es obligatorio" })}
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
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <Stack spacing={10}>
              <Button
                bg={"brand.500"}
                color={"white"}
                isLoading={isSubmitting}
                loadingText="Entrando..."
                type="submit"
                _hover={{
                  bg: "brand.600",
                }}
              >
                Entrar
              </Button>
            </Stack>

            <Text align={"center"}>
              ¿No tienes cuenta?{" "}
              <Link as={RouterLink} to="/register" color={"brand.500"}>
                Regístrate
              </Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
