import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { updateUser, deleteUser } from "../services/user.service";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const toast = useToast();
  const bg = useColorModeValue("white", "gray.700");

  const [previewImage, setPreviewImage] = useState(user?.image);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      if (data.password) {
        formData.append("password", data.password);
      }

      if (data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const updatedUserData = await updateUser(user._id, formData);

      const newUserState = { ...user, ...updatedUserData };

      setUser(newUserState);
      localStorage.setItem("user", JSON.stringify(newUserState));

      toast({
        title: "Perfil actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al actualizar",
        description:
          error.response?.data || "No se pudieron guardar los cambios",
        status: "error",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user._id);
      onClose();
      logout();
      toast({
        title: "Cuenta eliminada",
        description: "Lamentamos que te vayas. ¡Hasta pronto!",
        status: "info",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la cuenta",
        status: "error",
      });
    }
  };

  return (
    <Flex
      minH={"80vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      py={12}
    >
      <Box maxW={"lg"} w={"full"} bg={bg} boxShadow={"xl"} rounded={"lg"} p={8}>
        <Stack spacing={6} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "3xl" }}
            textAlign="center"
          >
            Editar Perfil
          </Heading>

          <FormControl id="userIcon">
            <Center>
              <Avatar size="2xl" src={previewImage} mb={4} name={user?.name} />
            </Center>
            <Center w="full">
              <Button
                as="label"
                htmlFor="image-upload"
                cursor="pointer"
                size="sm"
                variant="outline"
              >
                Cambiar Foto
              </Button>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                hidden
                {...register("image")}
                onChange={(e) => {
                  register("image").onChange(e);
                  handleImageChange(e);
                }}
              />
            </Center>
          </FormControl>

          <FormControl id="name">
            <FormLabel>Nombre completo</FormLabel>
            <Input type="text" {...register("name", { required: true })} />
          </FormControl>

          <FormControl id="email">
            <FormLabel>Email (No editable)</FormLabel>
            <Input
              type="email"
              isDisabled
              _disabled={{ color: "gray.500", cursor: "not-allowed" }}
              {...register("email")}
            />
          </FormControl>

          <FormControl id="password" isInvalid={errors.password}>
            <FormLabel>Nueva Contraseña</FormLabel>
            <Input
              type="password"
              placeholder="Deja en blanco para mantener la actual"
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />

            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Stack spacing={6} direction={["column", "row"]} pt={4}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{ bg: "red.500" }}
              onClick={onOpen}
            >
              Eliminar Cuenta
            </Button>
            <Button
              bg={"brand.500"}
              color={"white"}
              w="full"
              _hover={{ bg: "brand.600" }}
              type="submit"
              isLoading={isSubmitting}
            >
              Guardar Cambios
            </Button>
          </Stack>
        </Stack>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Cuenta
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro? Esta acción borrará tus datos y tu historial de
              reservas permanentemente
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Sí, eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default Profile;
