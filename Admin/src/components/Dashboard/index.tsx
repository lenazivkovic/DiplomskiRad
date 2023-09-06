import axios from "axios";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./Dashboard.css";

const Dashboard = () => {
  const [graph, setGraph] = useState<any>([]);
  const [analytics, setAnalytics] = useState<any>([]);
  const [posts, setPosts] = useState<any>([]);
  const [selected, setSelected] = useState(0);
  const [first5, setFirst5] = useState<any>([]);

  const getAnalytics = () => {
    try {
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };

      axios
        .get(import.meta.env.VITE_API_ENDPOINT + "/office/analytics", {
          headers,
        })
        .then((res) => {
          setAnalytics(res.data);
          console.log(res.data);
          let data = [];

          for (const [key, value] of Object.entries(res.data["categories"])) {
            data.push({ name: key, kolicina: value });
          }

          setGraph(data);
          console.log(data);
        });
    } catch (err) {
      console.error(err);
    }
  };

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
    getAnalytics();
    getPosts();
    const firstFive = posts.sort((a: any, b: any) => b.visited > a.visited);
    setFirst5(firstFive);
  }, []);

  return (
    <>
      <div
        style={{
          marginTop: "15px",
          marginLeft: "15px",
          borderBottom: "1px solid gray",
          paddingBottom: "10px",
        }}>
        <button
          onClick={() => setSelected(0)}
          style={{
            background: selected === 0 ? "#ccc" : "transparent",
            border: "none",
            color: "black",
          }}>
          Osnovno
        </button>
        <button
          onClick={() => setSelected(1)}
          style={{
            background: selected === 1 ? "#ccc" : "transparent",
            border: "none",
            color: "black",
          }}>
          Proizvodi po kategorijama
        </button>
        <button
          onClick={() => setSelected(2)}
          style={{
            background: selected === 2 ? "#ccc" : "transparent",
            border: "none",
            color: "black",
          }}>
          Objave
        </button>
      </div>
      {selected === 0 ? (
        <>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 600,
              marginTop: "28px",
              marginLeft: "23px",
            }}>
            Statistika
          </h1>

          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              marginTop: "25px",
              marginBottom: "25px",
              justifyContent: "space-evenly",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}>
            <div className="card">
              <h1>Korisnici</h1>
              <p>{analytics["users_count"]}</p>
            </div>
            <div className="card">
              <h1>Proizvodi</h1>
              <p>{analytics["items_count"]}</p>
            </div>
            <div className="card">
              <h1>Kategorije</h1>
              <p>{analytics["categories_count"]}</p>
            </div>
            <div className="card">
              <h1>Objave</h1>
              <p>{analytics["posts_count"]}</p>
            </div>
          </div>
        </>
      ) : selected === 2 ? (
        <>
        <h1
            style={{
              fontSize: "30px",
              fontWeight: 600,
              marginTop: "28px",
              marginLeft: "23px",
            }}>
            Najposećenije objave 
          </h1>
        <div
          style={{
            marginTop: "25px",
            width: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Table
            aria-label="Simple table"
            className="tabela"
            variant="compact"
            style={{
              height: "100%",
              width: "80%",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}>
            <Thead>
              <Tr>
                <Th>Rating</Th>
                <Th>Naziv</Th>
              </Tr>
            </Thead>
            <Tbody>
              {first5?.slice(0, 5).map((post: any) => (
                <Tr key={post.id}>
                  <Td dataLabel="ID">{post.visited}</Td>
                  <Td dataLabel="Ime" style={{ fontWeight: 600 }}>
                    {post.title}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
        </>
      ) : (
        <>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 600,
              marginTop: "28px",
              marginLeft: "23px",
            }}>
            Broj proizvoda po kategoriijama
          </h1>
        <ResponsiveContainer width="100%" height="50%">
          <BarChart
            width={500}
            height={300}
            data={graph}
            margin={{
              top: 25,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}>
            <XAxis
              dataKey="name"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="kolicina"
              fill="#8884d8"
              background={{ fill: "#eee" }}
            />
          </BarChart>
        </ResponsiveContainer>
        </>
      )}
      {/* \
       <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <div
          style={{
            marginTop: "25px",
            width: "100%",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"center"
          }}>
         
            <Table
              aria-label="Simple table"
              className="tabela"
              variant="compact"
              style={{
                height: "100%",
                width: "80%",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}>
              <Thead>
                <Tr>
                  <Th>Rating</Th>
                  <Th>Naziv</Th>
                </Tr>
              </Thead>
              <Tbody>
                {first5?.slice(0, 5).map((post: any) => (
                  <Tr key={post.id}>
                    <Td dataLabel="ID">{post.visited}</Td>
                    <Td dataLabel="Ime" style={{ fontWeight: 600 }}>
                      {post.title}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </div>
      <ResponsiveContainer width="100%" height="50%">
        <BarChart
          width={500}
          height={300}
          data={graph}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}>
          <XAxis
            dataKey="name"
            scale="point"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar
            dataKey="kolicina"
            fill="#8884d8"
            background={{ fill: "#eee" }}
          />
        </BarChart>
      </ResponsiveContainer> */}
    </>
  );
};

export default Dashboard;
