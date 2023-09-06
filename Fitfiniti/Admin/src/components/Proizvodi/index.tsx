import { useEffect, useState } from "react";
import "./Proizvodi.css";
import {
  Button,
  FileUpload,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalVariant,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";
import axios from "axios";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { Category } from "../Kategorije";

type Item = {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category?: number;
};
const Proizvodi: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPhoto, setNewItemPhoto] = useState<File>();
  const [changeItemName, setChangeItemName] = useState("");
  const [changeItemDesc, setChangeItemDesc] = useState("");
  const [changeItemCategory, setChangeItemCategory] = useState("");
  const [changeItemPrice, setChangeItemPrice] = useState("");
  const [changeItemQuantity, setChangeItemQuantity] = useState("");
  const [changeItemPhoto, setChangeItemPhoto] = useState<File>();
  const [value, setValue] = useState("");
  const [changeFilename, setChangeFilename] = useState("");
  const [filename, setFilename] = useState("");
  const [categories, setCategories] = useState<Category[]>();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [isModalChangeOpen, setIsModalChangeOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("Izaberite kategoriju");

  const onToggleClick = () => {
    setIsOpen(!isOpen);
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

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    // console.log("selected", value);
    setNewItemCategory(value as string);
    setSelected(value as string);
    setIsOpen(false);
  };

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  const getItems = () => {
    try {
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/items";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      axios.get(url, { headers }).then((res) => setItems(res.data));
    } catch (err) {
      console.error(err);
    }
  };
  const getCategories = async () => {
    try {
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/categories";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      await axios.get(url, { headers }).then((res) => setCategories(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getItems();
    getCategories();
  }, []);

  const changeItem = () => {
    try {
      const body = new FormData();
      const chName =
        changeItemName === "" ? selectedItem?.name : changeItemName;
      const chDesc =
        changeItemDesc === "" ? selectedItem?.description : changeItemDesc;
      const chPrice =
        changeItemPrice === "" ? selectedItem?.price : changeItemPrice;
      const chQuantity =
        changeItemQuantity === "" ? selectedItem?.quantity : changeItemQuantity;
      const chCategory =
        changeItemCategory === "" ? selectedItem?.category : changeItemCategory;

      if (changeFilename !== "") body.append("image", changeItemPhoto!);

      body.append("id", String(selectedItem?.id!));
      body.append("name", chName!);
      body.append("description", chDesc!);
      body.append("price", chPrice! as string);
      body.append("quantity", chQuantity! as string);
      body.append("category", chCategory! as string);

      const url = import.meta.env.VITE_API_ENDPOINT + "/office/items";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      };

      axios.patch(url, body, { headers }).then(() => {
        setIsModalChangeOpen(!isModalOpen);
        setChangeFilename("");
        setNewItemCategory("");
        getItems();
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addNewItem = async () => {
    try {
      const body = new FormData();
      body.append("name", newItemName);
      body.append("description", newItemDesc);
      body.append("price", newItemPrice);
      body.append("quantity", newItemQuantity);
      body.append("category", newItemCategory);
      body.append("image", newItemPhoto!);

      const url = import.meta.env.VITE_API_ENDPOINT + "/office/items";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };

      await axios.post(url, body, { headers }).then(() => {
        setIsModalOpen(!isModalOpen);
        setFilename("");
        setNewItemCategory("");
        getItems();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/items";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      const config = {
        headers: headers,
        data: { id: id },
      };

      await axios.delete(url, config).then(() => getItems());
    } catch (err) {
      console.error(err);
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
        <h1 style={{fontSize:"30px", fontWeight:600, marginLeft:"15px"}}>Proizvodi</h1>
        <button onClick={handleModalToggle} className="add-item-button">
          Dodaj novi proizvod
        </button>
      </div>
      <div className="shop-data">
        <div className="container">
          <Table className="tabela">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Naziv</Th>
                <Th>Opis</Th>
                <Th>Kolicina</Th>
                <Th>Cena</Th>
                <Th>Slika</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items?.map((item) => (
                <Tr key={item.id}>
                  <Td dataLabel="ID">{item.id}</Td>
                  <Td dataLabel="Ime" style={{ fontWeight: 600 }}>
                    {item.name}
                  </Td>
                  <Td dataLabel="Opis">{item.description}</Td>
                  <Td dataLabel="Kolicina">{item.quantity}</Td>
                  <Td dataLabel="Cena">{item.price}</Td>
                  <Td dataLabel="Slika">
                    {item.image && (
                      <img
                        src={import.meta.env.VITE_API_ENDPOINT + item.image}
                        alt={`Slika za ${item.name}`}
                        width="60"
                        height="30"
                      />
                    )}
                  </Td>
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
                            setSelectedItem(item);
                            setIsModalChangeOpen(!isModalChangeOpen);
                          }}
                          className="modify-button">
                          Izmeni
                        </button>
                        <button
                          onClick={() => handleDelete(item.id!)}
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
        <div>
          <Modal
            title="Dodaj novi proizvod"
            isOpen={isModalOpen}
            onClose={handleModalToggle}
            variant={ModalVariant.small}
            actions={[
              <Button key="confirm" variant="primary" onClick={addNewItem}>
                Potvrdi
              </Button>,
              <Button key="cancel" variant="link" onClick={handleModalToggle}>
                Izadji
              </Button>,
            ]}
            ouiaId="BasicModal">
            <h3>Naziv artikla</h3>
            <input
              style={{ width: "100%" }}
              onChange={(ev) => setNewItemName(ev.target.value)}
            />
            <h3>Opis</h3>
            <input
              style={{ width: "100%" }}
              onChange={(ev) => setNewItemDesc(ev.target.value)}
            />
            <h3>Kategorija</h3>
            <Select
              id="single-select"
              isOpen={isOpen}
              selected={selected}
              onSelect={onSelect}
              onOpenChange={(isOpen) => setIsOpen(isOpen)}
              toggle={toggle}
              shouldFocusToggleOnSelect>
              <SelectList>
                {categories?.map((category: Category) => (
                  <SelectOption value={category.id}>
                    {category.name}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
            <h3>Cena</h3>
            <input
              style={{ width: "100%" }}
              onChange={(ev) => setNewItemPrice(ev.target.value)}
            />
            <h3>Kolicina</h3>
            <input
              style={{ width: "100%" }}
              onChange={(ev) => setNewItemQuantity(ev.target.value)}
            />
            <h3>Slika artikla</h3>
            <FileUpload
              id="simple-file"
              value={value}
              filename={filename}
              filenamePlaceholder="Drag and drop a file or upload one"
              onFileInputChange={(_, file: File) => {
                setNewItemPhoto(file);
                setFilename(file.name);
              }}
              //   onClearClick={handleClear}
              browseButtonText="Upload"
            />
          </Modal>
        </div>
        <div>
          <Modal
            title="Izmeni proizvod"
            isOpen={isModalChangeOpen}
            onClose={() => setIsModalChangeOpen(!isModalChangeOpen)}
            variant={ModalVariant.small}
            actions={[
              <Button key="confirm" variant="primary" onClick={changeItem}>
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
            <h3>Naziv artikla</h3>
            <input
              style={{ width: "100%" }}
              placeholder={selectedItem?.name}
              onChange={(ev) => setChangeItemName(ev.target.value)}
            />
            <h3>Opis</h3>
            <input
              style={{ width: "100%" }}
              placeholder={selectedItem?.description}
              onChange={(ev) => setChangeItemDesc(ev.target.value)}
            />
            <h3>Kategorija</h3>
            <Select
              id="single-select"
              isOpen={isOpen}
              selected={selectedItem?.category}
              onSelect={onSelect}
              onOpenChange={(isOpen) => setIsOpen(isOpen)}
              toggle={toggle}
              shouldFocusToggleOnSelect>
              <SelectList>
                {categories?.map((category: Category) => (
                  <SelectOption value={category.id}>
                    {category.name}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
            <h3>Cena</h3>
            <input
              style={{ width: "100%" }}
              placeholder={String(selectedItem?.price as unknown)}
              onChange={(ev) => setChangeItemPrice(ev.target.placeholder)}
            />
            <h3>Kolicina</h3>
            <input
              style={{ width: "100%" }}
              placeholder={String(selectedItem?.quantity)}
              onChange={(ev) => setChangeItemQuantity(ev.target.value)}
            />
            <h3>Slika artikla</h3>
            <FileUpload
              id="simple-file"
              value={value}
              filename={changeFilename}
              filenamePlaceholder={selectedItem?.image!}
              onFileInputChange={(_, file: File) => {
                setChangeItemPhoto(file);
                setChangeFilename(file.name);
              }}
              //   onClearClick={handleClear}
              browseButtonText="Upload"
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Proizvodi;
