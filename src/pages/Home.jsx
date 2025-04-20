import { Container, Button, Card, Row, Col, Badge, Modal, Form } from "react-bootstrap";
import Header from "../components/Header";
import { useEffect, useMemo, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import axios from 'axios';

function TopCard({ totalSold, totalRevenue }) {
    return (
        <Card className="shadow-sm mb-4 border-0 rounded" style={{ backgroundColor: "#f9f9fb" }}>
            <Card.Body>
                <Card.Title className="mb-3" style={{ color: "#4B0082", fontWeight: "600" }}>📦 Stocks Overview</Card.Title>
                <Row>
                    <Col md={6}>
                        <h5>
                            Total Items Sold:{" "}
                            <Badge style={{ backgroundColor: "#6a0dad", color: "white", fontSize: "1rem" }}>
                                {totalSold}
                            </Badge>
                        </h5>
                    </Col>
                    <Col md={6}>
                        <h5>
                            Total Revenue:{" "}
                            <Badge style={{ backgroundColor: "#28a745", color: "white", fontSize: "1rem" }}>
                                ₹{totalRevenue.toLocaleString()}
                            </Badge>
                        </h5>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

function Home() {
    const [stockDatas, setStockDatas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    // const [totalItemsSold, setTotalItemsSold] = useState(0);
    // const [totalRevenue, setTotalRevenue] = useState(0);

    const [sellingQuantity, setSellingQuantity] = useState(0);

    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/stocks',
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                const rawData = response.data.data;

                const transformedData = rawData.map(item => ({
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    stockQuantity: item.product.quantity,
                    itemsSold: item.itemsSold,
                    revenueGenerated: item.revenueGenerated
                }));

                console.log(transformedData);
                setStockDatas(transformedData);

            })
            .catch((error) => {
                console.log(error);
            });


    }, []);

    const handleSell = (item) => {
        setShowModal(true);
        setSelectedItem(item);
        console.log("Selling item:", item.name);
    };

    const handleClose = () => {
        setShowModal(false);
        setSellingQuantity(0);
        setSelectedItem(null);
    };

    const handleChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setSellingQuantity(isNaN(value) ? 0 : value);
        console.log("Sell: ", sellingQuantity);
    }

    const handleSubmit = () => {
        let data = JSON.stringify({
            "productId": selectedItem.productId,
            "price": selectedItem.price,
            "sellingQuantity": sellingQuantity,
            "prevStockData": {
                "productId": selectedItem.productId,
                "stockQuantity": selectedItem.stockQuantity,
                "itemsSold": selectedItem.itemsSold,
                "revenueGenerated": selectedItem.revenueGenerated
            }
        });

        console.log("Data: ", data);
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/stock',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setStockDatas((prev) =>
                    prev.map((item) =>
                        item.productId === selectedItem.productId
                            ? {
                                ...item,
                                stockQuantity: item.stockQuantity - sellingQuantity,
                                itemsSold: item.itemsSold + sellingQuantity,
                                revenueGenerated: item.revenueGenerated + (selectedItem.price * sellingQuantity),
                            }
                            : item
                    )
                );
            })
            .catch((error) => {
                console.log(error);
            });

        setShowModal(false);
        handleClose();

        console.log("Called");
    }

    const renderSellModal = (selectedItem) => (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Sell Quantity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedItem && (
                    <>
                        <h5>Product: {selectedItem.name}</h5>
                        <p>Available Stock: {selectedItem.stockQuantity}</p>
                        <Form>
                            <Form.Group controlId="sellQuantity">
                                <Form.Label>Quantity to Sell</Form.Label>
                                <Form.Control
                                    name="sellingQuantity"
                                    type="number"
                                    placeholder="Enter quantity"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} >Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} >Confirm Sell</Button>
            </Modal.Footer>
        </Modal>
    );

    const totalItemsSold = stockDatas.reduce((acc, item) => acc + item.itemsSold, 0);
    const totalRevenue = stockDatas.reduce((acc, item) => acc + item.revenueGenerated, 0);

    const columns = useMemo(() => [
        { accessorKey: "productId", header: "Product ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "price", header: "Price" },
        { accessorKey: "stockQuantity", header: "Stock Quantity" },
        { accessorKey: "itemsSold", header: "Items Sold" },
        { accessorKey: "revenueGenerated", header: "Revenue Generated" },
        {
            header: "Action",
            Cell: ({ row }) => (
                <Button
                    variant="primary"
                    size="sm"
                    style={{
                        background: "linear-gradient(135deg, #6a0dad, #4B0082)",
                        border: "none",
                        fontWeight: 600,
                        transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    onClick={() => handleSell(row.original)}
                >
                    Sell
                </Button>
            ),
        },
    ], []);

    const table = useMantineReactTable({
        columns,
        data: stockDatas
    });

    return (
        <Container style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
            <Header />
            <Container className="mt-4 px-3">
                <TopCard totalSold={totalItemsSold} totalRevenue={totalRevenue} />

                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <MantineReactTable table={table} />
                    </Card.Body>
                </Card>

                {renderSellModal(selectedItem)}
            </Container>
        </Container>
    );
}

export default Home;
