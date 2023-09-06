import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import axios from "axios";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

type Post = {
  id?: number;
  title?: string;
  body?: string;
  author?: {
    first_name?: string;
    last_name?: string;
  };
};
const Objave: React.FunctionComponent = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post>();

  const getPosts = async () => {
    try {
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/posts";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      await axios.get(url, { headers }).then((res) => {
        setPosts(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const url = import.meta.env.VITE_API_ENDPOINT + "/office/posts";
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
      const config = {
        headers: headers,
        data: { id: id },
      };
      await axios.delete(url, config).then(() => getPosts());
    } catch (err) {
      console.error(err);
    }
  };

  let sanitizedHTML = "";
  if (currentPost?.body) sanitizedHTML = DOMPurify.sanitize(currentPost.body);

  return (
    <div className="stranica">
      <h1 style={{fontSize:"30px", fontWeight:600, marginLeft:"15px", marginBottom:"10px"}}>Objave</h1>
      <div className="container">
        <Table
          aria-label="Simple table"
          className="tabela"
          style={{ height: "100%" }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Naziv</Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts?.map((post) => (
              <Tr key={post.id}>
                <Td dataLabel="ID">{post.id}</Td>
                <Td dataLabel="Ime" style={{ fontWeight: 600 }}>
                  {post.title}
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
                          setIsModalOpen(!isModalOpen);
                          setCurrentPost(post!);
                        }}
                        className="modify-button">
                        Pogledaj sadrzaj
                      </button>
                      <button
                        onClick={() => handleDelete(post.id!)}
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
        title={`Sadrzaj bloga ${currentPost?.title!}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(!isModalOpen)}
        variant={ModalVariant.small}
        actions={[
          <Button
            key="cancel"
            variant="link"
            onClick={() => setIsModalOpen(!isModalOpen)}>
            Cancel
          </Button>,
        ]}
        ouiaId="BasicModal">
        <div
          className="pt-5"
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      </Modal>
    </div>
  );
};

export default Objave;
