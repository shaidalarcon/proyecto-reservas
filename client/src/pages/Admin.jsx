import { useEffect, useState } from "react";
import { getAllCourts, deleteCourt } from "../services/court.service";
import {
  getAllUsers,
  changeUserRole,
  deleteUser,
} from "../services/user.service";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  IconButton,
  useToast,
  Text,
  useColorModeValue,
  TableContainer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Select,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const Admin = () => {
  const [courts, setCourts] = useState([]);
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const bg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    const loadData = async () => {
      try {
        const courtsData = await getAllCourts();
        setCourts(courtsData);

        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error cargando datos del admin:", error);
        toast({ title: "Error de conexión", status: "error", duration: 3000 });
      }
    };

    loadData();
  }, [toast]);

  const handleDeleteCourt = async (id, name) => {
    if (window.confirm(`¿Seguro que quieres eliminar la pista "${name}"?`)) {
      try {
        await deleteCourt(id);
        setCourts((prevCourts) =>
          prevCourts.filter((court) => court._id !== id)
        );

        toast({ title: "Pista eliminada", status: "success", duration: 3000 });
      } catch (error) {
        toast({ title: "Error al eliminar", status: "error" });
        console.error(error);
      }
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar al usuario "${userName}"?`
      )
    ) {
      try {
        await deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));

        toast({
          title: "Usuario eliminado",
          status: "success",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error al eliminar usuario",
          description: error.response?.data || "Inténtalo más tarde",
          status: "error",
        });
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeUserRole(userId, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );

      toast({ title: "Rol actualizado", status: "success", duration: 2000 });
    } catch (error) {
      toast({
        title: "Error cambiando rol",
        description: "Verifica permisos",
        status: "error",
      });
      console.error(error);
    }
  };

  return (
    <Container maxW="1200px" py={10}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Panel de Administración</Heading>
        </Box>
        <Button
          as={RouterLink}
          to="/admin/create"
          colorScheme="brand"
          leftIcon={<FaPlus />}
          size="md"
        >
          Nueva Pista
        </Button>
      </Flex>

      <Box bg={bg} shadow="xl" rounded="xl" overflow="hidden" minH="500px">
        <Tabs isFitted variant="enclosed" colorScheme="brand">
          <TabList mb="1em">
            <Tab fontWeight="bold">Gestión de Pistas</Tab>
            <Tab fontWeight="bold">Gestión de Usuarios</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <TableContainer>
                <Table variant="simple">
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th textAlign="center">Imagen</Th>
                      <Th textAlign="center">Nombre</Th>
                      <Th textAlign="center">Deporte</Th>
                      <Th textAlign="center">Precio</Th>
                      <Th textAlign="center">Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {courts.map((court) => (
                      <Tr key={court._id} _hover={{ bg: "gray.50" }}>
                        <Td textAlign="center">
                          <Flex justify="center">
                            <Image
                              src={court.image}
                              alt="pista"
                              boxSize="50px"
                              objectFit="cover"
                              borderRadius="md"
                              shadow="sm"
                            />
                          </Flex>
                        </Td>
                        <Td textAlign="center" fontWeight="bold">
                          {court.name}
                        </Td>
                        <Td textAlign="center">
                          <Badge colorScheme="purple">{court.sport}</Badge>
                        </Td>
                        <Td textAlign="center">{court.price}€</Td>
                        <Td textAlign="center">
                          <Flex justify="center" gap={3}>
                            <IconButton
                              as={RouterLink}
                              to={`/admin/edit/${court._id}`}
                              aria-label="Editar"
                              icon={<FaEdit />}
                              colorScheme="blue"
                              variant="outline"
                              size="sm"
                            />
                            <IconButton
                              onClick={() =>
                                handleDeleteCourt(court._id, court.name)
                              }
                              aria-label="Borrar"
                              icon={<FaTrash />}
                              colorScheme="red"
                              variant="outline"
                              size="sm"
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel p={0}>
              <TableContainer>
                <Table variant="simple">
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th textAlign="center">Avatar</Th>
                      <Th textAlign="center">Usuario</Th>
                      <Th textAlign="center">Email</Th>
                      <Th textAlign="center">Rol Actual</Th>
                      <Th textAlign="center">Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((u) => {
                      const isSuperAdmin = u.email === "admin@reservas.com";
                      const isMe = u._id === currentUser?._id;
                      const isDisabled = isMe || isSuperAdmin;

                      return (
                        <Tr key={u._id} _hover={{ bg: "gray.50" }}>
                          <Td textAlign="center">
                            <Flex justify="center">
                              <Avatar size="lg" src={u.image} name={u.name} />
                            </Flex>
                          </Td>
                          <Td textAlign="center" fontWeight="bold">
                            {u.name}
                          </Td>
                          <Td textAlign="center" color="gray.600">
                            {u.email}
                          </Td>
                          <Td textAlign="center">
                            <Badge
                              colorScheme={u.role === "admin" ? "red" : "green"}
                              variant="subtle"
                              px={2}
                            >
                              {u.role.toUpperCase()}
                            </Badge>
                          </Td>

                          <Td textAlign="center">
                            <HStack justify="center" spacing={3}>
                              <Select
                                size="sm"
                                maxW="120px"
                                value={u.role}
                                onChange={(e) =>
                                  handleRoleChange(u._id, e.target.value)
                                }
                                borderColor="gray.300"
                                borderRadius="md"
                                isDisabled={isDisabled}
                                title={
                                  isSuperAdmin
                                    ? "El Admin Principal es inmutable"
                                    : ""
                                }
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </Select>

                              <IconButton
                                aria-label="Eliminar usuario"
                                icon={<FaTrash />}
                                colorScheme="red"
                                variant="outline"
                                size="sm"
                                isDisabled={isDisabled}
                                title={
                                  isSuperAdmin
                                    ? "No puedes borrar al Admin Principal"
                                    : ""
                                }
                                onClick={() => handleDeleteUser(u._id, u.name)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Admin;
