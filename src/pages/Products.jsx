import { Container, Button, Row, Col, Card, Badge } from "react-bootstrap";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import Form from "../components/Form";
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete }) => {
    return (
        <Card
            className="shadow-sm border-0 h-100 rounded-3"
            style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)", // Elegant soft shadow
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.06)";
            }}
        >
            <Card.Body className="d-flex flex-column justify-content-between h-100">
                <div>
                    <h5 className="fw-semibold text-dark mb-2">{product.name}</h5>
                    <p className="text-muted small mb-3">{product.description}</p>

                    <div className="mb-3 small text-muted">
                        <div><strong>ID:</strong> {product.id}</div>
                        <div><strong>Type:</strong> {product.type}</div>
                        <div><strong>Vendor:</strong> {product.vendor}</div>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                        <div>
                            <div className="text-muted small">Price</div>
                            <div className="fw-semibold text-success">₹{product.price}</div>
                        </div>
                        <div>
                            <div className="text-muted small">Quantity</div>
                            <div className="fw-semibold text-primary">{product.quantity}</div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <Button variant="success" size="sm" onClick={() => onEdit(product)}>
                        <Pencil size={14} className="me-1" /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(product.id)}>
                        <Trash2 size={14} className="me-1" /> Delete
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

function Products() {
    // const backEndAppUrl = import.meta.env.BACK_END_APP_URL;
    const backEndAppUrl = "https://stock-management-be-wq7x.onrender.com";

    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${backEndAppUrl}/api/products`,
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
            url: `${backEndAppUrl}/api/product`,
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
                url: `${backEndAppUrl}/api/product`,
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
                url: `${backEndAppUrl}/api/product`,
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

                <div className="p-3 rounded bg-white shadow-sm">
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {products.map((product) => (
                            <Col key={product.id}>
                                <ProductCard
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </Col>
                        ))}
                    </Row>
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
