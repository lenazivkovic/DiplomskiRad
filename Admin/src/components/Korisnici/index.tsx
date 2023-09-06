import React, { useEffect, useState } from "react";
import "./Korisnici.css";
import axios from "axios";
import {
  Button,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalVariant,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
  email: string;
  password?: string;
  username?: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserpassword, setNewUserPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isModalChangeOpen, setIsModalChangeOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [changeFirstName, setChangeFirstName] = useState("");
  const [changeLastName, setChangeLastName] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [changeUsername, setChangeUsername] = useState("");
  const [changeEmail, setChangeEmail] = useState("");

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  const getUsers = async () => {
    try {
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/users";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      await axios.get(url, { headers }).then((res) => {
        setUsers(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const changeUser = async () => {
    const url = import.meta.env.VITE_API_ENDPOINT + "/office/users";
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    };
    const body: User = {
      id: selectedUser?.id,
      first_name:
        changeFirstName === "" ? selectedUser?.first_name! : changeFirstName,
      last_name:
        changeLastName === "" ? selectedUser?.last_name! : changeFirstName,
      email: changeEmail === "" ? selectedUser?.email! : changeEmail,
      password:
        changePassword === "" ? selectedUser?.password! : changePassword,
      username:
        changeUsername === "" ? selectedUser?.username! : changeUsername,
      is_staff: selected === "Jeste" ? true : false,
    };

    await axios.put(url, body, { headers }).then(() => {
      getUsers();
      setIsModalChangeOpen(!isModalChangeOpen);
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/users";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      const config = {
        headers: headers,
        data: { id: id },
      };
      await axios.delete(url, config).then(() => getUsers());
    } catch (err) {
      console.error(err);
    }
  };
  const addNewUser = async () => {
    try {
      const payload: User = {
        email: newUserEmail,
        password: newUserpassword,
        first_name: newUserFirstName,
        last_name: newUserLastName,
        username: newUsername,
      };
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/users";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      axios.post(url, payload, { headers }).then(() => {
        setIsModalOpen(!isModalOpen);
        getUsers();
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const [selected, setSelected] = useState<string>("Da li je korisnik trener");
  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    // console.log("selected", value);
    setSelected(value as string);
    setIsOpen(false);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={
        {
          width: "100%",
        } as React.CSSProperties
      }>
      {selected}
    </MenuToggle>
  );

  return (
    <div className="stranica">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}>
        <h1 style={{fontSize:"30px", fontWeight:600, marginLeft:"15px"}}>Korisnici</h1>
        <button
          onClick={handleModalToggle}
          className="add-item-button">
          Dodaj korisnika
        </button>
      </div>
      <div>
        <Modal
          title="Dodaj korisnika"
          isOpen={isModalOpen}
          onClose={handleModalToggle}
          variant={ModalVariant.small}
          actions={[
            <Button key="confirm" variant="primary" onClick={addNewUser}>
              Potvrdi
            </Button>,
            <Button key="cancel" variant="link" onClick={handleModalToggle}>
              Izadji
            </Button>,
          ]}
          ouiaId="BasicModal">
          <h3>Ime</h3>
          <input
            style={{ width: "100%" }}
            onChange={(ev) => setNewUserFirstName(ev.target.value)}
          />
          <h3>Prezime</h3>
          <input
            style={{ width: "100%" }}
            onChange={(ev) => setNewUserLastName(ev.target.value)}
          />
          <h3>Email</h3>
          <input
            style={{ width: "100%" }}
            onChange={(ev) => setNewUserEmail(ev.target.value)}
          />
          <h3>Lozinka</h3>
          <input
            type="password"
            style={{ width: "100%" }}
            onChange={(ev) => setNewUserPassword(ev.target.value)}
          />
          <h3>Username</h3>
          <input
            style={{ width: "100%" }}
            onChange={(ev) => setNewUsername(ev.target.value)}
          />
        </Modal>
        <Modal
          title="Izmeni korisnika"
          isOpen={isModalChangeOpen}
          onClose={() => setIsModalChangeOpen(!isModalChangeOpen)}
          variant={ModalVariant.small}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={() => {
                changeUser();
              }}>
              Potvrdi
            </Button>,
            <Button
              key="cancel"
              variant="link"
              onClick={() => setIsModalChangeOpen(!isModalChangeOpen)}>
              Izadji
            </Button>,
          ]}
          ouiaId="BasicModal">
          <h3>Ime</h3>
          <input
            style={{ width: "100%" }}
            placeholder={selectedUser?.first_name}
            onChange={(ev) => setChangeFirstName(ev.target.value)}
          />
          <h3>Prezime</h3>
          <input
            style={{ width: "100%" }}
            placeholder={selectedUser?.last_name}
            onChange={(ev) => setChangeLastName(ev.target.value)}
          />
          <h3>Email</h3>
          <input
            style={{ width: "100%" }}
            placeholder={selectedUser?.email}
            onChange={(ev) => setChangeEmail(ev.target.value)}
          />
          <h3>Username</h3>
          <input
            style={{ width: "100%" }}
            placeholder={selectedUser?.username}
            onChange={(ev) => setChangeUsername(ev.target.value)}
          />
          <h3>Lozinka</h3>
          <input
            style={{ width: "100%" }}
            type="password"
            onChange={(ev) => setChangePassword(ev.target.value)}
          />
          <h3>Trener</h3>

          <Select
            id="single-select"
            isOpen={isOpen}
            selected={selected}
            onSelect={onSelect}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
            toggle={toggle}
            shouldFocusToggleOnSelect>
            <SelectList>
              {["Jeste", "Nije"]?.map((option: string) => (
                <SelectOption value={option}>{option}</SelectOption>
              ))}
            </SelectList>
          </Select>
        </Modal>
      </div>
      <div className="container">
        <Table aria-label="Simple table" className="tabela">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Ime</Th>
              <Th>Prezime</Th>
              <Th>Email</Th>
              <Th>Trener</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users &&
              users?.map((user) => (
                <Tr key={user.id}>
                  <Td dataLabel="ID">{user.id}</Td>
                  <Td dataLabel="Ime">{user.first_name}</Td>
                  <Td dataLabel="Prezime">{user.last_name}</Td>
                  <Td dataLabel="Email">{user.email}</Td>
                  <Td dataLabel="Trener">{user.is_staff ? "Jeste" : "Nije"}</Td>

                  <Td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}>
                      <div>
                        <button
                          onClick={() => {
                            setIsModalChangeOpen(!isModalChangeOpen);
                            setSelectedUser(user);
                          }}
                          className="modify-button">
                          Izmeni
                        </button>
                        <button
                          onClick={() => handleDelete(user.id!)}
                          className="delete-button">
                          Obrisi
                        </button>
                      </div>
                    </div>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
