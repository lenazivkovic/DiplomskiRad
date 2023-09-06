import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import axios from "axios";
import { useEffect, useState } from "react";

export type Category = {
  id?: number;
  name: string;
  description?: string;
};
const Kategorije: React.FunctionComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");

  const getCategories = async () => {
    try {
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/categories";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      await axios.get(url, { headers }).then((res) => {
        setCategories(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/categories";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      const config = {
        headers: headers,
        data: { id: id },
      };
      await axios.delete(url, config).then(() => getCategories());
    } catch (err) {
      console.error(err);
    }
  };

  const addNewCategory = async () => {
    try {
      const body: Category = {
        name: newItemName,
        description: newItemDesc,
      };

      const url = import.meta.env.VITE_API_ENDPOINT + "/office/categories";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };

      await axios.post(url, body, { headers }).then(() => {
        setIsModalOpen(!isModalOpen);
        getCategories();
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="stranica">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}>
        <h1 style={{fontSize:"30px", fontWeight:600, marginLeft:"15px"}}>Kategorije</h1>
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="add-item-button">
          Dodaj kategoriju
        </button>
      </div>
      <div className="container">
        <Table
          aria-label="Simple table"
          className="tabela"
          style={{ height: "100%" }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Naziv</Th>
              <Th>Opis</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories?.map((category) => (
              <Tr key={category.id}>
                <Td dataLabel="ID">{category.id}</Td>
                <Td dataLabel="Ime" style={{ fontWeight: 600 }}>
                  {category.name}
                </Td>
                <Td dataLabel="Prezime">{category.description}</Td>

                <Td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}>
                    <div>
                      <button
                        onClick={() => handleDelete(category.id!)}
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
      <Modal
        title="Dodaj novu kategoriju"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(!isModalOpen)}
        variant={ModalVariant.small}
        actions={[
          <Button key="confirm" variant="primary" onClick={addNewCategory}>
            Potvrdi
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => setIsModalOpen(!isModalOpen)}>
            Izadji
          </Button>,
        ]}
        ouiaId="BasicModal">
        <h3>Naziv Kategorije</h3>
        <input
          style={{ width: "100%" }}
          onChange={(ev) => setNewItemName(ev.target.value)}
        />
        <h3>Opis</h3>
        <input
          style={{ width: "100%" }}
          onChange={(ev) => setNewItemDesc(ev.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Kategorije;
