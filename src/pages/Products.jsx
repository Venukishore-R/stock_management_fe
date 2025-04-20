import { Container, Button, Row, Col, Card } from "react-bootstrap";
import Header from "../components/Header";
import { useEffect, useMemo, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import Form from "../components/Form";
import axios from 'axios';

function Products() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/products',
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                let resultProducts = response.data.data;
                console.log(resultProducts);

                setProducts(resultProducts);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    const handleEdit = (product) => {
        setEditMode(true);
        setEditFormData(product);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        let data = JSON.stringify({
            "id": id
        });

        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/product',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setProducts((prev) => prev.filter((item) => item.id !== id));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleFormSubmit = (data) => {
        if (editMode) {
            let editData = JSON.stringify({
                "id": data.id,
                "update_data": data
            })

            let config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: 'http://localhost:3000/api/product',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: editData
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));

                    setProducts((prev) =>
                        prev.map((item) => (item.id === data.id ? data : item))
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            const newProduct = JSON.stringify(data);
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:3000/api/product',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: newProduct
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    setProducts((prev) => [data, ...prev]);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        setShowForm(false);
        setEditFormData(null);
        setEditMode(false);
    };

    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "description", header: "Description" },
            { accessorKey: "price", header: "Price" },
            { accessorKey: "quantity", header: "Quantity" },
            { accessorKey: "type", header: "Type" },
            { accessorKey: "vendor", header: "Vendor" },
            {
                header: "Action",
                Cell: ({ row }) => (
                    <div>
                        <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleEdit(row.original)}
                            className="me-3"
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(row.original.id)}
                        >
                            Delete
                        </Button>
                    </div>
                ),
            },
        ],
        [products]
    );

    const table = useMantineReactTable({
        columns,
        data: products,
    });

    return (
        <Container style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", paddingBottom: "50px" }}>
            <Header />
            <Container className="mt-5">
                <Card className="p-4 mb-4 shadow-sm border-0">
                    <Row className="align-items-center">
                        <Col>
                            <h4 className="fw-semibold" style={{
                                background: "linear-gradient(to right, #6a0dad, #4B0082)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>
                                📦 Product Management
                            </h4>
                            <p className="text-muted small">Easily view, add, and manage your products.</p>
                        </Col>
                        <Col className="text-end">
                            <Button
                                className="px-4 py-2"
                                style={{
                                    background: "linear-gradient(to right, #6a0dad, #4B0082)",
                                    border: "none",
                                    color: "white"
                                }}
                                onClick={() => {
                                    setShowForm(true);
                                    setEditFormData(null);
                                    setEditMode(false);
                                }}
                            >
                                <i className="fa-solid fa-plus me-2" />
                                Add Product
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <div className="p-4 rounded bg-white shadow-sm">
                    <MantineReactTable table={table} />
                </div>
            </Container>

            <Form
                show={showForm}
                onHide={() => setShowForm(false)}
                initialData={editFormData}
                onSubmit={handleFormSubmit}
                mode={editMode ? "edit" : "add"}
            />
        </Container>
    );
}

export default Products;
